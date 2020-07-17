class Ship {
    constructor (we, r, h, wi) {
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

    toObject() {
        return {
            weapon: this.weapon,
            reactor: this.reactor, 
            hull: this.hull,
            wing: this.wing
        }
    }

}