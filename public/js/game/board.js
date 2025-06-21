class GameBoard {
  constructor(canvas, isSpectatorMode = false) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.size = window.CONSTANTS.BOARD_SIZE;
    this.cells = Array(window.CONSTANTS.TOTAL_CELLS)
      .fill()
      .map(() => ({
        state: false,
        color: "",
      }));
    this.margin = 0;
    this.cellSize = 0;
    this.onCellClick = null;
    this.lastStonePosition = -1; // 마지막에 놓인 돌의 위치
    this.isSpectatorMode = isSpectatorMode; // 관전 모드 여부

    this.init();
  }

  init() {
    this.resize();
    this.draw();
    this.bindEvents();

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const maxSize = Math.min(viewport.width * 0.9, viewport.height * 0.75, 750);

    this.canvas.width = maxSize;
    this.canvas.height = maxSize;
    this.margin = maxSize / 18;
    this.cellSize = (maxSize - this.margin * 2) / (this.size - 1);

    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawStones();
  }

  drawGrid() {
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
    this.ctx.shadowBlur = 2;

    for (let i = 0; i < this.size; i++) {
      const pos = this.margin + i * this.cellSize;

      this.ctx.beginPath();
      this.ctx.moveTo(this.margin, pos);
      this.ctx.lineTo(this.canvas.width - this.margin, pos);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(pos, this.margin);
      this.ctx.lineTo(pos, this.canvas.height - this.margin);
      this.ctx.stroke();
    }

    this.ctx.shadowColor = "transparent";
    this.ctx.shadowBlur = 0;
    this.drawStarPoints();
  }

  drawStarPoints() {
    const starPoints = [
      { x: 3, y: 3 },
      { x: 3, y: 11 },
      { x: 11, y: 3 },
      { x: 11, y: 11 },
      { x: 7, y: 7 },
      { x: 7, y: 3 },
      { x: 7, y: 11 },
      { x: 3, y: 7 },
      { x: 11, y: 7 },
    ];

    this.ctx.fillStyle = "#ffffff";
    this.ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    this.ctx.shadowBlur = 3;

    starPoints.forEach((point) => {
      const x = this.margin + point.x * this.cellSize;
      const y = this.margin + point.y * this.cellSize;

      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.shadowColor = "transparent";
    this.ctx.shadowBlur = 0;
  }

  drawStones() {
    this.cells.forEach((cell, index) => {
      if (cell.state) {
        this.drawStone(index, cell.color, "gray");
      }
    });

    // 마지막에 놓인 돌에 빨간 점 표시
    this.drawLastStoneIndicator();
  }

  drawStone(position, color, borderColor = null) {
    if (position < 0 || position >= this.cells.length) return;

    const coords = window.Utils.positionToCoords(position);
    const x = this.margin + coords.x * this.cellSize;
    const y = this.margin + coords.y * this.cellSize;
    const radius = this.cellSize * 0.4;

    this.ctx.save();

    // 그림자 효과
    this.ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    this.ctx.shadowBlur = 8;
    this.ctx.shadowOffsetX = 4;
    this.ctx.shadowOffsetY = 4;

    if (color === "black") {
      // 검은돌 - 방사형 그라데이션으로 3D 효과
      const gradient = this.ctx.createRadialGradient(
        x - radius * 0.3,
        y - radius * 0.3,
        0,
        x,
        y,
        radius
      );
      gradient.addColorStop(0, "#444444");
      gradient.addColorStop(0.3, "#222222");
      gradient.addColorStop(1, "#000000");
      this.ctx.fillStyle = gradient;
    } else {
      // 흰돌 - 방사형 그라데이션으로 3D 효과
      const gradient = this.ctx.createRadialGradient(
        x - radius * 0.3,
        y - radius * 0.3,
        0,
        x,
        y,
        radius
      );
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.7, "#f0f0f0");
      gradient.addColorStop(1, "#d0d0d0");
      this.ctx.fillStyle = gradient;
    }

    // 메인 돌 그리기
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();

    // 테두리
    this.ctx.strokeStyle =
      borderColor || (color === "black" ? "#ffffff" : "#333333");
    this.ctx.lineWidth = borderColor === "red" ? 3 : 1;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();

    // 하이라이트 효과 추가
    if (!borderColor || borderColor !== "red") {
      this.ctx.save();

      if (color === "black") {
        // 검은돌 하이라이트
        const highlight = this.ctx.createRadialGradient(
          x - radius * 0.4,
          y - radius * 0.4,
          0,
          x - radius * 0.4,
          y - radius * 0.4,
          radius * 0.6
        );
        highlight.addColorStop(0, "rgba(255, 255, 255, 0.3)");
        highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
        this.ctx.fillStyle = highlight;
      } else {
        // 흰돌 하이라이트
        const highlight = this.ctx.createRadialGradient(
          x - radius * 0.4,
          y - radius * 0.4,
          0,
          x - radius * 0.4,
          y - radius * 0.4,
          radius * 0.5
        );
        highlight.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
        this.ctx.fillStyle = highlight;
      }

      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }

    // 빨간 테두리 특수 효과
    if (borderColor === "red") {
      this.ctx.strokeStyle = "rgba(255, 68, 68, 0.6)";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  drawLastStoneIndicator() {
    if (
      this.lastStonePosition >= 0 &&
      this.lastStonePosition < this.cells.length
    ) {
      const coords = window.Utils.positionToCoords(this.lastStonePosition);
      const x = this.margin + coords.x * this.cellSize;
      const y = this.margin + coords.y * this.cellSize;
      const squareSize = this.cellSize * 0.15; // 정사각형 크기

      this.ctx.save();

      // 빨간 정사각형 그리기
      this.ctx.fillStyle = "#ff4444";
      this.ctx.shadowColor = "rgba(255, 68, 68, 0.8)";
      this.ctx.shadowBlur = 4;
      this.ctx.fillRect(
        x - squareSize / 2,
        y - squareSize / 2,
        squareSize,
        squareSize
      );

      // 빨간 정사각형 테두리
      this.ctx.strokeStyle = "#ff0000";
      this.ctx.lineWidth = 1;
      this.ctx.shadowColor = "transparent";
      this.ctx.shadowBlur = 0;
      this.ctx.strokeRect(
        x - squareSize / 2,
        y - squareSize / 2,
        squareSize,
        squareSize
      );

      this.ctx.restore();
    }
  }

  bindEvents() {
    this.canvas.addEventListener("click", (event) => {
      if (this.onCellClick) {
        const position = this.getPositionFromEvent(event);
        if (position >= 0) {
          this.onCellClick(position);
        }
      }
    });

    this.canvas.addEventListener("mousemove", (event) => {
      const position = this.getPositionFromEvent(event);
      this.canvas.style.cursor = position >= 0 ? "crosshair" : "default";
    });
  }

  getPositionFromEvent(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const gridX = Math.round((x - this.margin) / this.cellSize);
    const gridY = Math.round((y - this.margin) / this.cellSize);

    if (window.Utils.isValidCoords(gridX, gridY)) {
      const position = window.Utils.coordsToPosition(gridX, gridY);
      if (!this.cells[position].state) {
        return position;
      }
    }

    return -1;
  }
  placeStone(position, color) {
    if (!window.Utils.isValidPosition(position) || this.cells[position].state) {
      return false;
    }

    this.cells[position] = { state: true, color };
    this.lastStonePosition = position; // 마지막에 놓인 돌의 위치 저장
    this.draw();
    return true;
  }

  reset() {
    this.cells = Array(window.CONSTANTS.TOTAL_CELLS)
      .fill()
      .map(() => ({
        state: false,
        color: "",
      }));
    this.lastStonePosition = -1; // 마지막 돌 위치 초기화
    this.draw();
  }

  getBoard() {
    return this.cells.map((cell) => (cell.state ? cell.color : ""));
  }

  setBoard(board) {
    this.cells = board.map((color, index) => ({
      state: !!color,
      color: color || "",
    }));

    // 마지막에 놓인 돌 찾기 (가장 높은 인덱스의 돌)
    this.lastStonePosition = -1;
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i]) {
        this.lastStonePosition = i;
        break;
      }
    }

    this.draw();
  }

  setLastStonePosition(position) {
    this.lastStonePosition = position;
    this.draw();
  }
}
