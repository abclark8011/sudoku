// Program to solve any Sudoku puzzle by brute force. The actual
// code is only about 30 lines.
// The user calls the "solve" function and passes in a 9x9 puzzle.
// The puzzle is filled out with correct values and returned back.



class Puzzle {
  constructor(puzzle = [[]]) {
    this.puzzle = puzzle;
  }

  get puzzle() {
    return this._puzzle;
  }

  set puzzle(data) {
    this._puzzle = data;
    this.ROWS = this.puzzle.length;
    this.COLS = this.puzzle[0].length;
  }

  getValue(row, col) {
    return this.puzzle[row][col];
  }

  setValue(row, col, value) {
    this.puzzle[row][col] = value;
  }

  // Functions to convert from 1D index to 2D coords.
  // Used to traverse all cells in a block.
  row2D(id, offset)  {
    return 3 * Math.floor(id / 3) + Math.floor(offset / 3);
  }

  col2D(id, offset) {
    return 3 * Math.floor(id / 3) + offset % 3;
  }

  // Calulcate the next row and column
  nextRow(row, col)  {
    return Math.floor((9 * row + col + 1) / 9);
  }

  nextCol(row, col)  {
    return (9 * row + col + 1) % 9;
  }


  // Given a possible value for a row/col location, check if
  // that value will violate the basic Sudoku rules.
  isValid(row, col, value) {
    for (let i = 0; i < this.ROWS; i++) {
      if (this.getValue(row, i) == value) return false;
      if (this.getValue(i, col) == value) return false;
      if (this.getValue(this.row2D(row, i), this.col2D(col, i)) == value) return false;
    }
    return true;
  }

  // Function to print out the puzzle.
  print() {
    for (let i = 0; i < this.ROWS; i++) {
      for (let j = 0; j < this.COLS; j++) {
        process.stdout.write(this.getValue(i, j).toString());
      }
      console.log("");
    }
  }

  // The solver.  Recursively tries all possible solutions.
  solve(row = 0, col = 0) {
    if (row == this.ROWS) return true;

    // If there's a value, then it came from the inital puzzle.  Skip it.
    if (this.getValue(row, col)) {
      return this.solve(this.nextRow(row, col), this.nextCol(row, col));
    }

    // Try all 9 possible values
    for (let value = 1; value <= 9; value++) {
      if (this.isValid(row, col, value)) {
        this.setValue(row, col, value);
        if (this.solve(this.nextRow(row, col), this.nextCol(row, col))) {
          return true;
        }
      }
    }
    this.setValue(row, col, 0); // Restore original value
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

var p = new Puzzle(puzzle);

if (p.solve()) {  
  console.log("Solution:");
  p.print();
} else {
  console.log("Unsolvable!");
}
