import k, { getPageHeight, getPageWidth } from "../initKaboom";
import { LAYER } from "../definition";
import {} from "kaboom";
import { g_GameScene, g_OSType, g_PageHeight, g_PageWidth, g_StageHeight, g_StagePosY, setGameScene } from "../global";

const { add, sprite, pos, opacity, scale, fadeIn, anchor, center, text, z, onClick, go, color } = k;

let mobilePotrait: boolean = (g_OSType == "OT_ANDROID" || g_OSType == "OT_IOS") && g_PageHeight > g_PageWidth;

const IntroScene = () => {
    setGameScene("intro");

    if (mobilePotrait) {
        //스마트폰 세로모드인 경우
        add([sprite("gameTitle2"), anchor("center"), scale(1.0), pos(center().x, g_StagePosY), z(LAYER.UI)])
            .add([
                text("Rotate your phone.", { size: 45, font: "LilitaOne-Regular" }),
                anchor("center"),
                pos(0, 80),
                opacity(1.0),
                color(255, 255, 200),
                z(LAYER.UI),
            ])
            .add([sprite("rotatePhone", { anim: "rotating", animSpeed: 10 }), anchor("center"), scale(3.0), pos(0, 300), z(LAYER.UI)]);
    } else {
        add([sprite("gameTitle2"), anchor("center"), scale(1.0), pos(center().x, g_StagePosY + g_StageHeight * 0.3), z(LAYER.UI)])
            .add([
                text("Bin less, recycle more.", { size: 32, font: "LilitaOne-Regular" }),
                anchor("center"),
                pos(0, 80),
                opacity(1.0),
                color(255, 255, 200),
                z(LAYER.UI),
            ])
            .add([sprite("playStart"), anchor("center"), opacity(), scale(0.5), fadeIn(1.5), pos(0, 100), z(LAYER.UI)]);
    }

    onClick(() => {
        if (!mobilePotrait) go("start");
    });
};

window.onresize = function () {
    if (g_GameScene == "intro" && mobilePotrait && (g_OSType == "OT_ANDROID" || g_OSType == "OT_IOS")) {
        if (getPageWidth() > getPageHeight()) {
            location.reload();
        }
    }
};

export default IntroScene;
