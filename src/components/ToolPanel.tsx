
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
  { name: 'Hot Pink', color: '#ff0080' },
  { name: 'Cyan', color: '#00ffff' },
  { name: 'Yellow', color: '#ffff00' },
  { name: 'Green', color: '#00ff80' },
  { name: 'Purple', color: '#8000ff' },
  { name: 'Orange', color: '#ff8000' },
  { name: 'Black', color: '#000000' },
  { name: 'White', color: '#ffffff' }
];

export const ToolPanel = ({
  activeTool,
  onToolChange,
  brushColor,
  onColorChange,
  activeLayer
}: ToolPanelProps) => {
  const tools = [
    { id: 'select' as const, name: 'SELECT', icon: MousePointer, description: 'Navigate & select' },
    { id: 'draw' as const, name: 'DRAW', icon: PenTool, description: 'Scribble paths' },
    { id: 'marker' as const, name: 'MARKER', icon: MapPin, description: 'Drop pins' },
    { id: 'text' as const, name: 'TEXT', icon: Type, description: 'Add notes' }
  ];

  return (
    <div className="space-y-6">
      {/* Tools */}
      <Card className="border-2 border-foreground">
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground font-mono text-xl">
            [TOOLS]
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                variant={activeTool === tool.id ? "default" : "outline"}
                className={`w-full justify-start h-auto p-3 font-mono font-bold rounded-sm border-2 ${
                  activeTool === tool.id 
                    ? 'bg-primary hover:bg-primary/80 text-primary-foreground border-primary' 
                    : 'border-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-bold">{tool.name}</div>
                  <div className="text-xs opacity-75">{tool.description}</div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Colors */}
      <Card className="border-2 border-foreground">
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground font-mono text-xl flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            [COLORS]
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((colorOption) => (
              <button
                key={colorOption.color}
                onClick={() => onColorChange(colorOption.color)}
                className={`w-12 h-12 rounded-sm border-2 transition-all hover:scale-110 ${
                  brushColor === colorOption.color 
                    ? 'border-primary ring-2 ring-primary' 
                    : 'border-foreground hover:border-primary'
                }`}
                style={{ backgroundColor: colorOption.color }}
                title={colorOption.name}
              />
            ))}
          </div>
          
          <div className="mt-4">
            <label className="text-sm text-foreground font-mono font-bold block mb-2">CUSTOM</label>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-full h-10 rounded-sm border-2 border-foreground cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Layer Info */}
      {activeLayer && (
        <Card className="border-2 border-accent">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground font-mono text-lg">
              [CURRENT]
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-mono font-bold text-accent">
                {activeLayer.name}
              </div>
              <div className="text-sm text-muted-foreground font-mono space-y-1">
                <div>→ {activeLayer.drawings.length} drawings</div>
                <div>→ {activeLayer.markers.length} markers</div>
                <div>→ {activeLayer.textBoxes.length} notes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="border-2 border-secondary border-dashed bg-secondary/10">
        <CardContent className="p-4">
          <h4 className="text-sm font-mono font-bold text-foreground mb-2">
            [TIPS]
          </h4>
          <div className="text-xs text-muted-foreground font-mono space-y-1">
            <div>→ Draw where you walk</div>
            <div>→ Mark secret spots</div>
            <div>→ Add memory notes</div>
            <div>→ Toggle layers on/off</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
