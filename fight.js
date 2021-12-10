//0 Left, 1 Right, 2 Middle, Dont even Ask

const fight = (state) => {
    let b = new Boss(state.challengeNumber + 1);
    if(state.challengeNumber >= 750) {
        return 99999999;
    }
    //[ref, shpen, deinc, regen, leech]
    let drones = state.drones;
    let armorPen = 1.0 + shieldPenDrone[drones[1]];
    let leech = drones[4] != -1 ? leechDrone[drones[4]] : 0;
    let reflection = reflectionDrone[drones[0]];
    let regen = regenDrone[drones[3]];
    let deadlyInc = deadlyIncDrone[drones[2]];
    let absorptions = [state.leftShip.reactor * 0.02, state.rightShip.reactor * 0.02, state.middleShip.reactor * 0.02 ];
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

        let order = [0,1,2,3];
        order.sort((a,b) => {
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