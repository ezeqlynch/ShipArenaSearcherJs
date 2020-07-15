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
    runWorker(e);
})