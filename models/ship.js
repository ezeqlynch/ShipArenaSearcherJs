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

    // equals(o) {
    //     if (this == o) return true;
    //     if (o == null) return false;
    //     let ship = o;
    //     return hull == ship.hull &&
    //         reactor == ship.reactor &&
    //         weapon == ship.weapon &&
    //         wing == ship.wing;
    // }

    // hashCode() {
    //     return Object.hash(hull, reactor, weapon, wing);
    // }

    toString() {
        return " |" + weapon + "-" + reactor + "-" + hull + "-" + wing + "| ";
    }

    toJson() {
        return "[[" + weapon + "],[" + reactor + "],[" + hull + "],[" + wing + "]]";
    }


}