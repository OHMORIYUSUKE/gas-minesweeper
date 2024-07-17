export class Minesweeper {
  private rows: number;
  private cols: number;
  private mines: number;
  private board: string[][];
  private displayBoard: string[][];

  constructor(rows: number, cols: number, mines: number) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.board = Array.from({ length: rows }, () => Array(cols).fill("0"));
    this.displayBoard = Array.from({ length: rows }, () => Array(cols).fill("□"));
    this.placeMines();
    this.calculateNumbers();
  }

  private placeMines(): void {
    let placedMines = 0;
    while (placedMines < this.mines) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      if (this.board[row]![col] !== "M") {
        this.board[row]![col] = "M";
        placedMines++;
      }
    }
  }

  // eslint-disable-next-line complexity
  private calculateNumbers(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row]![col] === "M") continue;
        let count = 0;
        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            if (r === 0 && c === 0) continue;
            const newRow = row + r;
            const newCol = col + c;
            if (
              newRow >= 0 &&
              newRow < this.rows &&
              newCol >= 0 &&
              newCol < this.cols &&
              this.board[newRow]![newCol] === "M"
            ) {
              count++;
            }
          }
        }
        this.board[row]![col] = count.toString();
      }
    }
  }

  // eslint-disable-next-line complexity
  private floodFill(row: number, col: number): void {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols || this.displayBoard[row]![col] !== "□") return;
    const cellValue = this.board[row]![col] as string;
    this.displayBoard[row]![col] = cellValue;

    if (this.board[row]![col] === "0") {
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          if (r !== 0 || c !== 0) {
            this.floodFill(row + r, col + c);
          }
        }
      }
    }
  }

  private revealCell(row: number, col: number): boolean {
    if (this.board[row]![col] === "M") {
      this.displayBoard[row]![col] = "M";
      return false; // マインに当たった場合
    }

    if (this.displayBoard[row]![col] !== "□") {
      return true; // すでに開いているセルはそのまま
    }

    this.floodFill(row, col);
    return true;
  }

  private checkWin(): boolean {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.displayBoard[row]![col] === "□" && this.board[row]![col] !== "M") {
          return false; // まだ開いていない非マインセルがある
        }
      }
    }
    return true; // すべての非マインセルが開かれている
  }

  public printBoard(board: string[][]): void {
    for (const row of board) {
      console.log(row.join(" "));
    }
    console.log(); // 空行
  }

  private revealAllCells(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.displayBoard[row]![col] = this.board[row]![col]!;
      }
    }
  }

  public play(moves: [number, number][]): void {
    for (const [row, col] of moves) {
      if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
        console.log(`Invalid coordinates (${row}, ${col}). Skipping.`);
        continue;
      }
      const result = this.revealCell(row, col);
      console.log(`Revealed cell (${row}, ${col}): ${this.displayBoard[row]![col]}`);
      this.printBoard(this.displayBoard);
      if (!result) {
        console.log(`You hit a mine at (${row}, ${col})! Game over.`);
        this.revealAllCells();
        this.printBoard(this.displayBoard);
        return;
      }
      if (this.checkWin()) {
        console.log("Congratulations! You cleared the board.");
        this.printBoard(this.displayBoard);
        return;
      }
    }
  }
}
