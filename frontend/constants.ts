import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 50;

// Using reliable public domain/placeholder audio for the "AI Generated" dummy tracks
export const DUMMY_TRACKS: Track[] = [
    {
        id: 'track-1',
        title: 'Neon Horizon (AI Mix)',
        artist: 'SynthBot Alpha',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: '6:12'
    },
    {
        id: 'track-2',
        title: 'Cybernetic Dreams',
        artist: 'Neural Network 9',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: '7:05'
    },
    {
        id: 'track-3',
        title: 'Digital Pulse',
        artist: 'Algorithm X',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: '5:44'
    }
];
