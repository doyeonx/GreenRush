import k from "../initKaboom";
import { Vec2 } from "kaboom";
import { moving } from "../components/util";
import { LAYER } from "../definition";
import { RANDOM_EFFECT, stageInfo } from "../data/stage";
import { g_StagePosX, g_StagePosY, g_StageWidth } from "../global";

const { sprite, add, pos, area, z, anchor, loop, vec2, choose, chance, randi, offscreen, wait, play } = k;

let isRainning: boolean = false;

export const startRandomEffect = (stage: number, randomEffect: RANDOM_EFFECT[]) => {
    const windowPos: Vec2[] = [
        vec2(g_StagePosX + 20, g_StagePosY + 30),
        vec2(g_StagePosX + 250, g_StagePosY + 30),
        vec2(g_StagePosX + 500, g_StagePosY + 30),
        vec2(g_StagePosX + 760, g_StagePosY + 30),
    ];

    if (randomEffect.includes("RE_RAIN")) {
        //비오는 효과
        loop(5, () => {
            if (isRainning == false) {
                const rainningTime = randi(10, 15);
                windowPos.forEach((wp: Vec2) => {
                    const weatherEffect = add([sprite("rain01"), pos(wp.x, wp.y), anchor("topleft"), z(LAYER.OUTDOOR), "rain01"]);
                    isRainning = true;
                    weatherEffect.play("rainning", { speed: 10, loop: true });
                    wait(rainningTime, () => {
                        weatherEffect.destroy();
                        isRainning = false;
                    });
                });
            }
        });
    }

    if (randomEffect.includes("RE_THUNDER")) {
        //번개 치는 효과
        loop(3, () => {
            if (chance(0.5)) {
                const wp: Vec2 = choose(windowPos);
                const weatherEffect = add([sprite("thunder"), pos(wp.x, wp.y), z(LAYER.OUTDOOR), "thunder"]);
                weatherEffect.play("lightning", {
                    speed: 10,
                    onEnd: () => weatherEffect.destroy(),
                });

                play("thunder");
            }
        });
    }

    if (randomEffect.includes("RE_MICE")) {
        //생쥐 이동
        loop(3, () => {
            if (chance(0.7)) {
                const dir: string = choose(["MOVE_RIGHT", "MOVE_LEFT"]);

                let yPosMin = 300;
                let yPosMax = 510;
                if (stageInfo[stage].bkgMainImage == "bkgM02" || stageInfo[stage].bkgMainImage == "bkgM06") {
                    yPosMin = 470;
                    yPosMax = 550;
                } else if (stageInfo[stage].bkgMainImage == "bkgM05") {
                    yPosMin = 440;
                    yPosMax = 550;
                }

                if (dir == "MOVE_RIGHT") {
                    const startPos = vec2(g_StagePosX, g_StagePosY + randi(yPosMin, yPosMax));

                    add([
                        sprite("mice", { anim: "move", animSpeed: 18 }),
                        pos(startPos.x, startPos.y),
                        area(),
                        moving(200, 0),
                        offscreen({ destroy: true }),
                        z(LAYER.BG),
                        "Mice",
                    ]);
                } else {
                    const startPos = vec2(g_StagePosX + g_StageWidth, g_StagePosY + randi(yPosMin, yPosMax));

                    add([
                        sprite("mice", { anim: "move", animSpeed: 18 }),
                        pos(startPos.x, startPos.y),
                        area(),
                        moving(-200, 0),
                        offscreen({ destroy: true }),
                        z(LAYER.BG),
                        "Mice",
                    ]).flipX = true;
                }
            }
        });
    }
};
