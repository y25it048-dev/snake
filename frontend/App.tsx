import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Track } from './types';

const App: React.FC = () => {
    const [score, setScore] = useState(0);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

    return (
        <div className="min-h-screen bg-neon-dark flex flex-col font-sans relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/10 blur-[120px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-neon-cyan/10 blur-[150px] rounded-full mix-blend-screen"></div>
                
                {/* Grid lines for retro feel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom opacity-30"></div>
            </div>

            {/* Header / Scoreboard */}
            <header className="w-full p-6 flex justify-between items-center z-10 relative">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(5,217,232,0.5)]">
                        Synth<span className="text-neon-pink">Snake</span>
                    </h1>
                    {currentTrack && (
                        <p className="text-xs text-gray-400 font-mono mt-1 animate-pulse">
                            Now Playing: {currentTrack.title}
                        </p>
                    )}
                </div>
                
                <div className="bg-black/60 border border-neon-cyan/50 px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(5,217,232,0.3)] backdrop-blur-sm">
                    <span className="text-gray-400 font-mono text-sm mr-2">SCORE</span>
                    <span className="text-2xl font-bold text-neon-cyan font-mono">{score.toString().padStart(4, '0')}</span>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-4 z-10 relative">
                
                {/* Game Container */}
                <div className="flex-1 flex justify-center items-center w-full">
                    <SnakeGame onScoreChange={setScore} />
                </div>

                {/* Music Player Container - Positioned at bottom on mobile, side on desktop */}
                <div className="w-full lg:w-auto lg:absolute lg:bottom-8 lg:right-8 flex justify-center z-20">
                    <MusicPlayer onTrackChange={setCurrentTrack} />
                </div>
                
            </main>
        </div>
    );
};

export default App;
