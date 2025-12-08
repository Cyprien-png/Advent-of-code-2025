import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { fileURLToPath } from 'url';

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
const freshIdRanges = [];

const processIdRange = (rawString) => {
    const range = rawString.trim().split('-');
    freshIdRanges.push({ start: parseInt(range[0]), end: parseInt(range[1]) });
}

const isFresh = (rawString) => {
    const id = parseInt(rawString.trim());

    for (let range of freshIdRanges) {
        if (id >= range.start && id <= range.end) {
            return true;
        }
    }

    return false;
}

// Process each line of the input
rl.on('line', (line) => {
    if (line.includes('-')) {
        processIdRange(line);
    } else {
        if (isFresh(line)) password ++;
    }
});

// Output the result
rl.on('close', () => console.log(`Password: ${password}`));
