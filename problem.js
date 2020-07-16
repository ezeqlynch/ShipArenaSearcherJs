const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

const WEAPON = 0;
const REACTOR = 1;
const HULL = 2;
const WINGS = 3;
class ArenaProblem {

    constructor (node) {
        this.state = node;
        this.rules = [];
        this.trophyRules = [];
        this.droneRules = [];
        //0 weapon, 1 reactor, 2 hull, 3 wings
        for (let i = 0; i < 4; i++) {
            //0 left, 1 middle, 2 right
            for (let j = 0; j < 3; j++) {
                if ((i == WINGS && j == MIDDLE) || (j == LEFT && (i == WEAPON || i == WINGS)) || i == REACTOR /*|| (i == 2 && j == 1)*/) {
                    continue;
                }
                this.rules.push(new ShipRule(j, i));
            }
        }

        for (let i = 0; i < 5; i++) {
            this.droneRules.push(new DroneRule(i));
        }

    }

    getInitialState() {
        return this.state;
    }

    getRules(o) {

        let drones = this.droneRules.filter(dr => o.canBuyDrone(dr.drone)).map(dr => dr.clone());

        let ships = this.rules.filter(sr => o.canBuy(sr.ship, sr.part)).map(sr => new ShipRule(sr.ship, sr.part));

        let total = drones.concat(ships);
        
        for (let i = total.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [total[i], total[j]] = [total[j], total[i]];
        }

        return total;
    }

}
