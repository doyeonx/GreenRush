import * as Cookies from "typescript-cookie";
import { saveItem } from "../global";
const INIT_AUTO_RECYCLE_COUNT = Cookies.getCookie("GR_item_AutoRecycle")!= null? Number(Cookies.getCookie("GR_item_AutoRecycle")) : 5;
const INIT_AUTO_CLEAN_COUNT = Cookies.getCookie("GR_item_AutoClean")!= null? Number(Cookies.getCookie("GR_item_AutoClean")) : 5;
const INIT_SLOW_CONBELT_COUNT = Cookies.getCookie("GR_item_SlowConbelt")!= null? Number(Cookies.getCookie("GR_item_SlowConbelt")) : 1;

export type ITEM_TYPE = "IT_AUTO_RECYCLE" | "IT_AUTO_CLEAN" | "IT_SLOW_CONBELT";

export interface IGameItem {
    name: string;
    count: number;
    price: number;
    
}

export const gameItem = new Map<ITEM_TYPE, IGameItem>([
    ["IT_SLOW_CONBELT", { name: "slowConBelt", count: INIT_SLOW_CONBELT_COUNT, price:10 }],
    ["IT_AUTO_RECYCLE", { name: "autoRecycle", count: INIT_AUTO_RECYCLE_COUNT, price: 30 }],
    ["IT_AUTO_CLEAN", { name: "autoClean", count: INIT_AUTO_CLEAN_COUNT, price:20 }],
]);

export function initGemeItemCount(): void {
    setGameItemCount("IT_AUTO_RECYCLE", INIT_AUTO_RECYCLE_COUNT);
    setGameItemCount("IT_AUTO_CLEAN", INIT_AUTO_CLEAN_COUNT);
    setGameItemCount("IT_SLOW_CONBELT", INIT_SLOW_CONBELT_COUNT);
}

export function setGameItemCount(type: ITEM_TYPE, count: number): void {
    const item = gameItem.get(type) as IGameItem;
    gameItem.set(type, { ...item, count: count });
    saveItem();
}

export function getGameItemCount(type: ITEM_TYPE): number {
    return gameItem.get(type)?.count as number;
}
