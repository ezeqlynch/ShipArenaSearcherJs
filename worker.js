const runWorker = (e) => {

    let l = new Ship(e.weL, e.reL, e.huL, e.wiL);
    let m = new Ship(e.weM, e.reM, e.huM, e.wiM);
    let r = new Ship(e.weR, e.reR, e.huR, e.wiR);
    let s = new NodeSA(e.totalUlt, e.totalIm, e.stage, e.totalPCores, 
        l, m, r, [e.ref, e.shp, e.di, e.reg, e.lec], 0, 0, 
        e.dmgMult, e.hpMult, e.currUlt, e.currIm, null, 
        e.expedPoints, e.fuelUpgrades, e.totalLab, e.trophies100, 0);
    let root = s.clone();
    root.challengeNumber = "INIT";
    let p = new ArenaProblem(s);
    let pEngine = new Engine(p, e.max);
    let sols = pEngine.findSolution();
    let truestSols = [];
    sols.forEach(sol => {

        console.log(sol);
        let longPrint = true;
        let list = [];
        let w = sol.parent;
        if (w == null) {
            //console.log("There was nothing to be found.");
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
        let prev = trueList[0];
        let truestList = [root];
        for (let i = 0; i < trueList.length; i++) {
            const r = trueList[i];
            if (prev.equalsEnd(r)) {
                prev = r;
                continue;
            }
            if (r.challengeNumber > currentChallenge) {
                truestList.push(r);
                currentChallenge = r.challengeNumber;
                prev = r;
            }
        }
        if (currentChallenge != trueList[trueList.length - 1].challengeNumber) {
            truestList.push(trueList[trueList.length - 1]);
        }
        console.log(truestList);
        truestList = truestList.map(e => e.toObject());
        truestSols.push(truestList);
    });
    truestSols.sort((a, b) => {
        if(b[b.length-1].challengeNumber == a[a.length - 1].challengeNumber)
            return b[b.length - 1].currUlt - a[a.length - 1].currUlt;
        return b[b.length - 1].challengeNumber - a[a.length - 1].challengeNumber;
    })
    self.postMessage(truestSols);
}

self.addEventListener('message', e => {
    
    runWorker(e.data);
});

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
