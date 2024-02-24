import k from "../initKaboom";
import { EventController, GameObj, Vec2 } from "kaboom";
import { mouseMove, scaleUpDown, progressBar } from "../components/util";
import { movePath } from "../components/movePath";
import {
    stageInfo,
    initConBeltSpeed,
    setConBeltSpeed,
    restoreConBeltSpeed,
    retoreConbeltLoopInterval,
    initWayPoint,
    IConBeltInfo,
} from "../data/stage";
import { recycleInfo, recycleStatus, IRecycleStatus, IRecycleInfo } from "../data/recycle";
import { startRandomEffect } from "../common/randomEffect";
import { drawGameUI } from "../drawGameUI";
import { LAYER, GAME_STATE, IRect } from "../definition";
import { ITEM_TYPE, getGameItemCount, setGameItemCount } from "../data/item";
import {
    getDPoint,
    incGPoint,
    incStageCoin,
    incDPoint,
    getGPoint,
    g_SoundOn,
    g_MusicOn,
    setSoundOn,
    g_StagePosX,
    g_StagePosY,
    g_StageWidth,
    g_StageHeight,
    g_StageScale,
    setStageCoin,
    setGPoint,
    setDPoint,
} from "../global";
import { coverStageOutside, playMusic, playSound, playSound_audio } from "../common/util";

const {
    add,
    sprite,
    pos,
    area,
    rotate,
    vec2,
    scale,
    anchor,
    width,
    height,
    z,
    loop,
    choose,
    setCursor,
    mousePos,
    onUpdate,
    onCollide,
    onMousePress,
    onMouseRelease,
    onClick,
    get,
    chance,
    testRectPoint,
    lifespan,
    go,
    timer,
    rgb,
    opacity,
    wait,
    play,
    setBackground,
    onKeyPress,
    setFullscreen,
    isFullscreen,
    onTouchStart,
    testRectRect,
    isTouchscreen,
    Rect,
    color,
    outline,
    rect,
    drawText,
    drawSprite,
} = k;

const GameScene = (stage: number) => {
    const RB_WIDTH = 150;
    const RB_HEIGHT = 70;
    const DPOINT_ICON_WIDTH = 30;
    const GPOINT_ICON_WIDTH = 30;
    const ITEM_AUTO_CLEAN_TIME = 3;
    const ITEM_AUTO_RECYCLE_TIME = 3;
    const ITEM_SLOW_CONBELT_TIME = 3;
    const ITEM_PROGRESS_BAR_COLOR = rgb(252, 176, 78);
    const TUTORIAL_BKG_WIDTH = 600;
    const TUTORIAL_BKG_HEIGHT = 450;
    const STORY_BKG_X_POS = g_StagePosX + (g_StageWidth - TUTORIAL_BKG_WIDTH) * 0.5;
    const STORY_BKG_Y_POS = g_StagePosY + g_StageHeight * 0.1;

    let isDragging: boolean = false;
    let dragSprite: GameObj;
    let isCleaning: boolean = false;

    let gameState: GAME_STATE = "GS_READY";
    let oldGameState: GAME_STATE;

    let isAutoRecycle: boolean = false;
    let isAutoClean: boolean = false;
    let isSlowConBelt: boolean = false;
    let canDrawSetting: boolean = true;

    let currentTutorialPage: number = 0;

    setGPoint(0);
    setDPoint(0);
    setStageCoin(0);

    let stageRecycles: IRecycleInfo[] = recycleInfo.filter((info: IRecycleInfo): boolean => {
        return stageInfo[stage].recycleBinInfo.find((binInfo: IRecycleInfo) => binInfo.type == info.type) != undefined;
    });

    const startRecycling = (conBelt: IConBeltInfo, index: number): EventController => {
        return loop(conBelt.loopInterval, () => {
            if (gameState == "GS_GAMEOVER") return;

            if (!conBelt.isGenerator) return;
            if (!isSlowConBelt) {
                conBelt.speed = conBelt.speed + 5;
                conBelt.oldSpeed = conBelt.speed;
            }

            const info = { ...choose(stageRecycles) };
            //const status = { ...choose(recycleStatus) };
            let status: IRecycleStatus;
            if (chance(0.7)) {
                if (chance(0.7)) status = { ...recycleStatus[1] };
                else status = { ...recycleStatus[2] };
            } else status = { ...recycleStatus[0] };

            let recycle: GameObj = add([
                sprite(info.name),
                scale(0.8),
                pos(conBelt.wayPoints[0]),
                area(),
                rotate(0),
                opacity(1),
                anchor("bot"),
                movePath(conBelt.wayPoints, conBelt.speed, false, false, false),
                drag(),
                z(LAYER.ITEM_1),
                "Recycle",
                {
                    info: info,
                    status: status,
                    conBeltIndex: index,
                    incineratorIndex: stageInfo[stage].conBeltInfo[index].incinerator,
                },
            ]);

            if (status.type != "RS_NORMAL") {
                if (status.type == "RS_POLLUTED") recycle.use(sprite(info.name + "_p"));
                recycle.add([sprite(status.name), scale(1.0), pos(0, -recycle.height), anchor("bot"), scaleUpDown(), z(LAYER.ITEM_3)]);
            }

            recycle.moveStart(conBelt.speed);

            recycle.onDrag(() => {
                recycle.movePause();
            });

            recycle.onDragUpdate(() => {
                if (recycle.status.type == "RS_POLLUTED") {
                    if (isCleaning) {
                        //cleaner 를 벗어난 경우
                        if (testRectRect(cleaner.worldArea().bbox(), recycle.worldArea().bbox()) == false) {
                            get("Cleaning").forEach((obj) => obj.destroy());

                            cleaner.play("normal");
                            playSound_audio(cleaningSound, false);
                            isCleaning = false;
                        }
                    } else {
                        if (testRectRect(cleaner.worldArea().bbox(), recycle.worldArea().bbox())) {
                            const cleaningProgressBar = add([
                                pos(cleaner.pos.x, cleaner.pos.y + cleaner.worldArea().bbox().height + 10),
                                progressBar(0.5, 100, 20, rgb(15, 35, 61), rgb(255, 220, 48)),
                                timer(),
                                z(LAYER.ACTION),
                                "Cleaning",
                            ]);

                            cleaningProgressBar.onProgressEnd(() => {
                                cleaningProgressBar.destroy();
                                recycle.status.type = "RS_NORMAL";
                                recycle.use(sprite(recycle.info.name));
                                recycle.children[0].destroy();

                                cleaner.play("normal");
                                playSound_audio(cleaningSound, false);
                                isCleaning = false;
                            });

                            cleaner.play("cleaning");
                            playSound_audio(cleaningSound, true);
                            isCleaning = true;
                        }
                    }
                }
            });

            recycle.onDragEnd(() => {
                if (isCleaning) {
                    get("Cleaning").forEach((obj) => obj.destroy());
                    isCleaning = false;
                }

                dragSprite.destroy();

                console.log("Recycle " + recycle.id + " :" + recycle.worldArea().bbox());
                get("RecycleBin").forEach((bin: GameObj) => {
                    console.log("RecycleBin " + bin.id + " :" + bin.worldArea().bbox());
                });

                const recycleBin: GameObj | undefined = get("RecycleBin").find((recycleBin: GameObj) =>
                    testRectRect(recycleBin.worldArea().bbox(), recycle.worldArea().bbox())
                );

                if (isAutoRecycle) {
                    autoRecycle(recycle);
                } else {
                    if (recycleBin == undefined) {
                        //쓰레기를 아무 곳에 떨어뜨린 경우
                        recycleResult(false, -1, recycle.incineratorIndex, recycle.status.type == "RS_POLLUTED" ? 3 : 1);
                    } else {
                        //쓰레기를 재활용통에 떨어뜨린 경우
                        //코인 쓰레기인 경우
                        if (recycle.status.type == "RS_COIN") incStageCoin(1);

                        //오염된 쓰레기인 경우
                        if (recycle.status.type == "RS_POLLUTED") {
                            recycleResult(false, recycleBin.index, recycle.incineratorIndex, recycleBin.info.type == recycle.info.type ? 1 : 2);
                        } else {
                            recycleResult(true, recycleBin.index, recycle.incineratorIndex, recycleBin.info.type == recycle.info.type ? 2 : 1);
                        }
                    }
                }
            });

            recycle.onMoveEnd((endAction: boolean) => {
                if (endAction) recycleResult(false, -1, recycle.incineratorIndex, recycle.status.type == "RS_POLLUTED" ? 3 : 1);
                else {
                    const conBelt = stageInfo[stage].conBeltInfo[recycle.conBeltIndex];
                    if (conBelt.connectedConBelt == -1) {
                        recycle.use(movePath(conBelt.dropCurvePoints, conBelt.speed, true, true, true));
                        recycle.moveStart(conBelt.speed);

                        //const time = conBelt.dropCurveLength / recycle.speed;
                        //recycle.fadeOut(time);
                    } else {
                        recycle.conBeltIndex = conBelt.connectedConBelt;
                        recycle.use(pos(stageInfo[stage].conBeltInfo[conBelt.connectedConBelt].wayPoints[0]));
                        recycle.use(
                            movePath(stageInfo[stage].conBeltInfo[conBelt.connectedConBelt].wayPoints, conBelt.speed, false, false, false)
                        );
                        recycle.moveStart(conBelt.speed);
                    }
                }
            });
        });
    };

    const pauseGame = () => {
        const objList: GameObj[] = get("*");

        objList.forEach((obj) => {
            obj.is("Background") || obj.is("Hand") || obj.is("Modal") ? (obj.paused = false) : (obj.paused = true);
        });

        oldGameState = gameState;
        gameState = "GS_PAUSE";
    };

    const resumeGame = () => {
        get("*").forEach((obj) => {
            obj.paused = false;
        });

        gameState = oldGameState;
        oldGameState = "GS_PAUSE";
    };

    const gameOver = () => {
        gameState = "GS_GAMEOVER";
        bgm.paused = true;

        get("Recycle").forEach((obj) => (obj.paused = true));

        if (hand != undefined) hand.destroy();
        setCursor("default");

        go("gameOver");
    };

    const clearLevel = () => {
        bgm.paused = true;

        get("Recycle").forEach((obj) => (obj.paused = true));

        if (hand != undefined) hand.destroy();
        setCursor("default");

        go("clearLevel", stage);
    };

    const updateHandSprite = () => {
        if (hand != undefined) {
            if (isAutoRecycle && isAutoClean) hand.use(sprite("handARC"));
            else if (isAutoRecycle) hand.use(sprite("handAR"));
            else if (isAutoClean) hand.use(sprite("handAC"));
            else hand.use(sprite("hand"));
        }
    };

    const autoRecycle = (recycle: GameObj) => {
        recycle.destroy();

        const recycleBin: GameObj | undefined = get("RecycleBin").find((recycleBin: GameObj) => recycleBin.info.type == recycle.info.type);

        if (recycleBin != undefined) {
            if (recycle.status.type == "RS_POLLUTED") {
                recycleResult(true, recycleBin.index, recycle.incineratorIndex, isAutoClean ? 2 : 1);
            } else recycleResult(true, recycleBin.index, recycle.incineratorIndex, 2);
        }
    };

    const recycleResult = (success: boolean, rbIndex: number, icIndex: number, point: number) => {
        if (success) {
            const signPos = vec2(rbXPos + rbIndex * rbWidth + rbWidth / 2, rbYPos);
            add([
                sprite(point == 1 ? "recycleSign50" : "recycleSign100", {
                    anim: "recycle",
                    animSpeed: 1,
                }),
                anchor("center"),
                pos(signPos),
                lifespan(0.5, { fade: 0.5 }),
                z(LAYER.ACTION),
            ]);

            add([
                sprite("GPoint"),
                anchor("center"),
                pos(signPos.x - (point == 2 ? GPOINT_ICON_WIDTH / 2 : 0), signPos.y - 50),
                lifespan(0.5, { fade: 0.5 }),
                z(LAYER.ACTION),
            ]);

            if (point == 1) {
                playSound("gpoint1");
            } else if (point == 2) {
                playSound("gpoint2");
                add([
                    sprite("GPoint"),
                    anchor("center"),
                    pos(signPos.x + GPOINT_ICON_WIDTH / 2, signPos.y - 50),
                    lifespan(0.5, { fade: 0.5 }),
                    z(LAYER.ACTION),
                ]);
            }

            incGPoint(point);
            if (getGPoint() >= stageInfo[stage].gPoint) clearLevel();
        } else {
            const signPos =
                rbIndex == -1
                    ? vec2(
                          g_StagePosX + stageInfo[stage].icineratorRect[icIndex].x + stageInfo[stage].icineratorRect[icIndex].width / 2,
                          g_StagePosY + stageInfo[stage].icineratorRect[icIndex].y
                      )
                    : vec2(rbXPos + rbIndex * rbWidth + rbWidth / 2, rbYPos);
            add([
                sprite("hazardSign", { anim: "hazard", animSpeed: 1 }),
                anchor("center"),
                pos(signPos),
                scale(point == 3 ? 1.5 : 1.0),
                lifespan(0.5, { fade: 0.5 }),
                z(LAYER.ACTION),
            ]);

            add([
                sprite("DPoint"),
                anchor("center"),
                pos(signPos.x - (point == 2 ? DPOINT_ICON_WIDTH / 2 : 0), signPos.y - (point == 3 ? 70 : 50)),
                lifespan(0.5, { fade: 0.5 }),
                z(LAYER.ACTION),
            ]);

            if (point == 1) {
                playSound("dpoint1");
            } else if (point == 2) {
                playSound("dpoint1");
                add([
                    sprite("DPoint"),
                    anchor("center"),
                    pos(signPos.x + DPOINT_ICON_WIDTH / 2, signPos.y - 50),
                    lifespan(0.5, { fade: 0.5 }),
                    z(LAYER.ACTION),
                ]);
            } else if (point == 3) {
                playSound("dpoint3");
                add([
                    sprite("DPoint"),
                    anchor("center"),
                    pos(signPos.x - DPOINT_ICON_WIDTH, signPos.y - 70),
                    lifespan(0.5, { fade: 0.5 }),
                    z(LAYER.ACTION),
                ]);
                add([
                    sprite("DPoint"),
                    anchor("center"),
                    pos(signPos.x + DPOINT_ICON_WIDTH, signPos.y - 70),
                    lifespan(0.5, { fade: 0.5 }),
                    z(LAYER.ACTION),
                ]);
            }

            incDPoint(point);
            if (getDPoint() >= stageInfo[stage].dPoint) gameOver();
        }
    };

    const drag = () => {
        // The displacement between object pos and mouse pos
        let offset: Vec2 = vec2(0);

        return {
            // Name of the component
            id: "drag",
            // This component requires the "pos" and "area" component to work
            require: ["pos", "area"],
            pick(this: GameObj) {
                // Set the current global dragged object to this
                isDragging = true;
                dragSprite = this;
                offset = mousePos().sub(this.pos);
                this.trigger("drag");
            },
            // "update" is a lifecycle method gets called every frame the obj is in scene
            update(this: GameObj) {
                if (dragSprite === this) {
                    this.pos = mousePos().sub(offset);
                    this.trigger("dragUpdate");
                }
            },
            onDrag(this: GameObj, action: () => void) {
                return this.on("drag", action);
            },
            onDragUpdate(this: GameObj, action: () => void) {
                return this.on("dragUpdate", action);
            },
            onDragEnd(this: GameObj, action: (obj: GameObj) => void) {
                return this.on("dragEnd", action);
            },
        };
    };

    const useItem = (item: ITEM_TYPE, obj: GameObj) => {
        if (gameState == "GS_PAUSE" || getGameItemCount(item) == 0) return;
        if (item == "IT_AUTO_RECYCLE") {
            if (isAutoRecycle) return;

            isAutoRecycle = true;
            obj.use(sprite("autoRecycleOn"));
            updateHandSprite();

            setGameItemCount("IT_AUTO_RECYCLE", getGameItemCount("IT_AUTO_RECYCLE") - 1);

            const itemPprogressBar = add([
                pos(obj.pos.x - 10, obj.pos.y + 70),
                progressBar(ITEM_AUTO_RECYCLE_TIME, 60, 20, rgb(15, 35, 61), ITEM_PROGRESS_BAR_COLOR),
                timer(),
                z(LAYER.UI),
                "conBeltProgressBar",
            ]);

            itemPprogressBar.onProgressEnd(() => {
                itemPprogressBar.destroy();

                isAutoRecycle = false;
                obj.use(sprite("autoRecycle"));
                updateHandSprite();
            });
        } else if (item == "IT_AUTO_CLEAN") {
            if (isAutoClean) return;

            isAutoClean = true;
            obj.use(sprite("autoCleanOn"));
            updateHandSprite();

            setGameItemCount("IT_AUTO_CLEAN", getGameItemCount("IT_AUTO_CLEAN") - 1);

            const itemPprogressBar = add([
                pos(obj.pos.x - 10, obj.pos.y + 70),
                progressBar(ITEM_AUTO_CLEAN_TIME, 60, 20, rgb(15, 35, 61), ITEM_PROGRESS_BAR_COLOR),
                timer(),
                z(LAYER.UI),
                "conBeltProgressBar",
            ]);

            itemPprogressBar.onProgressEnd(() => {
                itemPprogressBar.destroy();

                isAutoClean = false;
                obj.use(sprite("autoClean"));
                updateHandSprite();
            });
        } else if (item == "IT_SLOW_CONBELT") {
            if (isSlowConBelt) return;

            isSlowConBelt = true;
            obj.use(sprite("slowConBeltOn"));
            setGameItemCount("IT_SLOW_CONBELT", getGameItemCount("IT_SLOW_CONBELT") - 1);

            setConBeltSpeed(stage, 60);

            const itemPprogressBar = add([
                pos(obj.pos.x - 10, obj.pos.y + 70),
                progressBar(ITEM_SLOW_CONBELT_TIME, 60, 20, rgb(15, 35, 61), ITEM_PROGRESS_BAR_COLOR),
                timer(),
                z(LAYER.UI),
                "conBeltProgressBar",
            ]);

            itemPprogressBar.onProgressEnd(() => {
                itemPprogressBar.destroy();

                isSlowConBelt = false;
                obj.use(sprite("slowConBelt"));
                retoreConbeltLoopInterval(stage);
                restoreConBeltSpeed(stage);
            });
        }
    };

    const doModalSetting = () => {
        if (gameState == "GS_PAUSE") return;

        pauseGame();

        if (canDrawSetting) {
            add([sprite("settingWindow"), anchor("center"), area(), pos(width() / 2, height() / 2), z(LAYER.ACTION), "Modal"]);

            add([
                sprite("close"),
                anchor("center"),
                area(),
                pos(g_StagePosX + g_StageWidth * 0.65, g_StagePosY + g_StageHeight * 0.08),
                z(LAYER.ACTION),
                "CloseButton",
                "Modal",
            ]);

            add([
                g_SoundOn ? sprite("sound_on") : sprite("sound_off"),
                anchor("center"),
                area(),
                pos(g_StagePosX + g_StageWidth * 0.62, g_StagePosY + g_StageHeight * 0.3),
                scale(1.2),
                z(LAYER.ACTION),
                "SoundButton",
                "Modal",
            ]);

            add([
                g_MusicOn ? sprite("music_on") : sprite("music_off"),
                anchor("center"),
                area(),
                pos(g_StagePosX + g_StageWidth * 0.62, g_StagePosY + g_StageHeight * 0.42),
                scale(1.2),
                z(LAYER.ACTION),
                "MusicButton",
                "Modal",
            ]);

            add([
                sprite("restart"),
                anchor("center"),
                area(),
                pos(g_StagePosX + g_StageWidth * 0.5, g_StagePosY + g_StageHeight * 0.65),
                z(LAYER.ACTION),
                "RestartButton",
                "Modal",
            ]);

            add([
                sprite("quit"),
                anchor("center"),
                area(),
                pos(g_StagePosX + g_StageWidth * 0.5, g_StagePosY + g_StageHeight * 0.8),
                z(LAYER.ACTION),
                "QuitButton",
                "Modal",
            ]);
        }
    };

    const drawTutorialPage = (page: number) => {
        currentTutorialPage = page;

        if (page == 0) {
            add([
                pos(STORY_BKG_X_POS, STORY_BKG_Y_POS),
                z(LAYER.UI),
                {
                    draw(this: GameObj): void {
                        drawText({
                            text: "TUTORIAL (1/2)",
                            size: 36,
                            font: "LilitaOne-Regular",
                            align: "center",
                            width: TUTORIAL_BKG_WIDTH,
                            pos: vec2(0, 10),
                        });
                        drawText({
                            text: "Put the trash inside the trash can of its type. If you miss, the trash goes into the incinerator.",
                            size: 20,

                            align: "left",
                            width: 250,
                            pos: vec2(320, 80),
                        });
                        drawText({
                            text: "If the trash is polluted (has a radioactive sign), use the clearer before recycling it.",
                            size: 20,
                            align: "left",
                            width: 250,
                            pos: vec2(320, 250),
                        });
                    },
                },
                "TutorialPage1",
            ])
                .add([sprite("tutorialDrag", { anim: "drag" }), anchor("topleft"), scale(0.8), area(), pos(25, 60), "TutorialPage1"])
                .add([sprite("tutorialCleaner", { anim: "cleaner" }), anchor("topleft"), scale(1.0), area(), pos(0, 210), "TutorialPage1"]);
        } else if (page == 1) {
            add([
                pos(STORY_BKG_X_POS, STORY_BKG_Y_POS),
                z(LAYER.UI),
                {
                    draw(this: GameObj): void {
                        drawText({
                            text: "TUTORIAL (2/2)",
                            size: 36,
                            font: "LilitaOne-Regular",
                            align: "center",
                            width: TUTORIAL_BKG_WIDTH,
                            pos: vec2(0, 10),
                        });
                        drawSprite({
                            sprite: "GPoint",
                            pos: vec2(30, 80),
                            anchor: "topleft",
                        });
                        drawText({
                            text: "must be filled to clear the level. correct trash can: 2 points, wrong trash can: 1 point",
                            size: 20,
                            align: "left",
                            width: 500,
                            pos: vec2(70, 80),
                        });
                        drawSprite({
                            sprite: "DPoint",
                            pos: vec2(30, 160),
                            anchor: "topleft",
                        });
                        drawText({
                            text: "will lead to game over. miss polluted trash: 3 points, miss regular trash: 1 point",
                            size: 20,
                            align: "left",
                            width: 500,
                            pos: vec2(70, 160),
                        });
                        drawSprite({
                            sprite: "coin",
                            pos: vec2(30, 240),
                            anchor: "topleft",
                        });
                        drawText({
                            text: "correctly recycle the trash with the coin floating. coins can we used in the store",
                            size: 20,
                            align: "left",
                            width: 500,
                            pos: vec2(70, 240),
                        });
                        drawSprite({
                            sprite: "autoRecycle",
                            pos: vec2(30, 320),
                            anchor: "topleft",
                            scale: 0.6,
                        });
                        drawText({
                            text: "automatically recycles the trash",
                            size: 20,
                            align: "left",
                            width: 500,
                            pos: vec2(70, 325),
                        });
                        drawSprite({
                            sprite: "autoClean",
                            pos: vec2(30, 360),
                            anchor: "topleft",
                            scale: 0.6,
                        });
                        drawText({
                            text: "automatically cleans the polluted trash",
                            size: 20,
                            align: "left",
                            width: 500,
                            pos: vec2(70, 365),
                        });
                        drawSprite({
                            sprite: "slowConBelt",
                            pos: vec2(30, 400),
                            anchor: "topleft",
                            scale: 0.6,
                        });
                        drawText({
                            text: "slows down the conveyor belt",
                            size: 20,
                            align: "left",
                            width: 500,
                            pos: vec2(70, 405),
                        });
                    },
                },
                "TutorialPage2",
            ]);
        }
    };

    startRandomEffect(stage, stageInfo[stage].randomEffect);
    drawGameUI(stage);

    //stageInfo에 따라 background 표시
    setBackground(stageInfo[stage].bkgColor);
    if (stageInfo[stage].bkgBackImage != "")
        add([sprite(stageInfo[stage].bkgBackImage), area(), pos(g_StagePosX, g_StagePosY), z(LAYER.BG), "Background"]);
    add([sprite(stageInfo[stage].bkgMainImage), area(), pos(g_StagePosX, g_StagePosY), z(LAYER.BG), "Background"]);

    //stageInfo에 따라 Cleaner 표시
    const cleaner = add([
        sprite("cleaner", { anim: "normal", animSpeed: 1.0 }),
        area(),
        scale(1.0),
        anchor("topleft"),
        pos(stageInfo[stage].cleanerPos.add(g_StagePosX, g_StagePosY)),
        z(LAYER.BG),
        "Cleaner",
    ]);

    //stageInfo에 따라 Incinerator 표시
    stageInfo[stage].icineratorRect.forEach((rect: IRect) => {
        const incinerator = add([
            sprite("incinerator"),
            pos(g_StagePosX + rect.x, g_StagePosY + rect.y),
            scale(stageInfo[stage].incineratorScale),
            area(),
            anchor("topleft"),
            z(LAYER.BG),
            "Incinerator",
        ]);
        rect.width = incinerator.worldArea().bbox().width;
        rect.height = incinerator.worldArea().bbox().height;

        const fireScale = stageInfo[stage].incineratorScale / 0.7;

        add([
            sprite("fire", { anim: "fire", animSpeed: 1.0 }),
            pos(g_StagePosX + rect.x, g_StagePosY + rect.y - 40),
            scale(fireScale),
            z(LAYER.BG),
        ]);

        add([
            sprite("fire", { anim: "fire", animSpeed: 1.0 }),
            pos(g_StagePosX + rect.x, g_StagePosY + rect.y - 20),
            scale(fireScale),
            z(LAYER.BG),
        ]);
        add([
            sprite("fire", { anim: "fire", animSpeed: 1.0 }),
            pos(g_StagePosX + rect.x, g_StagePosY + rect.y + 10),
            scale(fireScale),
            z(LAYER.BG),
        ]);
    });

    initConBeltSpeed(stage);
    initWayPoint(stage);
    coverStageOutside();

    const bgm = play(stageInfo[stage].bgm, { loop: true, paused: true });
    const cleaningSound = play("cleaning", { loop: true, paused: true });

    playMusic(bgm, g_MusicOn);

    // add([
    //     pos(0, 0),
    //     z(LAYER.UI),
    //     {
    //         draw(this: GameObj): void {
    //             drawPolygon({
    //                 pts: stageInfo[stage].conBeltInfo[1].curvePoints,
    //                 color: rgb(255, 0, 0),
    //             });
    //         },
    //     },
    // ]);

    //stageInfo에 따라 ConveyorBelt 구성
    stageInfo[stage].conBeltInfo.forEach((cb) => {
        for (let i = 0; i < cb.count; i = i + 1) {
            add([
                sprite(cb.name, { anim: "move" }),
                pos(g_StagePosX + cb.pos.x + i * 200, g_StagePosY + cb.pos.y),
                scale(1.0),
                z(LAYER.ITEM_1),
                "ConveyorBelt",
            ]);

            if (cb.connectedConBelt != -1) {
                add([
                    sprite("portal"),
                    anchor("center"),
                    area({ scale: vec2(0.1, 1.0) }),
                    pos(cb.wayPoints[cb.wayPoints.length - 1].x + (cb.dir == 0 ? -20 : 20), cb.wayPoints[cb.wayPoints.length - 1].y - 60),
                    scale(1.2),
                    z(LAYER.ITEM_3),
                    "Portal",
                ]);
            }
        }
    });

    //stageInfo에 따라 RecycleBin 구성
    let rbWidth = (g_StageWidth - 40) / stageInfo[stage].recycleBinInfo.length;
    if (rbWidth > RB_WIDTH) rbWidth = RB_WIDTH;

    let rbScale = rbWidth / RB_WIDTH;
    let rbXPos = g_StagePosX + (g_StageWidth - rbWidth * stageInfo[stage].recycleBinInfo.length) / 2;
    let rbYPos = g_StagePosY + g_StageHeight - RB_HEIGHT * rbScale;

    stageInfo[stage].recycleBinInfo.forEach((info, index) => {
        add([
            sprite(info.name),
            area(),
            scale(rbWidth / RB_WIDTH),
            pos(rbXPos + index * rbWidth, rbYPos),
            z(LAYER.BG),
            info.name,
            "RecycleBin",
            {
                info: info,
                index: index,
            },
        ]);
    });

    //재활용 쓰레기 램덤 생성
    stageInfo[stage].conBeltInfo.forEach((conBelt: IConBeltInfo, index: number) => {
        let recyclingLoop = startRecycling(conBelt, index);

        loop(10, () => {
            if (conBelt.loopInterval > 2.0) {
                if (isSlowConBelt == true) {
                    conBelt.loopInterval = 5;
                } else {
                    conBelt.loopInterval = conBelt.loopInterval - 0.25;
                    conBelt.oldLoopInterval = conBelt.loopInterval;
                }
                recyclingLoop.cancel();
                wait(conBelt.loopInterval, () => {
                    recyclingLoop = startRecycling(conBelt, index);
                });
                //debug.log(loopInterval);
            }
        });
    });

    const hand = isTouchscreen()
        ? undefined
        : add([sprite("hand"), pos(mousePos()), area(), scale(1.0), rotate(0), mouseMove(), anchor("topleft"), z(LAYER.CURSOR), "Hand"]);

    if (stage == 0) {
        pauseGame();

        add([
            rect(TUTORIAL_BKG_WIDTH, TUTORIAL_BKG_HEIGHT, { radius: 10 }),
            color(0, 0, 0),
            outline(4, rgb(255, 169, 35)),
            pos(STORY_BKG_X_POS, STORY_BKG_Y_POS),
            z(LAYER.UI),
            area(),
            "TutorialMain",
        ]);

        drawTutorialPage(0);
    }

    onTouchStart((touchPos: Vec2) => {
        if (!isTouchscreen()) return;
        if (isDragging) return;

        const tPos = vec2(touchPos.x / g_StageScale, touchPos.y / g_StageScale);

        if (hand != undefined) hand.use(rotate(hand.angle - 25));

        if (gameState == "GS_PAUSE") return;

        for (const obj of get("drag").reverse()) {
            let objPoints = obj.worldArea().bbox().points();
            const dx = obj.worldArea().bbox().width * 0.5;
            const dy = obj.worldArea().bbox().height * 0.5;
            objPoints[0].x -= dx;
            objPoints[0].y -= dy;
            objPoints[1].x += dx;
            objPoints[1].y -= dy;
            objPoints[2].x += dx;
            objPoints[2].y += dy;
            objPoints[3].x -= dx;
            objPoints[3].y += dy;
            const objRect = Rect.fromPoints(vec2(objPoints[0].x, objPoints[0].y), vec2(objPoints[2].x, objPoints[2].y));
            if (testRectPoint(objRect, tPos)) {
                if (isAutoClean && obj.status.type == "RS_POLLUTED") {
                    if (isAutoRecycle) autoRecycle(obj);
                    else {
                        obj.status.type = "RS_NORMAL";
                        obj.use(sprite(obj.info.name));
                        obj.children[0].destroy();
                    }
                } else obj.pick();
                break;
            }
        }
    });

    onMousePress(() => {
        if (isTouchscreen() || hand == undefined) return;
        if (isDragging) return;

        hand.use(rotate(hand.angle - 25));

        if (gameState == "GS_PAUSE") return;

        for (const obj of get("drag").reverse()) {
            if (testRectPoint(obj.worldArea().bbox(), hand.pos)) {
                if (isAutoClean && obj.status.type == "RS_POLLUTED") {
                    if (isAutoRecycle) autoRecycle(obj);
                    else {
                        obj.status.type = "RS_NORMAL";
                        obj.use(sprite(obj.info.name));
                        obj.children[0].destroy();
                    }
                } else obj.pick();

                break;
            }
        }
    });

    onMouseRelease(() => {
        if (gameState == "GS_READY") {
            gameState = "GS_PLAYING";
            return;
        }

        if (hand != undefined) hand.use(rotate(hand.angle + 25));

        if (isDragging) {
            dragSprite.trigger("dragEnd");
            isDragging = false;
        }
    });

    onClick("PauseButton", () => {
        doModalSetting();
    });

    onClick("FullscreenBtn", () => {
        if (hand != undefined) hand.use(rotate(hand.angle + 25));
        setFullscreen(!isFullscreen());
    });

    onClick("RestartButton", () => {
        gameState = "GS_GAMEOVER";
        bgm.paused = true;
        go("game", stage);
    });

    onClick("QuitButton", () => {
        gameState = "GS_GAMEOVER";
        bgm.paused = true;
        go("level");
    });

    onKeyPress("1", () => {
        useItem("IT_AUTO_RECYCLE", get("AutoRecycleBtn")[0]);
    });

    onClick("AutoRecycleBtn", (obj: GameObj) => {
        useItem("IT_AUTO_RECYCLE", obj);
    });

    onKeyPress("2", () => {
        useItem("IT_AUTO_CLEAN", get("AutoCleanBtn")[0]);
    });

    onClick("AutoCleanBtn", (obj: GameObj) => {
        useItem("IT_AUTO_CLEAN", obj);
    });

    onKeyPress("3", () => {
        useItem("IT_SLOW_CONBELT", get("SlowConBeltBtn")[0]);
    });

    onClick("SlowConBeltBtn", (obj: GameObj) => {
        useItem("IT_SLOW_CONBELT", obj);
    });

    onKeyPress(".", () => {
        setGameItemCount("IT_AUTO_RECYCLE", getGameItemCount("IT_AUTO_CLEAN") + 1);
        setGameItemCount("IT_AUTO_CLEAN", getGameItemCount("IT_AUTO_CLEAN") + 1);
        setGameItemCount("IT_SLOW_CONBELT", getGameItemCount("IT_SLOW_CONBELT") + 1);
    });

    onClick("CloseButton", () => {
        get("Modal").forEach((obj) => obj.destroy());
        resumeGame();
    });

    onClick("MusicButton", (music_button) => {
        music_button.use(sprite(g_MusicOn ? "music_off" : "music_on"));
        playMusic(bgm, !g_MusicOn);
    });

    onClick("SoundButton", (sound_button) => {
        if (g_SoundOn) {
            sound_button.use(sprite("sound_off"));
            setSoundOn(false);
        } else {
            sound_button.use(sprite("sound_on"));
            setSoundOn(true);
        }
    });

    onClick("CreditButton", () => {
        go("credit");
    });

    onClick("TutorialMain", () => {
        if (currentTutorialPage == 0) {
            get("TutorialPage1").forEach((obj) => obj.destroy());
            drawTutorialPage(1);
        } else if (currentTutorialPage == 1) {
            get("TutorialPage2").forEach((obj) => obj.destroy());
            get("TutorialMain").forEach((obj) => obj.destroy());
            resumeGame();
        }
    });

    onUpdate(() => {
        //setCursor("none");
        //debug.log("Hand : " + hand.pos);
    });

    onCollide("Mice", "Incinerator", (obj: GameObj) => {
        if (!obj.isBack) {
            obj.isBack = true;
            obj.xVel *= -1;
            obj.flipX = !obj.flipX;
        }
    });

    onCollide("Portal", "Recycle", (portal: GameObj, recycle: GameObj) => {
        if (recycle.worldArea().pts[0].y > portal.worldArea().pts[0].y && recycle.worldArea().pts[3].y < portal.worldArea().pts[3].y)
            portal.play("teleport", { speed: 30 });
    });

    onKeyPress("f", () => {
        setFullscreen(!isFullscreen());
    });
};

export default GameScene;
