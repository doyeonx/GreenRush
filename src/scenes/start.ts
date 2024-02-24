import k from "../initKaboom";
import { LAYER } from "../definition";
import { blink } from "../components/util";
import { bkgScroll, coverStageOutside } from "../common/util";
import { g_StageHeight, g_StagePosX, g_StagePosY, g_StageWidth, setGameScene } from "../global";
import * as Cookies from "typescript-cookie";
import { GameObj } from "kaboom";

const {
    add,
    sprite,
    pos,
    area,
    opacity,
    lifespan,
    scale,
    fadeIn,
    anchor,
    center,
    text,
    z,
    onClick,
    go,
    play,
    drawMasked,
    drawText,
    drawRect,
    rect,
    Color,
    vec2,
    color,
} = k;

const StartScene = () => {
    setGameScene("start");
    coverStageOutside();

    add([sprite("startBkg05"), anchor("topleft"), "startBkg05", area(), pos(g_StagePosX, g_StagePosY), z(0)]);

    bkgScroll("startBkg01", 0, 0);
    bkgScroll("startBkg02", 0.8, 50);
    bkgScroll("startBkg03", 0.7, 40);
    bkgScroll("startBkg04", 0.6, 30);

    const title = add([
        sprite("gameTitle"),
        anchor("center"),
        opacity(),
        scale(1.5),
        fadeIn(1.5),
        pos(center().x, g_StagePosY + g_StageHeight * 0.3),
        z(LAYER.UI),
    ]);

    const tapToStart = add([
        text("TAP TO START", { size: 64, font: "LilitaOne-Regular" }),
        anchor("center"),
        pos(center().x, g_StagePosY + g_StageHeight * 0.7),
        opacity(1.0),
        blink(10),
        z(LAYER.UI),
    ]);

    onClick(() => {
        if (Cookies.getCookie("GR_ReadStory") == "true") {
            bgm.paused = true;
            go("level");
        } else {
            Cookies.setCookie("GR_ReadStory", "true");

            title.use(lifespan(0.3, { fade: 0.3 }));
            tapToStart.use(pos(center().x, g_StagePosY + g_StageHeight * 0.9));
            const STORY_BKG_WIDTH = 500;
            const STORY_BKG_HEIGHT = 450;
            const STORY_BKG_X_POS = g_StagePosX + (g_StageWidth - STORY_BKG_WIDTH) * 0.5;
            const STORY_BKG_Y_POS = g_StagePosY + g_StageHeight * 0.1;
            add([
                rect(STORY_BKG_WIDTH, STORY_BKG_HEIGHT, { radius: 30 }),
                anchor("topleft"),
                pos(STORY_BKG_X_POS, STORY_BKG_Y_POS),
                opacity(0.5),
                color(0, 0, 0),
                z(LAYER.UI),
            ]);
            add([
                anchor("topleft"),
                pos(STORY_BKG_X_POS + 50, STORY_BKG_Y_POS),
                opacity(1.0),
                fadeIn(1.0),
                z(LAYER.UI),
                {
                    textPosY: 380,
                    draw(this: GameObj): void {
                        drawMasked(
                            () => {
                                drawText({
                                    //pos: vec2(600, this.pos.y + this.textPosY),
                                    pos: vec2(0, this.textPosY),
                                    anchor: "topleft",
                                    text: "In 2030, Earth is in an apocalypse due to resource depletion and pollution. Garbage fills the world, threatening humanity. To fight this crisis, the government sends special agents like you to recycle waste. You have to purify waste and correctly recycle all the waste. Your missions is to clean pollution and restore nature by recycling all the trash. Continue to work towards making a greener world and you will receive the title 'Environmental Agent: Hero of Recycling'",
                                    size: 14,
                                    align: "center",
                                    width: 400,
                                    font: "pcsenior",
                                    lineSpacing: 10,
                                    color: Color.WHITE,
                                });
                            },
                            () => {
                                drawRect({ width: 500, height: 450, radius: 30 });
                            }
                        );
                    },
                    update(this: GameObj): void {
                        if (this.textPosY < -450) {
                            bgm.paused = true;
                            go("level");
                        }
                        textposy: this.textPosY -= 0.5;
                    },
                },
            ]);
        }
    });

    Cookies.setCookie("GR_ReadStory", "false");
    const bgm = play("start", { loop: true });
};

export default StartScene;
