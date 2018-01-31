// Read 9 lines of 9 numbers and return a 9x9 array.
// Error checking could be improved - as far as the data format.
//
// This module creates a Promise object, so that the caller
// can call it asynchronously and wait for it complete.
//
const readline = require('readline');

function puzzleReader(args = []) {
    const promise = new Promise((resolve, reject) => {
        const data = [[]];
        //for (let i = 0; i < 9; i++) {
         //   data[i] = [];
        //}

        // Default reading from stdin.  If a file name was passed in,
        // then try to open it and read from it instead.
        let inputFS = process.stdin;
        if (args.length > 0) {
            inputFS = require('fs').createReadStream(args[0]);
            inputFS.on('error', () => {
                inputFS.close();
                reject(`error opening data file: ${args[0]}`);
            })
        }

        // Create the read interface and read the input data.
        const rl = readline.createInterface({
            input: inputFS,
            output: process.stdout
        });

        // Read the data.  Handle lines of data, closing the
        // stream, and errors reading from the stream.
        let lineNum = 0;
        rl.on('line', (line) => {
            data.push(new Array());
            // TODO: Handle lines too long or invalid data values
            for (let c of line) {
                data[lineNum].push(Number(c));
            }
            if (++lineNum == 9) {   // too many lines, quit reading
                rl.close();
            }
        }).on('close', () => {
            if (lineNum != 9) {
                reject("Incorrect number of lines");
            } else {
                resolve(data);
            }
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

//puzzleReader
//  .then(result => console.log(result))
//  .then(result => console.log("here!"));
