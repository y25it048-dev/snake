import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { Track } from '../types';
import { DUMMY_TRACKS } from '../constants';

interface MusicPlayerProps {
    onPlayStateChange?: (isPlaying: boolean) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onPlayStateChange }) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const currentTrack = DUMMY_TRACKS[currentTrackIndex];

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
        if (onPlayStateChange) {
            onPlayStateChange(isPlaying);
        }
    }, [isPlaying, currentTrackIndex, onPlayStateChange]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
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

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
        if (isMuted) setIsMuted(false);
    };

    return (
        <div className="flex flex-col w-full max-w-md bg-gray-900/80 border border-neon-purple rounded-xl p-6 shadow-neon-purple backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neon-purple flex items-center gap-2 tracking-widest uppercase">
                    <Music size={20} className="animate-pulse" />
                    AI Synth Deck
                </h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-neon-cyan transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                    />
                </div>
            </div>

            {/* Now Playing Info */}
            <div className="mb-6 text-center">
                <div className="text-neon-cyan font-bold text-lg truncate shadow-neon-cyan drop-shadow-md">
                    {currentTrack.title}
                </div>
                <div className="text-gray-400 text-sm mt-1">
                    {currentTrack.artist}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-800 rounded-full mb-6 overflow-hidden">
                <div 
                    className="h-full bg-neon-magenta shadow-neon-magenta transition-all duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-6 mb-8">
                <button 
                    onClick={prevTrack}
                    className="p-2 text-gray-300 hover:text-neon-cyan hover:shadow-neon-cyan rounded-full transition-all"
                >
                    <SkipBack size={24} />
                </button>
                <button 
                    onClick={togglePlay}
                    className="p-4 bg-gray-800 text-neon-lime border border-neon-lime rounded-full shadow-neon-lime hover:bg-gray-700 transition-all transform hover:scale-105"
                >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </button>
                <button 
                    onClick={nextTrack}
                    className="p-2 text-gray-300 hover:text-neon-cyan hover:shadow-neon-cyan rounded-full transition-all"
                >
                    <SkipForward size={24} />
                </button>
            </div>

            {/* Track List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                {DUMMY_TRACKS.map((track, index) => (
                    <div 
                        key={track.id}
                        onClick={() => {
                            setCurrentTrackIndex(index);
                            setIsPlaying(true);
                        }}
                        className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all ${
                            index === currentTrackIndex 
                                ? 'bg-gray-800 border border-neon-cyan text-neon-cyan shadow-[inset_0_0_10px_rgba(0,255,255,0.2)]' 
                                : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <div className="flex flex-col truncate pr-4">
                            <span className="font-semibold truncate">{track.title}</span>
                            <span className="text-xs opacity-70">{track.artist}</span>
                        </div>
                        <span className="text-xs font-mono">{track.duration}</span>
                    </div>
                ))}
            </div>

            <audio 
                ref={audioRef}
                src={currentTrack.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleTrackEnd}
            />
        </div>
    );
};
