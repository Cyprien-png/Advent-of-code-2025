import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TACHYONCHAR = "S";
const SPLITTERCHAR = "^";

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
const currentLineTachyons = [];

// split a Tachyon at the given splitter index
const splitTachyon = (tachyonIndex, splitterIndex) => {
    const newTachyonsIndexes = [splitterIndex - 1, splitterIndex + 1];
    currentLineTachyons.splice(tachyonIndex, 1);

    newTachyonsIndexes.forEach((newIndex) => {
        if (currentLineTachyons.indexOf(newIndex) === -1) {
            currentLineTachyons.push(newIndex);
        }
    });
}

// Process each line of the input
rl.on('line', (line) => {
    const l = line.split('');

    l.forEach((char, index) => {
        if (char === TACHYONCHAR) currentLineTachyons.push(index);

        if (char === SPLITTERCHAR) {
            currentLineTachyons.forEach((tachyonPostition, tachyonIndex) => {
                if (tachyonPostition === index) {
                    password++;
                    splitTachyon(tachyonIndex, index);
                }
            });
        }
    });
});

// Output the result
rl.on('close', () => console.log(`Password: ${password}`));
