import k from "../initKaboom";
import { g_StagePosX, g_StageWidth, g_SoundOn, g_MusicOn, setGameScene } from "../global";

const { add, sprite, pos, Color, drawRect, vec2, area, anchor, z, width, height, scale, camPos } = k;

export const settings = () => {
    setGameScene("settings");

    const currpos = camPos();
    const Y_POS = currpos.y - height() / 2;
    const TUTORIAL_Y_POS = 390 + Y_POS;
    const CREDITS_Y_POS = 480 + Y_POS;
    const MUSIC_Y_POS = 270 + Y_POS;
    const SOUND_Y_POS = 195 + Y_POS;
    const BUTTON_X_POS = width() / 2 + 120;
    const settingBgLayer = 10;
    const settingUILayer = 11;
    add([sprite("settingWindow"), "Modal", anchor("center"), area(), pos(width() / 2, Y_POS + 641 / 2), z(settingBgLayer)]);
    add([
        "Modal",
        pos(g_StagePosX, Y_POS),
        anchor("topleft"),
        z(settingBgLayer - 1),
        {
            draw(): void {
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
    add([sprite("close"), "Modal", anchor("center"), area(), pos(width() / 2 + 150, 50 + Y_POS), z(settingUILayer), "close"]);

    add([
        g_SoundOn ? sprite("sound_on") : sprite("sound_off"),
        "Modal",
        anchor("center"),
        area(),
        pos(BUTTON_X_POS, SOUND_Y_POS),
        z(settingUILayer),
        "sound_button",
        scale(1.2),
    ]);

    add([
        g_MusicOn ? sprite("music_on") : sprite("music_off"),
        "Modal",
        anchor("center"),
        area(),
        pos(BUTTON_X_POS, MUSIC_Y_POS),
        z(settingUILayer),
        "music_button",
        scale(1.2),
    ]);

    add([sprite("credits"), "Modal", anchor("center"), area(), pos(width() / 2, CREDITS_Y_POS), z(settingUILayer), "credits"]);
    add([sprite("tutorial"), "Modal", anchor("center"), area(), pos(width() / 2, TUTORIAL_Y_POS), z(settingUILayer), "tutorial"]);
};

export default settings;
