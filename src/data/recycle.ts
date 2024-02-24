export type RECYCLE_TYPE =
    | "RT_PLASTIC"
    | "RT_PLASTIC_PET"
    | "RT_VINYL"
    | "RT_CAN"
    | "RT_SCRAP_METAL"
    | "RT_GLASS"
    | "RT_PAPER"
    | "RT_GENERAL_WASTE"
    | "RT_STYROFOAM"
    | "RT_FOOD"
    | "RT_CLOTHING";

export interface IRecycleInfo {
    name: string;
    type: RECYCLE_TYPE;
}

export const recycleInfo: IRecycleInfo[] = [
    { name: "plastic01", type: "RT_PLASTIC" },
    { name: "plastic02", type: "RT_PLASTIC_PET" },
    { name: "plastic03", type: "RT_PLASTIC" },
    { name: "plastic04", type: "RT_PLASTIC_PET" },
    { name: "can01", type: "RT_CAN" },
    { name: "can02", type: "RT_CAN" },
    { name: "paper01", type: "RT_PAPER" },
    { name: "paper02", type: "RT_PAPER" },
    { name: "glass01", type: "RT_GLASS" },
    { name: "foodwaste01", type: "RT_FOOD" },
    { name: "cloth01", type: "RT_CLOTHING" },
    { name: "vinyl01", type: "RT_VINYL" },
];

export type RECYCLE_STATUS = "RS_NORMAL" | "RS_COIN" | "RS_POLLUTED";

export interface IRecycleStatus {
    name: string;
    type: RECYCLE_STATUS;
}

export const recycleStatus: IRecycleStatus[] = [
    { name: "normal", type: "RS_NORMAL" },
    { name: "coin", type: "RS_COIN" },
    { name: "PPoint", type: "RS_POLLUTED" },
];
