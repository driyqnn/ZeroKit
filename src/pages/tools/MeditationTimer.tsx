
import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Bell, Play, Pause, RotateCcw, VolumeX, Volume2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

const BELL_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2017/2017.wav";

interface MeditationSession {
  duration: number;
  intervalBell: boolean;
  intervalTime: number;
  ambientSound: string | null;
  timestamp: Date;
}

const ambientSounds = [
  { name: "None", value: null },
  { name: "Rain", value: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-looping-1249.mp3" },
  { name: "Ocean Waves", value: "https://assets.mixkit.co/sfx/preview/mixkit-ocean-waves-ambience-1189.mp3" },
  { name: "Forest", value: "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3" },
  { name: "White Noise", value: "https://assets.mixkit.co/sfx/preview/mixkit-static-white-noise-1203.mp3" },
  { name: "Om Chanting", value: "https://assets.mixkit.co/sfx/preview/mixkit-tibetan-bells-and-male-voice-2819.mp3" }
];

const MeditationTimer = () => {
  const { toast } = useToast();
  const [duration, setDuration] = useState<number>(10 * 60); // 10 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionHistory, setSessionHistory] = useState<MeditationSession[]>([]);
  const [intervalBell, setIntervalBell] = useState<boolean>(false);
  const [intervalTime, setIntervalTime] = useState<number>(60); // Interval time in seconds
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(70);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastIntervalRef = useRef<number>(0);

  // Initialize audio elements
  useEffect(() => {
    bellAudioRef.current = new Audio(BELL_SOUND_URL);
    bellAudioRef.current.preload = "auto";
    
    return () => {
      stopAmbientSound();
    };
  }, []);

  // Handle ambient sound changes
  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current = null;
    }
    
    if (ambientSound && isRunning) {
      ambientAudioRef.current = new Audio(ambientSound);
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.volume = isMuted ? 0 : volume / 100;
      ambientAudioRef.current.play().catch(err => console.error("Error playing ambient sound:", err));
    }
  }, [ambientSound, isRunning]);

  // Handle volume changes
  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = isMuted ? 0 : volume / 100;
    }
    
    if (bellAudioRef.current) {
      bellAudioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsCompleted(false);
      
      // If timer was reset, set time remaining to duration
      if (timeRemaining === duration) {
        setTimeRemaining(duration);
      }
      
      // Play bell to indicate start
      playBellSound();
      
      // Start ambient sound if selected
      if (ambientSound) {
        if (!ambientAudioRef.current) {
          ambientAudioRef.current = new Audio(ambientSound);
          ambientAudioRef.current.loop = true;
          ambientAudioRef.current.volume = isMuted ? 0 : volume / 100;
        }
        ambientAudioRef.current.play().catch(err => console.error("Error playing ambient sound:", err));
      }
      
      // Reset interval tracking
      lastIntervalRef.current = timeRemaining;
      
      // Start countdown
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Check if we need to play interval bell
          if (intervalBell && (lastIntervalRef.current - newTime) >= intervalTime) {
            playBellSound();
            lastIntervalRef.current = newTime;
          }
          
          // Check if timer is complete
          if (newTime <= 0) {
            completeSession();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      stopAmbientSound();
    }
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRunning(false);
    setIsCompleted(false);
    setTimeRemaining(duration);
    stopAmbientSound();
    lastIntervalRef.current = 0;
  };

  const completeSession = () => {
    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsRunning(false);
    setIsCompleted(true);
    
    // Play bell three times to indicate end
    playBellSound();
    setTimeout(() => playBellSound(), 1200);
    setTimeout(() => playBellSound(), 2400);
    
    // Stop ambient sound
    stopAmbientSound();
    
    // Save session to history
    const newSession: MeditationSession = {
      duration: duration,
      intervalBell: intervalBell,
      intervalTime: intervalTime,
      ambientSound: ambientSound,
      timestamp: new Date()
    };
    
    setSessionHistory(prev => [newSession, ...prev]);
    
    // Show notification
    toast({
      title: "Meditation complete",
      description: `You completed a ${formatTime(duration)} meditation session.`,
    });
  };

  const playBellSound = () => {
    if (bellAudioRef.current) {
      bellAudioRef.current.currentTime = 0;
      bellAudioRef.current.volume = isMuted ? 0 : volume / 100;
      bellAudioRef.current.play().catch(err => console.error("Error playing bell sound:", err));
    }
  };

  const stopAmbientSound = () => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current.currentTime = 0;
    }
  };

  const handleDurationChange = (minutes: number) => {
    const newDuration = minutes * 60;
    setDuration(newDuration);
    if (!isRunning) {
      setTimeRemaining(newDuration);
    }
  };

  // Calculate progress percentage
  const progress = ((duration - timeRemaining) / duration) * 100;
  
  // Format timestamps
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ToolLayout
      title="Meditation Timer"
      description="Guide meditation sessions with ambient sounds and interval bells"
      icon={<Bell className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timer Display */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 timer-display">
                  {/* Outer circle (progress) */}
                  <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-muted/20"
                    />
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * progress) / 100}
                      className={isCompleted ? "text-green-500" : "text-primary"}
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </svg>

                  {/* Timer display */}
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <span className="text-5xl md:text-6xl font-light">
                      {formatTime(timeRemaining)}
                    </span>
                    <span className="text-muted-foreground text-sm mt-2">
                      {isRunning ? "Meditating" : isCompleted ? "Completed" : "Ready"}
                    </span>
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-8 w-full max-w-sm">
                  <Button
                    size="lg" 
                    variant={isRunning ? "outline" : "default"}
                    className="flex-1"
                    onClick={isRunning ? pauseTimer : startTimer}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" /> Start
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetTimer}
                    disabled={timeRemaining === duration && !isRunning}
                    title="Reset timer"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMute}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                {/* Volume Slider */}
                {!isMuted && (
                  <div className="w-full max-w-sm mt-4">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        value={[volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(newVolume) => setVolume(newVolume[0])}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" /> Settings
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <RadioGroup 
                      value={String(duration / 60)} 
                      onValueChange={(val) => handleDurationChange(Number(val))}
                      className="grid grid-cols-3 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="duration-5" />
                        <Label htmlFor="duration-5">5 min</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="10" id="duration-10" />
                        <Label htmlFor="duration-10">10 min</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="15" id="duration-15" />
                        <Label htmlFor="duration-15">15 min</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="20" id="duration-20" />
                        <Label htmlFor="duration-20">20 min</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="30" id="duration-30" />
                        <Label htmlFor="duration-30">30 min</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="45" id="duration-45" />
                        <Label htmlFor="duration-45">45 min</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interval-bell" className="flex items-center gap-2">
                      <input
                        type="checkbox" 
                        id="interval-bell"
                        checked={intervalBell}
                        onChange={(e) => setIntervalBell(e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      Interval Bell
                    </Label>
                    
                    {intervalBell && (
                      <RadioGroup 
                        value={String(intervalTime)} 
                        onValueChange={(val) => setIntervalTime(Number(val))}
                        className="grid grid-cols-3 gap-2 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="30" id="interval-30" />
                          <Label htmlFor="interval-30">30 sec</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="60" id="interval-60" />
                          <Label htmlFor="interval-60">1 min</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="300" id="interval-300" />
                          <Label htmlFor="interval-300">5 min</Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Ambient Sound</Label>
                    <RadioGroup 
                      value={ambientSound === null ? "null" : ambientSound} 
                      onValueChange={(val) => setAmbientSound(val === "null" ? null : val)}
                      className="space-y-1"
                    >
                      {ambientSounds.map((sound) => (
                        <div key={sound.name} className="flex items-center space-x-2">
                          <RadioGroupItem value={sound.value === null ? "null" : sound.value} id={`sound-${sound.name}`} />
                          <Label htmlFor={`sound-${sound.name}`}>{sound.name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  Meditation History
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-64 overflow-auto">
                {sessionHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No meditation sessions yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {sessionHistory.map((session, index) => (
                      <div key={index} className="border-b border-border pb-2 mb-2 text-sm">
                        <div className="font-medium">
                          {formatTime(session.duration)} session
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {formatTimestamp(session.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-8 p-6 bg-muted/30 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Meditation Guide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Getting Started</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Find a quiet, comfortable place to sit</li>
                <li>• Set your timer for a realistic duration</li>
                <li>• Keep your back straight but not rigid</li>
                <li>• Rest your hands comfortably on your lap or knees</li>
                <li>• Close your eyes or maintain a soft gaze</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Mindfulness Techniques</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Focus on your natural breathing</li>
                <li>• Notice when your mind wanders without judgment</li>
                <li>• Gently bring attention back to your breath</li>
                <li>• Observe thoughts and feelings as they arise</li>
                <li>• Practice kindness and patience with yourself</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default MeditationTimer;
