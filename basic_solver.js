// Program to solve any Sudoku puzzle by brute force. The actual
// code is only about 30 lines.
// The user calls the "solve" function and passes in a 9x9 puzzle.
// The puzzle is filled out with correct values and returned back.


// A sample puzzle.  Could extend the app to read puzzle from stdin.
var puzzle = [
    // Allegedly the hardest known Sudoku puzzle
    [ 8, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 3, 6, 0, 0, 0, 0, 0 ],
    [ 0, 7, 0, 0, 9, 0, 2, 0, 0 ],
    [ 0, 5, 0, 0, 0, 7, 0, 0, 0 ],
    [ 0, 0, 0, 0, 4, 5, 7, 0, 0 ],
    [ 0, 0, 0, 1, 0, 0, 0, 3, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0, 6, 8 ],
    [ 0, 0, 8, 5, 0, 0, 0, 1, 0 ],
    [ 0, 9, 0, 0, 0, 0, 4, 0, 0 ]
];

/*
var puzzle = [
    // Solution to the hardest puzzle
    [ 8, 1, 2, 7, 5, 3, 6, 4, 9 ],
    [ 9, 4, 3, 6, 8, 2, 1, 7, 5 ], 
    [ 6, 7, 5, 4, 9, 1, 2, 8, 3 ], 
    [ 1, 5, 4, 2, 3, 7, 8, 9, 6 ], 
    [ 3, 6, 9, 8, 4, 5, 7, 2, 1 ], 
    [ 2, 8, 7, 1, 6, 9, 5, 3, 4 ], 
    [ 5, 2, 1, 9, 7, 4, 3, 6, 8 ], 
    [ 4, 3, 8, 5, 2, 6, 9, 1, 7 ], 
    [ 7, 9, 6, 3, 1, 8, 4, 5, 2 ],
    [ 7, 9, 6, 3, 1, 8, 4, 5, 2 ] 
];
*/

// Functions to convert from 1D index to 2D coords.
// Used to traverse all cells in a block.
function RTB(id, offset)  {
  return 3 * Math.floor(id / 3) + Math.floor(offset / 3);
}

function CTB(id, offset) {
  return 3 * Math.floor(id / 3) + offset % 3;
}

// Calulcate the next row and column
function NEXT_ROW(row, col)  {
  return Math.floor((9 * row + col + 1) / 9);
}

function NEXT_COL(row, col)  {
  return (9 * row + col + 1) % 9;
}


// Given a possible value for a row/col location, check if
// that value will violate the basic Sudoku rules.
function
isValid(data, row, col, value) {
  for (var i = 0; i < 9; i++) {
    if (data[row][i] == value) return false;
    if (data[i][col] == value) return false;
    if (data[RTB(row, i)][CTB(col, i)] == value) return false;
  }
  return true;
}

// Function to print out the puzzle.
function
print(data) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      process.stdout.write(data[i][j].toString());
    }
    console.log("");
  }
}

// The solver.  Recursively tries all possible solutions.
function
solve(data, row, col) {
  if (row == 9) return true;

  var val = data[row][col];

  // If there's a value, then it came from the inital puzzle.  Skip it.
  if (val) return solve(data, NEXT_ROW(row, col), NEXT_COL(row, col));

  // Try all 9 possible values
  for (var i = 1; i <= 9; i++) {
    if (isValid(data, row, col, i)) {
      data[row][col] = i;
      if (solve(data, NEXT_ROW(row, col), NEXT_COL(row, col))) return true;
    }
  }
  data[row][col] = val; // Restore original value
  return false;
}

if (solve(puzzle, 0, 0)) {  
  console.log("Solution:");
  print(puzzle);
} else {
  console.log("Unsolvable!");
}
