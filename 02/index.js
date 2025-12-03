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
const rangesString = fs.readFileSync(filePath, 'utf8').trim();

const ranges = rangesString.split(',').map(range => { 
    const [start, end] = range.split('-').map(num => parseInt(num));
    return { start, end };
});

console.log(ranges)