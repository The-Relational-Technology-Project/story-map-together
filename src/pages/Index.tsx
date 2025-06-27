
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, MapPin, Zap, Users } from "lucide-react";
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
        console.log("Image uploaded successfully:", file.name);
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 37px)`
        }} />
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-marker text-primary mb-6 zine-title glitch-text" data-text="MAP/MAKE">
            MAP/MAKE
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-foreground font-mono leading-relaxed text-balance border-l-4 border-primary pl-4 bg-secondary/20 p-4">
              Upload your hood screenshot → Layer your stories → Print & paste everywhere
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="max-w-2xl mx-auto mb-16 border-2 border-primary shadow-lg transform rotate-1">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="border-dashed-punk border-primary rounded-sm p-12 bg-muted/20 hover:bg-primary/10 transition-colors relative">
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-mono transform rotate-12">
                  START HERE!
                </div>
                <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-mono font-bold text-foreground mb-2">
                  DROP YOUR MAP
                </h3>
                <p className="text-muted-foreground mb-6 font-mono text-sm">
                  Screenshot from Maps, satellite view, whatever you got
                </p>
                
                <label htmlFor="map-upload" className="cursor-pointer">
                  <Button 
                    type="button" 
                    className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-3 rounded-sm text-lg font-mono font-bold transform transition-all duration-200 hover:scale-105 hover:-rotate-1"
                  >
                    CHOOSE FILE
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
                  <div className="relative max-w-md mx-auto transform -rotate-2">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded neighborhood map" 
                      className="w-full rounded-sm shadow-md border-2 border-foreground"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground p-2 rounded-full">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="absolute -top-2 -left-2 bg-secondary text-secondary-foreground px-2 py-1 text-xs font-mono font-bold transform -rotate-12">
                      READY!
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startMapping}
                    className="mt-6 bg-accent hover:bg-accent/80 text-accent-foreground px-8 py-3 rounded-sm text-lg font-mono font-bold transition-all duration-200 hover:scale-105 transform hover:rotate-1"
                  >
                    START LAYERING →
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center border-2 border-foreground shadow-md hover:shadow-lg transition-shadow transform rotate-1 hover:rotate-0">
            <CardContent className="p-6">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-mono font-bold text-foreground mb-2">
                LAYER STORIES
              </h3>
              <p className="text-muted-foreground text-sm font-mono">
                "Made with daughter" / "Skate spots" / "Late night walks"
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 border-foreground shadow-md hover:shadow-lg transition-shadow transform -rotate-1 hover:rotate-0">
            <CardContent className="p-6">
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-mono font-bold text-foreground mb-2">
                MARK PLACES
              </h3>
              <p className="text-muted-foreground text-sm font-mono">
                Drop markers, scribble paths, add secret notes
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 border-foreground shadow-md hover:shadow-lg transition-shadow transform rotate-1 hover:rotate-0">
            <CardContent className="p-6">
              <Upload className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-mono font-bold text-foreground mb-2">
                PRINT & PASTE
              </h3>
              <p className="text-muted-foreground text-sm font-mono">
                Zine-ready exports for stickers, flyers, whatever
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="font-marker text-2xl text-primary transform -rotate-2">
            Make maps not war ✨
          </p>
          <div className="mt-4 font-mono text-xs text-muted-foreground">
            [A tool for co-mapping with your crew]
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
