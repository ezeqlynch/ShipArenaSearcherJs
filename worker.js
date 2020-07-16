const runWorker = (e) => {

    let l = new Ship(e.weL, e.reL, e.huL, e.wiL);
    let m = new Ship(e.weM, e.reM, e.huM, e.wiM);
    let r = new Ship(e.weR, e.reR, e.huR, e.wiR);
    let s = new NodeSA(e.totalUlt, e.totalIm, e.stage, e.totalPCores, 
        l, m, r, [e.ref, e.shp, e.di, e.reg, e.lec], 0, 0, 
        e.dmgMult, e.hpMult, e.currUlt, e.currIm, null, 
        e.expedpoints, e.fuelUpgrades, e.totalLab, e.trophies100)

    let p = new ArenaProblem(s);
    let pEngine = new Engine(p, 750);

    let sol = pEngine.findSolution()[0];
    // if (solutions[0].length > 0) {
    //     listRules(solutions[0], true);
    //     // listRules(solutions[1], false);
    // } else {
    //     console.log("There was no solution found");
    // }
    let list = [];
    let w = sol[0].parent;
    if (w == null) {
        console.log("There was nothing to be found.");
        return;
    }
    list.push(w);
    while (w.parent != null) {

        list.push(w);
        w = w.parent;
    }
    list.push(w);
    list.reverse();
    console.log(list);
    let trueList = [];
    let currCh = 0;
    for (let i = 0; i < list.length; i++) {
        const r = list[i];
        if (currCh != r.challengeNumber) {
            trueList.push(r);
        }
        currCh = r.challengeNumber;
    }
    console.log(trueList);
    let currentChallenge = trueList[0].challengeNumber;
    let sb = '';
    sb = sb.concat(trueList[0].toJson());
    sb = sb.concat('\t');
    if (longPrint) {
        console.log(trueList[0].toString());
        console.log("Beat up to challenge " + currentChallenge);
    }
    let prev = trueList[0];
    let truestList = [];
    for (let i = 0; i < trueList.length; i++) {
        const r = trueList[i];
        if (prev.equalsEnd(r)) {
            prev = r;
            continue;
        }
        if (r.challengeNumber > currentChallenge) {
            sb = sb.concat(r.toJson());
            sb = sb.concat('\t');
            truestList.push(r);
            currentChallenge = r.challengeNumber;
            if (longPrint) {
                console.log(r.toString());
                console.log("Beat up to challenge " + currentChallenge);
            }
            prev = r;
        }
    }
    if (currentChallenge != trueList[trueList.length - 1].challengeNumber) {
        sb = sb.concat(trueList[trueList.length - 1].toJson());
        sb = sb.concat('\t');
        truestList.push(trueList[trueList.length - 1]);
        if (longPrint) {
            console.log(trueList[trueList.length - 1].toString());
            console.log("Beat up to challenge " + trueList[trueList.length - 1].challengeNumber);
        }
    }
    console.log(sb);
    self.postMessage(truestList);
}

self.addEventListener('message', e => {
    importScripts('./models/boss.js');
    importScripts('./models/formulas.js');
    importScripts('./models/node.js');
    importScripts('./models/ship.js');
    importScripts('./rules/droneRule.js');
    importScripts('./rules/shipRule.js');
    importScripts('engine.js');
    importScripts('fight.js');
    importScripts('problem.js');
    importScripts('queue.js');
    runWorker(e.data);
})