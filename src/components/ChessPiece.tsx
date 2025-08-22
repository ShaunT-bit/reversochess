import { ChessPiece as ChessPieceType } from '../types/chess';

interface ChessPieceProps {
    piece: ChessPieceType;
}

const pieceSymbols = {
    king: { white: '♔', black: '♚' },
    queen: { white: '♕', black: '♛' },
    rook: { white: '♖', black: '♜' },
    bishop: { white: '♗', black: '♝' },
    knight: { white: '♘', black: '♞' },
    pawn: { white: '♙', black: '♟' },
};

export const ChessPiece = ({ piece }: ChessPieceProps) => {
    const symbol = pieceSymbols[piece.type][piece.color];

    return (
        <div className={`
      text-4xl select-none cursor-pointer transition-all duration-200 
      hover:scale-110 drop-shadow-lg
      ${piece.color === 'white' ? 'text-foreground' : 'text-foreground filter brightness-75'}
    `}>
            {symbol}
        </div>
    );
};