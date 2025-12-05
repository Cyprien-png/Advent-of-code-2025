export class PowerBank {
    batteries = [];
    bestCombination = [];

    constructor(batteries, bestCombinationLength = 2) {
        this.batteries = batteries;

        for (let i = 0; i < bestCombinationLength; i++) {
            this.bestCombination.push(0);
        }
    }

    computeBestCombination() {
        this.batteries.forEach((b, index) => {
            const bVal = parseInt(b);
            const len = this.bestCombination.length;

            for (let i = 0; i < len; i++) {
                if (bVal > this.bestCombination[i] && index < (this.batteries.length - (len - i - 1))) {
                    for (let j = i + 1; j < len; j++) {
                        this.bestCombination[j] = 0;
                    }
                    this.bestCombination[i] = bVal;
                    break;
                }
            }
        });
       
        return this.bestCombination
    }
}