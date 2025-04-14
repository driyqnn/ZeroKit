
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface MysteryItemProps {
  price: number;
  cash: number;
  onPurchase: () => void;
}

const MysteryItem: React.FC<MysteryItemProps> = ({ price, cash, onPurchase }) => {
  return (
    <Card className="bg-primary/5 border-dashed border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Mystery Package</h3>
              <p className="text-sm text-muted-foreground">Could contain a valuable surprise or nothing at all!</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPurchase}
            disabled={cash < price}
            className="whitespace-nowrap"
          >
            Buy for ${price}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MysteryItem;
