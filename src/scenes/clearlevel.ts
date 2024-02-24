import k from "../initKaboom";
import { LAYER } from "../definition";
import { blink } from "../components/util";
import { GameObj, Vec2 } from "kaboom";
import { stageInfo } from "../data/stage";
import { g_StarCounts, getStageCoin, getDPoint, incGameCoin, setStageCoin, incDPoint, incGPoint, setGameScene, saveProgress } from "../global";

const {
    add,
    sprite,
    pos,
    opacity,
    area,
    scale,
    text,
    fadeIn,
    anchor,
    onClick,
    z,
    go,
    center,
    setGravity,
    rect,
    play,
    vec2,
    loop,
    rgb,
    move,
    body,
    lifespan,
} = k;

import { g_StagePosX, g_StagePosY, g_StageWidth, g_StageHeight } from "../global";
import { bkgScroll, coverStageOutside } from "../common/util";

const ITEM_SCALE: number = 1;
const ITEM_DIRECTION: number = 0;

interface ItopItems {
    sprite: string;
    pos: Vec2;
    scale: number;
}

interface IshowerItems {
    limit: number;
    itemPlay: boolean;
    text: {
        writing: string;
        pos: Vec2;
    };
    showerItem: {
        pos: Vec2;
        sprite: string;
        scale: number;
        direction: number;
        speed: number;
    };
}

const topItems: ItopItems[] = [
    {
        sprite: "coin",
        pos: vec2(g_StagePosX + g_StageWidth * 0.9, g_StagePosY + g_StageHeight * 0.05),
        scale: ITEM_SCALE,
    },
    {
        sprite: "slowConBelt",
        pos: vec2(g_StagePosX + g_StageWidth * 0.85, g_StagePosY + g_StageHeight * 0.05),
        scale: ITEM_SCALE,
    },
    {
        sprite: "autoClean",
        pos: vec2(g_StagePosX + g_StageWidth * 0.8, g_StagePosY + g_StageHeight * 0.05),
        scale: ITEM_SCALE,
    },
    {
        sprite: "autoRecycle",
        pos: vec2(g_StagePosX + g_StageWidth * 0.75, g_StagePosY + g_StageHeight * 0.05),
        scale: ITEM_SCALE,
    },
];

const ClearLevelScene = (stage: number) => {
    setGameScene("clearLevel");

    let percentage: number = getDPoint() / stageInfo[stage].dPoint;
    let starSprite: string = "level1Star";
    console.log(stage);

    percentage <= 0.1 ? (starSprite = "level3Star") : percentage <= 0.4 && (starSprite = "level2Star");
    let showerItems: IshowerItems[] = [
        {
            limit: getStageCoin() * Number(starSprite[5]),
            itemPlay: true,
            text: {
                writing: "0",
                pos: vec2(g_StagePosX + g_StageWidth * 0.95, g_StagePosY + g_StageHeight * 0.05),
            },
            showerItem: {
                pos: vec2(center().x, center().y),
                sprite: "coin",
                scale: ITEM_SCALE,
                direction: ITEM_DIRECTION,
                speed: 330,
            },
        },
        {
            limit: 3,
            itemPlay: true,
            text: {
                writing: "0",
                pos: vec2(g_StagePosX + g_StageWidth * 0.85, g_StagePosY + g_StageHeight * 0.08),
            },
            showerItem: {
                pos: vec2(center().x, center().y),
                sprite: "slowConBelt",
                scale: ITEM_SCALE,
                direction: ITEM_DIRECTION,
                speed: 300,
            },
        },
        {
            limit: 3,
            itemPlay: true,
            text: {
                writing: "0",
                pos: vec2(g_StagePosX + g_StageWidth * 0.8, g_StagePosY + g_StageHeight * 0.08),
            },
            showerItem: {
                pos: vec2(center().x, center().y),
                sprite: "autoClean",
                scale: ITEM_SCALE,
                direction: ITEM_DIRECTION,
                speed: 270,
            },
        },
        {
            limit: 3,
            itemPlay: true,
            text: {
                writing: "0",
                pos: vec2(g_StagePosX + g_StageWidth * 0.75, g_StagePosY + g_StageHeight * 0.08),
            },
            showerItem: {
                pos: vec2(center().x, center().y),
                sprite: "autoRecycle",
                scale: ITEM_SCALE,
                direction: ITEM_DIRECTION,
                speed: 240,
            },
        },
    ];

    coverStageOutside();

    add([sprite("startBkg05"), anchor("topleft"), "startBkg05", area(), pos(g_StagePosX, g_StagePosY), z(0)]);

    bkgScroll("startBkg01", 0, 0);
    bkgScroll("startBkg02", 0.8, 50);
    bkgScroll("startBkg03", 0.7, 40);
    bkgScroll("startBkg04", 0.6, 30);

    // star sprite & stage Cleared UI
    add([
        sprite(starSprite),
        anchor("center"),
        opacity(),
        scale(1.5),
        fadeIn(1),
        pos(center().x, g_StagePosY + g_StageHeight * 0.2),
        z(LAYER.UI),
        "clearlevelTitle",
        area(),
    ]);

    const stageCleared = add([
        sprite("stageCleared"),
        pos(center().x, g_StagePosY + g_StageHeight * 0.55),
        anchor("center"),
        z(LAYER.UI),
        "stageCleared",
    ]);

    stageCleared.play("stageCleared", {
        speed: 30,
    });

    add([
        text("TAP TO NEXT LEVEL", { size: 64, font: "LilitaOne-Regular" }),
        anchor("center"),
        pos(center().x, g_StagePosY + g_StageHeight * 0.8),
        opacity(1.0),
        blink(10),
        z(LAYER.UI),
    ]);

    // top items UI
    topItems.forEach((item) => {
        add([sprite(item.sprite), anchor("center"), pos(item.pos), scale(item.scale), z(LAYER.UI), `${item.sprite}`]);
    });

    add([
        rect(80, 20),
        pos(g_StagePosX + g_StageWidth * 0.9, g_StagePosY + g_StageHeight * 0.05),
        anchor("left"),
        {
            color: rgb(39, 14, 12),
            outline: { color: rgb(0, 0, 0), width: 2 },
        },
    ]);

    // shower event
    setGravity(-400);
    showerItems.forEach((item) => {
        let count: number = 0;

        let itemText: GameObj = add([
            text(`${item.text.writing}`, { size: 20, font: "LilitaOne-Regular" }),
            anchor("center"),
            pos(item.text.pos),
            z(LAYER.UI),
        ]);

        if (item.itemPlay == true) {
            let shower = loop(0.1, () => {
                if (count >= item.limit - 1) shower.cancel();
                add([
                    sprite(item.showerItem.sprite),
                    pos(item.showerItem.pos),
                    scale(item.showerItem.scale),
                    move(item.showerItem.direction, item.showerItem.speed),
                    anchor("center"),
                    area({ collisionIgnore: ["coin"] }),
                    body(),
                    lifespan(1, { fade: 0.5 }),
                    opacity(1),
                    lifespan(1, { fade: 0.1 }),
                    z(LAYER.UI),
                    `${item.showerItem.sprite}`,
                ]);

                count++;

                itemText.destroy();

                itemText = add([text(`${count}`, { size: 20, font: "LilitaOne-Regular" }), anchor("center"), pos(item.text.pos), z(LAYER.UI)]);
            });
        }
    });

    const bgm = play("stageClear", { loop: true });
    onClick(() => {
        incGameCoin(getStageCoin() * Number(starSprite[5]));
        incDPoint(3);
        incGPoint(3);
        setStageCoin(0);
        bgm.paused = true;
        g_StarCounts[stage] = starSprite;
        saveProgress();
        go("level");
    });
};

export default ClearLevelScene;
