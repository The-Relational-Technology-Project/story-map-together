
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayerManager } from "./LayerManager";
import { DrawingCanvas } from "./DrawingCanvas";
import { ToolPanel } from "./ToolPanel";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { toast } from "sonner";

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  drawings: any[];
  markers: any[];
  textBoxes: any[];
}

interface MappingWorkspaceProps {
  backgroundImage: string;
}

export const MappingWorkspace = ({ backgroundImage }: MappingWorkspaceProps) => {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: '1',
      name: 'Base Layer',
      visible: true,
      drawings: [],
      markers: [],
      textBoxes: []
    },
    {
      id: '2',
      name: 'Made with my daughter',
      visible: true,
      drawings: [],
      markers: [],
      textBoxes: []
    },
    {
      id: '3',
      name: 'Surfer group',
      visible: false,
      drawings: [],
      markers: [],
      textBoxes: []
    }
  ]);
  const [activeLayerId, setActiveLayerId] = useState('2');
  const [activeTool, setActiveTool] = useState<'draw' | 'marker' | 'text' | 'select'>('select');
  const [brushColor, setBrushColor] = useState('#ff0080');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeLayer = layers.find(layer => layer.id === activeLayerId);

  const addLayer = (name: string) => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      name,
      visible: true,
      drawings: [],
      markers: [],
      textBoxes: []
    };
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
    toast(`Layer "${name}" created!`);
    console.log(`New layer created: ${name}`);
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ));
  };

  const deleteLayer = (layerId: string) => {
    if (layers.length === 1) {
      toast("Can't delete the last layer!");
      return;
    }
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    if (activeLayerId === layerId) {
      setActiveLayerId(layers[0].id);
    }
    toast("Layer deleted");
    console.log(`Layer deleted: ${layerId}`);
  };

  const exportMap = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'neighborhood-map.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
    toast("Map downloaded!");
    console.log("Map exported as PNG");
  };

  const generatePrintable = () => {
    window.print();
    toast("Opening print dialog...");
  };

  const goBack = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b-2 border-foreground p-4 relative">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="flex items-center justify-between max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4">
            <Button 
              onClick={goBack}
              variant="outline" 
              className="text-foreground hover:bg-primary hover:text-primary-foreground font-mono border-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
            <h1 className="text-3xl font-marker text-primary">
              MAP/MAKE
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={generatePrintable}
              variant="outline"
              className="border-2 text-foreground hover:bg-accent hover:text-accent-foreground font-mono"
            >
              <Printer className="w-4 h-4 mr-2" />
              PRINT
            </Button>
            <Button 
              onClick={exportMap}
              className="bg-primary hover:bg-primary/80 text-primary-foreground font-mono font-bold"
            >
              <Download className="w-4 h-4 mr-2" />
              EXPORT
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Layers */}
        <div className="w-80 bg-card border-r-2 border-foreground p-4 overflow-y-auto">
          <LayerManager
            layers={layers}
            activeLayerId={activeLayerId}
            onLayerSelect={setActiveLayerId}
            onAddLayer={addLayer}
            onToggleVisibility={toggleLayerVisibility}
            onDeleteLayer={deleteLayer}
          />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-muted/20">
          <DrawingCanvas
            ref={canvasRef}
            backgroundImage={backgroundImage}
            layers={layers}
            activeLayerId={activeLayerId}
            activeTool={activeTool}
            brushColor={brushColor}
            onLayersUpdate={setLayers}
          />
        </div>

        {/* Right Sidebar - Tools */}
        <div className="w-80 bg-card border-l-2 border-foreground p-4">
          <ToolPanel
            activeTool={activeTool}
            onToolChange={setActiveTool}
            brushColor={brushColor}
            onColorChange={setBrushColor}
            activeLayer={activeLayer}
          />
        </div>
      </div>
    </div>
  );
};
