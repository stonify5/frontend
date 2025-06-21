class Stone {
    constructor(position, color, board) {
        this.position = position;
        this.color = color;
        this.board = board;
        this.coords = window.Utils.positionToCoords(position);
    }
    
    draw(ctx, highlight = false) {
        const x = this.board.margin + this.coords.x * this.board.cellSize;
        const y = this.board.margin + this.coords.y * this.board.cellSize;
        const radius = this.board.cellSize * 0.35;
        
        ctx.save();
        
        if (this.color === 'black') {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--stone-black').trim();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = highlight ? 6 : 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        } else {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--stone-white').trim();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = highlight ? 4 : 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
        }
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        if (highlight) {
            ctx.strokeStyle = 'rgba(255, 68, 68, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.strokeStyle = this.color === 'black' ? '#444' : '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    isAdjacent(otherStone) {
        const dx = Math.abs(this.coords.x - otherStone.coords.x);
        const dy = Math.abs(this.coords.y - otherStone.coords.y);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    }
    
    getDistance(otherStone) {
        const dx = this.coords.x - otherStone.coords.x;
        const dy = this.coords.y - otherStone.coords.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    clone() {
        return new Stone(this.position, this.color, this.board);
    }
}
