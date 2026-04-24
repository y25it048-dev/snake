import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150; // ms per tick
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 50;

export const PLAYLIST: Track[] = [
    {
        id: 1,
        title: "Cybernetic Pulse",
        artist: "AI Gen - Model Alpha",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: "6:12"
    },
    {
        id: 2,
        title: "Neon Dreams",
        artist: "AI Gen - Model Beta",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: "7:05"
    },
    {
        id: 3,
        title: "Digital Horizon",
        artist: "AI Gen - Model Gamma",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: "5:44"
    }
];
