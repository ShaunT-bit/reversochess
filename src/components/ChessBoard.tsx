import { useState, useEffect } from 'react';
import { ChessSquare } from './ChessSquare.tsx';
import { Position } from '../types/chess.ts';
import { createChessGame } from '../utils/chessLogic.ts';

export const ChessBoard = () => {
  const [game] = useState(() => createChessGame());
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = game.addListener(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, [game]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          Current Player: <span className="capitalize text-accent">{game.gameState.currentPlayer}</span>
        </h2>
        {game.gameState.gameStatus === 'check' && (
          <span className="text-red-500 font-bold">CHECK!</span>
        )}
        {game.gameState.gameStatus === 'checkmate' && (
          <span className="text-red-600 font-bold">CHECKMATE!</span>
        )}
        {game.gameState.gameStatus === 'stalemate' && (
          <span className="text-yellow-600 font-bold">STALEMATE!</span>
        )}
        <button
          onClick={game.resetGame}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          New Game
        </button>
      </div>
      
      <div className="grid grid-cols-8 gap-0 border-4 border-chess-board-border rounded-lg overflow-hidden shadow-2xl">
        {game.gameState.board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = 
              game.gameState.selectedSquare &&
              game.gameState.selectedSquare.row === rowIndex &&
              game.gameState.selectedSquare.col === colIndex;
            const isValidMove = game.gameState.validMoves.some(
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
                onClick={game.handleSquareClick}
              />
            );
          })
        )}
      </div>
      
      <div className="text-center text-muted-foreground">
        <p>Click a piece to select it, then click a highlighted square to move.</p>
        {game.gameState.gameStatus === 'checkmate' && (
          <p className="text-red-600 font-bold mt-2">Game Over - {game.gameState.currentPlayer === 'white' ? 'Black' : 'White'} Wins!</p>
        )}
        {game.gameState.gameStatus === 'stalemate' && (
          <p className="text-yellow-600 font-bold mt-2">Game Over - Draw!</p>
        )}
      </div>
    </div>
  );
};