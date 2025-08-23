import { ChessPiece } from './ChessPiece';
import { ChessPiece as ChessPieceType, Position } from '../types/chess';

interface ChessSquareProps {
  piece: ChessPieceType | null;
  position: Position;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: (position: Position) => void;
}

export const ChessSquare = ({ 
  piece, 
  position, 
  isLight, 
  isSelected, 
  isValidMove, 
  onClick 
}: ChessSquareProps) => {
  const handleClick = () => {
    onClick(position);
  };

  return (
    <div
      className={`
        relative w-16 h-16 flex items-center justify-center cursor-pointer
        transition-all duration-200 hover:brightness-110
        ${isLight ? 'bg-chess-light' : 'bg-chess-dark'}
        ${isSelected ? 'ring-4 ring-chess-selected' : ''}
        ${isValidMove ? 'ring-2 ring-chess-valid-move' : ''}
      `}
      onClick={handleClick}
    >
      {isValidMove && !piece && (
        <div className="w-4 h-4 rounded-full bg-chess-valid-move opacity-60" />
      )}
      {isValidMove && piece && (
        <div className="absolute inset-0 ring-2 ring-chess-valid-move bg-chess-valid-move bg-opacity-20" />
      )}
      {piece && <ChessPiece piece={piece} />}
    </div>
  );
};