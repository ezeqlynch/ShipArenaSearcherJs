class Boss {

    constructor (index) {
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
