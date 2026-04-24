export interface Point {
    x: number;
    y: number;
}

export interface Track {
    id: number;
    title: string;
    artist: string;
    url: string;
    duration: string;
}

export enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}
