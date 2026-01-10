"""
AWS Cost Optimizer Lambda Function
Analyzes resources and sends recommendations for cost savings
"""

import boto3
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any

# Initialize AWS clients
ec2 = boto3.client('ec2')
rds = boto3.client('rds')
ecs = boto3.client('ecs')
cloudwatch = boto3.client('cloudwatch')
ce = boto3.client('ce')
sns = boto3.client('sns')
s3 = boto3.client('s3')
elasticache = boto3.client('elasticache')

SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN', '')
ENVIRONMENT = os.environ.get('ENVIRONMENT', 'production')
COST_CENTER = os.environ.get('COST_CENTER', 'healthcare-platform')


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Main Lambda handler for cost optimization analysis."""
    try:
        recommendations = []

        # Analyze different resource types
        recommendations.extend(analyze_ec2_instances())
        recommendations.extend(analyze_rds_instances())
        recommendations.extend(analyze_ebs_volumes())
        recommendations.extend(analyze_elastic_ips())
        recommendations.extend(analyze_s3_buckets())
        recommendations.extend(analyze_elasticache())
        recommendations.extend(get_cost_anomalies())

        # Calculate total potential savings
        total_savings = sum(r.get('estimated_monthly_savings', 0) for r in recommendations)

        # Send notification if there are significant recommendations
        if total_savings > 50:  # Threshold of $50/month
            send_notification(recommendations, total_savings)

        return {
            'statusCode': 200,
            'body': json.dumps({
                'recommendations_count': len(recommendations),
                'total_potential_savings': round(total_savings, 2),
                'recommendations': recommendations
            })
        }
    except Exception as e:
        print(f"Error in cost optimizer: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


def analyze_ec2_instances() -> List[Dict[str, Any]]:
    """Analyze EC2 instances for optimization opportunities."""
    recommendations = []

    try:
        # Get all running instances
        instances = ec2.describe_instances(
            Filters=[
                {'Name': 'instance-state-name', 'Values': ['running']},
                {'Name': 'tag:CostCenter', 'Values': [COST_CENTER]}
            ]
        )

        for reservation in instances.get('Reservations', []):
            for instance in reservation.get('Instances', []):
                instance_id = instance['InstanceId']
                instance_type = instance['InstanceType']

                # Check CPU utilization
                cpu_util = get_average_metric(
                    'AWS/EC2',
                    'CPUUtilization',
                    [{'Name': 'InstanceId', 'Value': instance_id}],
                    14  # Last 14 days
                )

                # Recommend downsizing for underutilized instances
                if cpu_util and cpu_util < 10:
                    recommendations.append({
                        'resource_type': 'EC2',
                        'resource_id': instance_id,
                        'recommendation': f'Instance {instance_id} has low CPU utilization ({cpu_util:.1f}%). Consider downsizing or using Spot instances.',
                        'current_type': instance_type,
                        'priority': 'high',
                        'estimated_monthly_savings': estimate_ec2_savings(instance_type)
                    })
                elif cpu_util and cpu_util < 25:
                    recommendations.append({
                        'resource_type': 'EC2',
                        'resource_id': instance_id,
                        'recommendation': f'Instance {instance_id} has moderate CPU utilization ({cpu_util:.1f}%). Consider right-sizing.',
                        'current_type': instance_type,
                        'priority': 'medium',
                        'estimated_monthly_savings': estimate_ec2_savings(instance_type) * 0.3
                    })

                # Check for instances without Savings Plans coverage
                # (Would require additional API calls to Savings Plans)

    except Exception as e:
        print(f"Error analyzing EC2 instances: {str(e)}")

    return recommendations


def analyze_rds_instances() -> List[Dict[str, Any]]:
    """Analyze RDS instances for optimization opportunities."""
    recommendations = []

    try:
        instances = rds.describe_db_instances()

        for instance in instances.get('DBInstances', []):
            db_id = instance['DBInstanceIdentifier']
            db_class = instance['DBInstanceClass']

            # Check if using Provisioned IOPS when not needed
            if instance.get('Iops') and instance.get('Iops') > 0:
                iops_util = get_average_metric(
                    'AWS/RDS',
                    'ReadIOPS',
                    [{'Name': 'DBInstanceIdentifier', 'Value': db_id}],
                    7
                )

                if iops_util and iops_util < 1000:
                    recommendations.append({
                        'resource_type': 'RDS',
                        'resource_id': db_id,
                        'recommendation': f'RDS {db_id} has low IOPS usage. Consider switching to gp3 storage.',
                        'priority': 'medium',
                        'estimated_monthly_savings': 50  # Approximate
                    })

            # Check CPU utilization for right-sizing
            cpu_util = get_average_metric(
                'AWS/RDS',
                'CPUUtilization',
                [{'Name': 'DBInstanceIdentifier', 'Value': db_id}],
                14
            )

            if cpu_util and cpu_util < 20:
                recommendations.append({
                    'resource_type': 'RDS',
                    'resource_id': db_id,
                    'recommendation': f'RDS {db_id} has low CPU ({cpu_util:.1f}%). Consider downsizing from {db_class}.',
                    'priority': 'high',
                    'estimated_monthly_savings': estimate_rds_savings(db_class)
                })

            # Check for single-AZ deployments in production
            if ENVIRONMENT == 'production' and not instance.get('MultiAZ'):
                recommendations.append({
                    'resource_type': 'RDS',
                    'resource_id': db_id,
                    'recommendation': f'RDS {db_id} is not Multi-AZ. Consider enabling for HA.',
                    'priority': 'low',
                    'estimated_monthly_savings': 0  # This is a reliability recommendation
                })

    except Exception as e:
        print(f"Error analyzing RDS instances: {str(e)}")

    return recommendations


def analyze_ebs_volumes() -> List[Dict[str, Any]]:
    """Analyze EBS volumes for optimization opportunities."""
    recommendations = []

    try:
        volumes = ec2.describe_volumes(
            Filters=[
                {'Name': 'status', 'Values': ['available', 'in-use']}
            ]
        )

        for volume in volumes.get('Volumes', []):
            volume_id = volume['VolumeId']
            volume_type = volume['VolumeType']
            size = volume['Size']
            state = volume['State']

            # Unattached volumes
            if state == 'available':
                recommendations.append({
                    'resource_type': 'EBS',
                    'resource_id': volume_id,
                    'recommendation': f'EBS volume {volume_id} ({size}GB) is not attached. Consider deleting if unused.',
                    'priority': 'high',
                    'estimated_monthly_savings': size * 0.10  # Approximate gp2 pricing
                })

            # gp2 to gp3 migration
            if volume_type == 'gp2' and size >= 100:
                recommendations.append({
                    'resource_type': 'EBS',
                    'resource_id': volume_id,
                    'recommendation': f'EBS volume {volume_id} is gp2. Migrate to gp3 for 20% savings.',
                    'priority': 'medium',
                    'estimated_monthly_savings': size * 0.02  # Approximate 20% savings
                })

            # io1/io2 optimization
            if volume_type in ['io1', 'io2']:
                read_ops = get_average_metric(
                    'AWS/EBS',
                    'VolumeReadOps',
                    [{'Name': 'VolumeId', 'Value': volume_id}],
                    7
                )

                provisioned_iops = volume.get('Iops', 0)
                if read_ops and provisioned_iops > 0:
                    iops_usage = (read_ops / provisioned_iops) * 100
                    if iops_usage < 30:
                        recommendations.append({
                            'resource_type': 'EBS',
                            'resource_id': volume_id,
                            'recommendation': f'EBS volume {volume_id} is using only {iops_usage:.1f}% of provisioned IOPS. Reduce IOPS or switch to gp3.',
                            'priority': 'high',
                            'estimated_monthly_savings': provisioned_iops * 0.065 * 0.7  # 70% savings on unused IOPS
                        })

    except Exception as e:
        print(f"Error analyzing EBS volumes: {str(e)}")

    return recommendations


def analyze_elastic_ips() -> List[Dict[str, Any]]:
    """Analyze Elastic IPs for unused allocations."""
    recommendations = []

    try:
        addresses = ec2.describe_addresses()

        for address in addresses.get('Addresses', []):
            if not address.get('AssociationId'):
                recommendations.append({
                    'resource_type': 'ElasticIP',
                    'resource_id': address['AllocationId'],
                    'recommendation': f'Elastic IP {address["PublicIp"]} is not associated. Release if unused.',
                    'priority': 'high',
                    'estimated_monthly_savings': 3.60  # $0.005/hour for unattached EIP
                })

    except Exception as e:
        print(f"Error analyzing Elastic IPs: {str(e)}")

    return recommendations


def analyze_s3_buckets() -> List[Dict[str, Any]]:
    """Analyze S3 buckets for optimization opportunities."""
    recommendations = []

    try:
        buckets = s3.list_buckets()

        for bucket in buckets.get('Buckets', []):
            bucket_name = bucket['Name']

            # Check for lifecycle policies
            try:
                s3.get_bucket_lifecycle_configuration(Bucket=bucket_name)
            except s3.exceptions.ClientError as e:
                if 'NoSuchLifecycleConfiguration' in str(e):
                    recommendations.append({
                        'resource_type': 'S3',
                        'resource_id': bucket_name,
                        'recommendation': f'S3 bucket {bucket_name} has no lifecycle policy. Consider adding for cost optimization.',
                        'priority': 'medium',
                        'estimated_monthly_savings': 10  # Variable based on usage
                    })

            # Check for Intelligent-Tiering
            try:
                analytics = s3.list_bucket_analytics_configurations(Bucket=bucket_name)
                if not analytics.get('AnalyticsConfigurationList'):
                    recommendations.append({
                        'resource_type': 'S3',
                        'resource_id': bucket_name,
                        'recommendation': f'S3 bucket {bucket_name} could benefit from S3 Intelligent-Tiering.',
                        'priority': 'low',
                        'estimated_monthly_savings': 5
                    })
            except Exception:
                pass

    except Exception as e:
        print(f"Error analyzing S3 buckets: {str(e)}")

    return recommendations


def analyze_elasticache() -> List[Dict[str, Any]]:
    """Analyze ElastiCache clusters for optimization."""
    recommendations = []

    try:
        clusters = elasticache.describe_cache_clusters(ShowCacheNodeInfo=True)

        for cluster in clusters.get('CacheClusters', []):
            cluster_id = cluster['CacheClusterId']
            node_type = cluster['CacheNodeType']

            # Check CPU utilization
            cpu_util = get_average_metric(
                'AWS/ElastiCache',
                'CPUUtilization',
                [{'Name': 'CacheClusterId', 'Value': cluster_id}],
                7
            )

            if cpu_util and cpu_util < 10:
                recommendations.append({
                    'resource_type': 'ElastiCache',
                    'resource_id': cluster_id,
                    'recommendation': f'ElastiCache {cluster_id} has low CPU ({cpu_util:.1f}%). Consider downsizing from {node_type}.',
                    'priority': 'medium',
                    'estimated_monthly_savings': 20  # Approximate
                })

    except Exception as e:
        print(f"Error analyzing ElastiCache: {str(e)}")

    return recommendations


def get_cost_anomalies() -> List[Dict[str, Any]]:
    """Get recent cost anomalies from AWS Cost Explorer."""
    recommendations = []

    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)

        anomalies = ce.get_anomalies(
            DateInterval={
                'StartDate': start_date.strftime('%Y-%m-%d'),
                'EndDate': end_date.strftime('%Y-%m-%d')
            },
            MaxResults=10
        )

        for anomaly in anomalies.get('Anomalies', []):
            if anomaly['AnomalyScore']['CurrentScore'] > 0.7:
                impact = anomaly.get('Impact', {})
                recommendations.append({
                    'resource_type': 'CostAnomaly',
                    'resource_id': anomaly['AnomalyId'],
                    'recommendation': f'Cost anomaly detected: {impact.get("TotalImpact", 0):.2f} USD impact',
                    'priority': 'critical',
                    'estimated_monthly_savings': float(impact.get('TotalImpact', 0))
                })

    except Exception as e:
        print(f"Error getting cost anomalies: {str(e)}")

    return recommendations


def get_average_metric(
    namespace: str,
    metric_name: str,
    dimensions: List[Dict[str, str]],
    days: int
) -> float | None:
    """Get average CloudWatch metric value over specified days."""
    try:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=days)

        response = cloudwatch.get_metric_statistics(
            Namespace=namespace,
            MetricName=metric_name,
            Dimensions=dimensions,
            StartTime=start_time,
            EndTime=end_time,
            Period=86400,  # 1 day
            Statistics=['Average']
        )

        datapoints = response.get('Datapoints', [])
        if datapoints:
            return sum(dp['Average'] for dp in datapoints) / len(datapoints)
        return None

    except Exception as e:
        print(f"Error getting metric {metric_name}: {str(e)}")
        return None


def estimate_ec2_savings(instance_type: str) -> float:
    """Estimate monthly savings from EC2 right-sizing."""
    # Approximate on-demand pricing (us-east-1)
    prices = {
        't3.micro': 7.56,
        't3.small': 15.12,
        't3.medium': 30.24,
        't3.large': 60.48,
        't3.xlarge': 120.96,
        'm5.large': 69.36,
        'm5.xlarge': 138.72,
        'm5.2xlarge': 277.44,
        'r5.large': 90.72,
        'r5.xlarge': 181.44,
    }

    # Estimate 50% savings from downsizing
    return prices.get(instance_type, 100) * 0.5


def estimate_rds_savings(db_class: str) -> float:
    """Estimate monthly savings from RDS right-sizing."""
    prices = {
        'db.t3.micro': 12.41,
        'db.t3.small': 24.82,
        'db.t3.medium': 49.64,
        'db.t3.large': 99.28,
        'db.m5.large': 124.10,
        'db.m5.xlarge': 248.20,
        'db.r5.large': 182.50,
        'db.r5.xlarge': 365.00,
    }

    return prices.get(db_class, 150) * 0.5


def send_notification(recommendations: List[Dict[str, Any]], total_savings: float) -> None:
    """Send cost optimization recommendations via SNS."""
    if not SNS_TOPIC_ARN:
        return

    try:
        # Group by priority
        critical = [r for r in recommendations if r['priority'] == 'critical']
        high = [r for r in recommendations if r['priority'] == 'high']
        medium = [r for r in recommendations if r['priority'] == 'medium']

        message = f"""
AWS Cost Optimization Report
============================
Environment: {ENVIRONMENT}
Date: {datetime.now().strftime('%Y-%m-%d')}
Total Potential Monthly Savings: ${total_savings:.2f}

Critical Priority ({len(critical)} items):
{format_recommendations(critical)}

High Priority ({len(high)} items):
{format_recommendations(high)}

Medium Priority ({len(medium)} items):
{format_recommendations(medium[:5])}  # Limit to first 5

Full report available in CloudWatch Logs.
"""

        sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject=f'[{ENVIRONMENT.upper()}] AWS Cost Optimization: ${total_savings:.2f} potential savings',
            Message=message
        )

    except Exception as e:
        print(f"Error sending notification: {str(e)}")


def format_recommendations(recommendations: List[Dict[str, Any]]) -> str:
    """Format recommendations for notification."""
    if not recommendations:
        return "  None"

    lines = []
    for r in recommendations[:10]:  # Limit to 10
        lines.append(f"  - [{r['resource_type']}] {r['resource_id']}: {r['recommendation']}")
        lines.append(f"    Estimated savings: ${r.get('estimated_monthly_savings', 0):.2f}/month")

    return '\n'.join(lines)
