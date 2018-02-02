// Program to solve any Sudoku puzzle by brute force. The actual
// code is only about 30 lines.
// The user creates a Sudoku object by passing in the 9x9
// data grid.  Then the user calls the "solve" function.
// The solution(s) are stored as Puzzles in the Sudoku object.


class Sudoku {
  constructor(puzzle) {
    this.puzzle = new Puzzle(puzzle);
    this.solution = [];
  }

  printSolutions() {
    for (let solution of this.solution) {
      solution.print();
    }
    return this;
  }

  addSolution() {
    // Silly, but we create a scalar array from the cell array, and then
    // convert back to a cell array to save the solution.  We do this as
    // a way to do a deep copy.
    this.solution.push(new Puzzle(this.puzzle._puzzle.map(x => x.value)));
    return this;
  }

  getCell(idx) {
    return this.puzzle.getCell(idx);
  }

  // The solver.  Recursively tries all possible solutions.
  solve(idx = 0) {
    if (idx >= 9 * 9) {
      return this.addSolution();
    }

    let cell = this.getCell(idx);
    let origValue = cell.value;

    // If there's a value, then it came from the inital puzzle.  Skip it.
    if (origValue > 0) {
      return this.solve(idx + 1);
    }

    // Try all 9 possible values
    for (let value = 1; value <= 9; value++) {
      if (this.puzzle.isValid(cell, value)) {
        cell.value = value;
        this.solve(idx + 1);
      }
    }
    cell.value = 0; // Restore original value
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
}

class Puzzle {
  constructor(puzzle = []) {
    this.puzzle = puzzle;
  }

  getCell(idx) {
    return this._puzzle[idx];
  }

  get puzzle() {
    return this._puzzle;
  }

  set puzzle(data) {
    this._puzzle = data.map(x => new Cell(x));
    this.initRowsColsBlocks();
    this.assignCellsToRowColBlock();
    this.dump();
  }

  dump() {
    function p(cell) {
      process.stdout.write(cell.getValue().toString());
    }
    function pr(txt = "") {
      console.log(txt);
    }

    pr("Data:");
    this.print();
    pr("Rows:");
    this.rows.map(row => { row.map(cell => p(cell)); pr() });
    pr("Cols:");
    this.cols.map(col => { col.map(cell => p(cell)); pr() });
    pr("Blocks:");
    this.blocks.map(block => { block.map(cell => p(cell)); pr() });
  }

  assignCellsToRowColBlock() {
    this.rows.map  (row   => row.map  (x => x.row   = row));
    this.cols.map  (col   => col.map  (x => x.col   = col));
    this.blocks.map(block => block.map(x => x.block = block));
  }

  // Create 9 rows, 9 cols, 9 blocks that point to
  // the cells in them.
  initRowsColsBlocks() {
    this.rows = []; this.cols = []; this.blocks = [];
    // Rows
    for (let i = 0; i < 9; i++) {
      this.rows.push(this._puzzle.slice(i * 9, i * 9 + 9))
    }
    // Cols
    for (let i = 0; i < 9; i++) {
      let x = [];
      for (let j = 0; j < 9; j++) {
        x.push(this._puzzle[j * 9 + i]);
      }
      this.cols.push(x);
    }
    // Blocks
    for (let i = 0; i < 9; i++) {
      let x = [];
      let row = Math.floor(i / 3) * 3;
      let col = i % 3 * 3;
      for (let j = row; j < row + 3; j++) {
        for (let k = col; k < col + 3; k++) {
          x.push(this.rows[j][k]);
        }
      }
      this.blocks.push(x);
    }
  }

  // Given a possible value for a row/col location, check if
  // that value will violate the basic Sudoku rules.
  isValid(cell, value) {
    var contains = (array, value) => array.find(x => x.value === value) !== undefined;
    if (contains(cell.row, value)) return false;
    if (contains(cell.col, value)) return false;
    if (contains(cell.block, value)) return false;
    return true;
  }

  // Function to print out the puzzle.
  print() {
    let i = 0;
    for (let cell of this._puzzle) {
      process.stdout.write(cell.getValue().toString());
      if (++i % 9 === 0) {
        console.log("");
      }
    }
    console.log("");
  }
}

require('./puzzleIO').puzzleReader(9 * 9, ['data/2solutions.txt'])
//require('./puzzleIO').puzzleReader(9 * 9, process.argv.slice(2))
  .then(data => {
    new Sudoku(data).solve().printSolutions();
  })
  .catch(error => console.log(error));
