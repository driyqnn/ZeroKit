
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Item, InventoryItem, PlayerTrait } from './types';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Star,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ItemsTableProps {
  items: Item[];
  inventory: InventoryItem[];
  cash: number;
  onBuy: (item: Item) => void;
  onSell: (item: InventoryItem) => void;
  onSelectItem: (itemId: string) => void;
  selectedItemId: string | null;
  showBlackMarket?: boolean;
  showOnlyInventory?: boolean;
  onInsureItem?: (item: Item) => void;
  onUpgradeStorage?: (item: Item) => void;
  onDelayedOrder?: (item: Item, type: 'buy' | 'sell', quantity: number) => void;
  onGoAllIn?: (item: Item) => void;
  playerTrait?: PlayerTrait | null;
  storageUpgrades?: { [itemId: string]: number };
  showVolatility?: boolean;
  altCurrency?: string;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ 
  items, 
  inventory,
  cash,
  onBuy,
  onSell,
  onSelectItem,
  selectedItemId,
  showBlackMarket = false,
  showOnlyInventory = false,
  onInsureItem,
  onUpgradeStorage,
  onDelayedOrder,
  onGoAllIn,
  playerTrait,
  storageUpgrades = {},
  showVolatility = true,
  altCurrency = 'USD'
}) => {
  // Filter items to either show all, or only those in inventory with quantity > 0
  const filteredItems = showOnlyInventory 
    ? inventory.filter(item => item.quantity > 0)
    : showBlackMarket 
      ? items 
      : items.filter(item => !item.name.includes('Black Market'));

  // Convert USD price to alternate currency
  const convertPrice = (price: number, currency: string): string => {
    switch(currency) {
      case 'BTC':
        return `₿${(price * 0.000026).toFixed(6)}`;
      case 'ETH':
        return `Ξ${(price * 0.00037).toFixed(5)}`;
      case 'EUR':
        return `€${(price * 0.91).toFixed(2)}`;
      case 'GBP':
        return `£${(price * 0.77).toFixed(2)}`;
      default:
        return `$${price.toFixed(2)}`;
    }
  };

  // Get volatility stars
  const getVolatilityDisplay = (volatility: number) => {
    // Scale volatility to 1-4 stars
    const stars = Math.max(1, Math.min(4, Math.ceil(volatility * 20)));
    return (
      <div className="flex items-center" title={`Volatility: ${volatility.toFixed(2)}`}>
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className={`h-3 w-3 ${stars >= 3 ? 'text-amber-500' : 'text-blue-500'}`} fill="currentColor" />
        ))}
        {Array.from({ length: 4 - stars }).map((_, i) => (
          <Star key={i} className="h-3 w-3 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Owned</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => {
            const inventoryItem = inventory.find(i => i.id === item.id);
            const owned = inventoryItem?.quantity || 0;
            const priceDiff = item.price - item.previousPrice;
            const percentChange = item.previousPrice ? (priceDiff / item.previousPrice) * 100 : 0;
            
            // Determine if item is black market
            const isBlackMarket = item.name.includes('Black Market');
            const isPerishable = item.perishable;
            
            // Calculate max quantity including storage upgrades
            const upgrades = storageUpgrades[item.id] || 0;
            const maxQuantity = item.maxQuantity + upgrades;
            
            return (
              <TableRow key={item.id} className={selectedItemId === item.id ? "bg-muted/50" : ""}>
                <TableCell className="font-medium flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onSelectItem(item.id)}
                  >
                    {selectedItemId === item.id ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {item.name}
                      {isPerishable && (
                        <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.perishDays}d
                        </Badge>
                      )}
                      {inventoryItem?.insured && (
                        <Shield size={14} className="text-blue-400" />
                      )}
                    </div>
                    {showVolatility && (
                      <div className="mt-1">
                        {getVolatilityDisplay(item.volatility)}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span>${item.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">
                      {convertPrice(item.price, altCurrency !== 'USD' ? altCurrency : 'USD')}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {priceDiff > 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">+{percentChange.toFixed(1)}%</span>
                      </>
                    ) : priceDiff < 0 ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">{percentChange.toFixed(1)}%</span>
                      </>
                    ) : (
                      <>
                        <Minus className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-500">0%</span>
                      </>
                    )}
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  {owned}/{maxQuantity}
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 flex-wrap">
                    {isBlackMarket && !showBlackMarket ? (
                      <Button variant="outline" size="sm" disabled>
                        <Lock className="h-4 w-4 mr-1" />
                        Locked
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onBuy(item)}
                          disabled={cash < item.price || owned >= maxQuantity}
                        >
                          Buy
                        </Button>
                        
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => onSell(item as InventoryItem)}
                          disabled={owned <= 0}
                        >
                          Sell
                        </Button>
                        
                        {onInsureItem && owned > 0 && !inventoryItem?.insured && (
                          <Button
                            variant="outline" 
                            size="sm"
                            onClick={() => onInsureItem(item)}
                          >
                            Insure
                          </Button>
                        )}
                        
                        {onUpgradeStorage && (storageUpgrades[item.id] || 0) < 3 && (
                          <Button
                            variant="outline" 
                            size="sm"
                            onClick={() => onUpgradeStorage(item)}
                          >
                            +Storage
                          </Button>
                        )}
                        
                        {onDelayedOrder && (
                          <Button
                            variant="outline" 
                            size="sm"
                            onClick={() => onDelayedOrder(item, 'buy', 1)}
                          >
                            Pre-order
                          </Button>
                        )}
                        
                        {onGoAllIn && (
                          <Button
                            variant="outline" 
                            size="sm"
                            onClick={() => onGoAllIn(item)}
                          >
                            All-in
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemsTable;
