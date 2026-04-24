import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, GameState } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { Trophy, Play, RotateCcw } from 'lucide-react';

export const SnakeGame: React.FC = () => {
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Point>({ x: 15, y: 15 });
    const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    
    // Use refs for values needed inside the game loop to avoid dependency issues
    const directionRef = useRef<Point>({ x: 1, y: 0 });
    const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
    const speedRef = useRef(INITIAL_SPEED);

    const generateFood = useCallback((currentSnake: Point[]): Point => {
        let newFood: Point;
        let isOccupied = true;
        while (isOccupied) {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
            // eslint-disable-next-line no-loop-func
            isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        }
        return newFood!;
    }, []);

    const resetGame = useCallback(() => {
        setSnake([{ x: 10, y: 10 }]);
        directionRef.current = { x: 1, y: 0 };
        nextDirectionRef.current = { x: 1, y: 0 };
        setScore(0);
        speedRef.current = INITIAL_SPEED;
        setFood(generateFood([{ x: 10, y: 10 }]));
        setGameState(GameState.PLAYING);
    }, [generateFood]);

    const gameOver = useCallback(() => {
        setGameState(GameState.GAME_OVER);
        if (score > highScore) {
            setHighScore(score);
        }
    }, [score, highScore]);

    // Handle Keyboard Input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default scrolling for arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            if (gameState !== GameState.PLAYING) {
                if (e.key === ' ' || e.key === 'Enter') {
                    resetGame();
                }
                return;
            }

            const currentDir = directionRef.current;
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (currentDir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (currentDir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (currentDir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (currentDir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, resetGame]);

    // Game Loop
    useEffect(() => {
        if (gameState !== GameState.PLAYING) return;

        const moveSnake = () => {
            setSnake(prevSnake => {
                const head = prevSnake[0];
                directionRef.current = nextDirectionRef.current;
                const newHead = {
                    x: head.x + directionRef.current.x,
                    y: head.y + directionRef.current.y
                };

                // Wall Collision
                if (
                    newHead.x < 0 || 
                    newHead.x >= GRID_SIZE || 
                    newHead.y < 0 || 
                    newHead.y >= GRID_SIZE
                ) {
                    gameOver();
                    return prevSnake;
                }

                // Self Collision
                if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    gameOver();
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Food Collision
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore(s => s + 10);
                    setFood(generateFood(newSnake));
                    speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREMENT);
                } else {
                    newSnake.pop(); // Remove tail if no food eaten
                }

                return newSnake;
            });
        };

        const intervalId = setInterval(moveSnake, speedRef.current);
        return () => clearInterval(intervalId);
    }, [gameState, food, generateFood, gameOver]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl">
            {/* Score Board */}
            <div className="flex justify-between w-full mb-4 px-4 py-2 bg-gray-900/80 border border-neon-cyan rounded-lg shadow-neon-cyan backdrop-blur-sm">
                <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Score</span>
                    <span className="text-2xl font-bold text-neon-lime font-mono">{score.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                        <Trophy size={12} /> High Score
                    </span>
                    <span className="text-2xl font-bold text-neon-magenta font-mono">{highScore.toString().padStart(4, '0')}</span>
                </div>
            </div>

            {/* Game Board Container */}
            <div className="relative p-2 bg-gray-900 rounded-xl border-2 border-gray-800 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
                {/* The Grid */}
                <div 
                    className="grid bg-black border border-gray-800"
                    style={{ 
                        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                        width: 'min(80vw, 500px)',
                        height: 'min(80vw, 500px)'
                    }}
                >
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                        const x = i % GRID_SIZE;
                        const y = Math.floor(i / GRID_SIZE);
                        
                        const isSnakeHead = snake[0].x === x && snake[0].y === y;
                        const isSnakeBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
                        const isFood = food.x === x && food.y === y;

                        let cellClass = "w-full h-full border-[0.5px] border-gray-900/30 ";
                        
                        if (isSnakeHead) {
                            cellClass += "bg-neon-lime shadow-[0_0_10px_#39ff14] rounded-sm z-10 relative";
                        } else if (isSnakeBody) {
                            cellClass += "bg-green-500/80 shadow-[0_0_5px_#22c55e] rounded-sm";
                        } else if (isFood) {
                            cellClass += "bg-neon-magenta shadow-[0_0_15px_#f0f] rounded-full animate-pulse scale-75";
                        }

                        return <div key={i} className={cellClass} />;
                    })}
                </div>

                {/* Overlays */}
                {gameState === GameState.IDLE && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20">
                        <h2 className="text-4xl font-bold text-neon-cyan mb-8 tracking-widest shadow-neon-cyan drop-shadow-lg">NEON SNAKE</h2>
                        <button 
                            onClick={resetGame}
                            className="flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-neon-lime text-neon-lime rounded-full hover:bg-neon-lime/20 hover:shadow-neon-lime transition-all text-xl font-bold uppercase tracking-wider"
                        >
                            <Play size={24} /> Start Game
                        </button>
                        <p className="mt-6 text-gray-400 text-sm">Use Arrow Keys or WASD to move</p>
                    </div>
                )}

                {gameState === GameState.GAME_OVER && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl z-20">
                        <h2 className="text-5xl font-bold text-red-500 mb-2 tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">SYSTEM FAILURE</h2>
                        <p className="text-xl text-gray-300 mb-8 font-mono">Final Score: <span className="text-neon-lime">{score}</span></p>
                        <button 
                            onClick={resetGame}
                            className="flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-neon-cyan text-neon-cyan rounded-full hover:bg-neon-cyan/20 hover:shadow-neon-cyan transition-all text-xl font-bold uppercase tracking-wider"
                        >
                            <RotateCcw size={24} /> Reboot
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
