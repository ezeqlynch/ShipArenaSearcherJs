// class ShipRule {
//     //0 left, 1 middle, 2 right
//     //0 weapon, 1 reactor, 2 hull, 3 wings

//     constructor (ship, part) {
//         this.ship = ship;
//         this.part = part;
//         this.cost = 0;
//         this.level = 0;
//     }

//     toString() {
//         let shipPos;
//         let partPos;
//         switch (this.ship) {
//             case 0:
//                 shipPos = "Left";
//                 break;
//             case 1:
//                 shipPos = "Middle";
//                 break;
//             case 2:
//                 shipPos = "Right";
//                 break;
//             default:
//                 shipPos = "Invalid";
//                 break;
//         }
//         switch (part) {
//             case 0:
//                 partPos = "Weapon";
//                 break;
//             case 1:
//                 partPos = "Reactor";
//                 break;
//             case 2:
//                 partPos = "Hull";
//                 break;
//             case 3:
//                 partPos = "Wings";
//                 break;
//             default:
//                 partPos = "Invalid";
//         }
//         return shipPos + " ship: Upgrade " + partPos + " to level " + level;
//     }

//     applyToState(o) {
//         let clone = o.clone();
//         switch (this.ship) {
//             case (0): {
//                 clone.setPart(this.ship, this.part);
//                 break;
//             }
//             case (1): {
//                 clone.setPart(this.ship, this.part);
//                 break;
//             }
//             case (2): {
//                 clone.setPart(this.ship, this.part);
//                 break;
//             }
//         }
//         this.level = clone.getLevel(this.ship, this.part);
//         return clone;
//     }

//     postApplyToState(s) {
//         if (s.doTrophies()) {
//             s.upChall();
//         }
//     }
// }
