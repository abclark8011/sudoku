// Program to solve any Sudoku puzzle by brute force. The actual
// code is only about 40 lines.
// The user calls the "solve" function and passes in a 9x9 puzzle.
// The puzzle is filled out with correct values and returned back.

#include <stdio.h>
#include <memory.h>

int solved = 0;   // global to keep track if puzzle has been solved

// A sample puzzle.  Could extend the app to read puzzle from stdin.
int puzzle[9][9] = {
    // Allegedly the hardest known Sudoku puzzle
    { 8, 0, 0, 0, 0, 0, 0, 0, 0 },
    { 0, 0, 3, 6, 0, 0, 0, 0, 0 },
    { 0, 7, 0, 0, 9, 0, 2, 0, 0 },
    { 0, 5, 0, 0, 0, 7, 0, 0, 0 },
    { 0, 0, 0, 0, 4, 5, 7, 0, 0 },
    { 0, 0, 0, 1, 0, 0, 0, 3, 0 },
    { 0, 0, 1, 0, 0, 0, 0, 6, 8 },
    { 0, 0, 8, 5, 0, 0, 0, 1, 0 },
    { 0, 9, 0, 0, 0, 0, 4, 0, 0 }
};

/*
int solution[9][9] = {
    // Solution to the hardest puzzle
    { 8, 1, 2, 7, 5, 3, 6, 4, 9 },
    { 9, 4, 3, 6, 8, 2, 1, 7, 5 }, 
    { 6, 7, 5, 4, 9, 1, 2, 8, 3 }, 
    { 1, 5, 4, 2, 3, 7, 8, 9, 6 }, 
    { 3, 6, 9, 8, 4, 5, 7, 2, 1 }, 
    { 2, 8, 7, 1, 6, 9, 5, 3, 4 }, 
    { 5, 2, 1, 9, 7, 4, 3, 6, 8 }, 
    { 4, 3, 8, 5, 2, 6, 9, 1, 7 }, 
    { 7, 9, 6, 3, 1, 8, 4, 5, 2 } 
};
*/

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

int
main() {
  solve(puzzle, 0, 0);
  if (solved) {
    printf("Solved!\n");
    print(puzzle);
  }
}
