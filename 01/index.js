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

// Process with the rules of Part One
const processPartOne = (line, currentValue) => {
    const mult = line.charAt(0) === 'R' ? 1 : -1;
    const value = parseInt(line.substring(1));
    
    let val;

    if (mult > 0) {
        val = (currentValue + mult * value) % 100;
    } else {
        val = (currentValue + 100 - (value % 100)) % 100;
    }

    let psw = (currentValue === 0) ? 1 : 0;
    return { val, psw };
}

// Process with the rules of Part Two
const processPartTwo = (line, currentValue) => {
    const mult = line.charAt(0) === 'R' ? 1 : -1;
    const value = parseInt(line.substring(1));
    
    let psw = 0;
    let val;
    
    if (currentValue + value * mult === 0) {
        psw = 1;
        val = 0;
    } else if (mult > 0) {
        psw += Math.floor(Math.abs(value + currentValue) / 100);
        val = (currentValue + mult * value) % 100;
    } else {
        psw += Math.floor(Math.abs(value + (100 - currentValue)) / 100);
        val = (currentValue + 100 - (value % 100)) % 100;
        if (currentValue === 0) psw --;
    }
    
    return { val, psw };
}

let password = 0;
let currentValue = 50;

// Process each line of the input
rl.on('line', (line) => {
    const processedLine = (isPartTwo) ? processPartTwo(line, currentValue) : processPartOne(line, currentValue);
    currentValue = processedLine.val;
    password += processedLine.psw;
});

// Output the result
rl.on('close', () => console.log(`Password: ${password}`));
