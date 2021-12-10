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
        // this.bestsFive = [];
        this.openNodes = createQueue(200, []);
        this.maxChallenge = maxChallenge;
        this.lowestHp = 0;
        this.lowestHpFive = 0;
        this.lowestHigh = 1;
        this.lowestHighFive = 1;
        this.clear = false;
        this.depths = {};
        this.stages = {};
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
        this.start = new Date();
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
        let a = 0;
        while (!this.openNodesIsEmpty()){
            let currentNode = this.getNextNode();
            if(this.openNodes.length() > 100000000 && !this.clear/* || (openNodes.size() > 800000 && bestDepths.size() > 10000000) || bestDepths.size() > 10000000*/) {
                // this.bests.reverse();
                // this.stepOnOpenNodes(this.bests);
                this.bestDepths.clear();
                this.clear = true;
                // currentNode = this.bests[0];
            }
            this.explode(currentNode);
            this.depths[currentNode.depth]--;
            this.stages[currentNode.challengeNumber]--;
            if(this.depths[currentNode.depth] == 0) {
                delete this.depths[currentNode.depth];
                this.bestDepths.clear();
            }
            if(this.stages[currentNode.challengeNumber] == 0) {
                delete this.stages[currentNode.challengeNumber];
            }
        }
        this.bests.reverse();
        // this.bestsFive.reverse();
        console.log(this.explosionCounter);
        return this.bests;

    }

    explode(node) {
        if (node.challengeNumber >= this.maxChallenge) {
            //node = null;
            return;
        }
        this.explosionCounter++;
        if (this.explosionCounter % 500 == 0) {
            if(this.explosionCounter % 50000 == 0) {    
                console.log(new Date());
                console.log("bestDepths = " + this.bestDepths.size);
                console.log("openNodes = " + this.getOpenNodesSize());
                console.log(this.bests[this.bests.length-1].toString());
                if(this.bestDepths.size > 16000000) { 
                    this.bestDepths.clear();
                }
                console.log(this.depths);
                console.log(this.stages);
            }
            postMessage({state: {
                openNodes: this.getOpenNodesSize(),
                bestStage: this.bests[this.bests.length - 1].challengeNumber,
                bestDepths: this.bestDepths.size,
                time: new Date() - this.start
            }});
        }

        if(node.parent != null /*&& ((StateSA)node.getParent()).getChallengeNumber() < node.getChallengeNumber()*/){
            let nn = node.clone();
            while (nn.doTrophies() && nn.challengeNumber < this.maxChallenge) {
                nn.upChall();
                nn.setParent(node);
                // this.bestDepths.add(nn.toByteArray());
                node = nn;
                nn = node.clone();
            }
        }

        let rl = this.problem.getRules(node);
        let ok = 0;
        for (let i = 0; i < rl.length; i++) {
            const rule = rl[i];
            let newState = rule.applyToState(node);
            if (this.bestDepths.has(newState.toByteArray())) {
                continue;
            }
            newState.upDepth();
            if(!this.depths[newState.depth]) {
                this.depths[newState.depth] = 1;
            } else {
                this.depths[newState.depth]++;
            }
            if(!this.stages[newState.challengeNumber]) {
                this.stages[newState.challengeNumber] = 1;
            } else {
                this.stages[newState.challengeNumber]++;
            }
//            rule.postApplyToState(newState);
            this.bestDepths.add(newState.toByteArray());
            newState.setParent(node);
            this.addToOpenNodes(newState);
            ok++;
            // if(newState.challengeNumber > 696)
            //     console.log(newState.toByteArray().toString(2));
        }
        // if(ok == 0) {
            this.updateBestCosts(node);
        // }
    }



    updateBestCosts(node){
        // if(node.challengeNumber > 697) 
            // console.log(`${this.bests.length} - ${node.challengeNumber} > ${this.lowestHigh} || (${node.challengeNumber} == ${this.lowestHigh} && ${node.currUlt} >= ${this.lowestHp})`);
        if (this.bests.length < 100) {
            this.bests.push(node);
            this.bests.sort((a, b) => {
                if(a.challengeNumber != b.challengeNumber) {
                    return a.challengeNumber - b.challengeNumber;
                } else {
                    return a.currUlt - b.currUlt;
                }
            });
        } else if (node.challengeNumber > this.lowestHigh || (node.challengeNumber == this.lowestHigh && node.currUlt >= this.lowestHp)){
            this.bests.sort((a, b) => {
                if(a.challengeNumber != b.challengeNumber) {
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
        // if(node.challengeNumber % 5 == 0) {
        //     if(this.bestsFive.length < 100) {
        //         this.bestsFive.push(node);
        //     } else if (node.challengeNumber > this.lowestHighFive || (node.challengeNumber == this.lowestHighFive && node.currUlt >= this.lowestHpFive)){
        //         this.bestsFive.sort((a, b) => {
        //             if (a != b) {
        //                 return a.challengeNumber - b.challengeNumber;
        //             } else {
        //                 return a.currUlt - b.currUlt;
        //             }
        //         })
        //         if (!this.bestsFive.some(n => n.equals(node))) {
        //             this.bestsFive[0] = node;
        //             this.lowestHighFive = this.bestsFive[1].challengeNumber;
        //             this.lowestHpFive = this.bestsFive[1].currUlt;

        //         }
        //     }
        // }
    }

    shuffle = arr => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
}
