import React from 'react';
import { SystemHealth } from '@/types/admin';

interface SystemHealthIndicatorProps {
  health: SystemHealth;
  className?: string;
}

export default function SystemHealthIndicator({
  health,
  className = '',
}: SystemHealthIndicatorProps) {
  const getStatusColor = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getServiceStatusColor = (status: 'online' | 'offline') => {
    return status === 'online' ? 'text-green-600' : 'text-red-600';
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            health.status
          )}`}
        >
          {health.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-4">
        {/* Uptime */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Uptime</span>
          <span className="text-sm text-gray-900">
            {formatUptime(health.uptime)}
          </span>
        </div>

        {/* CPU Usage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              CPU Usage ({health.cpu.cores} cores)
            </span>
            <span className="text-sm text-gray-900">{health.cpu.usage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                health.cpu.usage > 80
                  ? 'bg-red-500'
                  : health.cpu.usage > 60
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${health.cpu.usage}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Memory Usage
            </span>
            <span className="text-sm text-gray-900">
              {health.memory.used.toFixed(2)} GB / {health.memory.total.toFixed(2)} GB
              ({health.memory.percentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                health.memory.percentage > 80
                  ? 'bg-red-500'
                  : health.memory.percentage > 60
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${health.memory.percentage}%` }}
            />
          </div>
        </div>

        {/* Database */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Database</span>
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-medium ${
                health.database.status === 'connected'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {health.database.status}
            </span>
            <span className="text-xs text-gray-500">
              ({health.database.responseTime}ms)
            </span>
          </div>
        </div>

        {/* Services */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Services</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(health.services).map(([service, status]) => (
              <div
                key={service}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600 capitalize">{service}</span>
                <span
                  className={`font-medium ${getServiceStatusColor(status)}`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Last Checked */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last checked: {new Date(health.lastChecked).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
