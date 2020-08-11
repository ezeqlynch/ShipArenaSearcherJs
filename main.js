window.running = false;
const run = () => {
    if(window.running) {
        return;
    }
    window.worker = new Worker('worker.js');

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
    let expedPoints = +document.getElementById("expedPoints").value;
    let fuelUpgrades = +document.getElementById("fuelUpgrades").value;
    let totalLab = +document.getElementById("totalLab").value;
    let trophies100 = document.getElementById("trophies").checked;
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
    let max = Math.min(+document.getElementById("max").value, 750);
    let payload = {totalUlt, totalIm, stage, totalPCores, expedPoints, fuelUpgrades, totalLab, 
        weL, reL, huL, wiL, weM, reM, huM, wiM, weR, reR, huR, wiR, ref, shp, di, reg, lec, 
        dmgMult, hpMult, currUlt, currIm, trophies100, max}
    window.worker.postMessage(payload);
    window.running = true;
    let best = document.getElementById("best");
    let open = document.getElementById("open");
    let total = document.getElementById("total");
    let time = document.getElementById("time");
    window.worker.onmessage = e=> {
        if (!e.data.state) {
            document.getElementById("open").innerHTML = `Current Open Nodes: ${0}`;
            putOnTable(e.data, false);
            window.running = false;
        } else {
            best.innerHTML = `Current Best ${e.data.state.bestStage}`;
            open.innerHTML = `Current Open Nodes: ${e.data.state.openNodes}`;
            total.innerHTML = `Unique Nodes Checked: ${e.data.state.bestDepths}`;
            time.innerHTML = `Time elapsed: ${e.data.state.time}ms`;
        }
    }


    // let l = new Ship(weL, reL, huL, wiL);
    // let m = new Ship(weM, reM, huM, wiM);
    // let r = new Ship(weR, reR, huR, wiR);
    // let s = new NodeSA(totalUlt, totalIm, stage, totalPCores, l, m, r, [ref, shp, di, reg, lec], 0, 0, dmgMult, hpMult, currUlt, currIm, null, expedPoints, fuelUpgrades, totalLab, trophies100)
    // let root = s.clone();
    // root.challengeNumber = "INIT";

    // let p = new ArenaProblem(s);
    // let pEngine = new Engine(p, 900);
    
    // let solutions = pEngine.findSolution();
    // if (solutions[0].length > 0) {
    //     listRules(solutions[0], true, root);
    //     // listRules(solutions[1], false);
    // } else {
    //     console.log("There was no solution found");
    // }
}

listRules = (sol, longPrint, root) => {
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
    // console.log(list);
    let trueList = [];
    let currCh = 0;
    for (let i = 0; i < list.length; i++) {
        const r = list[i];
        if (currCh != r.challengeNumber) {
            trueList.push(r);
        }
        currCh = r.challengeNumber;
    }
    // console.log(trueList);
    let currentChallenge = trueList[0].challengeNumber;
    let sb = '';
    sb = sb.concat(trueList[0].toJson());
    sb = sb.concat('\t');
    if (longPrint) {
        console.log(trueList[0].toString());
        console.log("Beat up to challenge " + currentChallenge);
    }
    let prev = trueList[0];
    let truestList = [root];
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
    console.log('---');
    // putOnTable(sol);
    putOnTable(truestList);
}

const blue = "background-color: #6d9eeb;";
const green = "background-color: #93c47d;";

// yes, it is ugly
putOnTable = (list) => {
    let prevWeL, prevReL, prevHuL, prevWiL, 
        prevWeM, prevReM, prevHuM, prevWiM, 
        prevWeR, prevReR, prevHuR, prevWiR, 
        prevRef, prevShp, prevDi, prevReg, prevLec, 
        prevDmg, prevHp;

    for (let i = 0; i < list.length; i++) {
        const n = list[i];
        let stage = document.createElement("th");
        stage.className = "removable";
        stage.innerHTML = `--${n.challengeNumber}--`;
        document.getElementById("stageTable").appendChild(stage);

        let weL = document.createElement("td");
        weL.className = "removable";
        weL.innerHTML = n.leftShip.weapon;
        weL.style = prevWeL == undefined || prevWeL == n.leftShip.weapon ? green : blue;
        prevWeL = n.leftShip.weapon;
        document.getElementById("leftWeapon").appendChild(weL);

        let reL = document.createElement("td");
        reL.className = "removable";
        reL.innerHTML = n.leftShip.reactor;
        reL.style = prevReL == undefined || prevReL == n.leftShip.reactor ? green : blue;
        prevReL = n.leftShip.reactor;
        document.getElementById("leftReactor").appendChild(reL);

        let huL = document.createElement("td");
        huL.className = "removable";
        huL.innerHTML = n.leftShip.hull;
        huL.style = prevHuL == undefined || prevHuL == n.leftShip.hull ? green : blue;
        prevHuL = n.leftShip.hull;
        document.getElementById("leftHull").appendChild(huL);

        let wiL = document.createElement("td");
        wiL.className = "removable";
        wiL.innerHTML = n.leftShip.wing;
        wiL.style = prevWiL == undefined || prevWiL == n.leftShip.wing ? green : blue;
        prevWiL = n.leftShip.wing;
        document.getElementById("leftWings").appendChild(wiL);

        let weM = document.createElement("td");
        weM.className = "removable";
        weM.innerHTML = n.middleShip.weapon;
        weM.style = prevWeM == undefined || prevWeM == n.middleShip.weapon ? green : blue;
        prevWeM = n.middleShip.weapon;
        document.getElementById("middleWeapon").appendChild(weM);

        let reM = document.createElement("td");
        reM.className = "removable";
        reM.innerHTML = n.middleShip.reactor;
        reM.style = prevReM == undefined || prevReM == n.middleShip.reactor ? green : blue;
        prevReM = n.middleShip.reactor;
        document.getElementById("middleReactor").appendChild(reM);
        
        let huM = document.createElement("td");
        huM.className = "removable";
        huM.innerHTML = n.middleShip.hull;
        huM.style = prevHuM == undefined || prevHuM == n.middleShip.hull ? green : blue;
        prevHuM = n.middleShip.hull;
        document.getElementById("middleHull").appendChild(huM);

        let wiM = document.createElement("td");
        wiM.className = "removable";
        wiM.innerHTML = n.middleShip.wing;
        wiM.style = prevWiM == undefined || prevWiM == n.middleShip.wing ? green : blue;
        prevWiM = n.middleShip.wing;
        document.getElementById("middleWings").appendChild(wiM);

        let weR = document.createElement("td");
        weR.className = "removable";
        weR.innerHTML = n.rightShip.weapon;
        weR.style = prevWeR == undefined || prevWeR == n.rightShip.weapon ? green : blue;
        prevWeR = n.rightShip.weapon;
        document.getElementById("rightWeapon").appendChild(weR);

        let reR = document.createElement("td");
        reR.className = "removable";
        reR.innerHTML = n.rightShip.reactor;
        reR.style = prevReR == undefined || prevReR == n.rightShip.reactor ? green : blue;
        prevReR = n.rightShip.reactor;
        document.getElementById("rightReactor").appendChild(reR);

        let huR = document.createElement("td");
        huR.className = "removable";
        huR.innerHTML = n.rightShip.hull;
        huR.style = prevHuR == undefined || prevHuR == n.rightShip.hull ? green : blue;
        prevHuR = n.rightShip.hull;
        document.getElementById("rightHull").appendChild(huR);

        let wiR = document.createElement("td");
        wiR.className = "removable";
        wiR.innerHTML = n.rightShip.wing;
        wiR.style = prevWiR == undefined || prevWiR == n.rightShip.wing ? green : blue;
        prevWiR = n.rightShip.wing;
        document.getElementById("rightWings").appendChild(wiR);

        let ref = document.createElement("td");
        ref.className = "removable";
        ref.innerHTML = n.drones[0];
        ref.style = prevRef == undefined || prevRef == n.drones[0] ? green : blue;
        prevRef = n.drones[0];
        document.getElementById("reflection").appendChild(ref);

        let shp = document.createElement("td");
        shp.className = "removable";
        shp.innerHTML = n.drones[1];
        shp.style = prevShp == undefined || prevShp == n.drones[1] ? green : blue;
        prevShp = n.drones[1];
        document.getElementById("shieldPen").appendChild(shp);

        let di = document.createElement("td");
        di.className = "removable";
        di.innerHTML = n.drones[2];
        di.style = prevDi == undefined || prevDi == n.drones[2] ? green : blue;
        prevDi = n.drones[2];
        document.getElementById("deadlyInc").appendChild(di);

        let reg = document.createElement("td");
        reg.className = "removable";
        reg.innerHTML = n.drones[3];
        reg.style = prevReg == undefined || prevReg == n.drones[3] ? green : blue;
        prevReg = n.drones[3];
        document.getElementById("regen").appendChild(reg);

        let lec = document.createElement("td");
        lec.className = "removable";
        lec.innerHTML = n.drones[4];
        lec.style = prevLec == undefined || prevLec == n.drones[4] ? green : blue;
        prevLec = n.drones[4];
        document.getElementById("leech").appendChild(lec);

        let hp = document.createElement("td");
        hp.className = "removable";
        hp.innerHTML = n.healthTrophy;
        hp.style = prevHp == undefined || prevHp == n.healthTrophy ? green : blue;
        prevHp = n.healthTrophy;
        document.getElementById("healthTrophy").appendChild(hp);

        let dmg = document.createElement("td");
        dmg.className = "removable";
        dmg.innerHTML = n.damageTrophy;
        dmg.style = prevDmg == undefined || prevDmg == n.damageTrophy ? green : blue;
        prevDmg = n.damageTrophy;
        document.getElementById("damageTrophy").appendChild(dmg);
    }

    document.getElementById("resultsButton").click();
}

const saveValue = (e) => {
    let id = e.id;  // get the sender's id to save it . 
    let val = e.value; // get the value. 
    localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
}

//get the saved value function - return the value of "v" from localStorage. 
const getSavedValue = (v) => {
    if (!localStorage.getItem(v)) {
        return "";// You can change this to your defualt value. 
    }
    return localStorage.getItem(v);
}

const openTab = (evt, tab) => {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className += " active";
}

const trophies100 = (checkbox) => {
    document.getElementById("totalIm").disabled = checkbox.checked;
    document.getElementById("totalPCores").disabled = checkbox.checked;
    document.getElementById("expedPoints").disabled = checkbox.checked;
    document.getElementById("fuelUpgrades").disabled = checkbox.checked;
    document.getElementById("totalLab").disabled = checkbox.checked;
    document.getElementById("totalUlt").disabled = checkbox.checked;
}

const clearTable = () => {
    document.querySelectorAll(".removable").forEach(el => el.remove());
    document.getElementById("best").innerHTML = `Current Best ${0}`;
    document.getElementById("open").innerHTML = `Current Open Nodes: ${0}`;
    document.getElementById("total").innerHTML = `Unique Nodes Checked: ${0}`;
}

const terminateWorker = () => {
    window.worker.terminate();
    window.running = false;
}
// Use like:

document.getElementById("orbBonus").value = getSavedValue("orbBonus");
document.getElementById("guildBonus").value = getSavedValue("guildBonus");
document.getElementById("saBonus").value = getSavedValue("saBonus");
document.getElementById("legBonus").value = getSavedValue("legBonus");
document.getElementById("dmAsc").value = getSavedValue("dmAsc");
document.getElementById("hpAsc").value = getSavedValue("hpAsc");
document.getElementById("currUlt").value = getSavedValue("currUlt");
document.getElementById("currIm").value = getSavedValue("currIm");
document.getElementById("stage").value = getSavedValue("stage");
document.getElementById("totalUlt").value = getSavedValue("totalUlt");
document.getElementById("totalIm").value = getSavedValue("totalIm");
document.getElementById("totalPCores").value = getSavedValue("totalPCores");
document.getElementById("expedPoints").value = getSavedValue("expedPoints");
document.getElementById("fuelUpgrades").value = getSavedValue("fuelUpgrades");
document.getElementById("totalLab").value = getSavedValue("totalLab");
document.getElementById("max").value = getSavedValue("max");


document.getElementById("weL").value = getSavedValue("weL");
document.getElementById("weM").value = getSavedValue("weM");
document.getElementById("weR").value = getSavedValue("weR");
document.getElementById("reL").value = getSavedValue("reL");
document.getElementById("reM").value = getSavedValue("reM");
document.getElementById("reR").value = getSavedValue("reR");
document.getElementById("huL").value = getSavedValue("huL");
document.getElementById("huM").value = getSavedValue("huM");
document.getElementById("huR").value = getSavedValue("huR");
document.getElementById("wiL").value = getSavedValue("wiL");
document.getElementById("wiM").value = getSavedValue("wiM");
document.getElementById("wiR").value = getSavedValue("wiR");

document.getElementById("ref").value = getSavedValue("ref");
document.getElementById("shp").value = getSavedValue("shp");
document.getElementById("di").value = getSavedValue("di");
document.getElementById("reg").value = getSavedValue("reg");
document.getElementById("lec").value = getSavedValue("lec");
