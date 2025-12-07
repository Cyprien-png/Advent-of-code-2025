export class LineBuffer {
    lines = [null, null, null];
    isProcessable = true;

    get currentLine() {
        return this.lines[1];
    }

    get previousLine() {
        return this.lines[0];
    }

    get nextLine() {
        return this.lines[2];
    }

    addLine(lineString) {
        const line = lineString ? lineString.split('') : null;
        this.lines.unshift(line);

        if (this.lines.length > 3) this.lines.pop();
        this.isProcessable = (!!this.currentLine && !!this.nextLine);
    }

}