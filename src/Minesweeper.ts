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

  /**
   * ランダムにボード上に地雷を配置します。
   */
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

  /**
   * ボード上のすべてのセルに、周囲の地雷の数を計算して設定します。
   */
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

  /**
   * 再帰的にセルを開いて、連鎖的にゼロセルを開きます。
   * @param row - 開くセルの行番号
   * @param col - 開くセルの列番号
   */
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

  /**
   * 指定したセルを開きます。地雷がある場合はゲームオーバー。
   * @param row - 開くセルの行番号
   * @param col - 開くセルの列番号
   * @returns セルを無事に開けたかどうかの結果。地雷があった場合は false、それ以外は true。
   */
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

  /**
   * ゲームの勝利条件を確認します。すべての非マインセルが開かれているかどうかをチェックします。
   * @returns ゲームに勝った場合は true、それ以外は false。
   */
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

  /**
   * ボードの指定された状態をコンソールに出力します。
   * @param board - 出力するボード
   */
  public printBoard(board: string[][]): void {
    for (const row of board) {
      console.log(row.join(" "));
    }
    console.log(); // 空行
  }

  /**
   * すべてのセルを開いてボード全体を表示します。
   */
  private revealAllCells(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.displayBoard[row]![col] = this.board[row]![col]!;
      }
    }
  }

  /**
   * プレイヤーの移動を処理し、ゲームを進行させます。
   * @param moves - プレイヤーが行った移動のリスト（[行, 列] の配列）
   */
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
