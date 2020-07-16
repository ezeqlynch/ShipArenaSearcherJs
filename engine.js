class Engine {
    // private HashSet<List<Byte>> bestDepths;
    // private LinkedList<StateSA> bests;
    // private LinkedList<StateSA> bestsFive;
    // private Queue<StateSA> openNodes;
    // private int maxChallenge;


    constructor (problem, maxChallenge) {
        this.problem = problem;
        this.bestDepths = new Set();
        this.explosionCounter = 0;
        this.bests = [];
        this.bestsFive = [];
        this.openNodes = createQueue(200, []);
        this.maxChallenge = maxChallenge;
        this.lowestHp = 0;
        this.lowestHpFive = 0;
        this.lowestHigh = 1;
        this.lowestHighFive = 1;
    }

    getNextNode() {
        return this.openNodes.shift();
    }

    addToOpenNodes(node) {
        this.openNodes.push(node);
    }

    openNodesIsEmpty() {
        return this.openNodes.isEmpty();
    }

    getOpenNodesSize() {
        return this.openNodes.length();
    }

    stepOnOpenNodes(nodes) {
        this.shuffle(nodes);
        this.openNodes = createQueue(200, nodes);
    }

    findSolution() {
        console.log(this.problem);
        let root = this.problem.getInitialState();
        do {
            if (root.hpLeft <= 0) {
                root.upChall();
            }
            root.setHpLeft();
        } while (root.hpLeft <= 0.0);
        this.addToOpenNodes(root);

        let max = root.clone();
        while(max.doTrophies()) {
            max.upChall();
            max.setParent(root);
            root = max;
            max = root.clone();
        }

        this.openNodes = createQueue(200, []);
        this.addToOpenNodes(root);
        this.bests.push(root);

        while (!this.openNodesIsEmpty()){
            let currentNode = this.getNextNode();
            if(this.openNodes.length() > 1000000/* || (openNodes.size() > 800000 && bestDepths.size() > 10000000) || bestDepths.size() > 10000000*/) {
                this.bests.reverse();
                this.stepOnOpenNodes(this.bests);
                this.bestDepths.clear();
                currentNode = this.bests[0];
            }
            this.explode(currentNode);
        }
        this.bests.reverse();
        this.bestsFive.reverse();
        console.log(this.explosionCounter);
        return [this.bests, this.bestsFive];

    }

    explode(node) {
        if (node.challengeNumber >= this.maxChallenge) {
            return;
        }
        this.explosionCounter++;
        if (this.explosionCounter % 50000 == 0) {
            console.log(new Date());
            console.log("bestDepths = " + this.bestDepths.size);
            console.log("openNodes = " + this.getOpenNodesSize());
            console.log(this.bests[this.bests.length-1].toString());
            console.log(self);
            self.postMessage({state: {
                openNodes: this.getOpenNodesSize(),
                bestStage: this.bests[this.bests.length - 1].challengeNumber,
                date: new Date()
            }})
        }

        if(node.parent != null /*&& ((StateSA)node.getParent()).getChallengeNumber() < node.getChallengeNumber()*/){
            let nn = node.clone();
            while (nn.doTrophies() && nn.challengeNumber < this.maxChallenge) {
                nn.upChall();
                nn.setParent(node);
                node = nn;
                nn = node.clone();
            }
        }


        let rl = this.problem.getRules(node);
        for (let i = 0; i < rl.length; i++) {
            const rule = rl[i];
            let newState = rule.applyToState(node);
            if (this.bestDepths.has(newState.toByteArray())) {
                continue;
            }
//            rule.postApplyToState(newState);
            this.updateBestCosts(newState);
            newState.setParent(node);
            this.addToOpenNodes(newState);
        }
    }

    updateBestCosts(node){
        this.bestDepths.add(node.toByteArray());
        if (this.bests.length < 100) {
            this.bests.push(node);
        } else if (node.challengeNumber > this.lowestHigh || (node.challengeNumber == this.lowestHigh && node.currUlt >= this.lowestHp)){
            this.bests.sort((a, b) => {
                if(a != b) {
                    return a.challengeNumber - b.challengeNumber;
                } else {
                    return a.currUlt - b.currUlt;
                }
            })
            if (!this.bests.some(n => n.equals(node))) {
                this.bests[0] = node;
                this.lowestHigh = this.bests[1].challengeNumber;
                this.lowestHp = this.bests[1].currUlt;
            }
        }
        if(node.challengeNumber % 5 == 0) {
            if(this.bestsFive.length < 100) {
                this.bestsFive.push(node);
            } else if (node.challengeNumber > this.lowestHighFive || (node.challengeNumber == this.lowestHighFive && node.currUlt >= this.lowestHpFive)){
                this.bestsFive.sort((a, b) => {
                    if (a != b) {
                        return a.challengeNumber - b.challengeNumber;
                    } else {
                        return a.currUlt - b.currUlt;
                    }
                })
                if (!this.bestsFive.some(n => n.equals(node))) {
                    this.bestsFive[0] = node;
                    this.lowestHighFive = this.bestsFive[1].challengeNumber;
                    this.lowestHpFive = this.bestsFive[1].currUlt;

                }
            }
        }
    }

    shuffle = arr => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
}
