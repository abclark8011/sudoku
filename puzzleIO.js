// Read 9 lines of 9 numbers and return a 9x9 array.
// Minimal error checking.  Needs to be more.
//
// This module creates a Promise object, so that the caller
// can call it asynchronously.
//
const readline = require('readline');

let puzzleReader = new Promise((resolve, reject) => {
  let lineNum = 0;
  let data = [[]];
  for (let i = 0; i < 9; i++) {
    data[i] = [];
  }

  const rl = readline.createInterface({
    input : process.stdin,
    output: process.stdout
  });

  rl.on('line', (line) => {
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
  })
});

module.exports = {
  puzzleReader: puzzleReader
};

//puzzleReader
//  .then(result => console.log(result))
//  .then(result => console.log("here!"));

