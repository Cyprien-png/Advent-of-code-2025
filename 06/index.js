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
const calcs = [];

// Process each line of the input
rl.on('line', (line) => {
    const l = line.split(' ').filter(c => c !== '');

    l.forEach((val, index) => {
        const isDigit = /\d/.test(val);
        const calcIndex = calcs[index];

        if (isDigit) {
            if (calcIndex) {
                calcs[index] = calcIndex + " $operator ";
            } else {
                calcs[index] = "";
            }
            calcs[index] = calcs[index] + val;
        } else {
            calcs[index] = calcIndex.replaceAll("$operator", `${val}`);
            password += eval(calcs[index]);
        }
    });

});

// Output the result
rl.on('close', () => console.log(`Password: ${password}`));
