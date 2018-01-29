// Program to solve any Sudoku puzzle by brute force. The actual
// code is only about 30 lines.
// The user creates a Sudoku object by passing in the 9x9
// data grid.  Then the user calls the "solve" function.
// The solution(s) are stored as Puzzles in the Sudoku object.


class Sudoku {
  constructor(puzzle) {
    this.puzzle = new Puzzle(puzzle);
    this.solution = [];
    this.exhaustive = true;
  }

  printSolutions() {
    for (let solution of this.solution) {
      solution.print();
    }
  }


  addSolution() {
    this.solution.push(new Puzzle(this.puzzle._puzzle));
  }

  set exhaustive(value) {
    if (typeof(value) != typeof(true)) {
      throw 'expected boolean value';
    }
    this._exhaustive = value;
  }

  get exhaustive() {
    return this._exhaustive;
  }

  // The solver.  Recursively tries all possible solutions.
  solve(coord = new RC(0, 0)) {
    if (coord.eof) {
      this.addSolution();
      return true;
    }

    let nextCell = this.puzzle.nextRowCol(coord);

    // If there's a value, then it came from the inital puzzle.  Skip it.
    if (this.puzzle.getValue(coord)) {
      return this.solve(nextCell);
    }

    // Try all 9 possible values
    for (let value = 1; value <= 9; value++) {
      if (this.puzzle.isValid(coord, value)) {
        this.puzzle.setValue(coord, value);
        if (this.solve(nextCell)) {
          if (!this.exhaustive) return true;
        }
      }
    }
    this.puzzle.setValue(coord, 0); // Restore original value
    return false;
  }
};


class Coord {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }
};

class RC extends Coord { // Row/Column coordinate class
  constructor(row, col) {
    super(row, col);
    this.eof = row < 0 || row >=9 || col < 0 || col >= 9;
  }
}

class Puzzle {
  constructor(puzzle = [[]]) {
    this.puzzle = puzzle;
  }

  get puzzle() {
    return this._puzzle;
  }

  set puzzle(data) {
    this._puzzle = [data.length];
    for (let i = 0; i < data.length; i++) {
      this._puzzle[i] = data[i].slice();
    }
    this.ROWS = this.puzzle.length;
    this.COLS = this.puzzle[0].length;
  }

  getValue(coord) {
    return this.puzzle[coord.row][coord.col];
  }

  setValue(coord, value) {
    this.puzzle[coord.row][coord.col] = value;
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
  nextRow(coord)  {
    return Math.floor((9 * coord.row + coord.col + 1) / 9);
  }

  nextCol(coord)  {
    return (9 * coord.row + coord.col + 1) % 9;
  }

  nextRowCol(coord) {
    return new RC(this.nextRow(coord), this.nextCol(coord));
  }

  // Given a possible value for a row/col location, check if
  // that value will violate the basic Sudoku rules.
  isValid(coord, value) {
    for (let i = 0; i < this.ROWS; i++) {
      let c = new RC(coord.row, i);
      if (this.getValue(c) == value) return false;
      c = new RC(i, coord.col);
      if (this.getValue(c) == value) return false;
      c = new RC(this.row2D(coord.row, i), this.col2D(coord.col, i));
      if (this.getValue(c) == value) return false;
    }
    return true;
  }

  // Function to print out the puzzle.
  print() {
    for (let i = 0; i < this.ROWS; i++) {
      for (let j = 0; j < this.COLS; j++) {
        let coord = new RC(i, j);
        process.stdout.write(this.getValue(coord).toString());
      }
      console.log("");
    }
    console.log("");
  }
}

var puzzleIO = require('./puzzleIO');

puzzleIO.puzzleReader
  .then(data => {
    let sudoku = new Sudoku(data);

    sudoku.solve();
    sudoku.printSolutions();
  })
  .catch(error => console.log(error));
