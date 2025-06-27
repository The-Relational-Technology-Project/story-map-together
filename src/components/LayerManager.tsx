
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, EyeOff, Trash2, Edit } from "lucide-react";
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
    "Made with my daughter",
    "Mutual aid landmarks", 
    "Parent group spots",
    "Places of wonder",
    "Memory walks",
    "Community gardens",
    "Favorite corners"
  ];

  return (
    <Card className="h-full border-sage-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-earth-800 hand-drawn text-xl">Layers</CardTitle>
        <p className="text-sm text-sage-600">
          Each layer tells a different story about your place
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Add Layer Section */}
        {!showAddForm ? (
          <Button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-coral-500 hover:bg-coral-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Layer
          </Button>
        ) : (
          <div className="space-y-2 p-3 bg-coral-50 rounded-lg border border-coral-200">
            <Input
              placeholder={layerPlaceholders[Math.floor(Math.random() * layerPlaceholders.length)]}
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLayer()}
              className="border-coral-300 focus:border-coral-500"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleAddLayer}
                size="sm"
                className="flex-1 bg-coral-500 hover:bg-coral-600 text-white"
              >
                Create
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)}
                size="sm"
                variant="outline"
                className="border-coral-300 text-coral-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Layers List */}
        <div className="space-y-2">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeLayerId === layer.id
                  ? 'bg-sage-100 border-sage-400 shadow-sm'
                  : 'bg-white border-sage-200 hover:bg-sage-50'
              }`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <div className="hand-drawn font-medium text-earth-800">
                    {layer.name}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(layer.id);
                    }}
                    className="h-8 w-8 p-0 hover:bg-sage-200"
                  >
                    {layer.visible ? (
                      <Eye className="w-4 h-4 text-sage-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-sage-400" />
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
                      className="h-8 w-8 p-0 hover:bg-coral-200"
                    >
                      <Trash2 className="w-4 h-4 text-coral-600" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-sage-500 mt-1">
                {layer.drawings.length + layer.markers.length + layer.textBoxes.length} items
              </div>
            </div>
          ))}
        </div>

        {/* Layer Tips */}
        <div className="mt-6 p-3 bg-earth-50 rounded-lg border border-earth-200">
          <h4 className="text-sm font-medium text-earth-800 mb-2 hand-drawn">
            Layer Ideas
          </h4>
          <div className="text-xs text-earth-600 space-y-1">
            <div>• "This is where I got help"</div>
            <div>• "Map of wonder"</div>
            <div>• "Favorite walks"</div>
            <div>• "Places we made together"</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
