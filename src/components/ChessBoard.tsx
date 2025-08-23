import { useState } from 'react';
import { ChessSquare } from './ChessSquare';
import { Board, Position, GameState, PieceColor } from '../types/chess';
import { initialBoard, getValidMoves, makeMove, getPieceAt } from '../utils/chessLogic';
import { toast } from 'sonner';

export const ChessBoard = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: initialBoard,
    currentPlayer: 'white',
    selectedSquare: null,
    validMoves: [],
    gameStatus: 'playing'
  });

  const handleSquareClick = (position: Position) => {
    const { board, currentPlayer, selectedSquare, validMoves } = gameState;
    const clickedPiece = getPieceAt(board, position);

    // If no square is selected
    if (!selectedSquare) {
      if (clickedPiece && clickedPiece.color === currentPlayer) {
        const moves = getValidMoves(board, position, clickedPiece);
        setGameState(prev => ({
          ...prev,
          selectedSquare: position,
          validMoves: moves
        }));
      }
      return;
    }

    // If clicking the same square, deselect
    if (selectedSquare.row === position.row && selectedSquare.col === position.col) {
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        validMoves: []
      }));
      return;
    }

    // If clicking a valid move
    const isValidMove = validMoves.some(
      move => move.row === position.row && move.col === position.col
    );

    if (isValidMove) {
      const newBoard = makeMove(board, selectedSquare, position);
      const nextPlayer: PieceColor = currentPlayer === 'white' ? 'black' : 'white';
      
      setGameState({
        board: newBoard,
        currentPlayer: nextPlayer,
        selectedSquare: null,
        validMoves: [],
        gameStatus: 'playing'
      });

      if (clickedPiece) {
        toast(`${currentPlayer} captured ${clickedPiece.type}!`);
      }
    } else if (clickedPiece && clickedPiece.color === currentPlayer) {
      // Select a different piece of the same color
      const moves = getValidMoves(board, position, clickedPiece);
      setGameState(prev => ({
        ...prev,
        selectedSquare: position,
        validMoves: moves
      }));
    } else {
      // Invalid move
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        validMoves: []
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      board: initialBoard,
      currentPlayer: 'white',
      selectedSquare: null,
      validMoves: [],
      gameStatus: 'playing'
    });
    toast('New game started!');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          Current Player: <span className="capitalize text-accent">{gameState.currentPlayer}</span>
        </h2>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          New Game
        </button>
      </div>
      
      <div className="grid grid-cols-8 gap-0 border-4 border-chess-board-border rounded-lg overflow-hidden shadow-2xl">
        {gameState.board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = 
              gameState.selectedSquare &&
              gameState.selectedSquare.row === rowIndex &&
              gameState.selectedSquare.col === colIndex;
            const isValidMove = gameState.validMoves.some(
              move => move.row === rowIndex && move.col === colIndex
            );

            return (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                position={position}
                isLight={isLight}
                isSelected={!!isSelected}
                isValidMove={isValidMove}
                onClick={handleSquareClick}
              />
            );
          })
        )}
      </div>
      
      <div className="text-center text-muted-foreground">
        <p>Click a piece to select it, then click a highlighted square to move.</p>
      </div>
    </div>
  );
};