import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { LineBuffer } from './LineBuffer.js';

const ROLLCHAR = '@';
const EMPTYCHAR = '.';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get input file from command line arguments
const inputParam = '--input';
const inputFile = process.argv.includes(inputParam) ? process.argv[process.argv.indexOf(inputParam) + 1] : null;
const partTwoParam = '--part-two';
const isPartTwo = process.argv.includes(partTwoParam);

// Split the input into lines
const initialFilePath = path.join(__dirname, inputFile);

// Global accumulator for total password count across all iterations
let totalPassword = 0;

// Process a file and return the count of @ chars with <4 neighbors
async function processFile(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(inputPath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        // Write output file
        fs.writeFileSync(outputPath, '');

        let password = 0;
        let loadedLineCount = 0;
        const lb = new LineBuffer();

        const appendInTmpFile = (char) => {
            fs.appendFileSync(outputPath, char);
        };

        const processLine = () => {
            if (!lb.isProcessable && loadedLineCount !== 2) return;

            for (let i = 0; i < lb.currentLine.length; i++) {
                if (lb.currentLine[i] !== ROLLCHAR) {
                    appendInTmpFile(lb.currentLine[i]);
                    continue;
                }

                // Set the boundaries around the current roll
                const minIndex = (i === 0) ? 0 : i - 1;
                const maxIndex = (i === lb.currentLine.length - 1) ? i : i + 1;
                let nearRollsCount = 0;

                // Check the 3x3 area around the current roll
                for (let j = minIndex; j <= maxIndex; j++) {
                    if (lb.previousLine && lb.previousLine[j] === ROLLCHAR) nearRollsCount++;
                    if (j !== i && lb.currentLine[j] === ROLLCHAR) nearRollsCount++;
                    if (lb.nextLine && lb.nextLine[j] === ROLLCHAR) nearRollsCount++;
                }

                if (nearRollsCount < 4) password++;
                const newChar = (nearRollsCount < 4) ? EMPTYCHAR : ROLLCHAR;
                appendInTmpFile(newChar);
            }

            appendInTmpFile('\n');
        };

        const processLastLine = () => {
            lb.addLine(null);
            processLine();
        };

        // Process each line of the input
        rl.on('line', (line) => {
            lb.addLine(line);
            loadedLineCount++;
            processLine();
        });

        // Output the result
        rl.on('close', () => {
            processLastLine();
            
            // Remove last \n in output file
            const tmpFileContent = fs.readFileSync(outputPath, 'utf8');
            fs.writeFileSync(outputPath, tmpFileContent.slice(0, -1));
            
            resolve(password);
        });

        rl.on('error', reject);
    });
}

// Recursive function to process files until no more @ chars with <4 neighbors
async function recursiveProcess(inputPath, iteration = 0) {
    const dots = '.'.repeat((iteration % 3) + 1);
    process.stdout.write(`\rProcessing${dots}   `);
    const outputPath = path.join(__dirname, `tmpinput_${iteration}.txt`);
    
    const passwordCount = await processFile(inputPath, outputPath);
        totalPassword += passwordCount;
    
    // Remove the previous tmp file if it's not the original input
    if (iteration > 0) {
        fs.unlinkSync(inputPath);
    }
    
    // If we found any @ chars with <4 neighbors, recurse
    if (passwordCount > 0) {
        return recursiveProcess(outputPath, iteration + 1);
    } else {
        // No more @ chars with <4 neighbors found, clean up the last tmp file
        fs.unlinkSync(outputPath);
        return totalPassword;
    }
}

// Main execution
(async () => {
    if (isPartTwo) {
        const finalPassword = await recursiveProcess(initialFilePath);
        console.log(`\rPassword: ${finalPassword}       `);
    } else {
        // Part one: single pass
        const outputPath = path.join(__dirname, 'tmpinput.txt');
        const password = await processFile(initialFilePath, outputPath);
        fs.unlinkSync(outputPath);
        console.log(`Password: ${password}`);
    }
})();
