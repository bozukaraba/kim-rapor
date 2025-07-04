import React from 'react';

interface ChartProps {
  data: any;
  type: 'line' | 'pie' | 'bar';
}

const Chart: React.FC<ChartProps> = ({ data, type }) => {
  // This is a simplified chart component for demo purposes
  // In a real application, you'd use a library like Chart.js or D3.js
  
  if (type === 'line') {
    return (
      <div className="h-64 flex items-end justify-between px-4">
        {data.labels.map((label: string, index: number) => (
          <div key={label} className="flex flex-col items-center">
            <div 
              className="w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg mb-2"
              style={{ height: `${(data.datasets[0].data[index] / 30000) * 200}px` }}
            ></div>
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-500"></div>
          <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="h-64 flex items-center justify-center text-gray-500">Chart visualization</div>;
};

export default Chart;