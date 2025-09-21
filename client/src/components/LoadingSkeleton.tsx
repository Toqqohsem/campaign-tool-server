import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'list' | 'stat';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="card-elevated p-6 rounded-xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 skeleton rounded-xl"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 skeleton rounded w-3/4"></div>
                <div className="h-3 skeleton rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 skeleton rounded"></div>
              <div className="h-3 skeleton rounded w-5/6"></div>
              <div className="h-3 skeleton rounded w-4/6"></div>
            </div>
          </div>
        );
      
      case 'stat':
        return (
          <div className="card-elevated p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 skeleton rounded-xl"></div>
              <div className="w-16 h-6 skeleton rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 skeleton rounded w-20"></div>
              <div className="h-4 skeleton rounded w-24"></div>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="card-elevated p-4 rounded-lg mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 skeleton rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 skeleton rounded w-2/3"></div>
                <div className="h-3 skeleton rounded w-1/2"></div>
              </div>
              <div className="w-16 h-6 skeleton rounded"></div>
            </div>
          </div>
        );
      
      default:
        return <div className="h-20 skeleton rounded"></div>;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;