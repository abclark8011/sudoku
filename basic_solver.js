// Program to solve any Sudoku puzzle by brute force. The actual
// code is only about 30 lines.
// The user creates a Sudoku object by passing in the 9x9
// data grid.  Then the user calls the "solve" function.
// The solution(s) are stored as Puzzles in the Sudoku object.


class Sudoku {
  constructor(puzzle) {
    this.puzzle = new Puzzle(puzzle);
    this._solution = [];
  }

  printSolutions() {
    this._solution.map(x => x.print());
    return this;  // Just to allow method chaining.
  }

  addSolution() {
    // Silly, but we create a scalar array from the cell array, and then
    // convert back to a cell array to save the solution.  We do this as
    // a way to do a deep copy.
    this._solution.push(new Puzzle(this.puzzle._puzzle.map(x => x.value)));
    return this;
  }

  // Convenience wrapper function.
  getCell(idx) {
    return this.puzzle.getCell(idx);
  }

  // The solver.  Recursively try all possible solutions.
  // If we get past the end of the puzzle, then we have
  // found a solution!
  //
  solve(idx = 0) {
    // If beyond end of puzzle, then we've got a solution.
    if (idx >= this.puzzle.length) {
      return this.addSolution();
    }

    let cell = this.getCell(idx);

    // If there's a value, then it came from the inital puzzle.  Skip it.
    if (cell.value) {
      this.solve(idx + 1);
    }
    else {
      // Get the list of possible values and try them all.
      cell.choices.map(x => { cell.value = x; this.solve(idx + 1) });
      cell.value = 0; // Restore original value
    }
    return this;
  }
}

class Cell {
  constructor(value) {
    this.value = value;
    this.row = this.col = this.block = [];
  }

  getValue() {
    return this.value;
  }

  getSValue() {
    return Number(this.value);
  }

  // Get array of legal values for this cell.
  get choices() {
    var contains = (array, value) => array.find(x => x.value === value) !== undefined;
    return Array.range(1, 9).filter(x =>
      !contains(this.row,   x) &&
      !contains(this.col,   x) &&
      !contains(this.block, x)
    );
  }

}

class Puzzle {
  constructor(puzzle = []) {
    this.puzzle = puzzle;
  }

  get puzzle() {
    return this._puzzle;
  }

  set puzzle(data) {
    this._puzzle = data.map(x => new Cell(x));
    this.initRowsColsBlocks();
    this.assignCellsToRowColBlock();
  }

  get length() {
    return this.puzzle.length;
  }

  getCell(idx) {
    return this.puzzle[idx];
  }

  dump() {
    pr("Data:");
    this.print();
    pr("Rows:");
    this.rows.map(row     => { row.map(cell   => pr(cell.getSValue(), false)); pr() });
    pr("Cols:");
    this.cols.map(col     => { col.map(cell   => pr(cell.getSValue(), false)); pr() });
    pr("Blocks:");
    this.blocks.map(block => { block.map(cell => pr(cell.getSValue(), false)); pr() });
  }

  // Set up a back-reference so a cell knows what row/cell/block it is in.
  assignCellsToRowColBlock() {
    this.rows.map  (row   => row.map  (x => x.row   = row  ));
    this.cols.map  (col   => col.map  (x => x.col   = col  ));
    this.blocks.map(block => block.map(x => x.block = block));
  }

  // Create 9 rows, 9 cols, 9 blocks that point to cells.
  initRowsColsBlocks() {
    this.rows = []; this.cols = []; this.blocks = [];
    // Rows
    Array.range(0, 8).map(i => this.rows.push(this._puzzle.slice(i * 9, i * 9 + 9)));
    // Cols
    Array.range(0, 8).map(i =>
      this.cols.push(Array.from(Array.range(0, 8).map(j => this._puzzle[j * 9 + i])))
    );
    //Blocks
    Array.range(0, 8).map(i => {
      let x = [];
      let row = Math.floor(i / 3) * 3;
      let col = i % 3 * 3;
      Array.range(row, row + 2).map(j =>
        Array.range(col, col + 2).map(k => x.push(this.rows[j][k])));
      this.blocks.push(x);
    });
  }

  // Function to print out the puzzle.  Print CRLF after each 9th cell.
  print() {
    pr("Puzzle:");
    this._puzzle.map((x, idx) => pr(x.getSValue(), !((idx+1) % 9)));
    pr();
  }
}

// Create a range method for ourselves since JS doesn't have one (yet).
Array.range = (i, j) => Array.from(new Array(j - i + 1), (val, idx) => i + idx);

// Helper function for printing!
function pr(txt = "", newLine = true) {
  process.stdout.write(txt + (newLine ? "\n" : ""));
}

//require('./puzzleIO').puzzleReader(9 * 9, ['data/2solutions.txt'])
require('./puzzleIO').puzzleReader(9 * 9, process.argv.slice(2))
  .then(data => new Sudoku(data).solve().printSolutions())
  .catch(error => pr(error));
