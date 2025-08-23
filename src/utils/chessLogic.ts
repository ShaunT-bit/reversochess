import { Board, ChessPiece, Position, PieceType, PieceColor } from '../types/chess';

export const initialBoard: Board = [
  [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' }
  ],
  Array(8).fill({ type: 'pawn', color: 'black' }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: 'pawn', color: 'white' }),
  [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' }
  ]
];

export const isValidPosition = (pos: Position): boolean => {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
};

export const getPieceAt = (board: Board, pos: Position): ChessPiece | null => {
  if (!isValidPosition(pos)) return null;
  return board[pos.row][pos.col];
};

export const getValidMoves = (board: Board, from: Position, piece: ChessPiece): Position[] => {
  const moves: Position[] = [];
  
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, from, piece.color);
    case 'rook':
      return getRookMoves(board, from, piece.color);
    case 'knight':
      return getKnightMoves(board, from, piece.color);
    case 'bishop':
      return getBishopMoves(board, from, piece.color);
    case 'queen':
      return getQueenMoves(board, from, piece.color);
    case 'king':
      return getKingMoves(board, from, piece.color);
    default:
      return moves;
  }
};

const getPawnMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;

  // Move forward one square
  const oneForward = { row: from.row + direction, col: from.col };
  if (isValidPosition(oneForward) && !getPieceAt(board, oneForward)) {
    moves.push(oneForward);

    // Move forward two squares from starting position
    if (from.row === startRow) {
      const twoForward = { row: from.row + 2 * direction, col: from.col };
      if (isValidPosition(twoForward) && !getPieceAt(board, twoForward)) {
        moves.push(twoForward);
      }
    }
  }

  // Capture diagonally
  const captureLeft = { row: from.row + direction, col: from.col - 1 };
  const captureRight = { row: from.row + direction, col: from.col + 1 };
  
  [captureLeft, captureRight].forEach(pos => {
    if (isValidPosition(pos)) {
      const piece = getPieceAt(board, pos);
      if (piece && piece.color !== color) {
        moves.push(pos);
      }
    }
  });

  return moves;
};

const getRookMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  directions.forEach(([dRow, dCol]) => {
    for (let i = 1; i < 8; i++) {
      const pos = { row: from.row + dRow * i, col: from.col + dCol * i };
      if (!isValidPosition(pos)) break;
      
      const piece = getPieceAt(board, pos);
      if (!piece) {
        moves.push(pos);
      } else {
        if (piece.color !== color) moves.push(pos);
        break;
      }
    }
  });

  return moves;
};

const getKnightMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  knightMoves.forEach(([dRow, dCol]) => {
    const pos = { row: from.row + dRow, col: from.col + dCol };
    if (isValidPosition(pos)) {
      const piece = getPieceAt(board, pos);
      if (!piece || piece.color !== color) {
        moves.push(pos);
      }
    }
  });

  return moves;
};

const getBishopMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

  directions.forEach(([dRow, dCol]) => {
    for (let i = 1; i < 8; i++) {
      const pos = { row: from.row + dRow * i, col: from.col + dCol * i };
      if (!isValidPosition(pos)) break;
      
      const piece = getPieceAt(board, pos);
      if (!piece) {
        moves.push(pos);
      } else {
        if (piece.color !== color) moves.push(pos);
        break;
      }
    }
  });

  return moves;
};

const getQueenMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  return [...getRookMoves(board, from, color), ...getBishopMoves(board, from, color)];
};

const getKingMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  directions.forEach(([dRow, dCol]) => {
    const pos = { row: from.row + dRow, col: from.col + dCol };
    if (isValidPosition(pos)) {
      const piece = getPieceAt(board, pos);
      if (!piece || piece.color !== color) {
        moves.push(pos);
      }
    }
  });

  return moves;
};

export const makeMove = (board: Board, from: Position, to: Position): Board => {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  
  return newBoard;
};