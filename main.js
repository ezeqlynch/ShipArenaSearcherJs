const run = () => {
    
    let l2 = new Ship(0, 0, 70, 0);
    let m2 = new Ship(29, 0, 65, 5);
    let r2 = new Ship(90, 0, 75, 85);
    let s = new NodeSA(881435, 1316955, 424, 2181610, l2, m2, r2,
        [25, 25, 25, 25, 25], 85, 10, 60.88544191439999, 18.8967852, 47379, 234320, null);
    
    console.log(fight(s));

}