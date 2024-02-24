import k from "./initKaboom";
import { GameObj } from "kaboom";
import { LAYER } from "./definition";
import { stageInfo } from "./data/stage";
import { g_GPoint, g_DPoint, g_OSType, g_StageCoin, g_StageWidth, g_StagePosX, g_StagePosY } from "./global";
import { getGameItemCount } from "./data/item";

const { add, sprite, anchor, area, pos, z, vec2, scale, drawRect, drawSprite, drawText, rgb, Color } = k;

export const drawGameUI = (stage: number) => {
    const isMobile: boolean = g_OSType == "OT_ANDROID" || g_OSType == "OT_IOS";
    const GAME_STATUS_X_POS = g_StagePosX;
    const GAME_STATUS_Y_POS = g_StagePosY;
    const GAME_STATUS_WIDTH = g_StageWidth;
    const GAME_STATUS_HEIGHT = 34;
    const GPOINT_X_POS = 10;
    const GPOINT_Y_POS = 2;
    const GPOINT_PROGRESS_X_POS = GPOINT_X_POS + 15;
    const GPOINT_PROGRESS_Y_POS = GPOINT_Y_POS + 5;
    const POINT_PROGRESS_WIDTH = 200;
    const POINT_PROGRESS_HEIGHT = 20;
    const DPOINT_X_POS = GPOINT_PROGRESS_X_POS + POINT_PROGRESS_WIDTH + 10;
    const DPOINT_Y_POS = GPOINT_Y_POS;
    const DPOINT_PROGRESS_X_POS = DPOINT_X_POS + 15;
    const DPOINT_PROGRESS_Y_POS = GPOINT_PROGRESS_Y_POS;
    const COIN_X_POS = DPOINT_PROGRESS_X_POS + POINT_PROGRESS_WIDTH + 10;
    const COIN_Y_POS = GPOINT_Y_POS;
    const COIN_RECT_X_POS = COIN_X_POS + 15;
    const COIN_RECT_Y_POS = GPOINT_PROGRESS_Y_POS;
    const COIN_RECT_WIDTH = 100;
    const COIN_RECT_HEIGHT = 20;
    const BTN_WIDTH = 50;
    const FULLSCREEN_BTN_X_POS = g_StagePosX + g_StageWidth - (isMobile ? 0 : BTN_WIDTH) - 5;
    const FULLSCREEN_BTN_Y_POS = GAME_STATUS_Y_POS + 5;
    const PAUSE_BTN_X_POS = FULLSCREEN_BTN_X_POS - BTN_WIDTH - 5;
    const PAUSE_BTN_Y_POS = FULLSCREEN_BTN_Y_POS;
    //const HAND_BTN_X_POS = PAUSE_BTN_X_POS - BTN_WIDTH - 5;
    //const HAND_BTN_Y_POS = FULLSCREEN_BTN_Y_POS;
    const SLOW_BTN_X_POS = PAUSE_BTN_X_POS - BTN_WIDTH - 15;
    const SLOW_BTN_Y_POS = FULLSCREEN_BTN_Y_POS;
    const AUTO_CLEAN_BTN_X_POS = SLOW_BTN_X_POS - BTN_WIDTH - 15;
    const AUTO_CLEAN_BTN_Y_POS = FULLSCREEN_BTN_Y_POS;
    const AUTO_RECYCLE_BTN_X_POS = AUTO_CLEAN_BTN_X_POS - BTN_WIDTH - 15;
    const AUTO_RECYCLE_BTN_Y_POS = FULLSCREEN_BTN_Y_POS;

    add([
        pos(GAME_STATUS_X_POS, GAME_STATUS_Y_POS),
        z(LAYER.UI),
        {
            draw(this: GameObj): void {
                drawRect({
                    width: GAME_STATUS_WIDTH,
                    height: GAME_STATUS_HEIGHT,
                    anchor: "topleft",
                    pos: vec2(0, 0),
                    color: rgb(4, 92, 157),
                    opacity: 0.7,
                });
                drawRect({
                    width: POINT_PROGRESS_WIDTH,
                    height: POINT_PROGRESS_HEIGHT,
                    radius: 5,
                    anchor: "topleft",
                    pos: vec2(GPOINT_PROGRESS_X_POS, GPOINT_PROGRESS_Y_POS),
                    color: rgb(8, 20, 63),
                    outline: { color: rgb(0, 0, 0), width: 2 },
                });
                drawRect({
                    width: (POINT_PROGRESS_WIDTH * g_GPoint) / stageInfo[stage].gPoint,
                    height: POINT_PROGRESS_HEIGHT,
                    radius: 5,
                    anchor: "topleft",
                    pos: vec2(GPOINT_PROGRESS_X_POS, GPOINT_PROGRESS_Y_POS),
                    color: rgb(19, 160, 242),
                    outline: { color: rgb(0, 0, 0), width: 2 },
                });
                drawText({
                    text: g_GPoint.toString() + " / " + stageInfo[stage].gPoint.toString(),
                    pos: vec2(GPOINT_PROGRESS_X_POS, GPOINT_PROGRESS_Y_POS + 2),
                    size: 18,
                    align: "center",
                    width: POINT_PROGRESS_WIDTH,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
                drawSprite({
                    sprite: "GPoint",
                    anchor: "topleft",
                    pos: vec2(GPOINT_X_POS, GPOINT_Y_POS),
                });
                drawRect({
                    width: POINT_PROGRESS_WIDTH,
                    height: POINT_PROGRESS_HEIGHT,
                    radius: 5,
                    anchor: "topleft",
                    pos: vec2(DPOINT_PROGRESS_X_POS, DPOINT_PROGRESS_Y_POS),
                    color: rgb(8, 20, 63),
                    outline: { color: Color.BLACK, width: 2 },
                });
                drawRect({
                    width: (POINT_PROGRESS_WIDTH * g_DPoint) / stageInfo[stage].dPoint,
                    height: POINT_PROGRESS_HEIGHT,
                    radius: 5,
                    anchor: "topleft",
                    pos: vec2(DPOINT_PROGRESS_X_POS, DPOINT_PROGRESS_Y_POS),
                    color: rgb(216, 57, 57),
                    outline: { color: Color.BLACK, width: 2 },
                });
                drawText({
                    text: g_DPoint.toString() + " / " + stageInfo[stage].dPoint.toString(),
                    pos: vec2(DPOINT_PROGRESS_X_POS, DPOINT_PROGRESS_Y_POS + 2),
                    size: 18,
                    align: "center",
                    width: POINT_PROGRESS_WIDTH,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
                drawSprite({
                    sprite: "DPoint",
                    anchor: "topleft",
                    pos: vec2(DPOINT_X_POS, DPOINT_Y_POS),
                });
                // drawRect({
                //     width: POINT_PROGRESS_WIDTH,
                //     height: POINT_PROGRESS_HEIGHT,
                //     radius: 5,
                //     anchor: "topleft",
                //     pos: vec2(PPOINT_PROGRESS_X_POS, PPOINT_PROGRESS_Y_POS),
                //     color: rgb(8, 20, 63),
                //     outline: { color: Color.BLACK, width: 2 },
                // });
                // drawRect({
                //     width: (POINT_PROGRESS_WIDTH / g_PPoint) * stageInfo[stage].pPoint,
                //     height: POINT_PROGRESS_HEIGHT,
                //     radius: 5,
                //     anchor: "topleft",
                //     pos: vec2(PPOINT_PROGRESS_X_POS, PPOINT_PROGRESS_Y_POS),
                //     color: rgb(27, 200, 0),
                //     outline: { color: Color.BLACK, width: 2 },
                // });
                // drawText({
                //     text: g_PPoint.toString() + " / " + stageInfo[stage].pPoint.toString(),
                //     pos: vec2(PPOINT_PROGRESS_X_POS, PPOINT_PROGRESS_Y_POS + 2),
                //     size: 18,
                //     align: "center",
                //     width: POINT_PROGRESS_WIDTH,
                //     font: "LilitaOne-Regular",
                //     color: Color.WHITE,
                // });
                // drawSprite({
                //     sprite: "PPoint",
                //     anchor: "topleft",
                //     pos: vec2(PPOINT_X_POS, PPOINT_Y_POS),
                // });
                drawRect({
                    width: COIN_RECT_WIDTH,
                    height: COIN_RECT_HEIGHT,
                    radius: 5,
                    anchor: "topleft",
                    pos: vec2(COIN_RECT_X_POS, COIN_RECT_Y_POS),
                    color: rgb(39, 14, 12),
                    outline: { color: Color.BLACK, width: 2 },
                });
                drawText({
                    text: g_StageCoin.toString(),
                    pos: vec2(COIN_RECT_X_POS, COIN_RECT_Y_POS + 2),
                    size: 18,
                    align: "center",
                    width: COIN_RECT_WIDTH,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
                drawSprite({
                    sprite: "coin",
                    anchor: "topleft",
                    pos: vec2(COIN_X_POS, COIN_Y_POS),
                });
            },
        },
    ]);

    add([sprite("pause"), pos(PAUSE_BTN_X_POS, PAUSE_BTN_Y_POS), anchor("topleft"), area(), z(LAYER.UI), "PauseButton", "HoverCursor"]);

    if (!isMobile) {
        add([
            sprite("fullscreen"),
            pos(FULLSCREEN_BTN_X_POS, FULLSCREEN_BTN_Y_POS),
            anchor("topleft"),
            area(),
            z(LAYER.UI),
            "FullscreenBtn",
            "HoverCursor",
        ]);
    }

    // add([
    //     sprite("hand"),
    //     pos(HAND_BTN_X_POS, HAND_BTN_Y_POS),
    //     anchor("topleft"),
    //     scale(0.6),
    //     area(),
    //     z(LAYER.UI),
    //     "HandBtn",
    //     "HoverCursor",
    //     "HoverScaleUp",
    // ]);

    const autoRecycleBtn = add([
        sprite("autoRecycle"),
        pos(AUTO_RECYCLE_BTN_X_POS, AUTO_RECYCLE_BTN_Y_POS),
        anchor("topleft"),
        scale(1.0),
        area(),
        z(LAYER.UI),
        "AutoRecycleBtn",
        "HoverCursor",
        "HoverScaleUp",
    ]);

    add([
        anchor("topleft"),
        z(LAYER.ACTION),
        {
            draw(this: GameObj): void {
                drawText({
                    text: getGameItemCount("IT_AUTO_RECYCLE").toString(),
                    pos: vec2(autoRecycleBtn.pos.x, autoRecycleBtn.pos.y + autoRecycleBtn.height - 20),
                    size: 30,
                    align: "center",
                    width: autoRecycleBtn.width,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
            },
        },
    ]);

    const autoCleanBtn = add([
        sprite("autoClean"),
        pos(AUTO_CLEAN_BTN_X_POS, AUTO_CLEAN_BTN_Y_POS),
        anchor("topleft"),
        scale(1.0),
        area(),
        z(LAYER.UI),
        "AutoCleanBtn",
        "HoverCursor",
        "HoverScaleUp",
    ]);

    add([
        anchor("topleft"),
        z(LAYER.ACTION),
        {
            draw(this: GameObj): void {
                drawText({
                    text: getGameItemCount("IT_AUTO_CLEAN").toString(),
                    pos: vec2(autoCleanBtn.pos.x, autoCleanBtn.pos.y + autoCleanBtn.height - 20),
                    size: 30,
                    align: "center",
                    width: autoCleanBtn.width,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
            },
        },
    ]);

    const slowConBeltBtn = add([
        sprite("slowConBelt"),
        pos(SLOW_BTN_X_POS, SLOW_BTN_Y_POS),
        anchor("topleft"),
        scale(1.0),
        area(),
        z(LAYER.UI),
        "SlowConBeltBtn",
        "HoverCursor",
        "HoverScaleUp",
    ]);

    add([
        anchor("topleft"),
        z(LAYER.ACTION),
        {
            draw(this: GameObj): void {
                drawText({
                    text: getGameItemCount("IT_SLOW_CONBELT").toString(),
                    pos: vec2(slowConBeltBtn.pos.x, slowConBeltBtn.pos.y + slowConBeltBtn.height - 20),
                    size: 30,
                    align: "center",
                    width: slowConBeltBtn.width,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
            },
        },
    ]);
};
