import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Volume2, Play, Pause, RefreshCw, VolumeX, Volume1, Volume2 as VolumeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Sound {
  name: string;
  icon: JSX.Element;
  audioSrc: string;
  category: string;
}

const FocusNoiseGenerator = () => {
  const [playing, setPlaying] = useState<{ [key: string]: boolean }>({});
  const [volume, setVolume] = useState<{ [key: string]: number }>({});
  const [masterVolume, setMasterVolume] = useState(80);
  const [timer, setTimer] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const sounds: Sound[] = [
    // Nature Sounds
    { name: "Rain", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1249.mp3", category: "nature" },
    { name: "Ocean Waves", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3", category: "nature" },
    { name: "Forest", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3", category: "nature" },
    { name: "Thunder", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-distant-thunder-explosion-1278.mp3", category: "nature" },
    
    // Ambient Sounds
    { name: "White Noise", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-hotel-lobby-with-dining-area-ambience-453.mp3", category: "ambient" },
    { name: "Brown Noise", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-urban-sidewalk-with-light-evening-traffic-ambience-371.mp3", category: "ambient" },
    { name: "Pink Noise", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-air-ventilator-ambience-2477.mp3", category: "ambient" },
    { name: "Coffee Shop", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-urban-sidewalk-with-light-evening-traffic-ambience-371.mp3", category: "ambient" },
    
    // Focus Music
    { name: "Lo-Fi", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3", category: "focus" },
    { name: "Classical", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/music/preview/mixkit-serene-view-632.mp3", category: "focus" },
    { name: "Ambient", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3", category: "focus" },
    { name: "Piano", icon: <Volume2 size={18} />, audioSrc: "https://assets.mixkit.co/music/preview/mixkit-serene-view-632.mp3", category: "focus" },
  ];

  // Initialize audio elements and states
  useEffect(() => {
    const initialPlaying: { [key: string]: boolean } = {};
    const initialVolume: { [key: string]: number } = {};
    
    sounds.forEach(sound => {
      initialPlaying[sound.name] = false;
      initialVolume[sound.name] = 70;
      
      const audio = new Audio();
      audio.src = sound.audioSrc;
      audio.loop = true;
      audioRefs.current[sound.name] = audio;
    });
    
    setPlaying(initialPlaying);
    setVolume(initialVolume);
    
    return () => {
      // Clean up all audio elements
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  // Fixed: Added validation to ensure volume is a valid number between 0 and 1
  useEffect(() => {
    // Update all audio volumes when master volume changes
    Object.keys(audioRefs.current).forEach(soundName => {
      if (audioRefs.current[soundName]) {
        // Calculate the combined volume
        const soundVolume = volume[soundName] || 70;
        const combinedVolume = (soundVolume / 100) * (masterVolume / 100);
        
        // Ensure the volume is a valid number between 0 and 1
        if (!isNaN(combinedVolume) && isFinite(combinedVolume)) {
          // Clamp the value to be between 0 and 1
          const clampedVolume = Math.max(0, Math.min(1, combinedVolume));
          audioRefs.current[soundName].volume = clampedVolume;
        }
      }
    });
  }, [masterVolume, volume]);

  useEffect(() => {
    // Timer countdown logic
    let interval: number | null = null;
    
    if (timer && remainingTime) {
      interval = window.setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime && prevTime > 1) {
            return prevTime - 1;
          } else {
            // Stop all sounds when timer ends
            stopAllSounds();
            clearInterval(interval!);
            setRemainingTime(null);
            return null;
          }
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, remainingTime]);

  const toggleSound = (soundName: string) => {
    const newPlayingState = !playing[soundName];
    
    setPlaying(prev => ({
      ...prev,
      [soundName]: newPlayingState
    }));
    
    const audio = audioRefs.current[soundName];
    if (newPlayingState) {
      // Fixed: Added safe volume calculation before playing
      const soundVolume = volume[soundName] || 70;
      const combinedVolume = (soundVolume / 100) * (masterVolume / 100);
      
      // Ensure volume is valid
      if (!isNaN(combinedVolume) && isFinite(combinedVolume)) {
        // Clamp the value between 0 and 1
        audio.volume = Math.max(0, Math.min(1, combinedVolume));
      } else {
        // Fallback to a safe value if invalid
        audio.volume = 0.5;
      }
      
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        // Reset playing state if there was an error
        setPlaying(prev => ({
          ...prev,
          [soundName]: false
        }));
      });
    } else {
      audio.pause();
    }
  };

  const changeVolume = (soundName: string, newVolume: number) => {
    setVolume(prev => ({
      ...prev,
      [soundName]: newVolume
    }));
    
    if (audioRefs.current[soundName]) {
      // Fixed: Added safe volume calculation when changing volume
      const combinedVolume = (newVolume / 100) * (masterVolume / 100);
      
      // Ensure volume is valid
      if (!isNaN(combinedVolume) && isFinite(combinedVolume)) {
        // Clamp the value between 0 and 1
        audioRefs.current[soundName].volume = Math.max(0, Math.min(1, combinedVolume));
      }
    }
  };

  const changeMasterVolume = (newVolume: number) => {
    setMasterVolume(newVolume);
  };

  const stopAllSounds = () => {
    const newPlayingState: { [key: string]: boolean } = {};
    
    Object.keys(playing).forEach(soundName => {
      newPlayingState[soundName] = false;
      if (audioRefs.current[soundName]) {
        audioRefs.current[soundName].pause();
      }
    });
    
    setPlaying(newPlayingState);
  };

  const startTimer = (minutes: number) => {
    setTimer(minutes);
    setRemainingTime(minutes * 60);
  };

  const cancelTimer = () => {
    setTimer(null);
    setRemainingTime(null);
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ToolLayout
      title="Focus Noise Generator"
      description="Play ambient sounds to help you concentrate and be productive"
      icon={<Volume2 className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Card className="flex-grow md:w-2/3">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Master Volume</h3>
                <div className="flex items-center gap-2">
                  <VolumeX size={18} />
                  <div className="w-40">
                    <Slider
                      value={[masterVolume]}
                      onValueChange={(values) => changeMasterVolume(values[0])}
                      max={100}
                      step={1}
                    />
                  </div>
                  <VolumeIcon size={18} />
                </div>
              </div>
              
              {remainingTime && (
                <div className="flex items-center justify-between mb-6 p-3 bg-primary/10 rounded-md">
                  <div>
                    <h3 className="text-lg font-medium">Timer Active</h3>
                    <p className="text-sm text-muted-foreground">Sounds will stop after timer ends</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-mono">{formatTime(remainingTime)}</span>
                    <Button variant="outline" size="sm" onClick={cancelTimer}>Cancel</Button>
                  </div>
                </div>
              )}
              
              <Tabs defaultValue="nature" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="nature">Nature</TabsTrigger>
                  <TabsTrigger value="ambient">Ambient</TabsTrigger>
                  <TabsTrigger value="focus">Focus Music</TabsTrigger>
                </TabsList>
                
                {["nature", "ambient", "focus"].map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sounds
                        .filter(sound => sound.category === category)
                        .map((sound) => (
                          <div 
                            key={sound.name} 
                            className={`p-4 rounded-lg border ${playing[sound.name] ? 'border-primary bg-primary/5' : 'border-border'}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {sound.icon}
                                <span className="font-medium">{sound.name}</span>
                              </div>
                              <Button 
                                size="sm" 
                                variant={playing[sound.name] ? "default" : "outline"}
                                onClick={() => toggleSound(sound.name)}
                              >
                                {playing[sound.name] ? <Pause size={16} /> : <Play size={16} />}
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <VolumeX size={14} className="text-muted-foreground" />
                              <Slider
                                value={[volume[sound.name] || 70]}
                                onValueChange={(values) => changeVolume(sound.name, values[0])}
                                max={100}
                                step={1}
                                disabled={!playing[sound.name]}
                                className="w-full"
                              />
                              <Volume1 size={14} className="text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="md:w-1/3 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Timer</h3>
                <p className="text-sm text-muted-foreground mb-4">Set a timer to automatically stop all sounds</p>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 45, 60, 90, 120].map(mins => (
                    <Button 
                      key={mins} 
                      variant="outline"
                      onClick={() => startTimer(mins)}
                      className={timer === mins ? "border-primary" : ""}
                    >
                      {mins} min
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Controls</h3>
                <div className="space-y-4">
                  <Button onClick={stopAllSounds} className="w-full">
                    <VolumeX className="mr-2 h-4 w-4" />
                    Stop All Sounds
                  </Button>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="loopToggle" className="text-sm">Loop Sounds</Label>
                    <Switch id="loopToggle" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">About Focus Sounds</h3>
          <p className="text-sm text-muted-foreground">
            Background sounds can improve focus and productivity by masking distracting noises and creating a consistent audio environment. Different sounds work better for different people - experiment with combinations to find what helps you concentrate best.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};

export default FocusNoiseGenerator;
