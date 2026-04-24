export interface Point {
    x: number;
    y: number;
}

export interface Track {
    id: string;
    title: string;
    artist: string;
    url: string;
    duration: string;
}

export enum GameState {
    IDLE,
    PLAYING,
    PAUSED,
    GAME_OVER
}
