class DragonTower {
    constructor() {
        this.currentRow = 5;
        this.currentScore = 0;
        this.highestScore = 0;
        this.multiplier = 1;
        this.isGameActive = false;
        this.grid = [];

        this.gridCells = document.querySelectorAll('.tile');
        this.startButton = document.querySelector('.startButton');
        this.currentScoreElement = document.getElementById('currentScore');
        this.highestScoreElement = document.getElementById('highestScore');
        this.introScreen = document.querySelector('.introScreen');
        
        this.updateScoreDisplays();
        this.initializeEventListeners();
        this.setupIntroScreen();
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        
        this.gridCells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                if (!this.isGameActive) return;
                
                if (cell.classList.contains('active')) {
                    const rowIndex = Math.floor(index / 3);
                    const colIndex = index % 3;
                    
                    if (colIndex === this.grid[rowIndex]) {
                        this.handleUnsafeClick(cell);
                    } else {
                        this.handleSafeClick(cell, rowIndex, colIndex);
                    }
                }
            });
        });
    }
    
    setupIntroScreen() {
        this.introScreen.addEventListener('click', () => {
            document.body.classList.add('gameActive');
        });
    }

    startGame() {
        document.body.classList.add('gameActive');
        
        this.isGameActive = true;
        this.currentRow = 5;
        this.multiplier = 1;
        this.currentScore = 0;

        this.updateScoreDisplays();
        this.startButton.style.display = 'none';
        this.resetGrid();
        this.generateSafeTiles();
        this.highlightCurrentRow();
    }

    generateSafeTiles() {
        this.grid = [];
        for (let i = 0; i < 6; i++) {
            const randomCol = Math.floor(Math.random() * 3);
            this.grid.push(randomCol);
        }
    }

    highlightCurrentRow() {
        if (this.currentRow < 0 || !this.isGameActive) return;
        
        const rowStart = this.currentRow * 3;
        for (let i = 0; i < 3; i++) {
            this.gridCells[rowStart + i].classList.add('active');
        }
    }
    
    handleSafeClick(tile, rowIndex, colIndex) {
        tile.classList.add('safe');
        
        this.multiplier *= 1.2;
        this.currentScore = Math.floor(100 * this.multiplier);
        this.updateScoreDisplays();

        this.revealRow(rowIndex);
        
        if (rowIndex === 0) {
            this.handleWin();
        } else {
            this.currentRow--;
            setTimeout(() => this.highlightCurrentRow(), 500);
        }
    }

    handleUnsafeClick(tile) {
        tile.classList.add('unsafe');
        this.revealAllTiles();
        
        document.body.classList.add('gameOver');
        
        const gameOverScreen = document.querySelector('.GameOver');
        const handleGameOverClick = () => {
            document.body.classList.remove('gameOver');
            this.updateHighScore();
            this.resetGame();
            gameOverScreen.removeEventListener('click', handleGameOverClick);
        };
        
        gameOverScreen.addEventListener('click', handleGameOverClick);
    }
    
    handleWin() {
        this.updateHighScore();
        document.body.classList.add('gameWinner');
        
        const winnerScreen = document.querySelector('.winnerScreen');
        const handleWinnerClick = () => {
            document.body.classList.remove('gameWinner');
            this.resetGame();
            winnerScreen.removeEventListener('click', handleWinnerClick);
        };
        
        winnerScreen.addEventListener('click', handleWinnerClick);
    }
    
    updateHighScore() {
        if (this.currentScore > this.highestScore) {
            this.highestScore = this.currentScore;
            this.highestScoreElement.textContent = this.highestScore;
        }
    }
    
    updateScoreDisplays() {
        this.currentScoreElement.textContent = this.currentScore;
        this.highestScoreElement.textContent = this.highestScore;
    }
    
    revealRow(rowIndex) {
        const dragonIndex = this.grid[rowIndex];
        const rowStart = rowIndex * 3;
        
        for (let col = 0; col < 3; col++) {
            const cellIndex = rowStart + col;
            const cell = this.gridCells[cellIndex];
            
            if (col === dragonIndex) {
                cell.classList.add('unsafe');
            } else {
                cell.classList.add('safe');
            }
        }
    }
    
    revealAllTiles() {
        for (let row = 0; row <= this.currentRow; row++) {
            this.revealRow(row);
        }
    }

    resetGrid() {
        this.gridCells.forEach(cell => {
            cell.classList.remove('active', 'safe', 'unsafe');
        });
    }

    resetGame() {
        this.isGameActive = false;
        this.currentRow = 5;
        this.multiplier = 1;
        this.updateScoreDisplays();

        this.startButton.style.display = 'block';
        this.resetGrid();
        
        document.body.classList.remove('gameOver');
        document.body.classList.remove('gameWinner');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DragonTower();
});