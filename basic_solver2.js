// Program to solve any Sudoku puzzle by brute force. The actual
// code is only about 30 lines.
// The user calls the "solve" function and passes in a 9x9 puzzle.
// The puzzle is filled out with correct values and returned back.

class Coord {
  constructor(row = 0, col = 0) {
    this.setCoord(row, col);
  }
  setCoord(row, col) {
    this.row = row;
    this.col = col;
  }
}

class Puzzle {
  constructor(puzzle = [[]]) {
    this.setPuzzle(puzzle);
  }

  setPuzzle(puzzle) {
    this.puzzle = puzzle;
  }

  getPuzzle() {
    return this.puzzle;
  }

  setCell(row, col, value) {
    this.puzzle[row][col] = value;
  }

  getCell(row, col) {
    return this.puzzle[row][col];
  }

  print() {
    for (var row = 0; row < 9; row ++) {
      for (var col = 0; col < 9; col ++) {
        process.stdout.write(this.getCell(row, col).toString());
      }
      console.log("");
    }
  }

  row2D(id, offset)  {
    return 3 * Math.floor(id / 3) + Math.floor(offset / 3);
  }

  col2D(id, offset) {
    return 3 * Math.floor(id / 3) + offset % 3;
  }

  nextRow(row, col)  {
    return Math.floor((9 * row + col + 1) / 9);
  }

  nextCol(row, col)  {
    return (9 * row + col + 1) % 9;
  }

  isValid(row, col, value) {
    for (var i = 0; i < 9; i++) {
      if (this.getCell(row, i) == value) return false;
      if (this.getCell(i, col) == value) return false;
      if (this.getCell(this.row2D(row, i), this.col2D(col, i)) == value) {
        return false;
      }
    }
    return true;
  }

  solve(row = 0, col = 0) {
    if (row == 9) return true;

    var val = this.getCell(row, col);

    // If there's a value, then it came from the inital puzzle.  Skip it.
    if (val) {
      return this.solve(this.nextRow(row, col), this.nextCol(row, col));
    }

    // Try all 9 possible values
    for (var i = 1; i <= 9; i++) {
      if (this.isValid(row, col, i)) {
        this.setCell(row, col, i);
        if (this.solve(this.nextRow(row, col), this.nextCol(row, col))) return true;
      }
    }
    this.setCell(row, col, val); // Restore original value
    return false;
  }
}
  
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

// The solver.  Recursively tries all possible solutions.

var p = new Puzzle(puzzle);

if (p.solve()) {  
  console.log("Solution:");
  p.print();
} else {
  console.log("Unsolvable!");
}
