import { OS_TYPE } from "./definition";
import * as Cookies from "typescript-cookie";
import { getGameItemCount } from "./data/item"; 

export let g_OSType: OS_TYPE = "OT_UNKNOWN";
export let g_Version: number = 100;

export let g_PageWidth = 0;
export let g_PageHeight = 0;
export let g_StageWidth = 960;
export let g_StageHeight = 640;
export let g_StagePosX = 0;
export let g_StagePosY = 0;
export let g_StageScale = 1.0;

export let g_GameScene = "intro";

export let g_GPoint = 0;
export let g_DPoint = 0;
export let g_GameCoin = Cookies.getCookie("GR_coin")!= undefined? Number(Cookies.getCookie("GR_coin")):100;
export let g_StageCoin = 100;

export let g_CurrentLevel = 0;

export let g_SoundOn = Cookies.getCookie("GR_Sound")!= undefined? Boolean(Cookies.getCookie("GR_Sound")) : false;
export let g_MusicOn = Cookies.getCookie("GR_Music")!= undefined? Boolean(Cookies.getCookie("GR_Music")) : false;

export let g_StarCounts: string[] = (Cookies.getCookie("GR_Stage")==undefined) ? [
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
    "level0Star",
] : savedGameStar();
export function savedGameStar(){
    let star: string[] =[];
    let starString = Cookies.getCookie("GR_Stage");
    if(starString==undefined) return [];
    for(let i=0; i<starString.length;i++){
        if(starString[i]==" ") continue;
        if(starString[i]=="0"){
            star.push("level0Star")
        }else if(starString[i]=="1"){
            star.push("level1Star")
        }else if(starString[i]=="2"){
            star.push("level2Star")
        }else if(starString[i]=="3"){
            star.push("level3Star")
        }
    }
    return star;
}
export function setOSType(value: OS_TYPE) {
    g_OSType = value;
}

export function initStagePos(pageWidth: number, pageHeight: number, canvasWidth: number, canvasHeight: number, canvasScale: number) {
    g_PageWidth = pageWidth;
    g_PageHeight = pageHeight;
    g_StagePosX = (canvasWidth - g_StageWidth) / 2;
    g_StagePosY = (canvasHeight - g_StageHeight) / 2;
    g_StageScale = canvasScale;
}

export function setGameScene(value: string) {
    g_GameScene = value;
}

export function setCurrentLevel(value: number) {
    g_CurrentLevel = value;
}

export function setSoundOn(value: boolean) {
    g_SoundOn = value;
    Cookies.setCookie("GR_Sound", g_SoundOn);
    console.log(Cookies.getCookie("GR_Sound"));
}
export function setMusicOn(value: boolean) {
    g_MusicOn = value;
    Cookies.setCookie("GR_Music", g_MusicOn);
    console.log(Cookies.getCookie("GR_Music"));
}

export function setGameCoin(value: number) {
    g_GameCoin = value;
    Cookies.setCookie("GR_coin", g_GameCoin);
}

export function setStageCoin(value: number) {
    g_StageCoin = value;
}

export function setGPoint(value: number) {
    g_GPoint = value;
}

export function setDPoint(value: number) {
    g_DPoint = value;
}

export function getGameCoin() {
    return g_GameCoin;
}

export function getStageCoin() {
    return g_StageCoin;
}

export function getGPoint() {
    return g_GPoint;
}

export function getDPoint() {
    return g_DPoint;
}

export function incGameCoin(value: number) {
    g_GameCoin = g_GameCoin + value;
    Cookies.setCookie("GR_coin", g_GameCoin);
}

export function incStageCoin(value: number) {
    g_StageCoin = g_StageCoin + value;
}

export function incGPoint(value: number) {
    g_GPoint = g_GPoint + value;
}

export function incDPoint(value: number) {
    g_DPoint = g_DPoint + value;
}

export function saveItem(){
    Cookies.setCookie("GR_item_SlowConbelt", getGameItemCount("IT_SLOW_CONBELT"));
    Cookies.setCookie("GR_item_AutoClean", getGameItemCount("IT_AUTO_CLEAN"));
    Cookies.setCookie("GR_item_AutoRecycle", getGameItemCount("IT_AUTO_RECYCLE"));
}
export function saveProgress(){
    let gameStar:string="";
    g_StarCounts.forEach((value:string) => {
        gameStar+=(value+" ");
    });
    Cookies.setCookie("GR_Stage", gameStar);
}