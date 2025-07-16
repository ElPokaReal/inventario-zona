import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600'
    },
    green: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      border: 'border-emerald-200',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    yellow: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-200',
      gradient: 'from-amber-500 to-amber-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      border: 'border-red-200',
      gradient: 'from-red-500 to-red-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-600'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${classes.border} p-6 hover:shadow-md transition-all duration-200 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
          {change && (
            <div className="flex items-center">
              <span className={`text-sm font-medium ${change.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change.trend === 'up' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-r ${classes.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;