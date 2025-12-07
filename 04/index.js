import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { LineBuffer } from './LineBuffer.js';

const ROLLCHAR = '@';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get input file from command line arguments
const inputParam = '--input';
const inputFile = process.argv.includes(inputParam) ? process.argv[process.argv.indexOf(inputParam) + 1] : null;

// Split the input into lines
const filePath = path.join(__dirname, inputFile);
const fileStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

let password = 0;
let loadedLineCount = 0;
const lb = new LineBuffer();

// Process each line of the input
rl.on('line', (line) => {
    lb.addLine(line);
    loadedLineCount++;
    processLine();
});

const processLine = () => {
    if (!lb.isProcessable && loadedLineCount !== 2) return;

    for (let i = 0; i < lb.currentLine.length; i++) {
        if (lb.currentLine[i] !== ROLLCHAR) continue;

        // Set the boundaries arround the current roll
        const minIndex = (i === 0) ? 0 : i - 1;
        const maxIndex = (i === lb.currentLine.length - 1) ? i : i + 1;
        let nearRollsCount = 0;

        // Check the 3x3 area around the current roll
        for (let j = minIndex; j <= maxIndex; j++) {
            if (lb.previousLine && lb.previousLine[j] === ROLLCHAR) nearRollsCount++;
            if (j !== i && lb.currentLine[j] === ROLLCHAR) nearRollsCount++;
            if (lb.nextLine && lb.nextLine[j] === ROLLCHAR) nearRollsCount++;
        }

        if (nearRollsCount < 4) password ++;
    }
}

const processLastLine = () => {
    lb.addLine(null);
    processLine();
}

// Output the result
rl.on('close', () => {
    processLastLine();
    console.log(`Password: ${password}`);
});
