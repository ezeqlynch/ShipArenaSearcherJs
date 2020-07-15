const runWorker = () => {

    let orbBonus = +document.getElementById("orbBonus").value;
    let guildBonus = +document.getElementById("guildBonus").value;
    let saBonus = +document.getElementById("saBonus").value;
    let legBonus = +document.getElementById("legBonus").value;
    let dmAsc = +document.getElementById("dmAsc").value;
    let hpAsc = +document.getElementById("hpAsc").value;
    let currUlt = +document.getElementById("currUlt").value;
    let currIm = +document.getElementById("currIm").value;
    let stage = +document.getElementById("stage").value;
    let totalUlt = +document.getElementById("totalUlt").value;
    let totalIm = +document.getElementById("totalIm").value;
    let totalPCores = +document.getElementById("totalPCores").value;
    let dmgMult = (1.0 + orbBonus) * (1.0 + saBonus) * (1.0 + guildBonus) * (1.0 + legBonus) * (1.0 + dmAsc);
    let hpMult = (1.0 + orbBonus) * (1.0 + saBonus) * (1.0 + hpAsc);
    let weL = +document.getElementById("weL").value;
    let weM = +document.getElementById("weM").value;
    let weR = +document.getElementById("weR").value;
    let reL = +document.getElementById("reL").value;
    let reM = +document.getElementById("reM").value;
    let reR = +document.getElementById("reR").value;
    let huL = +document.getElementById("huL").value;
    let huM = +document.getElementById("huM").value;
    let huR = +document.getElementById("huR").value;
    let wiL = +document.getElementById("wiL").value;
    let wiM = +document.getElementById("wiM").value;
    let wiR = +document.getElementById("wiR").value;

    let ref = +document.getElementById("ref").value;
    let shp = +document.getElementById("shp").value;
    let di = +document.getElementById("di").value;
    let reg = +document.getElementById("reg").value;
    let lec = +document.getElementById("lec").value;

    let l = new Ship(weL, reL, huL, wiL);
    let m = new Ship(weM, reM, huM, wiM);
    let r = new Ship(weR, reR, huR, wiR);
    let s = new NodeSA(totalUlt, totalIm, stage, totalPCores, l, m, r, [ref, shp, di, reg, lec], 0, 0, dmgMult, hpMult, currUlt, currIm, null)

    let p = new ArenaProblem(s);
    let pEngine = new Engine(p, 900);

    let solutions = pEngine.findSolution();
    if (solutions[0].length > 0) {
        listRules(solutions[0], true);
        // listRules(solutions[1], false);
    } else {
        console.log("There was no solution found");
    }
}

self.addEventListener('message', e => {
    runWorker();
})