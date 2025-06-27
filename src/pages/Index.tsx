
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, MapPin, Heart, Users } from "lucide-react";
import { MappingWorkspace } from "@/components/MappingWorkspace";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showWorkspace, setShowWorkspace] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        console.log("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const startMapping = () => {
    if (uploadedImage) {
      setShowWorkspace(true);
      console.log("Starting mapping workspace");
    }
  };

  if (showWorkspace && uploadedImage) {
    return <MappingWorkspace backgroundImage={uploadedImage} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 via-sage-50 to-coral-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-earth-800 mb-6 hand-drawn">
            Make a Map Together
          </h1>
          <p className="text-xl md:text-2xl text-sage-700 max-w-3xl mx-auto leading-relaxed text-balance">
            Upload a screenshot of your neighborhood. Then start layering in the stories, 
            memories, and meanings that matter to you and your people.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="max-w-2xl mx-auto mb-16 border-sage-200 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="border-2 border-dashed border-sage-300 rounded-xl p-12 bg-sage-50/50 hover:bg-sage-100/50 transition-colors">
                <Upload className="w-16 h-16 text-sage-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-sage-800 mb-2">
                  Start with your neighborhood
                </h3>
                <p className="text-sage-600 mb-6">
                  Upload a screenshot from Google Maps, OpenStreetMap, or any map of your area
                </p>
                
                <label htmlFor="map-upload" className="cursor-pointer">
                  <Button 
                    type="button" 
                    className="bg-earth-500 hover:bg-earth-600 text-white px-8 py-3 rounded-full text-lg transition-all duration-200 hover:scale-105"
                  >
                    Choose Your Map
                  </Button>
                  <input
                    id="map-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadedImage && (
                <div className="mt-8 animate-fade-in">
                  <div className="relative max-w-md mx-auto">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded neighborhood map" 
                      className="w-full rounded-lg shadow-md border-2 border-sage-200"
                    />
                    <div className="absolute -bottom-2 -right-2">
                      <div className="bg-coral-500 text-white p-2 rounded-full">
                        <MapPin className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startMapping}
                    className="mt-6 bg-coral-500 hover:bg-coral-600 text-white px-8 py-3 rounded-full text-lg transition-all duration-200 hover:scale-105"
                  >
                    Start Mapping Stories
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center border-coral-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Heart className="w-12 h-12 text-coral-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-earth-800 mb-2 hand-drawn">
                Layer Your Stories
              </h3>
              <p className="text-sage-600 text-sm">
                Create layers like "Made with my daughter" or "Mutual aid landmarks"
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-sage-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Users className="w-12 h-12 text-sage-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-earth-800 mb-2 hand-drawn">
                Mark What Matters
              </h3>
              <p className="text-sage-600 text-sm">
                Drop markers, draw paths, add memories wherever they belong
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-earth-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Upload className="w-12 h-12 text-earth-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-earth-800 mb-2 hand-drawn">
                Print & Share
              </h3>
              <p className="text-sage-600 text-sm">
                Export your map to share with friends or print for your wall
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sage-500">
          <p className="hand-drawn text-lg">
            A tool for co-mapping your place with your people ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
