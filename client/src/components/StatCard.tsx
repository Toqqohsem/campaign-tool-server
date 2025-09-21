import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  gradient?: 'primary' | 'success' | 'warning' | 'secondary';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  gradient = 'primary'
}) => {
  const gradientClasses = {
    primary: 'gradient-primary',
    success: 'gradient-success', 
    warning: 'gradient-warning',
    secondary: 'gradient-secondary'
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="card-elevated p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${gradientClasses[gradient]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-semibold ${trendColors[trend]}`}>
            {trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
            {trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;