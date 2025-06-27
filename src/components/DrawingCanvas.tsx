
import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import { Layer } from "./MappingWorkspace";

interface DrawingCanvasProps {
  backgroundImage: string;
  layers: Layer[];
  activeLayerId: string;
  activeTool: 'draw' | 'marker' | 'text' | 'select';
  brushColor: string;
  onLayersUpdate: (layers: Layer[]) => void;
}

export const DrawingCanvas = forwardRef<HTMLCanvasElement, DrawingCanvasProps>(({
  backgroundImage,
  layers,
  activeLayerId,
  activeTool,
  brushColor,
  onLayersUpdate
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{x: number, y: number}[]>([]);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  useImperativeHandle(ref, () => canvasRef.current!);

  // Load and draw background image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = Math.min(img.width, window.innerWidth - 700); // Account for sidebars
      canvas.height = Math.min(img.height, window.innerHeight - 100);
      
      // Calculate aspect ratio and fit image
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      setBackgroundLoaded(true);
      
      console.log("Background image loaded and drawn");
    };
    img.src = backgroundImage;
  }, [backgroundImage]);

  // Redraw canvas when layers change
  useEffect(() => {
    if (!backgroundLoaded) return;
    redrawCanvas();
  }, [layers, backgroundLoaded]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw background
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      // Draw all visible layers
      layers.forEach(layer => {
        if (!layer.visible) return;

        // Draw paths
        layer.drawings.forEach(drawing => {
          ctx.strokeStyle = drawing.color;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          ctx.beginPath();
          drawing.path.forEach((point: {x: number, y: number}, index: number) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        });

        // Draw markers
        layer.markers.forEach(marker => {
          ctx.fillStyle = marker.color;
          ctx.beginPath();
          ctx.arc(marker.x, marker.y, 8, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw marker label
          if (marker.label) {
            ctx.fillStyle = '#333';
            ctx.font = '12px Comic Neue, cursive';
            ctx.fillText(marker.label, marker.x + 12, marker.y + 4);
          }
        });

        // Draw text boxes
        layer.textBoxes.forEach(textBox => {
          ctx.fillStyle = textBox.color;
          ctx.font = '14px Comic Neue, cursive';
          ctx.fillText(textBox.text, textBox.x, textBox.y);
        });
      });
    };
    img.src = backgroundImage;
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    
    if (activeTool === 'draw') {
      setIsDrawing(true);
      setCurrentPath([pos]);
    } else if (activeTool === 'marker') {
      addMarker(pos);
    } else if (activeTool === 'text') {
      addTextBox(pos);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool !== 'draw') return;

    const pos = getMousePos(e);
    setCurrentPath(prev => [...prev, pos]);

    // Draw current path preview
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    redrawCanvas();
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    currentPath.concat([pos]).forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
  };

  const handleMouseUp = () => {
    if (isDrawing && activeTool === 'draw' && currentPath.length > 1) {
      // Add the drawing to the active layer
      const updatedLayers = layers.map(layer => {
        if (layer.id === activeLayerId) {
          return {
            ...layer,
            drawings: [...layer.drawings, {
              path: currentPath,
              color: brushColor,
              id: Date.now().toString()
            }]
          };
        }
        return layer;
      });
      
      onLayersUpdate(updatedLayers);
      console.log("Drawing added to layer");
    }
    
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const addMarker = (pos: {x: number, y: number}) => {
    const label = prompt("Add a label for this marker (optional):");
    
    const updatedLayers = layers.map(layer => {
      if (layer.id === activeLayerId) {
        return {
          ...layer,
          markers: [...layer.markers, {
            x: pos.x,
            y: pos.y,
            color: brushColor,
            label: label || '',
            id: Date.now().toString()
          }]
        };
      }
      return layer;
    });
    
    onLayersUpdate(updatedLayers);
    console.log("Marker added to layer");
  };

  const addTextBox = (pos: {x: number, y: number}) => {
    const text = prompt("Write a memory...");
    if (!text) return;
    
    const updatedLayers = layers.map(layer => {
      if (layer.id === activeLayerId) {
        return {
          ...layer,
          textBoxes: [...layer.textBoxes, {
            x: pos.x,
            y: pos.y,
            text,
            color: brushColor,
            id: Date.now().toString()
          }]
        };
      }
      return layer;
    });
    
    onLayersUpdate(updatedLayers);
    console.log("Text box added to layer");
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
      <canvas
        ref={canvasRef}
        className="border-2 border-sage-300 rounded-lg shadow-lg bg-white cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
});

DrawingCanvas.displayName = "DrawingCanvas";
