import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { Terminal } from 'lucide-react';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans selection:bg-neon-magenta selection:text-white">
            
            {/* Background Grid Effect */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                 style={{
                     backgroundImage: `linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)`,
                     backgroundSize: '40px 40px',
                     perspective: '1000px',
                     transform: 'rotateX(60deg) translateY(-100px) scale(2)',
                     transformOrigin: 'top center'
                 }}
            />

            {/* Header */}
            <header className="relative z-10 w-full p-6 flex justify-center items-center border-b border-gray-800 bg-black/50 backdrop-blur-md">
                <h1 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta flex items-center gap-4 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                    <Terminal className="text-neon-cyan" size={36} />
                    SYNTH_SNAKE_OS
                </h1>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
                
                {/* Left/Top: Game Area */}
                <div className="flex-1 flex justify-center items-center w-full order-2 lg:order-1">
                    <SnakeGame />
                </div>

                {/* Right/Bottom: Music Player Area */}
                <div className="w-full lg:w-96 flex justify-center items-start lg:items-center order-1 lg:order-2">
                    <MusicPlayer />
                </div>

            </main>

            {/* Footer */}
            <footer className="relative z-10 p-4 text-center text-gray-600 text-xs font-mono border-t border-gray-900 bg-black/80">
                v1.0.0 // NEON PROTOCOL ACTIVE // AUDIO SYNTHESIS ONLINE
            </footer>
        </div>
    );
};

export default App;
