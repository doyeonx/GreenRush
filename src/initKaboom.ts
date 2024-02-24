import kaboom from "kaboom";
import { g_StageWidth, g_StageHeight, initStagePos, setOSType } from "./global";

const agent = navigator.userAgent.toLowerCase();

if (agent.indexOf("android") > -1) {
    setOSType("OT_ANDROID");
} else if (agent.indexOf("iphone") > -1 || agent.indexOf("ipad") > -1 || agent.indexOf("ipod") > -1) {
    setOSType("OT_IOS");
} else if (agent.indexOf("mac os") > -1) {
    setOSType("OT_MACOS");
} else if (agent.indexOf("windows") > -1) {
    setOSType("OT_WINDOWS");
} else {
    setOSType("OT_UNKNOWN");
}

export const getPageWidth = (): number => {
    const bodyMax = document.body ? Math.max(document.body.scrollWidth, document.body.offsetWidth) : 0;

    const docElementMax = document.documentElement
        ? Math.max(document.documentElement.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth)
        : 0;

    return Math.max(bodyMax, docElementMax);
};

export const getPageHeight = (): number => {
    const bodyMax = document.body ? Math.max(document.body.scrollHeight, document.body.offsetHeight) : 0;

    const docElementMax = document.documentElement
        ? Math.max(document.documentElement.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight)
        : 0;

    return Math.max(bodyMax, docElementMax);
};

export const getPgeScale = (pageWidth: number, pageHeight: number): number => {
    return pageWidth > pageHeight ? pageHeight / g_StageHeight : pageWidth / g_StageWidth;
};

const pageWidth = getPageWidth();
const pageHeight = getPageHeight();
const pageScale = getPgeScale(pageWidth, pageHeight);

const k = kaboom({
    background: [0, 0, 0],
    scale: pageScale,
    canvas: document.querySelector(".myCanvas") as HTMLCanvasElement,
});

initStagePos(pageWidth, pageHeight, k.width(), k.height(), pageScale);

export default k;
