import k from "./initKaboom";
import IntroScene from "./scenes/intro";
import StartScene from "./scenes/start";
import LevelScene from "./scenes/level";
import GameScene from "./scenes/game";
import GameOverScene from "./scenes/gameover";
import CreditScene from "./scenes/credit";
import { loadGameAsset } from "./data/asset";
import settings from "./window/settings";
import ClearLevelScene from "./scenes/clearlevel";

const { scene, onLoad, go } = k;

loadGameAsset();

scene("intro", IntroScene);
scene("start", StartScene);
scene("level", LevelScene);
scene("gameOver", GameOverScene);
scene("game", GameScene);
scene("credit", CreditScene);
scene("settings", settings);
scene("clearLevel", ClearLevelScene);

onLoad(() => {
    go("intro");
});

export default k;
