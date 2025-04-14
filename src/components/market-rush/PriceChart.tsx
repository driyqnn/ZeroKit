
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PriceHistory, Item } from './types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface PriceChartProps {
  priceHistory: PriceHistory;
  items: Item[];
  selectedItemId: string | null;
  showAllItems?: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  priceHistory, 
  items, 
  selectedItemId,
  showAllItems = false
}) => {
  // Generate a set of colors for the lines
  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', 
    '#00ffff', '#ff8000', '#8000ff', '#0080ff', '#ff0080'
  ];
  
  // Transform the data for the chart
  const transformData = () => {
    const chartData = [];
    
    // Find the maximum length of price history for any item
    const maxLength = Math.max(
      ...Object.values(priceHistory).map(history => history.length)
    );
    
    // For each day, create a data point containing prices of all items
    for (let day = 0; day < maxLength; day++) {
      const dataPoint: any = { day: day + 1 };
      
      items.forEach(item => {
        // Skip items that should not be shown
        if (!showAllItems && selectedItemId && item.id !== selectedItemId) {
          return;
        }
        
        if (priceHistory[item.id] && priceHistory[item.id][day] !== undefined) {
          dataPoint[item.name] = priceHistory[item.id][day];
        }
      });
      
      chartData.push(dataPoint);
    }
    
    return chartData;
  };
  
  const chartData = transformData();
  
  // If there's no data or the data is not yet ready, show loading
  if (Object.keys(priceHistory).length === 0 || chartData.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 h-80 flex items-center justify-center">
          <p className="text-muted-foreground">Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }
  
  // Determine which items to show based on selections
  const itemsToShow = showAllItems 
    ? items 
    : selectedItemId 
      ? items.filter(item => item.id === selectedItemId) 
      : items;
  
  return (
    <Card>
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="day" 
              label={{ value: 'Day', position: 'insideBottomRight', offset: -5 }} 
            />
            <YAxis 
              label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: '1px solid #333',
                borderRadius: '4px'
              }}
              formatter={(value: any) => [`$${value.toFixed(2)}`, '']} 
            />
            <Legend />
            
            {itemsToShow.map((item, index) => (
              <Line
                key={item.id}
                type="monotone"
                dataKey={item.name}
                stroke={colors[index % colors.length]}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        
        {!selectedItemId && !showAllItems && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Click the eye icon next to an item to view its price history.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceChart;
