import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "../backend";

interface MusicPlayerProps {
  mediaItem: MediaItem;
  accentColor?: string;
}

export default function MusicPlayer({
  mediaItem,
  accentColor = "#8b5cf6",
}: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks = mediaItem.audioFiles.sort(
    (a, b) => Number(a.trackNumber) - Number(b.trackNumber),
  );
  const currentTrack = tracks[currentTrackIndex];
  const coverImage =
    mediaItem.images.find((img) => img.isCover) || mediaItem.images[0];
  const isAlbum = tracks.length > 1;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.file.getDirectURL();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const skipToPrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const skipToNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (currentTrackIndex < tracks.length - 1) {
      skipToNext();
    } else {
      setIsPlaying(false);
      setCurrentTrackIndex(0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden max-w-5xl mx-auto">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      >
        <track kind="captions" />
      </audio>

      {/* Album Cover, Title, and Artist */}
      <div className="p-8 pb-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-64 h-64 bg-muted rounded-lg overflow-hidden mb-6 flex items-center justify-center">
            {coverImage && (
              <img
                src={coverImage.file.getDirectURL()}
                alt={mediaItem.title}
                className="w-full h-full object-contain p-2"
              />
            )}
          </div>
          <h2 className="text-3xl font-bold mb-2 text-center">
            {currentTrack?.title || mediaItem.title}
          </h2>
          <p className="text-xl text-muted-foreground">Oneiric</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full"
            style={
              {
                "--slider-thumb-color": accentColor,
                "--slider-track-color": accentColor,
              } as React.CSSProperties
            }
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={skipToPrevious}
            disabled={currentTrackIndex === 0}
            className="h-12 w-12"
          >
            <SkipBack className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            onClick={togglePlay}
            style={{ backgroundColor: accentColor }}
            className="h-16 w-16 text-black hover:opacity-90"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={skipToNext}
            disabled={currentTrackIndex === tracks.length - 1}
            className="h-12 w-12"
          >
            <SkipForward className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2 ml-8">
            <Volume2 className="h-5 w-5" />
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={(value) => setVolume(value[0])}
              className="w-24"
              style={
                {
                  "--slider-thumb-color": accentColor,
                  "--slider-track-color": accentColor,
                } as React.CSSProperties
              }
            />
          </div>
        </div>
      </div>

      {/* Tracklist */}
      {isAlbum && (
        <div className="border-t border-border">
          <div className="p-8 pt-6">
            <h3 className="text-xl font-bold mb-4">Tracks</h3>
            <div className="space-y-1">
              {tracks.map((track, index) => (
                <button
                  type="button"
                  key={track.id}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all text-left ${
                    currentTrackIndex === index
                      ? "font-medium"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setCurrentTrackIndex(index)}
                  onDoubleClick={() => playTrack(index)}
                  style={
                    currentTrackIndex === index
                      ? {
                          backgroundColor: accentColor,
                          color: "#000",
                        }
                      : {}
                  }
                >
                  <span
                    className={`w-8 ${currentTrackIndex === index ? "opacity-70" : "text-muted-foreground"}`}
                  >
                    {Number(track.trackNumber)}.
                  </span>
                  <span className="flex-1">{track.title}</span>
                  <span
                    className={
                      currentTrackIndex === index
                        ? "opacity-70"
                        : "text-muted-foreground"
                    }
                  >
                    {formatTime(Number(track.duration))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
