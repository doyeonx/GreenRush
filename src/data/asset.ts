import k from "../initKaboom";

const { loadFont, loadSprite, loadSpriteAtlas, loadSound } = k;

export const loadGameAsset = () => {
    loadFont("LilitaOne-Regular", "font/LilitaOne-Regular.ttf", { outline: 2 });
    loadFont("pcsenior", "font/pcsenior.ttf", { outline: 1 });

    loadSprite("bkgM01", "image/bkgM01.png");
    loadSprite("bkgM02", "image/bkgM02.png");
    loadSprite("bkgM03", "image/bkgM03.png");
    loadSprite("bkgM04", "image/bkgM04.png");
    loadSprite("bkgM05", "image/bkgM05.png");
    loadSprite("bkgM06", "image/bkgM06.png");
    loadSprite("bkgM07", "image/bkgM07.png");
    loadSprite("bkgB01", "image/bkgB01.png");
    loadSprite("bkgB02", "image/bkgB02.png");
    loadSprite("bkgB03", "image/bkgB03.png");
    loadSprite("bkgB04", "image/bkgB04.png");
    loadSprite("bkgB05", "image/bkgB05.png");
    loadSprite("bkgB06", "image/bkgB06.png");
    loadSprite("bkgB07", "image/bkgB07.png");
    loadSprite("cogs01", "image/cogs01.png");
    loadSprite("rb01", "image/rb01.png");
    loadSprite("rb02", "image/rb02.png");
    loadSprite("rb03", "image/rb03.png");
    loadSprite("rb04", "image/rb04.png");
    loadSprite("rb05", "image/rb05.png");
    loadSprite("rb06", "image/rb06.png");
    loadSprite("rb07", "image/rb07.png");
    loadSprite("rb08", "image/rb08.png");
    loadSprite("rb09", "image/rb09.png");
    loadSprite("rb10", "image/rb10.png");
    loadSprite("rb11", "image/rb11.png");

    loadSprite("plastic01", "image/recycle/plastic01.png");
    loadSprite("plastic01_p", "image/recycle/plastic01_p.png");
    loadSprite("plastic02", "image/recycle/plastic02.png");
    loadSprite("plastic02_p", "image/recycle/plastic02_p.png");
    loadSprite("plastic03", "image/recycle/plastic03.png");
    loadSprite("plastic03_p", "image/recycle/plastic03_p.png");
    loadSprite("plastic04", "image/recycle/plastic04.png");
    loadSprite("plastic04_p", "image/recycle/plastic04_p.png");
    loadSprite("cloth01", "image/recycle/cloth01.png");
    loadSprite("cloth01_p", "image/recycle/cloth01_p.png");
    loadSprite("foodwaste01", "image/recycle/foodwaste01.png");
    loadSprite("foodwaste01_p", "image/recycle/foodwaste01_p.png");
    loadSprite("vinyl01", "image/recycle/vinyl01.png");
    loadSprite("vinyl01_p", "image/recycle/vinyl01_p.png");
    loadSprite("can01", "image/recycle/can01.png");
    loadSprite("can01_p", "image/recycle/can01_p.png");
    loadSprite("can02", "image/recycle/can02.png");
    loadSprite("can02_p", "image/recycle/can02_p.png");
    loadSprite("paper01", "image/recycle/paper01.png");
    loadSprite("paper01_p", "image/recycle/paper01_p.png");
    loadSprite("paper02", "image/recycle/paper02.png");
    loadSprite("paper02_p", "image/recycle/paper02_p.png");
    loadSprite("glass01", "image/recycle/glass01.png");
    loadSprite("glass01_p", "image/recycle/glass01_p.png");
    loadSprite("hand", "image/hand.png");
    loadSprite("handAR", "image/hand_AR.png");
    loadSprite("handAC", "image/hand_AC.png");
    loadSprite("handARC", "image/hand_ARC.png");

    loadSprite("GPoint", "image/GPoint.png");
    loadSprite("DPoint", "image/DPoint.png");
    loadSprite("PPoint", "image/PPoint.png");
    loadSprite("coin", "image/coin.png");
    loadSprite("setting", "image/button/setting.png");
    loadSprite("incinerator", "image/incinerator.png");

    loadSprite("autoRecycle", "image/button/autoRecycle.png");
    loadSprite("autoRecycleOn", "image/button/autoRecycleOn.png");
    loadSprite("autoClean", "image/button/autoClean.png");
    loadSprite("autoCleanOn", "image/button/autoCleanOn.png");
    loadSprite("slowConBelt", "image/button/slowConBelt.png");
    loadSprite("slowConBeltOn", "image/button/slowConBeltOn.png");

    loadSprite("setting", "image/button/setting.png");
    loadSprite("menu", "image/button/menu.png");
    loadSprite("shop", "image/button/shop.png");
    loadSprite("close", "image/button/close.png");
    loadSprite("pause", "image/button/pause.png");
    loadSprite("play", "image/button/play.png");
    loadSprite("fullscreen", "image/button/fullscreen.png");

    loadSprite("startBkg01", "image/startBkg01.png");
    loadSprite("startBkg02", "image/startBkg02.png");
    loadSprite("startBkg03", "image/startBkg03.png");
    loadSprite("startBkg04", "image/startBkg04.png");
    loadSprite("startBkg05", "image/startBkg05.png");
    loadSprite("gameTitle", "image/gameTitle.png");
    loadSprite("gameTitle2", "image/gameTitle2.png");
    loadSprite("gameOver", "image/gameOver.png");

    loadSprite("levelBkg1", "image/LevelMap/levelBkg1.png");
    loadSprite("levelBkg2", "image/LevelMap/levelBkg2.png");
    loadSprite("levelBkg3", "image/LevelMap/levelBkg3.png");
    loadSprite("levelBkg4", "image/LevelMap/levelBkg4.png");
    loadSprite("levelBkg5", "image/LevelMap/levelBkg5.png");
    loadSprite("levelBkg6", "image/LevelMap/levelBkg6.png");
    loadSprite("levelBkg7", "image/LevelMap/levelBkg7.png");
    loadSprite("levelBkg8", "image/LevelMap/levelBkg8.png");
    loadSprite("levelBkg9", "image/LevelMap/levelBkg9.png");
    loadSprite("road", "image/LevelMap/road.png");
    loadSprite("level0Star", "image/LevelMap/levelButton/zeroStars.png");
    loadSprite("level1Star", "image/LevelMap/levelButton/oneStars.png");
    loadSprite("level2Star", "image/LevelMap/levelButton/twoStars.png");
    loadSprite("level3Star", "image/LevelMap/levelButton/threeStars.png");
    loadSprite("levelLock", "image/LevelMap/levelButton/locked.png");
    loadSprite("numberBkg", "image/LevelMap/levelButton/numberBkg.png");

    loadSprite("settingWindow", "image/settingWindow.png");
    loadSprite("shopWindow", "image/shopWindow.png");
    loadSprite("sound_on", "image/button/sound_on.png");
    loadSprite("sound_off", "image/button/sound_off.png");
    loadSprite("music_on", "image/button/music_on.png");
    loadSprite("music_off", "image/button/music_off.png");
    loadSprite("tutorial", "image/button/tutorial.png");
    loadSprite("credits", "image/button/credits.png");
    loadSprite("buy", "image/button/buy.png");
    loadSprite("playStart", "image/button/playStart.png");
    loadSprite("quit", "image/button/quit.png");
    loadSprite("restart", "image/button/restart.png");

    loadSprite("portal", "image/portal.png");
    //loadSprite("rotatePhone", "image/retatePhone.png");

    loadSpriteAtlas("image/transport.png", {
        transport: {
            x: 0,
            y: 0,
            width: 852,
            height: 480,
            sliceX: 4,
            sliceY: 4,
            anims: { move: { from: 0, to: 12, loop: false } },
        },
    });

    loadSpriteAtlas("image/conBeltR.png", {
        conBeltR: {
            x: 0,
            y: 0,
            width: 1840,
            height: 220,
            sliceX: 5,
            anims: { move: { from: 0, to: 4, loop: true } },
        },
    });

    loadSpriteAtlas("image/conBeltL.png", {
        conBeltL: {
            x: 0,
            y: 0,
            width: 1840,
            height: 220,
            sliceX: 5,
            anims: { move: { from: 0, to: 4, loop: true } },
        },
    });

    loadSpriteAtlas("image/mice.png", {
        mice: {
            x: 0,
            y: 0,
            width: 240,
            height: 30,
            sliceX: 4,
            anims: { move: { from: 0, to: 3, loop: true } },
        },
    });

    loadSpriteAtlas("image/thunder.png", {
        thunder: {
            x: 0,
            y: 0,
            width: 2000,
            height: 400,
            sliceX: 10,
            sliceY: 2,
            anims: { lightning: { from: 0, to: 14, loop: false } },
        },
    });

    loadSpriteAtlas("image/rain01.png", {
        rain01: {
            x: 0,
            y: 0,
            width: 1600,
            height: 200,
            sliceX: 8,
            anims: { rainning: { from: 0, to: 7, loop: false } },
        },
    });

    loadSpriteAtlas("image/rain02.png", {
        rain02: {
            x: 0,
            y: 0,
            width: 512,
            height: 128,
            sliceX: 8,
            anims: { rainning: { from: 0, to: 7, loop: false } },
        },
    });

    loadSpriteAtlas("image/recycleSign_100.png", {
        recycleSign100: {
            x: 0,
            y: 0,
            width: 1500,
            height: 450,
            sliceX: 10,
            sliceY: 3,
            anims: { recycle: { from: 0, to: 22, loop: false } },
        },
    });

    loadSpriteAtlas("image/recycleSign_50.png", {
        recycleSign50: {
            x: 0,
            y: 0,
            width: 1500,
            height: 450,
            sliceX: 10,
            sliceY: 3,
            anims: { recycle: { from: 0, to: 22, loop: false } },
        },
    });

    loadSpriteAtlas("image/hazardSign.png", {
        hazardSign: {
            x: 0,
            y: 0,
            width: 1500,
            height: 450,
            sliceX: 10,
            sliceY: 3,
            anims: { hazard: { from: 0, to: 22, loop: false } },
        },
    });

    loadSpriteAtlas("image/cleaner.png", {
        cleaner: {
            x: 0,
            y: 0,
            width: 2000,
            height: 750,
            sliceX: 10,
            sliceY: 3,
            anims: { normal: { from: 0, to: 3, loop: true }, cleaning: { from: 4, to: 22, loop: true } },
        },
    });

    loadSpriteAtlas("image/fire.png", {
        fire: {
            x: 0,
            y: 0,
            width: 1600,
            height: 200,
            sliceX: 10,
            sliceY: 2,
            anims: { fire: { from: 0, to: 19, loop: true } },
        },
    });

    loadSpriteAtlas("image/stageCleared.png", {
        stageCleared: {
            x: 0,
            y: 0,
            width: 1800,
            height: 973,
            sliceX: 6,
            sliceY: 7,
            anims: { stageCleared: { from: 0, to: 39, loop: false } },
        },
    });

    loadSpriteAtlas("image/portal.png", {
        portal: {
            x: 0,
            y: 0,
            width: 588,
            height: 114,
            sliceX: 7,
            sliceY: 1,
            anims: { teleport: { from: 0, to: 6, loop: false } },
        },
    });

    loadSpriteAtlas("image/rotatePhone.png", {
        rotatePhone: {
            x: 0,
            y: 0,
            width: 1500,
            height: 1200,
            sliceX: 10,
            sliceY: 8,
            anims: { rotating: { from: 0, to: 70, loop: true } },
        },
    });

    loadSpriteAtlas("image/tutorial_cleaner.png", {
        tutorialCleaner: {
            x: 0,
            y: 0,
            width: 1600,
            height: 1210,
            sliceX: 5,
            sliceY: 5,
            anims: { cleaner: { from: 0, to: 20, loop: true } },
        },
    });

    loadSpriteAtlas("image/tutorial_drag.png", {
        tutorialDrag: {
            x: 0,
            y: 0,
            width: 1600,
            height: 744,
            sliceX: 5,
            sliceY: 4,
            anims: { drag: { from: 0, to: 16, loop: true } },
        },
    });

    loadSound("start", "sound/start.mp3");
    loadSound("level", "sound/level.mp3");
    loadSound("gameOver", "sound/gameOver.mp3");
    loadSound("stageClear", "sound/stageClear.mp3");
    loadSound("bgm01", "sound/bgm01.mp3");
    loadSound("bgm02", "sound/bgm02.mp3");
    loadSound("bgm03", "sound/bgm03.mp3");
    loadSound("bgm04", "sound/bgm04.mp3");
    loadSound("bgm05", "sound/bgm05.mp3");
    loadSound("dpoint1", "sound/dpoint1.mp3");
    loadSound("dpoint3", "sound/dpoint3.mp3");
    loadSound("gpoint1", "sound/gpoint1.mp3");
    loadSound("gpoint2", "sound/gpoint2.mp3");
    loadSound("burn", "sound/burn.mp3");
    loadSound("thunder", "sound/thunder.mp3");
    loadSound("cleaning", "sound/cleaning.mp3");
};
