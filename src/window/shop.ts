import { GameObj } from "kaboom";
import k from "../initKaboom";
import { g_GameCoin } from "../global";
import { getGameItemCount, ITEM_TYPE, gameItem, IGameItem } from "../data/item";
import { g_StagePosX, g_StageHeight, g_StageWidth } from "../global";

const {
    add,
    sprite,
    pos,
    area,
    anchor,
    z,
    height,
    vec2,
    scale,
    drawText,
    Color,
    drawRect,
    rgb,
    drawSprite,
    camPos,
    onHoverUpdate,
    onHoverEnd,
    wave,
    time,
    setCursor,
} = k;

export const shop = () => {
    const currpos = camPos().y;
    const SHOP_Y_POS = currpos - height() / 2;
    const ITEM_Y_POS_DISTANCE = 150;
    const ITEM_Y_POS = SHOP_Y_POS + 230;

    const shopBgLayer = 10;
    const shopUILayer = 11;
    const shopActionLayer = 12;
    add([
        sprite("shopWindow"),
        "Modal",
        anchor("center"),
        area(),
        pos(g_StageWidth / 2 + g_StagePosX, SHOP_Y_POS + g_StageHeight / 2),
        z(shopBgLayer),
    ]);
    add([
        "Modal",
        pos(vec2(g_StagePosX, SHOP_Y_POS)),
        anchor("topleft"),
        z(shopBgLayer - 1),
        {
            draw(this: GameObj): void {
                drawRect({
                    width: g_StageWidth,
                    height: height(),
                    pos: vec2(0, 0),
                    anchor: "topleft",
                    color: Color.BLACK,
                    opacity: 0.8,
                });
            },
        },
    ]);
    add([
        sprite("close"),
        "Modal",
        anchor("center"),
        area(),
        pos(g_StageWidth / 2 + 150 + g_StagePosX, 50 + SHOP_Y_POS),
        z(shopUILayer),
        "close",
    ]);

    const addItem = (ItemName: string, price: number, Y_pos: number, ItemType: ITEM_TYPE) => {
        const ITEM_X_POS = g_StageWidth / 2 - 130 + g_StagePosX;
        const BUTTON_X_POS = g_StageWidth / 2 + 120 + g_StagePosX;
        add([
            sprite("buy"),
            "Modal",
            anchor("center"),
            area(),
            pos(BUTTON_X_POS, Y_pos),
            z(shopUILayer),
            "buy_button",
            "HoverCursor",
            ItemType,
        ]).add([
            "Modal",
            pos(vec2(0, 0)),
            anchor("center"),
            z(shopActionLayer),
            {
                isClicking: false,
                draw(this: GameObj): void {
                    drawText({
                        text: price.toString(),
                        pos: vec2(-10, 0),
                        size: 20,
                        align: "center",
                        anchor: "center",
                        width: 30,
                        font: "LilitaOne-Regular",
                        color: this.isClicking ? Color.RED : Color.YELLOW,
                    });
                },
            },
        ]);
        add([sprite("coin"), anchor("center"), area(), pos(BUTTON_X_POS + 18, Y_pos), z(shopActionLayer), "Modal", "BuyScaleUp", scale(0.6)]);
        add([sprite(ItemName), pos(ITEM_X_POS, Y_pos), anchor("center"), area(), z(shopUILayer), "Modal"]);
    };

    onHoverUpdate("BuyScaleUp", (obj: GameObj) => {
        if (!obj.isLock) obj.use(scale(wave(0.6, 1.2, time() * 10)));
    });

    onHoverEnd("BuyScaleUp", (obj: GameObj) => {
        obj.use(scale(0.6));
        setCursor("auto");
    });

    let distanceCount = 0;
    gameItem.forEach((item: IGameItem, key: ITEM_TYPE) => {
        addItem(item.name, item.price, ITEM_Y_POS + ITEM_Y_POS_DISTANCE * distanceCount, key);
        distanceCount++;
    });

    const COIN_RECT_WIDTH = 70;
    const COIN_RECT_HEIGHT = 20;
    const BTN_WIDTH = 50;
    const ITEM_Y_POS_BAR = 25 + SHOP_Y_POS;
    const ITEM_X_DISTANCE_BAR = BTN_WIDTH + 15;
    const ITEM_X_POS_BAR = 730 + g_StagePosX;
    add([
        pos(100 + g_StagePosX, ITEM_Y_POS_BAR),
        z(shopUILayer),
        anchor("center"),
        scale(1.5),
        "Modal",
        {
            draw(this: GameObj): void {
                drawRect({
                    width: COIN_RECT_WIDTH,
                    height: COIN_RECT_HEIGHT,
                    radius: 5,
                    anchor: "topleft",
                    pos: vec2(15, 7),

                    color: rgb(39, 14, 12),
                    outline: { color: Color.BLACK, width: 2 },
                });
                drawText({
                    text: g_GameCoin.toString(),
                    pos: vec2(15, 8),
                    size: 18,
                    align: "center",
                    width: COIN_RECT_WIDTH,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
                drawSprite({
                    sprite: "coin",
                    anchor: "topleft",
                    pos: vec2(0, 1),
                });
            },
        },
    ]);
    add([
        sprite("slowConBelt"),
        pos(ITEM_X_DISTANCE_BAR * 2 + ITEM_X_POS_BAR, ITEM_Y_POS_BAR),
        anchor("topleft"),
        scale(1),
        area(),
        "Modal",
        z(shopUILayer),
        {
            draw(this: GameObj): void {
                drawText({
                    text: getGameItemCount("IT_SLOW_CONBELT").toString(),
                    pos: vec2(0, this.height - 20),
                    size: 30,
                    align: "right",
                    width: BTN_WIDTH,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
            },
        },
    ]);

    add([
        sprite("autoClean"),
        pos(ITEM_X_DISTANCE_BAR + ITEM_X_POS_BAR, ITEM_Y_POS_BAR),
        anchor("topleft"),
        scale(1),
        area(),
        "Modal",
        z(shopUILayer),
        {
            draw(this: GameObj): void {
                drawText({
                    text: getGameItemCount("IT_AUTO_CLEAN").toString(),
                    pos: vec2(0, this.height - 20),
                    size: 30,
                    align: "right",
                    width: BTN_WIDTH,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
            },
        },
    ]);

    add([
        sprite("autoRecycle"),
        pos(ITEM_X_POS_BAR, ITEM_Y_POS_BAR),
        anchor("topleft"),
        scale(1),
        "Modal",
        area(),
        z(shopUILayer),
        {
            draw(this: GameObj): void {
                drawText({
                    text: getGameItemCount("IT_AUTO_RECYCLE").toString(),
                    pos: vec2(0, this.height - 20),
                    size: 30,
                    align: "right",
                    width: BTN_WIDTH,
                    font: "LilitaOne-Regular",
                    color: Color.WHITE,
                });
            },
        },
    ]);
};
