class NodeSA {

    constructor(totalUlt, totalImatter, challengeNumber, totalPCores, leftShip, middleShip,
        rightShip, drones, healthTrophy, damageTrophy, damageMult, healthMult, currUlt, currImatter, rule,
        expedPoints, fuelUpgrades, totalLab, trophies) {
        this.totalUlt = totalUlt;
        this.totalImatter = totalImatter;
        this.currUlt = currUlt;
        this.currImatter = currImatter;
        this.challengeNumber = challengeNumber;
        this.totalPCores = totalPCores;
        this.expedPoints = expedPoints;
        this.fuelUpgrades = fuelUpgrades;
        this.totalLab = totalLab;
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
        this.trophies = trophies;
    }


    setParent = p => {
        this.parent = p;
    }

    calcTrophyPoints() {
        this.trophyPoints = trophyPoints(this);
    }

    canBuyTrophies(health, damage) {
        return this.trophyPoints >= health * (health + 1) / 2 + damage * (damage + 1) / 2;
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

    upDrone (drone) {
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
            this.rightShip.clone(), [...this.drones], this.healthTrophy, this.damageTrophy, this.initDamageMult, this.initHealthMult, this.currUlt, this.currImatter, this.rule,
            this.expedPoints, this.fuelUpgrades, this.totalLab, this.trophies);
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
        if(this.trophies) {
            this.setHealthTrophy(100);
            this.setDamageTrophy(100);
            this.setHpLeft();
            // console.log(`${this.hpLeft}, ${this.damageTrophy}, ${this.healthTrophy}, ${this.challengeNumber+1}`);
            return this.hpLeft <= 0;
        }
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
            // console.log(`${this.hpLeft}, ${this.damageTrophy}, ${this.healthTrophy}, ${this.challengeNumber+1}`);
            if (this.hpLeft <= 0)
                return true;
        }
        return false;
    }

    maxTrophies(health) {
        // >= 5*health*(health+1)/2 + 5*damage*(damage+1)/2;
        let healthPoints = health * (health + 1) / 2;

        let c = (this.trophyPoints - healthPoints) * 2.0;
        let damage1 = (-1 + Math.sqrt(1 - (4 * (-c)))) / 2;
        let damage2 = (-1 - Math.sqrt(1 - (4 * (-c)))) / 2;
        let damage = damage1 >= 0 ? Math.floor(damage1) : Math.floor(damage2);
        if (damage >= 100)
            damage = 100;
        let damagePoints = damage * (damage + 1) / 2;

        c = (this.trophyPoints - damagePoints) * 2.0;
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
