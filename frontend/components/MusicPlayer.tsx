import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { Track } from '../types';
import { PLAYLIST } from '../constants';

interface MusicPlayerProps {
    onTrackChange?: (track: Track) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onTrackChange }) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const currentTrack = PLAYLIST[currentTrackIndex];

    useEffect(() => {
        if (onTrackChange) {
            onTrackChange(currentTrack);
        }
    }, [currentTrack, onTrackChange]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, currentTrackIndex]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
        setIsPlaying(true);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            if (duration) {
                setProgress((current / duration) * 100);
            }
        }
    };

    const handleTrackEnd = () => {
        nextTrack();
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current) {
            const bounds = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const percentage = x / bounds.width;
            audioRef.current.currentTime = percentage * audioRef.current.duration;
            setProgress(percentage * 100);
        }
    };

    return (
        <div className="bg-neon-dark/80 backdrop-blur-md border border-neon-purple/50 rounded-xl p-4 shadow-neon-purple w-full max-w-md flex flex-col gap-4">
            <audio
                ref={audioRef}
                src={currentTrack.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleTrackEnd}
            />
            
            {/* Track Info */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-neon-pink animate-pulse">
                    <Music className="text-white w-6 h-6" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <h3 className="text-neon-cyan font-bold truncate text-lg tracking-wider">{currentTrack.title}</h3>
                    <p className="text-gray-400 text-sm truncate font-mono">{currentTrack.artist}</p>
                </div>
                <div className="text-neon-pink font-mono text-xs">
                    {isPlaying ? 'PLAYING' : 'PAUSED'}
                </div>
            </div>

            {/* Progress Bar */}
            <div 
                className="h-2 bg-gray-800 rounded-full overflow-hidden cursor-pointer relative group"
                onClick={handleProgressClick}
            >
                <div 
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-100 ease-linear group-hover:shadow-neon-cyan"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-neon-cyan transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                            setVolume(parseFloat(e.target.value));
                            if (isMuted) setIsMuted(false);
                        }}
                        className="w-20 accent-neon-cyan cursor-pointer"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={prevTrack} className="text-neon-cyan hover:text-white hover:shadow-neon-cyan transition-all rounded-full p-2">
                        <SkipBack size={24} />
                    </button>
                    <button 
                        onClick={togglePlay} 
                        className="bg-neon-pink text-white rounded-full p-3 shadow-neon-pink hover:scale-105 transition-transform"
                    >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    <button onClick={nextTrack} className="text-neon-cyan hover:text-white hover:shadow-neon-cyan transition-all rounded-full p-2">
                        <SkipForward size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
