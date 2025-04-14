import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Paintbrush,
  Eraser,
  Download,
  Trash2,
  Undo,
  Redo,
  Square,
  Circle,
  Text,
  PaintBucket,
  PenSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const DEFAULT_LINE_WIDTH = 5;
const DEFAULT_COLOR = "#6d28d9"; // Violet color

type Tool = "pencil" | "eraser" | "rectangle" | "circle" | "text" | "fill";

const DrawingBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [lineWidth, setLineWidth] = useState(DEFAULT_LINE_WIDTH);
  const [tool, setTool] = useState<Tool>("pencil");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textToAdd, setTextToAdd] = useState("");
  const [isTextMode, setIsTextMode] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isMobile) {
      canvas.width = Math.min(CANVAS_WIDTH, window.innerWidth - 40);
      canvas.height = Math.min(CANVAS_HEIGHT, (window.innerWidth - 40) * 0.75);
    } else {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }

    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setCtx(context);

    saveCanvasState();
  }, [isMobile]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !ctx) return;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;
      tempCtx.drawImage(canvas, 0, 0);

      if (isMobile) {
        canvas.width = Math.min(CANVAS_WIDTH, window.innerWidth - 40);
        canvas.height = Math.min(
          CANVAS_HEIGHT,
          (window.innerWidth - 40) * 0.75
        );
      }

      ctx.drawImage(tempCanvas, 0, 0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ctx, isMobile]);

  // Update context styles when color or line width changes
  useEffect(() => {
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = color;
  }, [color, lineWidth, ctx]);

  // Save current canvas state to history
  const saveCanvasState = () => {
    if (!canvasRef.current) return;

    try {
      const imgData = canvasRef.current.toDataURL("image/png");

      if (historyIndex >= 0 && canvasHistory[historyIndex] === imgData) return;

      const newHistory = canvasHistory.slice(0, historyIndex + 1);
      newHistory.push(imgData);

      if (newHistory.length > 50) {
        newHistory.shift();
      }

      setCanvasHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } catch (error) {
      console.error("Error saving canvas state:", error);
    }
  };

  // Restore canvas from saved state
  const restoreCanvas = (imgData: string) => {
    if (!ctx || !canvasRef.current) return;

    const img = new Image();
    img.src = imgData;
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  // Handle undo action
  const handleUndo = () => {
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    restoreCanvas(canvasHistory[newIndex]);
  };

  // Handle redo action
  const handleRedo = () => {
    if (historyIndex >= canvasHistory.length - 1) return;

    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    restoreCanvas(canvasHistory[newIndex]);
  };

  // Handle clear canvas action
  const handleClear = () => {
    if (!ctx || !canvasRef.current) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveCanvasState();
    toast({
      title: "Canvas cleared",
      description: "Your drawing has been cleared.",
    });
  };

  // Start drawing process
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!ctx || !canvasRef.current) return;

    setIsDrawing(true);

    const { x, y } = getCoordinates(e);
    setStartPos({ x, y });

    if (tool === "pencil" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (tool === "text" && textInputRef.current) {
      setIsTextMode(true);
      textInputRef.current.style.left = `${x}px`;
      textInputRef.current.style.top = `${y}px`;
      textInputRef.current.focus();
    } else if (tool === "fill") {
      floodFill(x, y, color);
    }
  };

  // Continue drawing process
  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;

    const { x, y } = getCoordinates(e);

    if (tool === "pencil") {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "eraser") {
      ctx.strokeStyle = "white";
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.strokeStyle = color;
    } else if (tool === "rectangle") {
      const width = x - startPos.x;
      const height = y - startPos.y;

      if (historyIndex >= 0) {
        restoreCanvas(canvasHistory[historyIndex]);
      }

      ctx.beginPath();
      ctx.rect(startPos.x, startPos.y, width, height);
      ctx.stroke();
    } else if (tool === "circle") {
      const radius = Math.sqrt(
        Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
      );

      if (historyIndex >= 0) {
        restoreCanvas(canvasHistory[historyIndex]);
      }

      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  // End drawing process
  const endDrawing = () => {
    if (!isDrawing || !ctx) return;

    ctx.closePath();
    setIsDrawing(false);
    saveCanvasState();
  };

  // Get mouse/touch coordinates relative to canvas
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    return { x, y };
  };

  // Add text to canvas when Enter key is pressed
  const addText = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && textToAdd && ctx && canvasRef.current) {
      const textPos = {
        x: parseInt(textInputRef.current!.style.left, 10),
        y: parseInt(textInputRef.current!.style.top, 10),
      };

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const relativeX = textPos.x - canvasRect.left;
      const relativeY = textPos.y - canvasRect.top + 20;

      ctx.font = `${lineWidth * 3}px sans-serif`;
      ctx.fillStyle = color;
      ctx.fillText(textToAdd, relativeX, relativeY);

      setTextToAdd("");
      setIsTextMode(false);
      saveCanvasState();
    }
  };

  // Implement flood fill algorithm with safeguards
  const floodFill = (startX: number, startY: number, fillColor: string) => {
    if (!ctx || !canvasRef.current) return;

    try {
      const imageData = ctx.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;

      // Parse fill color to RGB
      const fillR = parseInt(fillColor.substring(1, 3), 16);
      const fillG = parseInt(fillColor.substring(3, 5), 16);
      const fillB = parseInt(fillColor.substring(5, 7), 16);

      // Get target color at start position
      const startIndex = (Math.floor(startY) * width + Math.floor(startX)) * 4;
      const targetR = data[startIndex];
      const targetG = data[startIndex + 1];
      const targetB = data[startIndex + 2];

      // Don't fill if already the same color
      if (targetR === fillR && targetG === fillG && targetB === fillB) {
        return;
      }

      // Use a loop with stack for safety (instead of recursion which can cause stack overflow)
      const stack: [number, number][] = [[startX, startY]];
      const tolerance = 10;
      const visitedPixels = new Set<string>();
      const maxOperations = width * height; // Safety limit
      let operations = 0;

      const matchColor = (index: number) => {
        return (
          Math.abs(data[index] - targetR) <= tolerance &&
          Math.abs(data[index + 1] - targetG) <= tolerance &&
          Math.abs(data[index + 2] - targetB) <= tolerance
        );
      };

      while (stack.length > 0 && operations < maxOperations) {
        const [x, y] = stack.pop()!;
        operations++;

        // Boundary check
        if (x < 0 || x >= width || y < 0 || y >= height) {
          continue;
        }

        // Create a unique key for this pixel
        const pixelKey = `${Math.floor(x)},${Math.floor(y)}`;

        // Skip if already visited
        if (visitedPixels.has(pixelKey)) {
          continue;
        }

        visitedPixels.add(pixelKey);

        const index = (Math.floor(y) * width + Math.floor(x)) * 4;

        if (!matchColor(index)) {
          continue;
        }

        // Set the color
        data[index] = fillR;
        data[index + 1] = fillG;
        data[index + 2] = fillB;
        data[index + 3] = 255; // Alpha

        // Add neighboring pixels to stack
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }

      if (operations >= maxOperations) {
        console.warn("Fill operation terminated early due to safety limit");
      }

      ctx.putImageData(imageData, 0, 0);
      saveCanvasState();
    } catch (error) {
      console.error("Error in flood fill:", error);
      toast({
        title: "Error",
        description: "There was a problem with the fill operation.",
      });
    }
  };

  // Download the canvas as an image
  const downloadImage = () => {
    if (!canvasRef.current) return;

    try {
      const link = document.createElement("a");
      link.download = "drawing_ZeroKit.png";
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
      toast({
        title: "Image downloaded",
        description: "Your drawing has been saved as a PNG image.",
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        title: "Error",
        description: "There was a problem downloading your drawing.",
      });
    }
  };

  if (isMobile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Drawing Board</h2>
          <p className="text-muted-foreground mb-6">
            The Drawing Board tool is optimized for desktop use. Please try
            accessing it from a desktop browser for the best experience.
          </p>
          <PenSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              size="sm"
              variant={tool === "pencil" ? "default" : "outline"}
              onClick={() => setTool("pencil")}>
              <PenSquare className="h-4 w-4 mr-2" />
              Pencil
            </Button>
            <Button
              size="sm"
              variant={tool === "eraser" ? "default" : "outline"}
              onClick={() => setTool("eraser")}>
              <Eraser className="h-4 w-4 mr-2" />
              Eraser
            </Button>
            <Button
              size="sm"
              variant={tool === "rectangle" ? "default" : "outline"}
              onClick={() => setTool("rectangle")}>
              <Square className="h-4 w-4 mr-2" />
              Rectangle
            </Button>
            <Button
              size="sm"
              variant={tool === "circle" ? "default" : "outline"}
              onClick={() => setTool("circle")}>
              <Circle className="h-4 w-4 mr-2" />
              Circle
            </Button>
            <Button
              size="sm"
              variant={tool === "text" ? "default" : "outline"}
              onClick={() => setTool("text")}>
              <Text className="h-4 w-4 mr-2" />
              Text
            </Button>
            <Button
              size="sm"
              variant={tool === "fill" ? "default" : "outline"}
              onClick={() => setTool("fill")}>
              <PaintBucket className="h-4 w-4 mr-2" />
              Fill
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label htmlFor="colorPicker" className="text-sm">
                Color:
              </label>
              <input
                id="colorPicker"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 border-0 rounded-md cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 flex-grow max-w-xs">
              <label htmlFor="lineWidth" className="text-sm whitespace-nowrap">
                Size: {lineWidth}px
              </label>
              <Slider
                id="lineWidth"
                min={1}
                max={50}
                step={1}
                value={[lineWidth]}
                onValueChange={(values) => setLineWidth(values[0])}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleUndo}
              disabled={historyIndex <= 0}>
              <Undo className="h-4 w-4 mr-2" />
              Undo
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRedo}
              disabled={historyIndex >= canvasHistory.length - 1}>
              <Redo className="h-4 w-4 mr-2" />
              Redo
            </Button>
            <Button size="sm" variant="destructive" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button size="sm" variant="outline" onClick={downloadImage}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="relative bg-gray-100 flex justify-center p-4">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
            className="border border-gray-300 bg-white shadow-sm"
            style={{ cursor: tool === "text" ? "text" : "crosshair" }}
          />

          {isTextMode && (
            <input
              ref={textInputRef}
              type="text"
              value={textToAdd}
              onChange={(e) => setTextToAdd(e.target.value)}
              onKeyDown={addText}
              onBlur={() => setIsTextMode(false)}
              placeholder="Type and press Enter"
              className="absolute p-1 border border-gray-300 rounded-sm text-black"
              style={{ fontSize: `${lineWidth * 3}px` }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DrawingBoard;
