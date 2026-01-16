#!/bin/bash
# ============================================
# UnifiedHealth Platform - SNS Alert Subscription Helper
# ============================================
# Subscribes team emails to CloudWatch alarm SNS topics
#
# Usage: ./scripts/sns-subscribe-alerts.sh [options]
# Options:
#   --list-topics     List available SNS topics
#   --topic NAME      Topic name pattern to subscribe to
#   --email ADDRESS   Email address to subscribe
#   --bulk-file FILE  CSV file with email addresses
#   --verify          Check subscription status
#   --region REGION   AWS region (default: us-east-1)
# ============================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

AWS_REGION="${AWS_REGION:-us-east-1}"
PROJECT_PREFIX="unified-health"
ACTION=""
TOPIC_PATTERN=""
EMAIL=""
BULK_FILE=""

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --list-topics) ACTION="list"; shift ;;
            --topic) TOPIC_PATTERN="$2"; shift 2 ;;
            --email) EMAIL="$2"; shift 2 ;;
            --bulk-file) BULK_FILE="$2"; shift 2 ;;
            --verify) ACTION="verify"; shift ;;
            --region) AWS_REGION="$2"; shift 2 ;;
            --help) show_help; exit 0 ;;
            *) shift ;;
        esac
    done
}

show_help() {
    echo "SNS Alert Subscription Helper"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --list-topics     List available SNS topics"
    echo "  --topic NAME      Topic name pattern to subscribe to"
    echo "  --email ADDRESS   Email address to subscribe"
    echo "  --bulk-file FILE  CSV file with email addresses"
    echo "  --verify          Check subscription status"
    echo "  --region REGION   AWS region (default: us-east-1)"
}

check_prerequisites() {
    command -v aws >/dev/null 2>&1 || { log_error "AWS CLI is required"; exit 1; }
    aws sts get-caller-identity >/dev/null 2>&1 || { log_error "Not authenticated with AWS"; exit 1; }
}

list_topics() {
    log_info "Listing SNS topics in ${AWS_REGION}..."
    echo ""
    echo "Available alarm topics:"
    echo "========================"
    aws sns list-topics --region "$AWS_REGION" --query "Topics[?contains(TopicArn, '${PROJECT_PREFIX}')].[TopicArn]" --output text | while read -r arn; do
        topic_name=$(echo "$arn" | rev | cut -d':' -f1 | rev)
        sub_count=$(aws sns list-subscriptions-by-topic --topic-arn "$arn" --region "$AWS_REGION" --query 'length(Subscriptions)' --output text 2>/dev/null || echo "0")
        echo "  - ${topic_name} (${sub_count} subscriptions)"
    done
}

get_topic_arn() {
    local pattern="$1"
    aws sns list-topics --region "$AWS_REGION" --query "Topics[?contains(TopicArn, '${pattern}')].TopicArn" --output text | head -1
}

subscribe_email() {
    local topic_arn="$1"
    local email="$2"

    if [ -z "$topic_arn" ]; then
        log_error "Topic not found"
        return 1
    fi

    log_info "Subscribing ${email} to $(echo $topic_arn | rev | cut -d':' -f1 | rev)..."

    result=$(aws sns subscribe \
        --topic-arn "$topic_arn" \
        --protocol email \
        --notification-endpoint "$email" \
        --region "$AWS_REGION" \
        --output text 2>&1)

    if [[ "$result" == *"arn:aws:sns"* ]]; then
        log_success "Subscription created. Confirmation email sent to ${email}"
        log_warning "User must confirm subscription via email link"
    else
        log_error "Failed to subscribe: $result"
        return 1
    fi
}

bulk_subscribe() {
    local file="$1"
    local topic_arn="$2"

    if [ ! -f "$file" ]; then
        log_error "File not found: $file"
        exit 1
    fi

    log_info "Processing bulk subscriptions from ${file}..."

    while IFS=, read -r email name || [ -n "$email" ]; do
        email=$(echo "$email" | tr -d ' ')
        [ -z "$email" ] && continue
        [[ "$email" == "email"* ]] && continue  # Skip header
        subscribe_email "$topic_arn" "$email"
    done < "$file"
}

verify_subscriptions() {
    log_info "Verifying subscriptions..."
    echo ""

    aws sns list-topics --region "$AWS_REGION" --query "Topics[?contains(TopicArn, '${PROJECT_PREFIX}')].[TopicArn]" --output text | while read -r arn; do
        topic_name=$(echo "$arn" | rev | cut -d':' -f1 | rev)
        echo "Topic: ${topic_name}"
        echo "----------------------------------------"
        aws sns list-subscriptions-by-topic --topic-arn "$arn" --region "$AWS_REGION" \
            --query 'Subscriptions[?Protocol==`email`].[Endpoint,SubscriptionArn]' --output text | while read -r endpoint sub_arn; do
            if [[ "$sub_arn" == "PendingConfirmation" ]]; then
                echo -e "  ${YELLOW}PENDING${NC}: ${endpoint}"
            else
                echo -e "  ${GREEN}CONFIRMED${NC}: ${endpoint}"
            fi
        done
        echo ""
    done
}

main() {
    echo -e "${BLUE}"
    echo "============================================"
    echo "  UnifiedHealth SNS Subscription Helper"
    echo "============================================"
    echo -e "${NC}"

    parse_args "$@"
    check_prerequisites

    case "$ACTION" in
        "list")
            list_topics
            ;;
        "verify")
            verify_subscriptions
            ;;
        *)
            if [ -n "$EMAIL" ] && [ -n "$TOPIC_PATTERN" ]; then
                topic_arn=$(get_topic_arn "$TOPIC_PATTERN")
                subscribe_email "$topic_arn" "$EMAIL"
            elif [ -n "$BULK_FILE" ] && [ -n "$TOPIC_PATTERN" ]; then
                topic_arn=$(get_topic_arn "$TOPIC_PATTERN")
                bulk_subscribe "$BULK_FILE" "$topic_arn"
            else
                show_help
            fi
            ;;
    esac
}

main "$@"
