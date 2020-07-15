const run = () => {
    
    let l2 = new Ship(1, 0, 85, 0);
    let m2 = new Ship(46, 0, 85, 0);
    let r2 = new Ship(110, 0, 95, 126);
    let s = new NodeSA(1968272, 2966405, 550, 4908090, l2, m2, r2,
        [25, 25, 25, 25, 25], 0, 0, 69.48412606079998, 21.5655264, 12431, 78520, null);
    
    let p = new ArenaProblem(s);
    let pEngine = new Engine(p, 900);
    
    let solutions = pEngine.findSolution();
    console.log(solutions);
    if (solutions[0].length > 0) {
        listRules(solutions[0], true);
        // listRules(solutions[1], false);
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