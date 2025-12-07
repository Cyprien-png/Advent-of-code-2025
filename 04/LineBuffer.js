class Line {
    line = [];

    constructor(lineString) {
        this.line = lineString.split('');
    }

    getCharAt(index) {
        return this.line[index];
    }
}

export class LineBuffer {


}