class DroneRule {

    constructor (drone) {
        this.drone = drone;
        this.level = 0;
        this.cost = 0;
    }

    clone() {
        return new ArenaDroneRule(this.drone);
    }

    toString() {
        let drone = "";
        switch (this.drone) {
            case 0:
                drone = "Reflection";
                break;
            case 1:
                drone = "Shield Pen";
                break;
            case 2:
                drone = "Deadly Inc";
                break;
            case 3:
                drone = "Regen";
                break;
            case 4:
                drone = "Leech";
                break;
        }
        return "Upgrade " + drone + " drone to level " + this.level;
    }

    applyToState(o) {
        let s = o.clone();
        s.upDrone(this.drone);
        this.level = s.drones[this.drone];
        return s;
    }

    postApplyToState(s) {
        if (s.doTrophies()) {
            s.upChall();
        }
    }

}
