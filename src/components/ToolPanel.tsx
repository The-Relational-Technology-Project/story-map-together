
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointer, PenTool, MapPin, Type, Palette } from "lucide-react";
import { Layer } from "./MappingWorkspace";

interface ToolPanelProps {
  activeTool: 'draw' | 'marker' | 'text' | 'select';
  onToolChange: (tool: 'draw' | 'marker' | 'text' | 'select') => void;
  brushColor: string;
  onColorChange: (color: string) => void;
  activeLayer?: Layer;
}

const colors = [
  { name: 'Earth', color: '#d08f56' },
  { name: 'Sage', color: '#759058' },
  { name: 'Coral', color: '#e87665' },
  { name: 'Ocean', color: '#5c9bd5' },
  { name: 'Lavender', color: '#b19cd9' },
  { name: 'Sunshine', color: '#f4d03f' },
  { name: 'Forest', color: '#58a55c' },
  { name: 'Berry', color: '#d55c7a' }
];

export const ToolPanel = ({
  activeTool,
  onToolChange,
  brushColor,
  onColorChange,
  activeLayer
}: ToolPanelProps) => {
  const tools = [
    { id: 'select' as const, name: 'Select', icon: MousePointer, description: 'Navigate and select' },
    { id: 'draw' as const, name: 'Draw', icon: PenTool, description: 'Draw freeform paths' },
    { id: 'marker' as const, name: 'Marker', icon: MapPin, description: 'Drop markers with labels' },
    { id: 'text' as const, name: 'Text', icon: Type, description: 'Add text anywhere' }
  ];

  return (
    <div className="space-y-6">
      {/* Tools */}
      <Card className="border-sage-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-earth-800 hand-drawn text-xl">Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                variant={activeTool === tool.id ? "default" : "outline"}
                className={`w-full justify-start h-auto p-3 ${
                  activeTool === tool.id 
                    ? 'bg-earth-500 hover:bg-earth-600 text-white' 
                    : 'border-sage-300 hover:bg-sage-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-xs opacity-75">{tool.description}</div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Colors */}
      <Card className="border-sage-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-earth-800 hand-drawn text-xl flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Colors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((colorOption) => (
              <button
                key={colorOption.color}
                onClick={() => onColorChange(colorOption.color)}
                className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                  brushColor === colorOption.color 
                    ? 'border-earth-600 ring-2 ring-earth-300' 
                    : 'border-sage-300 hover:border-sage-500'
                }`}
                style={{ backgroundColor: colorOption.color }}
                title={colorOption.name}
              />
            ))}
          </div>
          
          <div className="mt-4">
            <label className="text-sm text-sage-700 block mb-2">Custom Color</label>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-full h-10 rounded-lg border-2 border-sage-300 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Layer Info */}
      {activeLayer && (
        <Card className="border-earth-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-earth-800 hand-drawn text-lg">
              Current Layer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="hand-drawn font-medium text-earth-700">
                {activeLayer.name}
              </div>
              <div className="text-sm text-sage-600 space-y-1">
                <div>{activeLayer.drawings.length} drawings</div>
                <div>{activeLayer.markers.length} markers</div>
                <div>{activeLayer.textBoxes.length} text boxes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="border-coral-200 bg-coral-50/50">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-coral-800 mb-2 hand-drawn">
            Tips
          </h4>
          <div className="text-xs text-coral-700 space-y-1">
            <div>• Draw paths where you walk together</div>
            <div>• Drop markers at meaningful spots</div>
            <div>• Add memories as text anywhere</div>
            <div>• Use layers to separate different stories</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
