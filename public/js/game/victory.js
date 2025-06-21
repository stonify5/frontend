class Victory {
    constructor() {
        this.directions = [
            {dx: 1, dy: 0},
            {dx: 0, dy: 1},
            {dx: 1, dy: 1},
            {dx: 1, dy: -1}
        ];
    }
    
    checkWin(board, position, color) {
        const coords = window.Utils.positionToCoords(position);
        
        for (const direction of this.directions) {
            const count = this.countDirection(board, coords, color, direction);
            if (count === window.CONSTANTS.WINNING_COUNT) {
                return {
                    win: true,
                    direction,
                    line: this.getWinningLine(board, coords, color, direction)
                };
            }
        }
        
        return { win: false };
    }
    
    countDirection(board, coords, color, direction) {
        let count = 1;
        
        count += this.countInDirection(board, coords, color, direction.dx, direction.dy);
        count += this.countInDirection(board, coords, color, -direction.dx, -direction.dy);
        
        return count;
    }
    
    countInDirection(board, coords, color, dx, dy) {
        let count = 0;
        let x = coords.x + dx;
        let y = coords.y + dy;
        
        while (window.Utils.isValidCoords(x, y)) {
            const position = window.Utils.coordsToPosition(x, y);
            const cell = board[position];
            
            if (cell && cell.state && cell.color === color) {
                count++;
                x += dx;
                y += dy;
            } else {
                break;
            }
        }
        
        return count;
    }
    
    getWinningLine(board, coords, color, direction) {
        const line = [window.Utils.coordsToPosition(coords.x, coords.y)];
        
        let x = coords.x + direction.dx;
        let y = coords.y + direction.dy;
        while (window.Utils.isValidCoords(x, y)) {
            const position = window.Utils.coordsToPosition(x, y);
            const cell = board[position];
            if (cell && cell.state && cell.color === color) {
                line.push(position);
                x += direction.dx;
                y += direction.dy;
            } else {
                break;
            }
        }
        
        x = coords.x - direction.dx;
        y = coords.y - direction.dy;
        while (window.Utils.isValidCoords(x, y)) {
            const position = window.Utils.coordsToPosition(x, y);
            const cell = board[position];
            if (cell && cell.state && cell.color === color) {
                line.unshift(position);
                x -= direction.dx;
                y -= direction.dy;
            } else {
                break;
            }
        }
        
        return line.slice(0, window.CONSTANTS.WINNING_COUNT);
    }
    
    highlightWinningLine(boardInstance, line) {
        if (!line || line.length === 0) return;
        
        boardInstance.draw();
        
        line.forEach(position => {
            const cell = boardInstance.cells[position];
            if (cell && cell.state) {
                boardInstance.drawStone(position, cell.color, 'red');
            }
        });
    }
    
    checkGameEnd(board) {
        let emptyCount = 0;
        for (const cell of board) {
            if (!cell.state) emptyCount++;
        }
        return emptyCount === 0;
    }
}
