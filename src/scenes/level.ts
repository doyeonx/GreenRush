import k from "../initKaboom";
import { GameObj, Vec2 } from "kaboom";
import { LAYER } from "../definition";

import {
    g_StagePosX,
    g_StagePosY,
    g_GameCoin,
    g_MusicOn,
    g_SoundOn,
    setSoundOn,
    g_StageHeight,
    g_StarCounts,
    g_StageScale,
    setGameScene,
    setGameCoin,
    getGameCoin,
} from "../global";
import { getGameItemCount, gameItem, IGameItem, ITEM_TYPE, setGameItemCount } from "../data/item";
import { shop } from "../window/shop";
import { bkgScroll, coverStageOutside, playMusic } from "../common/util";
import { settings } from "../window/settings";
//import { mouseMove } from "../components/util";
const {
    add,
    sprite,
    pos,
    area,
    anchor,
    scale,
    z,
    onClick,
    onScroll,
    go,
    vec2,
    wave,
    time,
    onHoverUpdate,
    onHoverEnd,
    setCursor,
    width,
    rgb,
    drawText,
    drawSprite,
    drawRect,
    Color,
    get,
    camPos,
    play,
    destroyAll,
    height,
    onTouchStart,
    onTouchMove,
    wait,
    // mousePos,
    // isTouchscreen,
    // isFullscreen,
    // rotate,
} = k;
let levelpaused = false;
export const pause = () => {
    if (levelpaused) {
        get("*").forEach((obj) => {
            obj.paused = false;
        });
        levelpaused = false;
    } else {
        const objList: GameObj[] = get("*");
        objList.forEach((obj) => {
            obj.is("Background") || obj.is("Hand") || obj.is("Modal") ? (obj.paused = false) : (obj.paused = true);
        });
        levelpaused = true;
    }
};
const LevelScene = () => {
    setGameScene("level");
    const camposY = g_StagePosY + 1920 - height();
    camPos(width() / 2, 1920 - g_StageHeight / 2);

    const MENU_POSITION_Y = 35 + camposY;
    const MENU_POSITION_X = 860;
    const MENU_BUTTON_DISTANCE = 60;
    const COIN_X_POS = 600;
    const COIN_RECT_WIDTH = 70;
    const COIN_RECT_HEIGHT = 20;
    const BTN_WIDTH = 30;
    const ITEM_X_DISTANCE = BTN_WIDTH + 13;
    const ITEM_X_POS = 700;

    const addLevel = (x: number, y: number, level: number, isLock: boolean, starSprite: string) => {
        add([
            sprite("numberBkg"),
            pos(vec2(g_StagePosX + x + 2, g_StagePosY + y - 20)),
            anchor("center"),
            z(LAYER.ITEM_1),
            "HoverCursor",
            area(),
            scale(0.5),
        ]);
        add([
            isLock ? sprite("levelLock") : sprite(starSprite),
            anchor("center"),
            area(),
            scale(0.6),
            pos(g_StagePosX + x, g_StagePosY + y),
            z(LAYER.ITEM_1),
            "StageMap",
            "HoverCursor",
            "HoverScaleUp",
            {
                isLock: isLock,
                level: level,
            },
        ]);
        add([
            pos(x + 2, y - 40),
            z(LAYER.ITEM_1),
            {
                draw(this: GameObj): void {
                    drawText({
                        text: (level + 1).toString(),
                        pos: vec2(g_StagePosX, g_StagePosY),
                        size: 30,
                        align: "center",
                        anchor: "center",
                        width: 100,
                        font: "LilitaOne-Regular",
                        color: Color.WHITE,
                        outline: { color: Color.BLACK, width: 4 },
                    });
                },
            },
            anchor("center"),
        ]);
    };
    const levelInfo: { xPos: number; yPos: number; level: number }[] = [
        {
            xPos: 140,
            yPos: 1830,
            level: 0,
        },
        {
            xPos: 420,
            yPos: 1840,
            level: 1,
        },
        {
            xPos: 720,
            yPos: 1820,
            level: 2,
        },
        {
            xPos: 820,
            yPos: 1620,
            level: 3,
        },
        {
            xPos: 550,
            yPos: 1560,
            level: 4,
        },
        {
            xPos: 250,
            yPos: 1600,
            level: 5,
        },
        {
            xPos: 70,
            yPos: 1420,
            level: 6,
        },
        {
            xPos: 320,
            yPos: 1300,
            level: 7,
        },
        {
            xPos: 650,
            yPos: 1330,
            level: 8,
        },
        {
            xPos: 870,
            yPos: 1190,
            level: 9,
        },
        {
            xPos: 560,
            yPos: 1050,
            level: 10,
        },
        {
            xPos: 240,
            yPos: 1070,
            level: 11,
        },
        {
            xPos: 80,
            yPos: 870,
            level: 12,
        },
        {
            xPos: 320,
            yPos: 730,
            level: 13,
        },
        {
            xPos: 610,
            yPos: 720,
            level: 14,
        },
        {
            xPos: 860,
            yPos: 660,
            level: 15,
        },
        {
            xPos: 890,
            yPos: 460,
            level: 16,
        },
        {
            xPos: 680,
            yPos: 340,
            level: 17,
        },
        {
            xPos: 410,
            yPos: 330,
            level: 18,
        },
        {
            xPos: 120,
            yPos: 320,
            level: 19,
        },
    ];
    let unlocked = true;
    levelInfo.forEach((info) => {
        let locked: boolean;
        if (g_StarCounts[info.level] != "level0Star") {
            locked = false;
        } else if (unlocked) {
            unlocked = false;
            locked = false;
        } else {
            locked = true;
        }
        //if(info.level==19)locked=false;
        addLevel(info.xPos, info.yPos, info.level, locked, g_StarCounts[info.level]);
    });
    // addLevel(140, 1830, 0, false, g_StarCounts[0]);
    // addLevel(420, 1840, 1, false, g_StarCounts[1]);
    // addLevel(720, 1820, 2, false, g_StarCounts[2]);
    // addLevel(820, 1620, 3, false, g_StarCounts[3]);
    // addLevel(550, 1560, 4, false, g_StarCounts[4]);
    // addLevel(250, 1600, 5, false, g_StarCounts[5]);
    // addLevel(70, 1420, 6, false, g_StarCounts[6]);
    // addLevel(320, 1300, 7, false, g_StarCounts[7]);
    // addLevel(650, 1330, 8, false, g_StarCounts[8]);
    // addLevel(870, 1190, 9, false, g_StarCounts[9]);
    // addLevel(560, 1050, 10, false, g_StarCounts[10]);
    // addLevel(240, 1070, 11, false, g_StarCounts[11]);
    // addLevel(80, 870, 12, false, g_StarCounts[12]);
    // addLevel(320, 730, 13, false, g_StarCounts[13]);
    // addLevel(610, 720, 14, false, g_StarCounts[14]);
    // addLevel(860, 660, 15, false, g_StarCounts[15]);
    // addLevel(890, 460, 16, false, g_StarCounts[16]);
    // addLevel(680, 340, 17, false, g_StarCounts[17]);
    // addLevel(410, 330, 18, false, g_StarCounts[18]);
    // addLevel(120, 320, 19, false, g_StarCounts[19]);

    const scrollMap = (dy: number): void => {
        const pos = camPos();
        if (pos.y + dy > g_StagePosY + height() / 2 && pos.y + dy < g_StagePosY + 1920 - height() / 2 && !levelpaused) {
            camPos(vec2(pos.x, pos.y + dy));
            get("Follow").forEach((obj: GameObj) => {
                obj.moveBy(0, dy);
            });
        }
    };

    // const hand =
    //     isTouchscreen() || isFullscreen()
    //         ? undefined
    //         : add([sprite("hand"), pos(mousePos()), area(), scale(1.0), rotate(0), mouseMove(), anchor("topleft"), z(LAYER.CURSOR), "Hand"]);

    let touchPosY: number;
    onTouchStart((touchPos: Vec2) => {
        touchPosY = touchPos.y / g_StageScale;
    });

    onTouchMove((touchPos: Vec2) => {
        const tPosY = touchPos.y / g_StageScale;
        scrollMap(touchPosY - tPosY);
        touchPosY = tPosY;
    });

    onScroll((delta: Vec2) => {
        scrollMap(delta.y);
    });

    onHoverUpdate("HoverCursor", (obj: GameObj) => {
        if (!obj.isLock) setCursor("pointer");
    });

    onHoverEnd("HoverCursor", (obj: GameObj) => {
        if (!obj.isLock) setCursor("auto");
    });

    onHoverUpdate("HoverScaleUp", (obj: GameObj) => {
        if (!obj.isLock) obj.use(scale(wave(0.6, 0.7, time() * 10)));
    });

    onHoverEnd("HoverScaleUp", (obj: GameObj) => {
        obj.use(scale(0.6));
        setCursor("auto");
    });

    onClick("StageMap", (obj: GameObj) => {
        if (!obj.isLock && !levelpaused) {
            bgm.paused = true;
            go("game", obj.level);
        }
    });

    const road = add([sprite("road"), anchor("topleft"), area(), pos(g_StagePosX, g_StagePosY), z(LAYER.BG)]);
    coverStageOutside(road.height);

    bkgScroll("levelBkg1", 0, 0);
    bkgScroll("levelBkg2", 0.8, 50);
    bkgScroll("levelBkg3", 0.7, 40);
    bkgScroll("levelBkg4", 0.6, 30);
    bkgScroll("levelBkg5", 0.5, 25);
    bkgScroll("levelBkg6", 0.4, 20);
    bkgScroll("levelBkg7", 0.3, 15);
    bkgScroll("levelBkg8", 0.2, 10);
    bkgScroll("levelBkg9", 0.1, 5);

    add([
        pos(0, camposY),
        anchor("topleft"),
        z(LAYER.UI - 1),
        "Follow",
        {
            draw(this: GameObj): void {
                drawRect({
                    width: width(),
                    height: 70,
                    pos: vec2(0, 0),
                    anchor: "topleft",
                    color: rgb(4, 92, 157),
                    opacity: 0.5,
                });
            },
        },
    ]);
    add([
        sprite("setting"),
        anchor("center"),
        area(),
        pos(MENU_POSITION_X, MENU_POSITION_Y),
        z(LAYER.UI),
        "level_button",
        "settings",
        "Follow",
        "HoverCursor",
        scale(1),
    ]);
    add([
        "Follow",
        sprite("shop"),
        anchor("center"),
        area(),
        pos(MENU_BUTTON_DISTANCE + MENU_POSITION_X, MENU_POSITION_Y),
        z(LAYER.UI),
        "level_button",
        "shop_button",
        "HoverCursor",
        scale(1),
    ]);

    onClick("settings", () => {
        if (!levelpaused) {
            pause();
            settings();
        }
    });
    onClick("close", () => {
        pause();
        destroyAll("Modal");
    });
    onClick("credits", () => {
        bgm.paused = true;
        pause();
        go("credit");
    });

    gameItem.forEach((item: IGameItem, key: ITEM_TYPE) => {
        onClick(key, (obj) => {
            if (g_GameCoin >= item.price) {
                setGameCoin(getGameCoin() - item.price);
                setGameItemCount(key, getGameItemCount(key) + 1);
                obj.children[0].isClicking = true;
                obj.children[0].draw();
                wait(0.2, () => {
                    obj.children[0].isClicking = false;
                });
            }
        });
    });

    onClick("music_button", (music_button) => {
        playMusic(bgm, !g_MusicOn);
        music_button.use(g_MusicOn ? sprite("music_on") : sprite("music_off"));
    });
    onClick("sound_button", (sound_button) => {
        g_SoundOn ? setSoundOn(false) : setSoundOn(true);
        sound_button.use(g_SoundOn ? sprite("sound_on") : sprite("sound_off"));
    });
    onClick("shop_button", () => {
        if (!levelpaused) {
            pause();
            shop();
        }
    });

    add([
        pos(COIN_X_POS, MENU_POSITION_Y),
        z(LAYER.UI),
        anchor("center"),
        scale(1.4),
        "Follow",
        {
            draw(this: GameObj): void {
                drawRect({
                    width: COIN_RECT_WIDTH,
                    height: COIN_RECT_HEIGHT,
                    radius: 5,
                    anchor: "center",
                    pos: vec2(0, 0),
                    color: rgb(39, 14, 12),
                    outline: { color: Color.BLACK, width: 2 },
                });
                drawText({
                    text: g_GameCoin.toString(),
                    pos: vec2(0, 0),
                    size: 18,
                    anchor: "center",
                    align: "center",
                    width: COIN_RECT_WIDTH,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
                drawSprite({
                    sprite: "coin",
                    anchor: "center",

                    pos: vec2(-(COIN_RECT_WIDTH / 2), 0),
                });
            },
        },
    ]);

    add([
        sprite("slowConBelt"),
        pos(ITEM_X_DISTANCE * 2 + ITEM_X_POS, MENU_POSITION_Y),
        anchor("center"),
        scale(1),
        area(),
        z(LAYER.UI),
        "Follow",
        {
            draw(this: GameObj): void {
                drawText({
                    text: getGameItemCount("IT_SLOW_CONBELT").toString(),
                    pos: vec2(0, this.height / 2 - 2),
                    size: 20,
                    align: "center",
                    anchor: "center",
                    width: BTN_WIDTH,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
            },
        },
    ]);

    add([
        sprite("autoClean"),
        pos(ITEM_X_DISTANCE + ITEM_X_POS, MENU_POSITION_Y),
        anchor("center"),
        scale(1),
        area(),
        z(LAYER.UI),
        "Follow",
        {
            draw(this: GameObj): void {
                drawText({
                    text: getGameItemCount("IT_AUTO_CLEAN").toString(),
                    pos: vec2(0, this.height / 2 - 2),
                    size: 20,
                    align: "center",
                    anchor: "center",
                    width: BTN_WIDTH,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
            },
        },
    ]);
    add([
        sprite("autoRecycle"),
        pos(ITEM_X_POS, MENU_POSITION_Y),
        anchor("center"),
        scale(1),
        "Follow",
        z(LAYER.UI),
        {
            draw(this: GameObj): void {
                drawText({
                    text: getGameItemCount("IT_AUTO_RECYCLE").toString(),
                    pos: vec2(0, this.height / 2 - 2),
                    size: 20,
                    align: "center",
                    anchor: "center",
                    width: BTN_WIDTH,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
            },
        },
    ]);
    const bgm = play("level", { loop: true, paused: true });
    if (g_MusicOn) bgm.paused = false;
};

export default LevelScene;
