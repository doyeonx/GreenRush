import k from "../initKaboom";
import { ICreditInfo } from "../data/stage";

import { moving } from "../components/util";
import { setGameScene } from "../global";

const { add, text, pos, anchor, width, sprite, loadSprite, scale, onClick, go } = k;

loadSprite("gameTitle", "image/gameTitle.png");

const creditInfo: ICreditInfo[] = [
    {
        name: "Doyeon Kim",
        grade: "11",
        school: "St. Johnsbury Academy Jeju",
    },

    {
        name: "Josiah Lee",
        grade: "11",
        school: "St. Johnsbury Academy Jeju",
    },

    {
        name: "Kyle Jung",
        grade: "12",
        school: "Korean International School Jeju",
    },

    {
        name: "Soohyun Ha",
        grade: "11",
        school: "Branksome Hall Asia",
    },

    {
        name: "Zinna Kim",
        grade: "12",
        school: "Seoul Foreign School",
    },

    {
        name: "Esther Nam",
        grade: "11",
        school: "Seoul Foreign School",
    },

    {
        name: "Garam Bae",
        grade: "8",
        school: "St. Johnsbury Academy Jeju",
    },

];

const CreditScene = () => {
    setGameScene("credit");

    creditInfo.forEach((credit: ICreditInfo, index: number) => {
        const name = add([
            text(credit.name, { size: 40, font: "LilitaOne-Regular" }),
            anchor("center"),
            pos(width() / 2, index * 150 + 50),
            moving(0, -60),
        ]);

        const grade = add([
            text(credit.grade, { size: 20, font: "LilitaOne-Regular" }),
            anchor("center"),
            pos(width() / 2, name.pos.y + 35),
            moving(0, -60),
        ]);

        const school = add([
            text(credit.school, { size: 20, font: "LilitaOne-Regular" }),
            anchor("center"),
            pos(width() / 2, grade.pos.y + 30),
            moving(0, -60),
            // offscreen({ destroy: true }),
        ]);

        const space = add([
            text(" -------------- ", { size: 40, font: "LilitaOne-Regular" }),
            anchor("center"),
            pos(width() / 2, school.pos.y + 30),
            moving(0, -60),
            // offscreen({ destroy: true }),
        ]);

        add([sprite("gameTitle"), anchor("center"), scale(2), pos(width() / 2, creditInfo.length * space.pos.y + 200), moving(0, -60)]);
    });
    onClick(() => {
        go("level");
    });
};

export default CreditScene;
