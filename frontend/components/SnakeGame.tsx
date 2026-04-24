import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';

interface SnakeGameProps {
    onScoreChange: (score: number) => void;
}

const generateFood = (snake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        // eslint-disable-next-line no-loop-func
        isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
};

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Point>({ x: 15, y: 10 });
    const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const [score, setScore] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
    const [hasStarted, setHasStarted] = useState<boolean>(false);

    // Use refs for state that needs to be accessed inside the interval without causing re-renders
    const directionRef = useRef(direction);
    const nextDirectionRef = useRef(direction); // Prevent rapid double-turns

    useEffect(() => {
        directionRef.current = direction;
    }, [direction]);

    const resetGame = useCallback(() => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection(Direction.RIGHT);
        nextDirectionRef.current = Direction.RIGHT;
        setFood(generateFood([{ x: 10, y: 10 }]));
        setGameOver(false);
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setIsPaused(false);
        setHasStarted(true);
        onScoreChange(0);
    }, [onScoreChange]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default scrolling for arrow keys and space
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
                e.preventDefault();
            }

            if (e.key === ' ' && hasStarted) {
                setIsPaused(prev => !prev);
                return;
            }

            if (gameOver || isPaused) return;

            const currentDir = nextDirectionRef.current;
            
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (currentDir !== Direction.DOWN) nextDirectionRef.current = Direction.UP;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (currentDir !== Direction.UP) nextDirectionRef.current = Direction.DOWN;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (currentDir !== Direction.RIGHT) nextDirectionRef.current = Direction.LEFT;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (currentDir !== Direction.LEFT) nextDirectionRef.current = Direction.RIGHT;
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver, isPaused, hasStarted]);

    useEffect(() => {
        if (gameOver || isPaused || !hasStarted) return;

        const moveSnake = () => {
            setSnake(prevSnake => {
                const head = prevSnake[0];
                const currentDir = nextDirectionRef.current;
                setDirection(currentDir); // Sync state with ref for rendering if needed

                const newHead = { ...head };

                switch (currentDir) {
                    case Direction.UP: newHead.y -= 1; break;
                    case Direction.DOWN: newHead.y += 1; break;
                    case Direction.LEFT: newHead.x -= 1; break;
                    case Direction.RIGHT: newHead.x += 1; break;
                }

                // Check wall collision
                if (
                    newHead.x < 0 || newHead.x >= GRID_SIZE ||
                    newHead.y < 0 || newHead.y >= GRID_SIZE
                ) {
                    setGameOver(true);
                    return prevSnake;
                }

                // Check self collision
                if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameOver(true);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check food collision
                if (newHead.x === food.x && newHead.y === food.y) {
                    const newScore = score + 10;
                    setScore(newScore);
                    onScoreChange(newScore);
                    setFood(generateFood(newSnake));
                    setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
                    // Don't pop the tail, so it grows
                } else {
                    newSnake.pop(); // Remove tail if no food eaten
                }

                return newSnake;
            });
        };

        const gameLoop = setInterval(moveSnake, speed);
        return () => clearInterval(gameLoop);
    }, [gameOver, isPaused, hasStarted, food, score, speed, onScoreChange]);

    // Render Grid
    const grid = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const isSnakeHead = snake[0].x === col && snake[0].y === row;
            const isSnakeBody = snake.some((segment, index) => index !== 0 && segment.x === col && segment.y === row);
            const isFood = food.x === col && food.y === row;

            let cellClass = "w-full h-full rounded-sm transition-all duration-75 ";
            
            if (isSnakeHead) {
                cellClass += "bg-neon-cyan shadow-neon-cyan z-10 relative scale-110";
            } else if (isSnakeBody) {
                cellClass += "bg-neon-cyan/70 shadow-[0_0_5px_#05d9e8]";
            } else if (isFood) {
                cellClass += "bg-neon-pink shadow-neon-pink animate-pulse rounded-full scale-75";
            } else {
                cellClass += "bg-gray-900/30 border border-gray-800/30";
            }

            grid.push(
                <div key={`${row}-${col}`} className="p-[1px]">
                    <div className={cellClass} />
                </div>
            );
        }
    }

    return (
        <div className="relative flex flex-col items-center">
            {/* Game Board Container */}
            <div className="relative bg-black/50 p-2 rounded-xl border-2 border-neon-purple/50 shadow-neon-purple backdrop-blur-sm">
                <div 
                    className="grid bg-black rounded-lg overflow-hidden"
                    style={{ 
                        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                        width: 'min(80vw, 500px)',
                        height: 'min(80vw, 500px)'
                    }}
                >
                    {grid}
                </div>

                {/* Overlays */}
                {(!hasStarted || gameOver || isPaused) && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20">
                        {!hasStarted ? (
                            <div className="text-center space-y-6">
                                <h2 className="text-4xl font-bold text-neon-cyan shadow-neon-cyan drop-shadow-[0_0_10px_rgba(5,217,232,0.8)] tracking-widest font-mono">NEON SNAKE</h2>
                                <p className="text-gray-400 font-mono">Use Arrow Keys or WASD to move</p>
                                <button 
                                    onClick={resetGame}
                                    className="px-8 py-3 bg-transparent border-2 border-neon-pink text-neon-pink font-bold rounded-full hover:bg-neon-pink hover:text-white hover:shadow-neon-pink transition-all duration-300 font-mono tracking-wider"
                                >
                                    INITIALIZE
                                </button>
                            </div>
                        ) : gameOver ? (
                            <div className="text-center space-y-6">
                                <h2 className="text-5xl font-bold text-neon-pink shadow-neon-pink drop-shadow-[0_0_15px_rgba(255,42,109,0.8)] tracking-widest font-mono">SYSTEM FAILURE</h2>
                                <p className="text-2xl text-neon-cyan font-mono">FINAL SCORE: {score}</p>
                                <button 
                                    onClick={resetGame}
                                    className="px-8 py-3 bg-transparent border-2 border-neon-cyan text-neon-cyan font-bold rounded-full hover:bg-neon-cyan hover:text-black hover:shadow-neon-cyan transition-all duration-300 font-mono tracking-wider mt-4"
                                >
                                    REBOOT
                                </button>
                            </div>
                        ) : isPaused ? (
                            <div className="text-center space-y-4">
                                <h2 className="text-4xl font-bold text-neon-purple shadow-neon-purple drop-shadow-[0_0_10px_rgba(179,0,255,0.8)] tracking-widest font-mono">PAUSED</h2>
                                <p className="text-gray-400 font-mono">Press SPACE to resume</p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
            
            {/* Controls Hint */}
            <div className="mt-4 text-gray-500 font-mono text-sm flex gap-4">
                <span>[SPACE] Pause/Resume</span>
                <span>[WASD/ARROWS] Move</span>
            </div>
        </div>
    );
};

export default SnakeGame;
