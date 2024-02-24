export const LAYER = {
    OUTDOOR: 1,
    BG: 2,
    ITEM_1: 3,
    ITEM_2: 4,
    ITEM_3: 5,
    UI: 6,
    ACTION: 7,
    CURSOR: 8,
    COVER_OUTSIDE: 30,
} as const;

type LAYER = (typeof LAYER)[keyof typeof LAYER];

export type OS_TYPE = "OT_ANDROID" | "OT_IOS" | "OT_MACOS" | "OT_WINDOWS" | "OT_UNKNOWN";

export type GAME_STATE = "GS_READY" | "GS_PLAYING" | "GS_PAUSE" | "GS_GAMEOVER";

export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IPoint {
    x: number;
    y: number;
}
