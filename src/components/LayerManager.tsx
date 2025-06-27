
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { Layer } from "./MappingWorkspace";

interface LayerManagerProps {
  layers: Layer[];
  activeLayerId: string;
  onLayerSelect: (layerId: string) => void;
  onAddLayer: (name: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
}

export const LayerManager = ({
  layers,
  activeLayerId,
  onLayerSelect,
  onAddLayer,
  onToggleVisibility,
  onDeleteLayer
}: LayerManagerProps) => {
  const [newLayerName, setNewLayerName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddLayer = () => {
    if (newLayerName.trim()) {
      onAddLayer(newLayerName.trim());
      setNewLayerName("");
      setShowAddForm(false);
    }
  };

  const layerPlaceholders = [
    "Late night crew",
    "Protest routes", 
    "Free food spots",
    "Skate session",
    "Dog walker gang",
    "Sunrise spots",
    "Secret places"
  ];

  return (
    <Card className="h-full border-2 border-foreground">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground font-mono text-xl flex items-center">
          [LAYERS]
          <div className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
        </CardTitle>
        <p className="text-sm text-muted-foreground font-mono">
          Each layer = different story/vibe
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Add Layer Section */}
        {!showAddForm ? (
          <Button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-primary hover:bg-primary/80 text-primary-foreground rounded-sm font-mono font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            ADD LAYER
          </Button>
        ) : (
          <div className="space-y-2 p-3 bg-primary/10 rounded-sm border-2 border-primary border-dashed">
            <Input
              placeholder={layerPlaceholders[Math.floor(Math.random() * layerPlaceholders.length)]}
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLayer()}
              className="border-2 border-foreground focus:border-primary font-mono"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleAddLayer}
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground font-mono"
              >
                CREATE
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)}
                size="sm"
                variant="outline"
                className="border-2 border-foreground font-mono"
              >
                X
              </Button>
            </div>
          </div>
        )}

        {/* Layers List */}
        <div className="space-y-2">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`p-3 rounded-sm border-2 transition-all cursor-pointer ${
                activeLayerId === layer.id
                  ? 'bg-primary/20 border-primary shadow-sm'
                  : 'bg-card border-foreground hover:bg-muted/50'
              }`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <div className="font-mono font-bold text-foreground">
                    {layer.name}
                  </div>
                  {activeLayerId === layer.id && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(layer.id);
                    }}
                    className="h-8 w-8 p-0 hover:bg-foreground hover:text-background"
                  >
                    {layer.visible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {layers.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLayer(layer.id);
                      }}
                      className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-1 font-mono">
                {layer.drawings.length + layer.markers.length + layer.textBoxes.length} items
              </div>
            </div>
          ))}
        </div>

        {/* Layer Tips */}
        <div className="mt-6 p-3 bg-secondary/20 rounded-sm border-2 border-secondary border-dashed">
          <h4 className="text-sm font-mono font-bold text-foreground mb-2">
            [LAYER IDEAS]
          </h4>
          <div className="text-xs text-muted-foreground font-mono space-y-1">
            <div>→ "Midnight walks"</div>
            <div>→ "Coffee shop wifi"</div>
            <div>→ "Kid-friendly chaos"</div>
            <div>→ "Community garden vibes"</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
