const run = () => {
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
    let s = new NodeSA(totalUlt, totalIm, stage, totalPCores, l, m, r, [ref,shp,di,reg,lec], 0, 0, dmgMult, hpMult, currUlt, currIm, null)

    let p = new ArenaProblem(s);
    let pEngine = new Engine(p, 900);
    
    let solutions = pEngine.findSolution();
    if (solutions[0].length > 0) {
        listRules(solutions[0], true);
        listRules(solutions[1], false);
    } else {
        console.log("There was no solution found");
    }
}

listRules = (sol, longPrint) => {
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
    for (let i = 0; i < trueList.length; i++) {
        const r = trueList[i];
        if (prev.equalsEnd(r)) {
            prev = r;
            continue;
        }
        if (r.challengeNumber > currentChallenge) {
            sb = sb.concat(r.toJson());
            sb = sb.concat('\t');
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
        if (longPrint) {
            console.log(trueList[trueList.length - 1].toString());
            console.log("Beat up to challenge " + trueList[trueList.length - 1].challengeNumber);
        }
    }
    console.log(sb);
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
