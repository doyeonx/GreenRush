import k from "../initKaboom";
import { GameObj, Vec2 } from "kaboom";

const { rotate } = k;

export const movePath = (
    wayPoints: Vec2[],
    speed: number,
    isDestroy: boolean = true,
    isEndAction: boolean = true,
    isRotate: boolean = false
) => {
    return {
        id: "movePath",
        oldSpeed: speed,
        speed: speed,
        isMoving: false,
        wayPointIndex: 1,
        moveStart(this: GameObj, speed: number) {
            this.wayPointIndex = 1;
            this.isMoving = true;
            this.oldSpeed = speed;
            this.speed = speed;
        },
        movePause(this: GameObj) {
            this.isMoving = false;
        },
        draw(this: GameObj) {},
        update(this: GameObj) {
            if (this.isMoving) {
                if (isRotate) {
                    const angle = this.pos.angle(wayPoints[this.wayPointIndex]) - 135;
                    this.use(rotate(angle));
                }

                this.moveTo(wayPoints[this.wayPointIndex], this.speed);

                if (this.pos.dist(wayPoints[this.wayPointIndex]) < 5) {
                    if (this.wayPointIndex < wayPoints.length - 1) {
                        this.wayPointIndex++;
                    } else {
                        this.isMoving = false;

                        if (isDestroy) this.destroy();

                        this.trigger("moveEnd", isEndAction);
                    }
                }
            }
        },
        onMoveEnd(this: GameObj, action: () => void) {
            return this.on("moveEnd", action);
        },
    };
};
