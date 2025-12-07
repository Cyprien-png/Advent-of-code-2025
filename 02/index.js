import * as fs from 'fs';
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
const rangesString = fs.readFileSync(filePath, 'utf8').trim();

let invalidIds = [];

// Set even sequence lengths only (part one)
const setSequencesLengthsPartOne = (start, end) => {
    const seqLen = [];
    for (let i = start.length; i <= end.length; i++) {
        if (i % 2 !== 0) continue;
        seqLen.push(i / 2);
    }
    return seqLen;
}

// Set all sequence lengths that divides all the total length(part two)
const setSequencesLengthsPartTwo = (start, end) => {
    const seqLen = [];
    // loop all the possible sequence lengths
    for (let j = start.length; j <= end.length; j++) {
        // loop to find the divisors of the total length
        for (let i = 2; i <= j; i++) {
            if ((j / i) % 1 === 0 && !seqLen.find((el) => el == i)) seqLen.push(i);
        }
    }
    return seqLen;
}

const setSubsequencesLengths = (len) => {
    const subSeqLen = [];
    for (let i = 1; i <= len; i++) {
        if ((len / i) % 1 === 0) subSeqLen.push(i);
    }
    return subSeqLen;
}


const processPartOne = (len, sl, start, end) => {
    let sum = 0;
    let startId = (len * sl === start.length) ? start.slice(0, len) : '1' + '0'.repeat(len - 1);
    let endId = (len * sl === end.length) ? end.slice(0, len) : '9'.repeat(len);

    if (parseInt(startId.repeat(sl)) > parseInt(endId.repeat(sl))) return;

    for (let i = parseInt(startId); i <= parseInt(endId); i++) {
        const invalidId = parseInt(`${i}`.repeat(sl));

        // Ensure that the repeated ID sequence is within the original range
        if (invalidId > parseInt(end)) break;
        if (invalidId < parseInt(start)) continue;
        sum += invalidId;
    }
    return sum;
}

rangesString.split(',').map(range => {
    const [start, end] = range.split('-').map(num => num);
    if (start.length == 1 && end.length == 1) return;

    // Set the all the possible lengths of sequences between start and end
    let sequencesLengths = isPartTwo ? setSequencesLengthsPartTwo(start, end) : setSequencesLengthsPartOne(start, end);

    // Leave if there are no sequence that allows to repeat twice the same subsequence
    if (sequencesLengths.length === 0) return;

    // Parse sequences to find their repeatable subsequences
    sequencesLengths.forEach(len => {
        const subSeqLen = isPartTwo ? setSubsequencesLengths(len) : [2];

        subSeqLen.forEach(sl => {
            if (!isPartTwo) {
                invalidIds.push(processPartOne(len, sl, start, end));
            } else {
                let startId = start.slice(0, len);
                if (start.length < len) startId = '1' + '0'.repeat(len - 1);
                let endId = end.slice(0, len);
                if (end.length > len) endId = '9'.repeat(len);

                if (len == sl && len * 2 >= end.length) return;

                for (let i = parseInt(startId.slice(0, sl)); i <= parseInt(endId.slice(0, sl)); i++) {

                    for (let j = start.length; j <= end.length; j++) {
                        const repeatCount = j / (sl);

                        if (repeatCount % 1 !== 0) continue;
                        const id = i.toString().repeat(repeatCount);
                        const invalidId = id.length === 1 ? 0 : parseInt(id);

                        if (invalidIds.includes(invalidId)) continue;

                        // Ensure that the repeated ID sequence is within the original range
                        if (invalidId > parseInt(end)) break;
                        if (invalidId < parseInt(start)) continue;

                        invalidIds.push(invalidId);
                    }
                }
            }
        });
    });
});

const sumOfIds = invalidIds.reduce((a, b) => a + b, 0);

console.log(sumOfIds)
