import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { fileURLToPath } from 'url';

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

let password = 0;
const freshIdRanges = [];

const processIdRange = (rawString) => {
    const range = rawString.trim().split('-');
    freshIdRanges.push({ start: parseInt(range[0]), end: parseInt(range[1]) });
}

const reduceRanges = () => {
    let didMergeSomething = false;

    for (let i = 0; i < freshIdRanges.length; i++) {
        for (let j = 0; j < freshIdRanges.length; j++) {
            if (i === j) continue;

            // Check if range j is inside range i
            if (freshIdRanges[j].start >= freshIdRanges[i].start && freshIdRanges[j].end <= freshIdRanges[i].end) {
                // Remove range j
                freshIdRanges.splice(j, 1);
                didMergeSomething = true;
            } else if (freshIdRanges[j].start >= freshIdRanges[i].start && freshIdRanges[j].start <= freshIdRanges[i].end && freshIdRanges[j].end > freshIdRanges[i].end) {
                // Adjust the end of range j
                freshIdRanges[i].end = freshIdRanges[j].end;
                freshIdRanges.splice(j, 1);
                didMergeSomething = true;
            } else if (freshIdRanges[j].start < freshIdRanges[i].start && freshIdRanges[j].end <= freshIdRanges[i].end && freshIdRanges[j].end >= freshIdRanges[i].start) {
                // Adjust the start of range j
                freshIdRanges[i].start = freshIdRanges[j].start;
                freshIdRanges.splice(j, 1);
                didMergeSomething = true;
            }
        }
    }

    if (didMergeSomething) reduceRanges();
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
        if (!isPartTwo && isFresh(line)) password++;
    }
});

// Output the result
rl.on('close', () => {

    if (isPartTwo) {
        reduceRanges();

        freshIdRanges.forEach(range => {
            password += (range.end - range.start + 1);
        });
    }

    console.log(`Password: ${password}`);
});
