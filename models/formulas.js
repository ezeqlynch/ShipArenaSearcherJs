


const calcDroneCost = () => {
    return [0, 50, 100, 150, 200, 275, 350, 425, 500, 575, 700, 825, 950, 1075, 1200, 1400, 1600, 1800, 2000, 2200, 2500, 2800, 3100, 3400, 3700, 4125 ]
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
    for (let i = 1; i <= 750; i++) {
        hp[i] = Math.floor((60 + 20 * (i - 1 + Math.max(0, i - 500))) * (1 + Math.floor((i - 1) / 5) / 20));
    }
    return hp;
}

const calcBossAttack = () => {
    //=(10+2.5*(index-1+max(0,index-500)))*(1+ROUNDDOWN((index-1)/5)/20)
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i <= 750; i++) {
        arr[i] = ((10 + 2.5 * (i - 1 + Math.max(0, i - 500))) * (1 + Math.floor((i - 1) / 5) / 20));
    }
    return arr;
}

const calcBossShield = () => {
    //=(0+10*(index-1+max(0,index-500)))*(1+ROUNDDOWN((index-1)/5,0)/20)
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i <= 750; i++) {
        arr[i] = ((10 * (i - 1 + Math.max(0, i - 500))) * (1 + Math.floor((i - 1) / 5) / 20));
    }
    return arr;
}

const calcBossSpeed = () => {
    //=(10+0.8*(A5-1+max(0,A5-500)))*(1+ROUNDDOWN((A5-1)/5)/20)
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i <= 750; i++) {
        arr[i] = ((10 + 0.8 * (i - 1 + Math.max(0, i - 500))) * (1 + Math.floor((i - 1) / 5) / 20));
    }
    return arr;
}

const calcBossUltinum = () => {
    //=A13*10*IF(MOD(A13,5)=0,2,1)
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i <= 750; i++) {
        arr[i] = i * 10.0 * (i % 5 == 0 ? 2.0 : 1.0);
    }
    return arr;
}

const calcBossImatter = () => {
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i <= 750; i++) {
        arr[i] = i * 15.0 * (i % 5 == 0 ? 2.0 : 1.0);
    }
    return arr;
}

const calcBossAp = () => {
    let arr = [];
    arr[0] = 0.0;
    for (let i = 1; i <= 750; i++) {
        arr[i] = i * 20.0 * (i % 5 == 0 ? 2.0 : 1.0);
    }
    return arr;
}

const calcPower = () => {
    let power = [];
    power[0] = 0;
    for (let i = 1; i <= 750; i++) {
        power[i] = power[i - 1] + 20 + Math.floor(i / 5.0) * 2 + (i % 5 == 0 ? (i - 1) * 2 : 0);
    }
    return power;
}

//    =20+ floor(A6/5)*2 + if(floor(A6/5)=A6/5, (A6-1)*2, 0)

const calcSpeed = () => {
    let speed = [];
    speed[0] = 10.0;
    for (let i = 1; i <= 750; i++) {
        //            =(10+0.8*L23)*(1+ROUNDDOWN(L23/5,0)/20)
        //            speed[i] = (0.81 + 0.04 * Math.floor(i/5.0)) * i - (i % 5) / 100.0;
        speed[i] = (10 + 0.8 * i) * (1 + Math.floor(i / 5.0) / 20.0);
    }
    return speed;
}

const calcDamage = () => {
    let damage = [];
    damage[0] = 10.0;
    for (let i = 1; i <= 750; i++) {
        damage[i] = damage[i - 1] + 2.5 + Math.floor(i / 5.0) / 8.0 + ((i % 5 == 0) ? 0.375 + i * 0.625 / 5.0 : 0.0);
    }
    return damage;
}

const calcArmor = () => {
    let armor = [];
    armor[0] = 0.0;
    for (let i = 1; i <= 750; i++) {
        armor[i] = armor[i - 1] + 10 + Math.floor(i / 5.0) / 2.0 + ((i % 5 == 0) ? i * 1.0 / 2.0 - 0.5 : 0.0);
    }
    return armor;
}

const calcHp = () => {
    let hp = [];
    hp[0] = 60;
    for (let i = 1; i <= 750; i++) {
        hp[i] = hp[i - 1] + 20 + (i % 5 == 0 ? 2 + i * 6.0 / 5.0 : Math.floor(i / 5.0));
    }
    return hp;
}

const trunc = n => {
    return Math.floor(n/10)*10;
}

// cum tfy =TRUNC(LEVEL, -1) / 2 * (TRUNC(LEVEL, -1) / 10 + 1) + (LEVEL - TRUNC(LEVEL, -1)) * (TRUNC(LEVEL, -1) / 10 + 1)
const getTotal = (n, mult) => {
    return ((trunc(n) / 2) * (trunc(n) / 10 + 1) + (n - trunc(n)) * (trunc(n) / 10 + 1)) * mult;
}

const trophyPoints = s => {
    const seriesLvl = Math.floor((s.challengeNumber - 1) / 5) + 1;
    const imatterLvl = Math.floor(Math.pow((s.totalImatter - 10) / 5, 1 / 3)) + 1;
    const pcoresLvl = Math.floor(Math.pow((s.totalPCores - 10) / 5, 1 / 3)) + 1;
    const ultinumLvl = Math.floor(Math.pow((s.totalUlt - 10) / 5, 1 / 3)) + 1;
    const powerLvl = Math.floor(Math.sqrt((s.getShipPower() - 25) / 5) + 1);
    const expedLvl = Math.floor(Math.pow(s.expedPoints / 50, 1 / 3)) + 1;
    const fuelLvl = Math.floor(s.fuelUpgrades / 10);
    const labLvl = Math.floor(s.totalLab / 10) + 1;
    
    const imatterTfy = getTotal(imatterLvl, 3);
    const pcoresTfy = getTotal(pcoresLvl, 3);
    const ultinumTfy = getTotal(ultinumLvl, 3);
    const seriesTfy = getTotal(seriesLvl, 5);
    const powerTfy = getTotal(powerLvl, 5);
    const expedTfy = getTotal(expedLvl, 3);
    const fuelTfy = getTotal(fuelLvl, 5);
    const labTfy = getTotal(labLvl, 3);
    return imatterTfy + pcoresTfy + ultinumTfy + seriesTfy + powerTfy + expedTfy + fuelTfy + labTfy;
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
