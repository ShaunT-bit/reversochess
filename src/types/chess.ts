export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
    type: PieceType;
    color: PieceColor;
}

export interface Position {
    row: number;
    col: number;
}

export interface Move {
    from: Position;
    to: Position;
    piece: ChessPiece;
    capturedPiece?: ChessPiece;
}

export type Board = (ChessPiece | null)[][];

export interface GameState {
    board: Board;
    currentPlayer: PieceColor;
    selectedSquare: Position | null;
    validMoves: Position[];
    gameStatus: 'playing' | 'check' | 'checkmate' | 'stalemate';
}