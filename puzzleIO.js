// Read lines of numbers and return a 2D array of the data.
// The caller must deal with bad input (e.g. too much/little data).
//
// This module creates a Promise object, so that the caller
// can call it asynchronously and wait for it complete.
//

function puzzleReader(args = []) {
    const promise = new Promise((resolve, reject) => {
        const data = [];

        // Default reading from stdin.  If a file name was passed in,
        // then try to open it and read from it instead.
        let inputFH = process.stdin;
        if (args.length > 0) {
            inputFH = require('fs').createReadStream(args[0])
                .on('error', () => {
                    inputFH.close();
                    reject(`error opening data file: ${args[0]}`);
                })
        }

        // Create the read interface and read the input data.
        const rl = require('readline').createInterface({
            input: inputFH,
            output: process.stdout
        });

        // Read the data.  Handle lines of data, closing the
        // stream, and errors reading from the stream.
        rl.on('line', (line) => {
            data.push(line.split('').map(x => Number(x)));
        }).on('close', () => {
            resolve(data);
        }).on('error', () => {
            reject('Error reading from data file');
        });
    });
    return promise;
}

// Export just the puzzleReader function.
module.exports = {
    puzzleReader: puzzleReader
};

// Just to test if it works.
puzzleReader(['data/hardest.txt']);