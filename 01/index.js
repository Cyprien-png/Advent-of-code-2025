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

const processPartOne = (line, currentValue) => {
    const mult = line.charAt(0) === 'R' ? 1 : -1;
    const value = parseInt(line.substring(1));
    
    let val = (currentValue + mult * value) % 100;
    let psw = (currentValue === 0) ? 1 : 0;
    return { val, psw };
}

let password = 0;
let currentValue = 50;

// Process each line of the input
rl.on('line', (line) => {
    const processedLine = (isPartTwo) ? processPartOne(line, currentValue) : processPartOne(line, currentValue);
    currentValue = processedLine.val;
    password += processedLine.psw;
});

// Output the result
rl.on('close', () => console.log(`Password: ${password}`));
