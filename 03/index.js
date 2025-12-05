import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { PowerBank } from './PowerBank.js';

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

// Process each line of the input
rl.on('line', (line) => {
    const powerBank = new PowerBank(line.split(''));
    const comb = powerBank.computeBestCombination();
    const bankValue = parseInt(`${comb.first}${comb.second}`);
    console.log(line);
    console.log(`Bank value: ${bankValue}`);
    password += bankValue;
});

// Output the result
rl.on('close', () => console.log(`Password: ${password}`));
