import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function processLineByLine() {
    const filePath = path.join(__dirname, 'input.txt');
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let total = 0;

    for await (const line of rl) {
       console.log(line);
    }
}

processLineByLine();