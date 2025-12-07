import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { LineBuffer } from './LineBuffer.js';

const ROLLCHAR = '@';
const EMPTYCHAR = '.';
const TMPFILENAME = 'tmpinput.txt';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get input file from command line arguments
const inputParam = '--input';
const inputFile = process.argv.includes(inputParam) ? process.argv[process.argv.indexOf(inputParam) + 1] : null;
const partTwoParam = '--part-two';
const isPartTwo = process.argv.includes(partTwoParam);

// Split the input into lines
const filePath = path.join(__dirname, inputFile);
const fileStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

if (isPartTwo) {
    fs.writeFileSync(path.join(__dirname, TMPFILENAME), '');
}

const appendInTmpFile = (char) => {
    fs.appendFileSync(path.join(__dirname, TMPFILENAME), char);
}

let password = 0;
let loadedLineCount = 0;
const lb = new LineBuffer();

// Process each line of the input
rl.on('line', (line) => {
    lb.addLine(line);
    loadedLineCount++;
    processLine();
    
    if (isPartTwo) {
        appendInTmpFile(1 + '\n');
    }
});

const processLine = () => {
    if (!lb.isProcessable && loadedLineCount !== 2) return;

    for (let i = 0; i < lb.currentLine.length; i++) {
        if (lb.currentLine[i] !== ROLLCHAR) {
            if (isPartTwo) appendInTmpFile(lb.currentLine[i]);
            continue;
        }

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
        const newChar = (nearRollsCount < 4) ? EMPTYCHAR : ROLLCHAR;
        if (isPartTwo) appendInTmpFile(newChar);
    }
}

const processLastLine = () => {
    lb.addLine(null);
    processLine();
}

// Output the result
rl.on('close', () => {
    processLastLine();
    if (isPartTwo) {
        // remove last \n in tmp file
        const tmpFilePath = path.join(__dirname, TMPFILENAME);
        const tmpFileContent = fs.readFileSync(tmpFilePath, 'utf8');
        fs.writeFileSync(tmpFilePath, tmpFileContent.slice(0, -1));
        // fs.unlinkSync(path.join(__dirname, TMPFILENAME));
    }
    console.log(`Password: ${password}`);
});
