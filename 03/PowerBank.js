export class PowerBank {
    batteries = [];
    bestCombination = { first: 0, second: 0 };

    constructor(batteries) {
        this.batteries = batteries;
    }

    computeBestCombination() {
        this.batteries.forEach((b, index) => {
            const bVal = parseInt(b);

            if (bVal > this.bestCombination.first && index < this.batteries.length - 1) {
                this.bestCombination.second = this.bestCombination.first;
                this.bestCombination.first = bVal;
            } else if (bVal > this.bestCombination.second) {
                this.bestCombination.second = bVal;
            }

            if (this.bestCombination.first === 9 && this.bestCombination.second === 9) return this.bestCombination;
        });

        return this.bestCombination
    }
}