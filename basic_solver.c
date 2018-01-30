// Program to solve any Sudoku puzzle by brute force. The actual
// code is only about 40 lines!
// The user calls the "solve" function and passes in a 9x9 puzzle.
// The puzzle is filled out with correct values and returned back.

#include <stdio.h>
#include <memory.h>
#include <malloc.h>

int solved = 0;   // global to keep track if puzzle has been solved

// Functions to convert from 1D index to 2D coords.
// Used to traverse all cells in a block.
#define RTB(id, offset)  (3 * ((id) / 3) + (offset) / 3)
#define CTB(id, offset) (3 * ((id) / 3) + (offset) % 3)

// Calulcate the next row and column
#define NEXT_ROW(row, col)  ((9 * (row) + (col) + 1) / 9)
#define NEXT_COL(row, col)  ((9 * (row) + (col) + 1) % 9)


// Given a possible value for a row/col location, check if
// that value will violate the basic Sudoku rules.
int
isValid(int data[9][9], int row, int col, int value) {
  for (int i = 0; i < 9; i++) {
    if (data[row][i] == value) return 0;
    if (data[i][col] == value) return 0;
    if (data[RTB(row, i)][CTB(col, i)] == value) return 0;
  }
  return 1;
}

// Function to print out the puzzle.
void
print(int data[9][9]) {
  for (int i = 0; i < 9; i++) {
    for (int j = 0; j < 9; j++) {
      printf("%1d", data[i][j]);
    }
    printf("\n");
  }
}

// The solver.  Recursively tries all possible solutions.
void
solve(int data[9][9], int row, int col) {
  if ((solved = solved || row == 9)) return;

  int val = data[row][col];

  // If there's a value, then it came from the inital puzzle.  Skip it.
  if (val) return solve(data, NEXT_ROW(row, col), NEXT_COL(row, col));

  // Try all 9 possible values
  for (int i = 1; !solved && i <= 9; i++) {
    if (isValid(data, row, col, i)) {
      data[row][col] = i;
      solve(data, NEXT_ROW(row, col), NEXT_COL(row, col));
      if (solved) return;
      data[row][col] = val; // Restore value
    }
  }
}

// Need some error handling in case bad input is provided, like:
//   * Not enough data
//   * Too much data
//   * Not enough data in a line
//   * An invalid number
//
void
puzzleRead(int puzzle[][9]) {
  char *line = NULL;
  size_t len = 0;
  ssize_t read;
  int lineNum = 0;

  while ((read = getline(&line, &len, stdin)) != -1) {
    for (int i = 0; i < read && i < 9 && line[i] != '\n'; i++) {
      puzzle[lineNum][i] = line[i] - '0';
    }
    lineNum++;
  }
  free(line);
}

int
main() {
  int puzzle[9][9];

  puzzleRead(puzzle);
  solve(puzzle, 0, 0);
  if (solved) {
    printf("Solved!\n");
    print(puzzle);
  }
}
