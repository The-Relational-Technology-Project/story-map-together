
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayerManager } from "./LayerManager";
import { DrawingCanvas } from "./DrawingCanvas";
import { ToolPanel } from "./ToolPanel";
import { ArrowLeft, Download, Printer, Undo, RotateCcw } from "lucide-react";
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
    }
  ]);
  const [activeLayerId, setActiveLayerId] = useState('1');
  const [activeTool, setActiveTool] = useState<'draw' | 'marker' | 'text' | 'select'>('select');
  const [brushColor, setBrushColor] = useState('#d08f56');
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
    <div className="min-h-screen bg-gradient-to-br from-earth-50 via-sage-50 to-coral-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sage-200 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              onClick={goBack}
              variant="ghost" 
              className="text-sage-700 hover:bg-sage-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-earth-800 hand-drawn">
              Mapping Stories
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={generatePrintable}
              variant="outline"
              className="border-sage-300 text-sage-700 hover:bg-sage-50"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button 
              onClick={exportMap}
              className="bg-earth-500 hover:bg-earth-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Layers */}
        <div className="w-80 bg-white/60 backdrop-blur-sm border-r border-sage-200 p-4 overflow-y-auto">
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
        <div className="flex-1 relative">
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
        <div className="w-80 bg-white/60 backdrop-blur-sm border-l border-sage-200 p-4">
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
