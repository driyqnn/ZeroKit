import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Layout, Copy, Code, Maximize2, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

type GridItem = {
  id: string;
  content: string;
  styles: {
    backgroundColor: string;
    color: string;
    padding: string;
    textAlign: string;
    justifySelf?: string;
    alignSelf?: string;
    gridColumn?: string;
    gridRow?: string;
  };
};

type FlexItem = {
  id: string;
  content: string;
  styles: {
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: string;
    order?: number;
    alignSelf?: string;
    backgroundColor: string;
    color: string;
    padding: string;
    textAlign: string;
  };
};

type TextAlign = "left" | "center" | "right" | "justify" | "initial" | "inherit";

const CssFlexboxGridGenerator: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("flexbox");
  
  // Flexbox state
  const [flexDirection, setFlexDirection] = useState("row");
  const [justifyContent, setJustifyContent] = useState("flex-start");
  const [alignItems, setAlignItems] = useState("stretch");
  const [flexWrap, setFlexWrap] = useState("nowrap");
  const [flexGap, setFlexGap] = useState("10px");
  const [flexItems, setFlexItems] = useState<FlexItem[]>([
    {
      id: "flex-1",
      content: "Item 1",
      styles: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
        order: 0,
        alignSelf: "auto",
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
      },
    },
    {
      id: "flex-2",
      content: "Item 2",
      styles: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
        order: 0,
        alignSelf: "auto",
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
      },
    },
    {
      id: "flex-3",
      content: "Item 3",
      styles: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
        order: 0,
        alignSelf: "auto",
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
      },
    },
  ]);
  
  // Grid state
  const [gridTemplateColumns, setGridTemplateColumns] = useState("repeat(3, 1fr)");
  const [gridTemplateRows, setGridTemplateRows] = useState("repeat(3, 100px)");
  const [gridGap, setGridGap] = useState("10px");
  const [justifyItems, setJustifyItems] = useState("stretch");
  const [alignItems_grid, setAlignItems_grid] = useState("stretch");
  const [gridItems, setGridItems] = useState<GridItem[]>([
    {
      id: "grid-1",
      content: "Item 1",
      styles: {
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        justifySelf: "stretch",
        alignSelf: "stretch",
      },
    },
    {
      id: "grid-2",
      content: "Item 2",
      styles: {
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        justifySelf: "stretch",
        alignSelf: "stretch",
      },
    },
    {
      id: "grid-3",
      content: "Item 3",
      styles: {
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        justifySelf: "stretch",
        alignSelf: "stretch",
      },
    },
    {
      id: "grid-4",
      content: "Item 4",
      styles: {
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        justifySelf: "stretch",
        alignSelf: "stretch",
      },
    },
    {
      id: "grid-5",
      content: "Item 5",
      styles: {
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        justifySelf: "stretch",
        alignSelf: "stretch",
      },
    },
    {
      id: "grid-6",
      content: "Item 6",
      styles: {
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        justifySelf: "stretch",
        alignSelf: "stretch",
      },
    },
    {
      id: "grid-7",
      content: "Item 7",
      styles: {
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        justifySelf: "stretch",
        alignSelf: "stretch",
      },
    },
    {
      id: "grid-8",
      content: "Item 8",
      styles: {
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        justifySelf: "stretch",
        alignSelf: "stretch",
      },
    },
    {
      id: "grid-9",
      content: "Item 9",
      styles: {
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        justifySelf: "stretch",
        alignSelf: "stretch",
      },
    },
  ]);
  
  // Selected item state (for individual item editing)
  const [selectedFlexItemId, setSelectedFlexItemId] = useState<string | null>(null);
  const [selectedGridItemId, setSelectedGridItemId] = useState<string | null>(null);
  
  const selectedFlexItem = flexItems.find(item => item.id === selectedFlexItemId);
  const selectedGridItem = gridItems.find(item => item.id === selectedGridItemId);
  
  // Add item functions
  const addFlexItem = () => {
    const newId = `flex-${flexItems.length + 1}`;
    const newItem: FlexItem = {
      id: newId,
      content: `Item ${flexItems.length + 1}`,
      styles: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
        order: 0,
        alignSelf: "auto",
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
      },
    };
    setFlexItems([...flexItems, newItem]);
  };
  
  const addGridItem = () => {
    const newId = `grid-${gridItems.length + 1}`;
    const newItem: GridItem = {
      id: newId,
      content: `Item ${gridItems.length + 1}`,
      styles: {
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        justifySelf: "stretch",
        alignSelf: "stretch",
      },
    };
    setGridItems([...gridItems, newItem]);
  };
  
  // Remove item functions
  const removeFlexItem = (id: string) => {
    if (flexItems.length > 1) {
      setFlexItems(flexItems.filter(item => item.id !== id));
      if (selectedFlexItemId === id) {
        setSelectedFlexItemId(null);
      }
    } else {
      toast({
        title: "Cannot remove item",
        description: "You need at least one item in the flexbox container.",
        variant: "destructive",
      });
    }
  };
  
  const removeGridItem = (id: string) => {
    if (gridItems.length > 1) {
      setGridItems(gridItems.filter(item => item.id !== id));
      if (selectedGridItemId === id) {
        setSelectedGridItemId(null);
      }
    } else {
      toast({
        title: "Cannot remove item",
        description: "You need at least one item in the grid container.",
        variant: "destructive",
      });
    }
  };
  
  // Update item functions
  const updateFlexItem = (id: string, update: Partial<FlexItem>) => {
    setFlexItems(items =>
      items.map(item =>
        item.id === id ? { ...item, ...update } : item
      )
    );
  };
  
  const updateGridItem = (id: string, update: Partial<GridItem>) => {
    setGridItems(items =>
      items.map(item =>
        item.id === id ? { ...item, ...update } : item
      )
    );
  };
  
  // Generate CSS code functions
  const generateFlexboxCss = () => {
    let css = `.container {\n`;
    css += `  display: flex;\n`;
    css += `  flex-direction: ${flexDirection};\n`;
    css += `  justify-content: ${justifyContent};\n`;
    css += `  align-items: ${alignItems};\n`;
    css += `  flex-wrap: ${flexWrap};\n`;
    css += `  gap: ${flexGap};\n`;
    css += `}\n\n`;
    
    flexItems.forEach((item, index) => {
      css += `.item-${index + 1} {\n`;
      if (item.styles.flexGrow !== undefined && item.styles.flexGrow !== 0) css += `  flex-grow: ${item.styles.flexGrow};\n`;
      if (item.styles.flexShrink !== undefined && item.styles.flexShrink !== 1) css += `  flex-shrink: ${item.styles.flexShrink};\n`;
      if (item.styles.flexBasis !== "auto") css += `  flex-basis: ${item.styles.flexBasis};\n`;
      if (item.styles.order !== undefined && item.styles.order !== 0) css += `  order: ${item.styles.order};\n`;
      if (item.styles.alignSelf !== "auto") css += `  align-self: ${item.styles.alignSelf};\n`;
      css += `}\n\n`;
    });
    
    return css;
  };
  
  const generateGridCss = () => {
    let css = `.container {\n`;
    css += `  display: grid;\n`;
    css += `  grid-template-columns: ${gridTemplateColumns};\n`;
    css += `  grid-template-rows: ${gridTemplateRows};\n`;
    css += `  gap: ${gridGap};\n`;
    css += `  justify-items: ${justifyItems};\n`;
    css += `  align-items: ${alignItems_grid};\n`;
    css += `}\n\n`;
    
    gridItems.forEach((item, index) => {
      if (item.styles.gridColumn || item.styles.gridRow || 
          item.styles.justifySelf !== "stretch" || item.styles.alignSelf !== "stretch") {
        css += `.item-${index + 1} {\n`;
        if (item.styles.gridColumn) css += `  grid-column: ${item.styles.gridColumn};\n`;
        if (item.styles.gridRow) css += `  grid-row: ${item.styles.gridRow};\n`;
        if (item.styles.justifySelf !== "stretch") css += `  justify-self: ${item.styles.justifySelf};\n`;
        if (item.styles.alignSelf !== "stretch") css += `  align-self: ${item.styles.alignSelf};\n`;
        css += `}\n\n`;
      }
    });
    
    return css;
  };
  
  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "CSS code copied to clipboard.",
      });
    });
  };
  
  // Download CSS file
  const downloadCss = () => {
    const css = activeTab === "flexbox" ? generateFlexboxCss() : generateGridCss();
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}-styles.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Reset function
  const resetLayout = () => {
    if (activeTab === "flexbox") {
      setFlexDirection("row");
      setJustifyContent("flex-start");
      setAlignItems("stretch");
      setFlexWrap("nowrap");
      setFlexGap("10px");
      setFlexItems([
        {
          id: "flex-1",
          content: "Item 1",
          styles: {
            flexGrow: 0,
            flexShrink: 1,
            flexBasis: "auto",
            order: 0,
            alignSelf: "auto",
            backgroundColor: "#8b5cf6",
            color: "white",
            padding: "1rem",
            textAlign: "center",
          },
        },
        {
          id: "flex-2",
          content: "Item 2",
          styles: {
            flexGrow: 0,
            flexShrink: 1,
            flexBasis: "auto",
            order: 0,
            alignSelf: "auto",
            backgroundColor: "#8b5cf6",
            color: "white",
            padding: "1rem",
            textAlign: "center",
          },
        },
        {
          id: "flex-3",
          content: "Item 3",
          styles: {
            flexGrow: 0,
            flexShrink: 1,
            flexBasis: "auto",
            order: 0,
            alignSelf: "auto",
            backgroundColor: "#8b5cf6",
            color: "white",
            padding: "1rem",
            textAlign: "center",
          },
        },
      ]);
    } else {
      setGridTemplateColumns("repeat(3, 1fr)");
      setGridTemplateRows("repeat(3, 100px)");
      setGridGap("10px");
      setJustifyItems("stretch");
      setAlignItems_grid("stretch");
      // Reset grid items to default
      const defaultGridItems: GridItem[] = Array(9).fill(0).map((_, i) => ({
        id: `grid-${i + 1}`,
        content: `Item ${i + 1}`,
        styles: {
          backgroundColor: "#8b5cf6",
          color: "white",
          padding: "1rem",
          textAlign: "center",
          justifySelf: "stretch",
          alignSelf: "stretch",
        },
      }));
      setGridItems(defaultGridItems);
    }
    
    toast({
      title: "Reset complete",
      description: `${activeTab === "flexbox" ? "Flexbox" : "Grid"} layout has been reset to default.`,
    });
  };

  return (
    <ToolLayout
      title="CSS Flexbox & Grid Generator"
      description="Create and visualize CSS Flexbox and Grid layouts with this interactive generator"
      icon={<Layout className="h-6 w-6 text-primary" />}
    >
      <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fade-in">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs defaultValue="flexbox" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="flexbox">Flexbox</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
            </TabsList>
            
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6 md:space-y-0">
                  {/* Control Panel */}
                  <div className="w-full md:w-1/3 space-y-6">
                    <TabsContent value="flexbox" className="space-y-4 mt-0">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Container Properties</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="flex-direction">Flex Direction</Label>
                          <Select value={flexDirection} onValueChange={setFlexDirection}>
                            <SelectTrigger id="flex-direction">
                              <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="row">row</SelectItem>
                              <SelectItem value="row-reverse">row-reverse</SelectItem>
                              <SelectItem value="column">column</SelectItem>
                              <SelectItem value="column-reverse">column-reverse</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="justify-content">Justify Content</Label>
                          <Select value={justifyContent} onValueChange={setJustifyContent}>
                            <SelectTrigger id="justify-content">
                              <SelectValue placeholder="Select justification" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flex-start">flex-start</SelectItem>
                              <SelectItem value="flex-end">flex-end</SelectItem>
                              <SelectItem value="center">center</SelectItem>
                              <SelectItem value="space-between">space-between</SelectItem>
                              <SelectItem value="space-around">space-around</SelectItem>
                              <SelectItem value="space-evenly">space-evenly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="align-items">Align Items</Label>
                          <Select value={alignItems} onValueChange={setAlignItems}>
                            <SelectTrigger id="align-items">
                              <SelectValue placeholder="Select alignment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flex-start">flex-start</SelectItem>
                              <SelectItem value="flex-end">flex-end</SelectItem>
                              <SelectItem value="center">center</SelectItem>
                              <SelectItem value="stretch">stretch</SelectItem>
                              <SelectItem value="baseline">baseline</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="flex-wrap">Flex Wrap</Label>
                          <Select value={flexWrap} onValueChange={setFlexWrap}>
                            <SelectTrigger id="flex-wrap">
                              <SelectValue placeholder="Select wrap behavior" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nowrap">nowrap</SelectItem>
                              <SelectItem value="wrap">wrap</SelectItem>
                              <SelectItem value="wrap-reverse">wrap-reverse</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="flex-gap">Gap</Label>
                          <Input
                            id="flex-gap"
                            value={flexGap}
                            onChange={(e) => setFlexGap(e.target.value)}
                            placeholder="10px"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium">Item Properties</h3>
                          <Button variant="outline" size="sm" onClick={addFlexItem}>
                            Add Item
                          </Button>
                        </div>
                        
                        {selectedFlexItem ? (
                          <div className="space-y-3 border p-3 rounded-md">
                            <div className="flex justify-between items-center">
                              <Label>Editing: {selectedFlexItem.content}</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFlexItem(selectedFlexItem.id)}
                              >
                                Remove
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="flex-grow">Flex Grow</Label>
                              <Input
                                id="flex-grow"
                                type="number"
                                min="0"
                                value={selectedFlexItem.styles.flexGrow}
                                onChange={(e) =>
                                  updateFlexItem(selectedFlexItem.id, {
                                    styles: {
                                      ...selectedFlexItem.styles,
                                      flexGrow: Number(e.target.value),
                                    },
                                  })
                                }
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="flex-shrink">Flex Shrink</Label>
                              <Input
                                id="flex-shrink"
                                type="number"
                                min="0"
                                value={selectedFlexItem.styles.flexShrink}
                                onChange={(e) =>
                                  updateFlexItem(selectedFlexItem.id, {
                                    styles: {
                                      ...selectedFlexItem.styles,
                                      flexShrink: Number(e.target.value),
                                    },
                                  })
                                }
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="flex-basis">Flex Basis</Label>
                              <Input
                                id="flex-basis"
                                value={selectedFlexItem.styles.flexBasis}
                                onChange={(e) =>
                                  updateFlexItem(selectedFlexItem.id, {
                                    styles: {
                                      ...selectedFlexItem.styles,
                                      flexBasis: e.target.value,
                                    },
                                  })
                                }
                                placeholder="auto"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="flex-order">Order</Label>
                              <Input
                                id="flex-order"
                                type="number"
                                value={selectedFlexItem.styles.order}
                                onChange={(e) =>
                                  updateFlexItem(selectedFlexItem.id, {
                                    styles: {
                                      ...selectedFlexItem.styles,
                                      order: Number(e.target.value),
                                    },
                                  })
                                }
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="flex-align-self">Align Self</Label>
                              <Select
                                value={selectedFlexItem.styles.alignSelf}
                                onValueChange={(value) =>
                                  updateFlexItem(selectedFlexItem.id, {
                                    styles: {
                                      ...selectedFlexItem.styles,
                                      alignSelf: value,
                                    },
                                  })
                                }
                              >
                                <SelectTrigger id="flex-align-self">
                                  <SelectValue placeholder="Select alignment" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="auto">auto</SelectItem>
                                  <SelectItem value="flex-start">flex-start</SelectItem>
                                  <SelectItem value="flex-end">flex-end</SelectItem>
                                  <SelectItem value="center">center</SelectItem>
                                  <SelectItem value="stretch">stretch</SelectItem>
                                  <SelectItem value="baseline">baseline</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="flex-item-content">Content</Label>
                              <Input
                                id="flex-item-content"
                                value={selectedFlexItem.content}
                                onChange={(e) =>
                                  updateFlexItem(selectedFlexItem.id, {
                                    content: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Select an item in the preview to edit its properties.
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="grid" className="space-y-4 mt-0">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Container Properties</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="grid-template-columns">Grid Template Columns</Label>
                          <Input
                            id="grid-template-columns"
                            value={gridTemplateColumns}
                            onChange={(e) => setGridTemplateColumns(e.target.value)}
                            placeholder="repeat(3, 1fr)"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="grid-template-rows">Grid Template Rows</Label>
                          <Input
                            id="grid-template-rows"
                            value={gridTemplateRows}
                            onChange={(e) => setGridTemplateRows(e.target.value)}
                            placeholder="repeat(3, 100px)"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="grid-gap">Gap</Label>
                          <Input
                            id="grid-gap"
                            value={gridGap}
                            onChange={(e) => setGridGap(e.target.value)}
                            placeholder="10px"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="justify-items">Justify Items</Label>
                          <Select value={justifyItems} onValueChange={setJustifyItems}>
                            <SelectTrigger id="justify-items">
                              <SelectValue placeholder="Select justification" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="start">start</SelectItem>
                              <SelectItem value="end">end</SelectItem>
                              <SelectItem value="center">center</SelectItem>
                              <SelectItem value="stretch">stretch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="align-items-grid">Align Items</Label>
                          <Select value={alignItems_grid} onValueChange={setAlignItems_grid}>
                            <SelectTrigger id="align-items-grid">
                              <SelectValue placeholder="Select alignment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="start">start</SelectItem>
                              <SelectItem value="end">end</SelectItem>
                              <SelectItem value="center">center</SelectItem>
                              <SelectItem value="stretch">stretch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium">Item Properties</h3>
                          <Button variant="outline" size="sm" onClick={addGridItem}>
                            Add Item
                          </Button>
                        </div>
                        
                        {selectedGridItem ? (
                          <div className="space-y-3 border p-3 rounded-md">
                            <div className="flex justify-between items-center">
                              <Label>Editing: {selectedGridItem.content}</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeGridItem(selectedGridItem.id)}
                              >
                                Remove
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="grid-column">Grid Column</Label>
                              <Input
                                id="grid-column"
                                value={selectedGridItem.styles.gridColumn || ""}
                                onChange={(e) =>
                                  updateGridItem(selectedGridItem.id, {
                                    styles: {
                                      ...selectedGridItem.styles,
                                      gridColumn: e.target.value,
                                    },
                                  })
                                }
                                placeholder="auto / span 2"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="grid-row">Grid Row</Label>
                              <Input
                                id="grid-row"
                                value={selectedGridItem.styles.gridRow || ""}
                                onChange={(e) =>
                                  updateGridItem(selectedGridItem.id, {
                                    styles: {
                                      ...selectedGridItem.styles,
                                      gridRow: e.target.value,
                                    },
                                  })
                                }
                                placeholder="auto / span 2"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="grid-justify-self">Justify Self</Label>
                              <Select
                                value={selectedGridItem.styles.justifySelf || "stretch"}
                                onValueChange={(value) =>
                                  updateGridItem(selectedGridItem.id, {
                                    styles: {
                                      ...selectedGridItem.styles,
                                      justifySelf: value,
                                    },
                                  })
                                }
                              >
                                <SelectTrigger id="grid-justify-self">
                                  <SelectValue placeholder="Select justification" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="start">start</SelectItem>
                                  <SelectItem value="end">end</SelectItem>
                                  <SelectItem value="center">center</SelectItem>
                                  <SelectItem value="stretch">stretch</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="grid-align-self">Align Self</Label>
                              <Select
                                value={selectedGridItem.styles.alignSelf || "stretch"}
                                onValueChange={(value) =>
                                  updateGridItem(selectedGridItem.id, {
                                    styles: {
                                      ...selectedGridItem.styles,
                                      alignSelf: value,
                                    },
                                  })
                                }
                              >
                                <SelectTrigger id="grid-align-self">
                                  <SelectValue placeholder="Select alignment" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="start">start</SelectItem>
                                  <SelectItem value="end">end</SelectItem>
                                  <SelectItem value="center">center</SelectItem>
                                  <SelectItem value="stretch">stretch</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="grid-item-content">Content</Label>
                              <Input
                                id="grid-item-content"
                                value={selectedGridItem.content}
                                onChange={(e) =>
                                  updateGridItem(selectedGridItem.id, {
                                    content: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Select an item in the preview to edit its properties.
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={resetLayout}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={downloadCss}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CSS
                      </Button>
                    </div>
                  </div>
                  
                  {/* Preview & Code */}
                  <div className="w-full md:w-2/3 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Preview</h3>
                      <div 
                        className="border rounded-md p-4 h-96 overflow-auto bg-muted transition-all duration-300 hover:shadow-md"
                        style={{
                          display: activeTab === "flexbox" ? "flex" : "grid",
                          ...(activeTab === "flexbox"
                            ? {
                                flexDirection: flexDirection as any,
                                justifyContent,
                                alignItems,
                                flexWrap: flexWrap as any,
                                gap: flexGap,
                              }
                            : {
                                gridTemplateColumns,
                                gridTemplateRows,
                                gap: gridGap,
                                justifyItems,
                                alignItems: alignItems_grid,
                              }),
                        }}
                      >
                        {activeTab === "flexbox"
                          ? flexItems.map((item) => (
                              <motion.div
                                key={item.id}
                                onClick={() => setSelectedFlexItemId(item.id)}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                  selectedFlexItemId === item.id
                                    ? "outline outline-2 outline-primary"
                                    : ""
                                }`}
                                style={{
                                  ...item.styles,
                                  flexGrow: item.styles.flexGrow,
                                  flexShrink: item.styles.flexShrink,
                                  flexBasis: item.styles.flexBasis,
                                  order: item.styles.order,
                                  alignSelf: item.styles.alignSelf as any,
                                  textAlign: item.styles.textAlign as TextAlign,
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {item.content}
                              </motion.div>
                            ))
                          : gridItems.map((item) => (
                              <motion.div
                                key={item.id}
                                onClick={() => setSelectedGridItemId(item.id)}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                  selectedGridItemId === item.id
                                    ? "outline outline-2 outline-primary"
                                    : ""
                                }`}
                                style={{
                                  ...item.styles,
                                  gridColumn: item.styles.gridColumn,
                                  gridRow: item.styles.gridRow,
                                  justifySelf: item.styles.justifySelf as any,
                                  alignSelf: item.styles.alignSelf as any,
                                  textAlign: item.styles.textAlign as TextAlign,
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {item.content}
                              </motion.div>
                            ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Generated CSS</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              activeTab === "flexbox"
                                ? generateFlexboxCss()
                                : generateGridCss()
                            )
                          }
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <pre className="border rounded-md p-4 bg-muted/50 text-xs overflow-auto h-48 whitespace-pre-wrap">
                        <code>
                          {activeTab === "flexbox"
                            ? generateFlexboxCss()
                            : generateGridCss()}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">CSS Flexbox & Grid Tips</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Flexbox Best Practices</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Use <code className="bg-muted px-1 rounded">flex-wrap: wrap</code> for responsive layouts that adapt to different screen sizes.</li>
                    <li>Instead of using exact <code className="bg-muted px-1 rounded">width</code> values, consider using <code className="bg-muted px-1 rounded">flex-basis</code> with <code className="bg-muted px-1 rounded">flex-grow</code> and <code className="bg-muted px-1 rounded">flex-shrink</code>.</li>
                    <li>Use <code className="bg-muted px-1 rounded">flex-direction: column</code> for vertical layouts, especially on mobile.</li>
                    <li>The <code className="bg-muted px-1 rounded">gap</code> property provides consistent spacing between items.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Grid Best Practices</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Use <code className="bg-muted px-1 rounded">minmax()</code> for responsive column sizes (e.g., <code className="bg-muted px-1 rounded">minmax(200px, 1fr)</code>).</li>
                    <li>The <code className="bg-muted px-1 rounded">auto-fill</code> and <code className="bg-muted px-1 rounded">auto-fit</code> keywords are useful for responsive grids.</li>
                    <li>Use named grid areas for more readable layouts with <code className="bg-muted px-1 rounded">grid-template-areas</code>.</li>
                    <li>Combine <code className="bg-muted px-1 rounded">grid-column</code> and <code className="bg-muted px-1 rounded">grid-row</code> to create complex layouts.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ToolLayout>
  );
};

export default CssFlexboxGridGenerator;
