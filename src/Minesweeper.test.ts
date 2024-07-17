import { Minesweeper } from './Minesweeper';

describe('Minesweeper ゲーム', () => {
    test('ボードが正しいサイズとマインの数で初期化されるべき', () => {
        const game = new Minesweeper(5, 5, 2);
        
        // ボードのサイズが正しいか確認
        expect(game['board'].length).toBe(5);
        expect(game['board'][0]!.length).toBe(5);

        // ボード上のマインの数をカウント
        const mineCount = game['board']
            .reduce((acc, row) => acc.concat(row), [])
            .filter(cell => cell === 'M').length;
        expect(mineCount).toBe(2);
    });

    test('セルが正しく表示されるべき', () => {
        const game = new Minesweeper(5, 5, 2);

        // セルを表示しようとする
        const initialBoard = game['displayBoard'].map(row => [...row]); // ボードの状態をクローン
        game.play([[0, 0]]); // 移動を行う

        // セルが表示されたか確認
        expect(game['displayBoard'][0]![0]).not.toBe('□');
        expect(game['displayBoard']).not.toEqual(initialBoard);
    });

    test('マインに当たると正しく処理されるべき', () => {
        const game = new Minesweeper(5, 5, 1);
        
        // マインの位置を取得
        const mineLocation = game['board']
            .map((row, rowIndex) => row.map((cell, colIndex) => ({ cell, rowIndex, colIndex })))
            .reduce((acc, curr) => acc.concat(curr), [])
            .find(cell => cell.cell === 'M');

        if (mineLocation) {
            const { rowIndex, colIndex } = mineLocation;
            game.play([[rowIndex, colIndex]]);
            // ゲームオーバーの状態に達しているか確認
            expect(game['displayBoard'][rowIndex]![colIndex]).toBe('M');
        } else {
            fail('ボード上にマインが配置されていません。');
        }
    });

    test('勝利条件が正しく検出されるべき', () => {
        const game = new Minesweeper(5, 5, 0); // マインなし
        const moves:[number, number][]= [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                moves.push([i, j]);
            }
        }

        game.play(moves);

        expect(game['displayBoard']
          .reduce((acc, row) => acc.concat(row), [])
          .every(cell => cell !== '□')).toBe(true);
    });
});
