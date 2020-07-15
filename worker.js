class Engine {
    // private HashSet<List<Byte>> bestDepths;
    // private LinkedList<StateSA> bests;
    // private LinkedList<StateSA> bestsFive;
    // private Queue<StateSA> openNodes;
    // private int maxChallenge;


    constructor(problem, maxChallenge) {
        this.problem = problem;
        this.bestDepths = new Set();
        this.explosionCounter = 0;
        this.bests = [];
        this.bestsFive = [];
        this.openNodes = createQueue(200, []);
        this.maxChallenge = maxChallenge;
        this.lowestHp = 0;
        this.lowestHpFive = 0;
        this.lowestHigh = 1;
        this.lowestHighFive = 1;
    }

    getNextNode() {
        return this.openNodes.shift();
    }

    addToOpenNodes(node) {
        this.openNodes.push(node);
    }

    openNodesIsEmpty() {
        return this.openNodes.isEmpty();
    }

    getOpenNodesSize() {
        return this.openNodes.length();
    }

    stepOnOpenNodes(nodes) {
        this.shuffle(nodes);
        this.openNodes = createQueue(200, nodes);
    }

    findSolution() {
        console.log(this.problem);
        let root = this.problem.getInitialState();
        do {
            console.log(root.hpLeft);
            if (root.hpLeft <= 0) {
                root.upChall();
            }
            root.setHpLeft();
        } while (root.hpLeft <= 0.0);
        this.addToOpenNodes(root);
        let max = root;
        while (max.doTrophies()) {
            let nn = max.clone();
            nn.upChall();
            nn.setParent(max);
            max = nn;
        }
        // console.log(max);
        //        while (!openNodesIsEmpty()) {
        //            max = getNextNode();
        //            trophyExplode(max, problem);
        //        }
        this.openNodes = createQueue(200, []);
        this.addToOpenNodes(max);
        this.bests.push(max);
        while (!this.openNodesIsEmpty()) {
            let currentNode = this.getNextNode();
            if (this.openNodes.length() > 1000000/* || (openNodes.size() > 800000 && bestDepths.size() > 10000000) || bestDepths.size() > 10000000*/) {
                this.bests.reverse();
                this.stepOnOpenNodes(this.bests);
                this.bestDepths.clear();
                currentNode = this.bests[0];
            }
            this.explode(currentNode);
        }
        this.bests.reverse();
        this.bestsFive.reverse();
        return [this.bests, this.bestsFive];

    }

    explode(node) {
        if (node.challengeNumber >= this.maxChallenge) {
            return;
        }
        this.explosionCounter++;
        if (this.explosionCounter % 50000 == 0) {
            console.log(new Date());
            console.log("bestDepths = " + this.bestDepths.size);
            console.log("openNodes = " + this.getOpenNodesSize());
            console.log(this.bests[this.bests.length - 1].toString());
        }

        if (node.parent != null /*&& ((StateSA)node.getParent()).getChallengeNumber() < node.getChallengeNumber()*/) {
            let nn = node.clone();
            while (nn.doTrophies() && nn.challengeNumber < this.maxChallenge) {
                nn.upChall();
                nn.setParent(node);
                node = nn;
                nn = node.clone();
            }
        }


        let rl = this.problem.getRules(node);
        for (let i = 0; i < rl.length; i++) {
            const rule = rl[i];
            let newState = rule.applyToState(node);
            if (this.bestDepths.has(newState.toByteArray())) {
                continue;
            }
            //            rule.postApplyToState(newState);
            this.updateBestCosts(newState);
            newState.setParent(node);
            this.addToOpenNodes(newState);
        }
    }

    updateBestCosts(node) {
        this.bestDepths.add(node.toByteArray());
        if (this.bests.length < 100) {
            this.bests.push(node);
        } else if (node.challengeNumber > this.lowestHigh || (node.challengeNumber == this.lowestHigh && node.currUlt >= this.lowestHp)) {
            this.bests.sort((a, b) => {
                if (a != b) {
                    return a.challengeNumber - b.challengeNumber;
                } else {
                    return a.currUlt - b.currUlt;
                }
            })
            if (!this.bests.some(n => n.equals(node))) {
                this.bests[0] = node;
                this.lowestHigh = this.bests[1].challengeNumber;
                this.lowestHp = this.bests[1].currUlt;
            }
        }
        if (node.challengeNumber % 5 == 0) {
            if (this.bestsFive.length < 100) {
                this.bestsFive.push(node);
            } else if (node.challengeNumber > this.lowestHighFive || (node.challengeNumber == this.lowestHighFive && node.currUlt >= this.lowestHpFive)) {
                this.bestsFive.sort((a, b) => {
                    if (a != b) {
                        return a.challengeNumber - b.challengeNumber;
                    } else {
                        return a.currUlt - b.currUlt;
                    }
                })
                if (!this.bestsFive.some(n => n.equals(node))) {
                    this.bestsFive[0] = node;
                    this.lowestHighFive = this.bestsFive[1].challengeNumber;
                    this.lowestHpFive = this.bestsFive[1].currUlt;

                }
            }
        }
    }

    shuffle = arr => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
}

function createQueue(ic, init) {
    let that = {};
    let head = 0;
    let tail = 0;
    let length = 0;
    let initialCapacity = ic;
    let currentSize = (typeof initialCapacity === undefined) ? initialCapacity : 200;
    let container = init;
    container.length = currentSize;

    function doubling() {
        let currentSource = head;
        let currentTarget = 0;
        let newContainer = [];
        newContainer.length = 2 * currentSize;

        while (currentTarget < currentSize) {
            newContainer[currentTarget] = container[currentSource];
            currentSource++;
            currentTarget++;
            if (currentSource == currentSize) {
                currentSource = 0;
            }
        }
        container = newContainer;
        head = 0;
        tail = currentSize;
        currentSize *= 2;
    }

    function shrink() {
        let currentSource = head;
        let currentTarget = 0;
        let newContainer = [];
        newContainer.length = currentSize / 4;

        while (currentTarget < currentSize) {
            newContainer[currentTarget] = container[currentSource];
            currentSource++;
            currentTarget++;
            if (currentSource == currentSize) {
                currentSource = 0;
            }
        }
        container = newContainer;
        head = 0;
        tail = currentSize;
        currentSize /= 4;
    }

    that.push = function (element) {
        if (length == currentSize) {
            doubling();
        }
        container[tail] = element;
        length++;
        tail++;
        if (tail == currentSize) {
            tail = 0;
        }
    };

    that.shift = function () {
        if (length === 0) {
            return null;
        }
        tmp = container[head];
        head++;
        length--;
        if (head == currentSize) {
            head = 0;
        }
        if (length == currentSize / 4 && length > initialCapacity) {
            shrink();
        }
        return tmp;
    };


    that.front = function () {
        if (length === 0) {
            return null;
        }
        return container[head];
    };

    that.length = function () {
        return length;
    };

    that.isEmpty = function () {
        return length === 0;
    };

    return that;
}

//0 Left, 1 Right, 2 Middle, Dont even Ask

const fight = (state) => {
    let b = new Boss(state.challengeNumber + 1);

    //[ref, shpen, deinc, regen, leech]
    let drones = state.drones;
    let armorPen = 1.0 + shieldPenDrone[drones[1]];
    let leech = drones[4] != -1 ? leechDrone[drones[4]] : 0;
    let reflection = reflectionDrone[drones[0]];
    let regen = regenDrone[drones[3]];
    let deadlyInc = deadlyIncDrone[drones[2]];
    let absorptions = [state.leftShip.reactor * 0.02, state.rightShip.reactor * 0.02, state.middleShip.reactor * 0.02];
    let speeds = [state.leftShip.speed, state.rightShip.speed, state.middleShip.speed, b.speed];
    let healths = [
        state.leftShip.hp * state.healthMult, state.rightShip.hp * state.healthMult,
        state.middleShip.hp * state.healthMult, b.hp
    ];
    let maxHealths = [
        state.leftShip.hp * state.healthMult, state.rightShip.hp * state.healthMult,
        state.middleShip.hp * state.healthMult, b.hp
    ];
    let regens = [healths[0] * regen, healths[1] * regen, healths[2] * regen];
    let armors = [
        state.leftShip.armor, state.rightShip.armor,
        state.middleShip.armor, b.shield
    ];
    let damages = [
        state.leftShip.damage * state.damageMult, state.rightShip.damage * state.damageMult,
        state.middleShip.damage * state.damageMult, b.attack
    ];
    let attackTimer = Math.max(...speeds);// * 10.0;
    let attackTimers = [attackTimer, attackTimer, attackTimer * 1.5, attackTimer];
    //        System.out.println(Arrays.toString(speeds));
    let time = 0.0;
    let deadShips = 0;

    let damageToShield = damages[2] * armorPen * 1 / (1 + b.absorption);
    let damageToHp = Math.max(damageToShield - armors[3], 0.0) * (1 + b.absorption) / armorPen;
    armors[3] -= armors[3] - damageToShield < 0 ? armors[3] : damageToShield;
    healths[3] -= damageToHp;
    if (healths[3] <= 0) {
        return 0.0;
    }

    healths[2] = (healths[2] + regens[2] + leech * damageToHp) > maxHealths[2] ? maxHealths[2] : healths[2] + regens[2] + leech * damageToHp;
    //        System.out.println("ship 2 attacks for: " + damageToShield + ", " + damageToHp);
    //        System.out.println("boss hp: " + healths[3] + ", " + armors[3]);
    //        System.out.println("Attack 2");
    while (!(healths[0] < 0 && healths[1] < 0 && healths[2] < 0) || healths[3] > 0) {
        let attacks = [-1, -1, -1, -1];
        for (let i = 0; i < attackTimers.length; i++) {
            attackTimers[i] -= speeds[i];
            if (attackTimers[i] <= 0) {
                attacks[i] = Math.abs(attackTimers[i] / speeds[i]) == 0 ? 1 : Math.abs(attackTimers[i] / speeds[i]);
                attackTimers[i] += (i == 2 ? attackTimer * 1.5 : attackTimer);
            }
        }

        let order = [0, 1, 2, 3];
        order.sort((a, b) => {
            return attacks[a] - attacks[b];
        });
        // console.log(attackTimers);
        // console.log(order);

        for (let i = 0; i < order.length; i++) {
            if (order[i] == 3 && attacks[order[i]] >= 0) {
                //boss attacks
                //                    System.out.println("\t\t\t\t\t\tAttack B");
                if (healths[2] >= 0) {
                    let dmgToS = b.attack / (1 + absorptions[2]);
                    let dmgToH = Math.max(dmgToS - armors[2], 0) * (1 + absorptions[2]);

                    let refS = (Math.min(dmgToS, armors[2]) + dmgToH) * reflection / (1 + b.absorption);
                    let refH = Math.max(refS - armors[3], 0.0) * (1 + b.absorption);
                    armors[2] -= armors[2] - dmgToS < 0 ? armors[2] : dmgToS;
                    healths[2] -= dmgToH;
                    if (armors[3] > 0) {
                        armors[3] -= refS;
                        if (armors[3] <= 0) {
                            armors[3] = 0.0;
                            healths[3] -= refH;
                        }
                    } else {
                        healths[3] -= refH;
                    }
                    //                        System.out.println("boss attacks 2 for ");
                    //                        System.out.println("dmgH: " + dmgToH);
                    //                        System.out.println("dmgS: " + dmgToS);
                    //                        System.out.println("hp: " + healths[2]);
                    //                        System.out.println("ar: " + armors[2]);
                    //                        System.out.println("boss gets armor reflect " + refS + " hp reflect " + refH);
                    if (healths[2] <= 0) {
                        deadShips++;
                        //                            System.out.println("killed ship 2");
                    }
                } else if (healths[0] >= 0) {
                    let dmgToS = b.attack / (1 + absorptions[0]);
                    let dmgToH = Math.max(dmgToS - armors[0], 0) * (1 + absorptions[0]);

                    let refS = (Math.min(dmgToS, armors[0]) + dmgToH) * reflection / (1 + b.absorption);
                    let refH = Math.max(refS - armors[3], 0.0) * (1 + b.absorption);
                    armors[0] -= armors[0] - dmgToS < 0 ? armors[0] : dmgToS;
                    healths[0] -= dmgToH;
                    if (armors[3] > 0) {
                        armors[3] -= refS;
                        if (armors[3] <= 0) {
                            armors[3] = 0.0;
                            healths[3] -= refH;
                        }
                    } else {
                        healths[3] -= refH;
                    }
                    //                        System.out.println("boss attacks 2 for ");
                    //                        System.out.println("dmgH: " + dmgToH);
                    //                        System.out.println("dmgS: " + dmgToS);
                    //                        System.out.println("hp: " + healths[0]);
                    //                        System.out.println("ar: " + armors[0]);
                    //
                    //                        System.out.println("boss gets armor reflect " + refS + " hp reflect " + refH);
                    if (healths[0] <= 0) {
                        deadShips++;
                        //                            System.out.println("killed ship 0");
                    }
                } else if (healths[1] >= 0) {
                    let dmgToS = b.attack / (1 + absorptions[1]);
                    let dmgToH = Math.max(dmgToS - armors[1], 0) * (1 + absorptions[1]);

                    let refS = (Math.min(dmgToS, armors[1]) + dmgToH) * reflection / (1 + b.absorption);
                    let refH = Math.max(refS - armors[3], 0.0) * (1 + b.absorption);
                    armors[1] -= armors[1] - dmgToS < 0 ? armors[1] : dmgToS;
                    healths[1] -= dmgToH;
                    if (armors[3] > 0) {
                        armors[3] -= refS;
                        if (armors[3] <= 0) {
                            armors[3] = 0.0;
                            healths[3] -= refH;
                        }
                    } else {
                        healths[3] -= refH;
                    }
                    //                        System.out.println("boss attacks 2 for ");
                    //                        System.out.println("dmgH: " + dmgToH);
                    //                        System.out.println("dmgS: " + dmgToS);
                    //                        System.out.println("hp: " + healths[1]);
                    //                        System.out.println("ar: " + armors[1]);
                    //
                    //                        System.out.println("boss gets armor reflect " + refS + " hp reflect " + refH);
                    if (healths[1] <= 0) {
                        //                            System.out.println("killed ship 1");
                        //                            System.out.println(armors[3]);
                        // console.log(healths);
                        return healths[3] + refH;
                    }
                } else {
                    //                        System.out.println(b.getIndex());
                    //                        System.out.println(Arrays.toString(healths));
                    // console.log(healths);
                    return healths[3];
                }
                if (healths[3] <= 0) {
                    // console.log(healths);
                    return 0.0;
                }
            } else if (attacks[order[i]] >= 0 && healths[order[i]] > 0) {
                //ship i attacks
                damageToShield = damages[order[i]] * armorPen * (1.0 + deadlyInc * deadShips) / (1 + b.absorption);
                damageToHp = Math.max(damageToShield - armors[3], 0.0) * (1 + b.absorption) / armorPen;
                armors[3] -= armors[3] - damageToShield < 0 ? armors[3] : damageToShield;
                healths[3] -= damageToHp;
                if (healths[3] <= 0) {
                    // console.log(healths);
                    return 0.0;
                }
                healths[order[i]] = (healths[order[i]] + regens[order[i]] + leech * damageToHp > maxHealths[order[i]]) ?
                    maxHealths[order[i]] : (healths[order[i]] + regens[order[i]] + leech * damageToHp);
                //                    System.out.println("ship "+order[i]+" attacks for: " + damageToShield + ", " + damageToHp);
                //                    System.out.println("regens " + (regens[order[i]] + leech * damageToHp));
                //                    StringBuilder sb = new StringBuilder();
                //                    for (int j = order[i]; j < 2; j++) {
                //                        sb.append("\t\t");
                //                    }
                //                    sb.append("Attack ");
                //                    sb.append(order[i]);
                //                    System.out.println(sb);
                //                    System.out.println("boss hp: " + healths[3] + ", " + armors[3]);
            }
        }
        //            System.out.println("-------------------------");
    }
    // console.log(healths);
    return 0.0;
}

const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

const WEAPON = 0;
const REACTOR = 1;
const HULL = 2;
const WINGS = 3;
class ArenaProblem {

    constructor(node) {
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

class NodeSA {

    constructor(totalUlt, totalImatter, challengeNumber, totalPCores, leftShip, middleShip,
        rightShip, drones, healthTrophy, damageTrophy, damageMult, healthMult, currUlt, currImatter, rule) {
        this.totalUlt = totalUlt;
        this.totalImatter = totalImatter;
        this.currUlt = currUlt;
        this.currImatter = currImatter;
        this.challengeNumber = challengeNumber;
        this.totalPCores = totalPCores;
        this.leftShip = leftShip;
        this.middleShip = middleShip;
        this.rightShip = rightShip;
        this.drones = drones;
        this.healthTrophy = healthTrophy;
        this.damageTrophy = damageTrophy;
        this.initDamageMult = damageMult;
        this.initHealthMult = healthMult;
        this.damageMult = damageMult * (1.0 + (damageTrophy * 0.01));
        this.healthMult = healthMult * (1.0 + (healthTrophy * 0.01));
        this.hpLeft = 99999.0;
        this.trophyPoints = trophyPoints(this);
        this.rule = rule;
        this.parent = null;
        this.minTrophy = 50;
    }


    setParent = p => {
        this.parent = p;
    }

    calcTrophyPoints() {
        this.trophyPoints = trophyPoints(this);
    }

    canBuyTrophies(health, damage) {
        return this.trophyPoints >= 5 * health * (health + 1) / 2 + 5 * damage * (damage + 1) / 2;
    }

    //0 left, 1 middle, 2 right
    //0 weapon, 1 reactor, 2 hull, 3 wings
    //TODO: usar getLevel
    canBuy(ship, part) {
        switch (ship) {
            case 0:
                switch (part) {
                    case 0:
                        return (ultCost[this.leftShip.weapon + 1] <= this.currUlt && imatterCost[this.leftShip.weapon + 1] <= this.currImatter) //tiene la guita
                            && this.leftShip.weapon < 30;
                    case 1:
                        return ultCost[this.leftShip.reactor + 1] <= this.currUlt && imatterCost[this.leftShip.reactor + 1] <= this.currImatter;
                    case 2:
                        return (ultCost[this.leftShip.hull + 1] <= this.currUlt && imatterCost[this.leftShip.hull + 1] <= this.currImatter)
                            && this.leftShip.hull + 10 < this.rightShip.hull;
                    case 3:
                        return (ultCost[this.leftShip.wing + 1] <= this.currUlt && imatterCost[this.leftShip.wing + 1] <= this.currImatter);
                }
            case 1:
                switch (part) {
                    case 0:
                        return (ultCost[this.middleShip.weapon + 1] <= this.currUlt && imatterCost[this.middleShip.weapon + 1] <= this.currImatter)
                            //                                && middleShip.weapon < 30;
                            ;
                    case 1:
                        return ultCost[this.middleShip.reactor + 1] <= this.currUlt && imatterCost[this.middleShip.reactor + 1] <= this.currImatter;
                    case 2:
                        return (ultCost[this.middleShip.hull + 1] <= this.currUlt && imatterCost[this.middleShip.hull + 1] <= this.currImatter)
                            //                                ;
                            && this.middleShip.hull + 10 < this.rightShip.hull
                    case 3:
                        return ultCost[this.middleShip.wing + 1] <= this.currUlt && imatterCost[this.middleShip.wing + 1] <= this.currImatter;
                }
            case 2:
                switch (part) {
                    case 0:
                        return ultCost[this.rightShip.weapon + 1] < this.currUlt && imatterCost[this.rightShip.weapon + 1] < this.currImatter;
                    case 1:
                        return ultCost[this.rightShip.reactor + 1] < this.currUlt && imatterCost[this.rightShip.reactor + 1] < this.currImatter;
                    case 2:
                        return ultCost[this.rightShip.hull + 1] < this.currUlt && imatterCost[this.rightShip.hull + 1] < this.currImatter;
                    case 3:
                        return (ultCost[this.rightShip.wing + 1] < this.currUlt && imatterCost[this.rightShip.wing + 1] < this.currImatter)
                            ;
                    //                                && rightShip.weapon > rightShip.wing;
                }
        }
        return false;
    }

    upDrone(drone) {
        this.drones[drone]++;
        this.currImatter -= droneCost[this.drones[drone]];
    }

    canBuyDrone(drone) {
        if (this.drones[drone] + 1 > 25) {
            return false;
        }
        if (drone > 2 && (this.drones[0] != 25 || this.drones[1] != 25 || this.drones[2] != 25)) {
            return false;
        }
        return droneCost[this.drones[drone] + 1] <= this.currImatter; //droneCost;
    }

    setPart(ship, part) {
        switch (ship) {
            case 0:
                this.currUlt -= ultCost[this.getLevel(ship, part) + 1];
                this.currImatter -= imatterCost[this.getLevel(ship, part) + 1];
                this.leftShip.setPart(part);
                return;
            case 1:
                this.currUlt -= ultCost[this.getLevel(ship, part) + 1];
                this.currImatter -= imatterCost[this.getLevel(ship, part) + 1];
                this.middleShip.setPart(part);
                return;
            case 2:
                this.currUlt -= ultCost[this.getLevel(ship, part) + 1];
                this.currImatter -= imatterCost[this.getLevel(ship, part) + 1];
                this.rightShip.setPart(part);
                return;
        }
    }

    getLevel(ship, part) {
        switch (ship) {
            case 0:
                switch (part) {
                    case 0:
                        return this.leftShip.weapon;
                    case 1:
                        return this.leftShip.reactor;
                    case 2:
                        return this.leftShip.hull;
                    case 3:
                        return this.leftShip.wing;
                }
            case 1:
                switch (part) {
                    case 0:
                        return this.middleShip.weapon;
                    case 1:
                        return this.middleShip.reactor;
                    case 2:
                        return this.middleShip.hull;
                    case 3:
                        return this.middleShip.wing;
                }
            case 2:
                switch (part) {
                    case 0:
                        return this.rightShip.weapon;
                    case 1:
                        return this.rightShip.reactor;
                    case 2:
                        return this.rightShip.hull;
                    case 3:
                        return this.rightShip.wing;
                }
        }
        return 0;
    }

    getShipPower() {
        let dronesP = this.drones[0] * 5 + this.drones[1] * 5 + this.drones[2] * 5 + this.drones[3] * 5 + this.drones[4] * 5 + 200;
        return this.leftShip.power + this.middleShip.power + this.rightShip.power + dronesP;
    }

    clone() {
        return new NodeSA(this.totalUlt, this.totalImatter, this.challengeNumber, this.totalPCores, this.leftShip.clone(), this.middleShip.clone(),
            this.rightShip.clone(), [...this.drones], this.healthTrophy, this.damageTrophy, this.initDamageMult, this.initHealthMult, this.currUlt, this.currImatter, this.rule);
    }

    setHpLeft() {
        this.hpLeft = fight(this);
    }

    setHealthTrophy(v) {
        this.healthMult = this.initHealthMult * (1.0 + (v * 0.01));
        this.healthTrophy = v;
    }

    setDamageTrophy(v) {
        this.damageMult = this.initDamageMult * (1.0 + (v * 0.01));
        this.damageTrophy = v;
    }

    doTrophies() {
        this.calcTrophyPoints();
        let cut = 110; // >100 al principio pq sino no calcula con 100
        let ht = this.healthTrophy;
        for (let i = this.healthTrophy; i < cut; i++) {
            if (!this.canBuyTrophies(i, 0) || i > 100) {
                i = this.minTrophy;
                cut = ht;
                continue;
            }
            let tfy = this.maxTrophies(i);
            if (tfy[1] <= this.minTrophy || tfy[0] <= this.minTrophy)
                continue;
            i = tfy[0];
            this.setHealthTrophy(tfy[0]);
            this.setDamageTrophy(tfy[1]);
            this.setHpLeft();
            if (this.hpLeft <= 0)
                return true;
        }
        return false;
    }

    maxTrophies(health) {
        // >= 5*health*(health+1)/2 + 5*damage*(damage+1)/2;
        let healthPoints = 5 * health * (health + 1) / 2;

        let c = (this.trophyPoints - healthPoints) * 2.0 / 5.0;
        let damage1 = (-1 + Math.sqrt(1 - (4 * (-c)))) / 2;
        let damage2 = (-1 - Math.sqrt(1 - (4 * (-c)))) / 2;
        let damage = damage1 >= 0 ? Math.floor(damage1) : Math.floor(damage2);
        if (damage >= 100)
            damage = 100;
        let damagePoints = 5 * damage * (damage + 1) / 2;

        c = (this.trophyPoints - damagePoints) * 2.0 / 5.0;
        let health1 = (-1 + Math.sqrt(1 - (4 * (-c)))) / 2;
        let health2 = (-1 - Math.sqrt(1 - (4 * (-c)))) / 2;
        health = health1 >= 0 ? Math.floor(health1) : Math.floor(health2);
        if (health >= 100)
            health = 100;
        return [health, damage];
    }


    equals(o) {
        if (this === o) return true;
        let stateSA = o;
        return this.challengeNumber == stateSA.challengeNumber &&
            this.leftShip.equals(stateSA.leftShip) &&
            this.middleShip.equals(stateSA.middleShip) &&
            this.rightShip.equals(stateSA.rightShip) &&
            this.drones[0] == stateSA.drones[0] &&
            this.drones[1] == stateSA.drones[1] &&
            this.drones[2] == stateSA.drones[2] &&
            this.drones[3] == stateSA.drones[3] &&
            this.drones[4] == stateSA.drones[4];
    }

    equalsEnd(o) {
        if (this === o) return true;
        let stateSA = o;
        return this.damageTrophy == stateSA.damageTrophy &&
            this.healthTrophy == stateSA.healthTrophy &&
            this.leftShip.equals(stateSA.leftShip) &&
            this.middleShip.equals(stateSA.middleShip) &&
            this.rightShip.equals(stateSA.rightShip) &&
            this.drones[0] == stateSA.drones[0] &&
            this.drones[1] == stateSA.drones[1] &&
            this.drones[2] == stateSA.drones[2] &&
            this.drones[3] == stateSA.drones[3] &&
            this.drones[4] == stateSA.drones[4];
    }

    // public int hashCode() {

    //     int result = Objects.hash(challengeNumber, leftShip, middleShip, rightShip);
    //     result = 31 * result + Arrays.hashCode(drones);
    //     return result;
    // }

    upChall() {
        this.totalUlt += bossUltinum[this.challengeNumber + 1];
        this.totalImatter += bossImatter[this.challengeNumber + 1];
        this.totalPCores += bossUltinum[this.challengeNumber + 1] * 2.5;
        this.currImatter += bossImatter[this.challengeNumber + 1];
        this.currUlt += bossUltinum[this.challengeNumber + 1];
        this.challengeNumber++;
    }

    toString() {

        return "Challenge: " + this.challengeNumber + "\n " + this.leftShip.toString() + "\n " + this.middleShip.toString() + "\n " + this.rightShip.toString() + "\nH: " + this.healthTrophy + " D:" + this.damageTrophy +
            " |" + this.drones.toString() + "|";
    }

    toJson() {
        return "{\"testMilitaryChallenge\": " + this.challengeNumber + ", \"testShip1\": " + this.leftShip.toJson() + ", \"testShip2\": " + this.middleShip.toJson() + ", \"testShip3\": " + this.rightShip.toJson() + ", " +
            "\"testDrones\": [[" + this.drones[0] + "],[" + this.drones[1] + "],[" + this.drones[2] + "],[" + this.drones[3] + "],[" + this.drones[4] + "]], \"testFourthDrone\": \"Regen\", \"testFifthDrone\": \"Leech\", " +
            "\"bonuses\":[[0],[0],[0],[0],[0],[0],[0],[" + this.healthTrophy + "],[" + this.damageTrophy + "]]}";
    }

    toStringSec() {
        return this.challengeNumber + "-" + this.leftShip.toString() + "-" + this.middleShip.toString() + "-" + this.rightShip.toString() + "-" + this.healthTrophy + "-" + this.damageTrophy +
            "-" + this.drones.toString();
    }

    toByteArray() {
        let bi = `0b\
${this.middleShip.weapon.toString(2).padStart(8, '0')}\
${this.rightShip.weapon.toString(2).padStart(8, '0')}\
${this.leftShip.hull.toString(2).padStart(8, '0')}\
${this.middleShip.hull.toString(2).padStart(8, '0')}\
${this.rightShip.hull.toString(2).padStart(8, '0')}\
${this.rightShip.wing.toString(2).padStart(8, '0')}\
${this.challengeNumber.toString(2).padStart(10, '0')}\
${this.drones[0].toString(2).padStart(5, '0')}\
${this.drones[1].toString(2).padStart(5, '0')}\
${this.drones[2].toString(2).padStart(5, '0')}\
${this.drones[3].toString(2).padStart(5, '0')}\
${this.drones[4].toString(2).padStart(5, '0')}`;
        return BigInt(bi);
    }
}

class DroneRule {

    constructor(drone) {
        this.drone = drone;
        this.level = 0;
        this.cost = 0;
    }

    clone() {
        return new DroneRule(this.drone);
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

class ShipRule {
    //0 left, 1 middle, 2 right
    //0 weapon, 1 reactor, 2 hull, 3 wings

    constructor(ship, part) {
        this.ship = ship;
        this.part = part;
        this.cost = 0;
        this.level = 0;
    }

    toString() {
        let shipPos;
        let partPos;
        switch (this.ship) {
            case 0:
                shipPos = "Left";
                break;
            case 1:
                shipPos = "Middle";
                break;
            case 2:
                shipPos = "Right";
                break;
            default:
                shipPos = "Invalid";
                break;
        }
        switch (part) {
            case 0:
                partPos = "Weapon";
                break;
            case 1:
                partPos = "Reactor";
                break;
            case 2:
                partPos = "Hull";
                break;
            case 3:
                partPos = "Wings";
                break;
            default:
                partPos = "Invalid";
        }
        return shipPos + " ship: Upgrade " + partPos + " to level " + level;
    }

    applyToState(o) {
        let clone = o.clone();
        switch (this.ship) {
            case (0): {
                clone.setPart(this.ship, this.part);
                break;
            }
            case (1): {
                clone.setPart(this.ship, this.part);
                break;
            }
            case (2): {
                clone.setPart(this.ship, this.part);
                break;
            }
        }
        this.level = clone.getLevel(this.ship, this.part);
        return clone;
    }

    postApplyToState(s) {
        if (s.doTrophies()) {
            s.upChall();
        }
    }
}

class Ship {
    constructor(we, r, h, wi) {
        this.hull = h;
        this.weapon = we;
        this.reactor = r;
        this.wing = wi;
        this.hp = hull2hp[h];
        this.armor = reactor2armor[r];
        this.damage = weapon2damage[we];
        this.speed = wings2speed[wi];
        this.power = level2power[we] + level2power[h] + level2power[r] + level2power[wi] + 80;
    }

    clone() {
        return new Ship(this.weapon, this.reactor, this.hull, this.wing);
    }

    setPart(part) {
        switch (part) {
            case 0:
                this.weapon++;
                break;
            case 1:
                this.reactor++;
                break;
            case 2:
                this.hull++;
                break;
            case 3:
                this.wing++;
                break;
        }
    }

    equals(o) {
        if (this == o) return true;
        let ship = o;
        return this.hull == ship.hull &&
            this.reactor == ship.reactor &&
            this.weapon == ship.weapon &&
            this.wing == ship.wing;
    }

    // hashCode() {
    //     return Object.hash(hull, reactor, weapon, wing);
    // }

    toString() {
        return " |" + this.weapon + "-" + this.reactor + "-" + this.hull + "-" + this.wing + "| ";
    }

    toJson() {
        return "[[" + this.weapon + "],[" + this.reactor + "],[" + this.hull + "],[" + this.wing + "]]";
    }


}




const calcDroneCost = () => {
    return [0, 50, 100, 150, 200, 275, 350, 425, 500, 575, 700, 825, 950, 1075, 1200, 1400, 1600, 1800, 2000, 2200, 2500, 2800, 3100, 3400, 3700, 4125]
}




const calcImatterCost = () => {
    let arr = []
    arr[0] = 0;
    for (let i = 1; i < 500; i++) {
        arr[i] = i * 5 * Math.ceil((i + 6.0) / 5.0);
    }
    return arr;
}

const calcUltCost = () => {
    let arr = [];
    arr[0] = 0;
    for (let i = 1; i < 500; i++) {
        arr[i] = i * 5 * Math.ceil((i + 1.0) / 5.0);
    }
    return arr;
}

const calcRegenDrone = () => {
    let arr = [];
    arr[0] = 0.005;
    for (let i = 1; i < 26; i++) {
        arr[i] = arr[i - 1] + 0.002;
    }
    return arr;
}

const calcLeechDrone = () => {
    let arr = [];
    arr[0] = 0.04;
    for (let i = 1; i < 26; i++) {
        arr[i] = arr[i - 1] + 0.015;
    }
    return arr;
}

const calcShieldPenDrone = () => {
    let arr = [];
    arr[0] = 0.05;
    for (let i = 1; i < 26; i++) {
        arr[i] = arr[i - 1] + 0.015;
    }
    return arr;
}

const calcReflectionDrone = () => {
    let arr = [];
    arr[0] = 0.03;
    for (let i = 1; i < 26; i++) {
        arr[i] = arr[i - 1] + 0.01;
    }
    return arr;
}

const calcDeadlyIncDrone = () => {
    let arr = [];
    arr[0] = 0.02;
    for (let i = 1; i < 26; i++) {
        arr[i] = arr[i - 1] + 0.01;
    }
    return arr;
}


const calcBossHp = () => {
    let hp = [];
    hp[0] = 0.0;
    for (let i = 1; i < 750; i++) {
        hp[i] = Math.floor((60 + 20 * (i - 1 + Math.max(0, i - 500))) * (1 + Math.floor((i - 1) / 5) / 20));
    }
    return hp;
}

const calcBossAttack = () => {
    //=(10+2.5*(index-1+max(0,index-500)))*(1+ROUNDDOWN((index-1)/5)/20)
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i < 750; i++) {
        arr[i] = ((10 + 2.5 * (i - 1 + Math.max(0, i - 500))) * (1 + Math.floor((i - 1) / 5) / 20));
    }
    return arr;
}

const calcBossShield = () => {
    //=(0+10*(index-1+max(0,index-500)))*(1+ROUNDDOWN((index-1)/5,0)/20)
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i < 750; i++) {
        arr[i] = ((10 * (i - 1 + Math.max(0, i - 500))) * (1 + Math.floor((i - 1) / 5) / 20));
    }
    return arr;
}

const calcBossSpeed = () => {
    //=(10+0.8*(A5-1+max(0,A5-500)))*(1+ROUNDDOWN((A5-1)/5)/20)
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i < 750; i++) {
        arr[i] = ((10 + 0.8 * (i - 1 + Math.max(0, i - 500))) * (1 + Math.floor((i - 1) / 5) / 20));
    }
    return arr;
}

const calcBossUltinum = () => {
    //=A13*10*IF(MOD(A13,5)=0,2,1)
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i < 750; i++) {
        arr[i] = i * 10.0 * (i % 5 == 0 ? 2.0 : 1.0);
    }
    return arr;
}

const calcBossImatter = () => {
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i < 750; i++) {
        arr[i] = i * 15.0 * (i % 5 == 0 ? 2.0 : 1.0);
    }
    return arr;
}

const calcBossAp = () => {
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i < 750; i++) {
        arr[i] = i * 20.0 * (i % 5 == 0 ? 2.0 : 1.0);
    }
    return arr;
}

const calcPower = () => {
    let power = [];
    power[0] = 0;
    for (let i = 1; i < 750; i++) {
        power[i] = power[i - 1] + 20 + Math.floor(i / 5.0) * 2 + (i % 5 == 0 ? (i - 1) * 2 : 0);
    }
    return power;
}

//    =20+ floor(A6/5)*2 + if(floor(A6/5)=A6/5, (A6-1)*2, 0)

const calcSpeed = () => {
    let speed = [];
    speed[0] = 10.0;
    for (let i = 1; i < 750; i++) {
        //            =(10+0.8*L23)*(1+ROUNDDOWN(L23/5,0)/20)
        //            speed[i] = (0.81 + 0.04 * Math.floor(i/5.0)) * i - (i % 5) / 100.0;
        speed[i] = (10 + 0.8 * i) * (1 + Math.floor(i / 5.0) / 20.0);
    }
    return speed;
}

const calcDamage = () => {
    let damage = [];
    damage[0] = 10.0;
    for (let i = 1; i < 750; i++) {
        damage[i] = damage[i - 1] + 2.5 + Math.floor(i / 5.0) / 8.0 + ((i % 5 == 0) ? 0.375 + i * 0.625 / 5.0 : 0.0);
    }
    return damage;
}

const calcArmor = () => {
    let armor = [];
    armor[0] = 0.0;
    for (let i = 1; i < 750; i++) {
        armor[i] = armor[i - 1] + 10 + Math.floor(i / 5.0) / 2.0 + ((i % 5 == 0) ? i * 1.0 / 2.0 - 0.5 : 0.0);
    }
    return armor;
}

const calcHp = () => {
    let hp = [];
    hp[0] = 60;
    for (let i = 1; i < 750; i++) {
        hp[i] = hp[i - 1] + 20 + (i % 5 == 0 ? 2 + i * 6.0 / 5.0 : Math.floor(i / 5.0));
    }
    return hp;
}

const trophyPoints = s => {
    // let seriesLvl = s.getChallengeNumber();
    // let imatterLvl = (int) Math.floor(Math.sqrt((s.getTotalImatter() - 20) / 20) + 1);
    // let pcoresLvl = (int) Math.floor(Math.sqrt((s.getTotalPCores() - 20) / 20) + 1);
    // let ultinumLvl = (int) Math.floor(Math.sqrt((s.getTotalUlt() - 20) / 20) + 1);
    // int powerLvl = (int) Math.floor(Math.sqrt((s.getShipPower() - 25) / 5) + 1);
    // int imatterTfy = 0;
    // int pcoresTfy = 0;
    // int ultinumTfy = 0;
    // int seriesTfy = 0;
    // int powerTfy = 0;
    // while (imatterLvl > 0 || pcoresLvl > 0 || ultinumLvl > 0 || seriesLvl > 0 || powerLvl > 0) {
    //     if (imatterLvl > 0) {
    //         imatterTfy += imatterLvl;
    //         imatterLvl -= 10;
    //     }
    //     if (pcoresLvl > 0) {
    //         pcoresTfy += pcoresLvl;
    //         pcoresLvl -= 10;
    //     }
    //     if (ultinumLvl > 0) {
    //         ultinumTfy += ultinumLvl;
    //         ultinumLvl -= 10;
    //     }
    //     if (seriesLvl > 0) {
    //         seriesTfy += seriesLvl;
    //         seriesLvl -= 10;
    //     }
    //     if (powerLvl > 0) {
    //         powerTfy += powerLvl;
    //         powerLvl -= 10;
    //     }
    // }
    // return imatterTfy + pcoresTfy + ultinumTfy + seriesTfy * 2 + powerTfy;
    return 100000;
}

const hull2hp = calcHp();
const reactor2armor = calcArmor();
const weapon2damage = calcDamage();
const wings2speed = calcSpeed();
const level2power = calcPower();
const bossHp = calcBossHp();
const bossAttack = calcBossAttack();
const bossShield = calcBossShield();
const bossSpeed = calcBossSpeed();
const bossUltinum = calcBossUltinum();
const bossImatter = calcBossImatter();
const bossAP = calcBossAp();
const regenDrone = calcRegenDrone();
const leechDrone = calcLeechDrone();
const shieldPenDrone = calcShieldPenDrone();
const reflectionDrone = calcReflectionDrone();
const deadlyIncDrone = calcDeadlyIncDrone();
const ultCost = calcUltCost();
const imatterCost = calcImatterCost();
const droneCost = calcDroneCost();
let minTrophy;


class Boss {

    constructor(index) {
        this.index = index;
        this.hp = bossHp[index];
        this.attack = bossAttack[index];
        this.shield = bossShield[index];
        this.speed = bossSpeed[index];
        this.ultinum = bossUltinum[index];
        this.imatter = bossImatter[index];
        this.ap = bossAP[index];
        this.arPen = 1.0;
        this.absorption = (index - 1) * 0.02;
    }

    toString = () => {
        return "HP: " + this.hp + "\n" +
            "Attack: " + this.attack + "\n" +
            "Shield: " + this.shield + "\n" +
            "Speed: " + this.speed + "\n" +
            "Ult: " + this.ultinum + "\n" +
            "I-matter: " + this.imatter + "\n" +
            "AP: " + this.ap + "\n";
    }
}


const runWorker = (e) => {

    let l = new Ship(e.weL, e.reL, e.huL, e.wiL);
    let m = new Ship(e.weM, e.reM, e.huM, e.wiM);
    let r = new Ship(e.weR, e.reR, e.huR, e.wiR);
    let s = new NodeSA(e.totalUlt, e.totalIm, e.stage, e.totalPCores, l, m, r, [e.ref, e.shp, e.di, e.reg, e.lec], 0, 0, e.dmgMult, e.hpMult, e.currUlt, e.currIm, null)

    let p = new ArenaProblem(s);
    let pEngine = new Engine(p, 750);

    let solutions = pEngine.findSolution();
    self.postMessage(solutions);
    // if (solutions[0].length > 0) {
    //     listRules(solutions[0], true);
    //     // listRules(solutions[1], false);
    // } else {
    //     console.log("There was no solution found");
    // }
}

self.addEventListener('message', e => {
    runWorker(e.data);
})