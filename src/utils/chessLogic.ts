import { Board, ChessPiece, Position, PieceType, PieceColor, GameState } from '../types/chess.ts';
import { toast } from 'sonner';

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
  let moves: Position[] = [];
  
  switch (piece.type) {
    case 'pawn':
      moves = getPawnMoves(board, from, piece.color);
      break;
    case 'rook':
      moves = getRookMoves(board, from, piece.color);
      break;
    case 'knight':
      moves = getKnightMoves(board, from, piece.color);
      break;
    case 'bishop':
      moves = getBishopMoves(board, from, piece.color);
      break;
    case 'queen':
      moves = getQueenMoves(board, from, piece.color);
      break;
    case 'king':
      moves = getKingMoves(board, from, piece.color);
      break;
    default:
      moves = [];
  }
  
  // Filter out moves that would put own king in check
  return moves.filter(to => !wouldMoveResultInCheck(board, from, to, piece.color));
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
  
  // Standard knight moves: L-shape (2+1 squares)
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
  // Queen moves like rook + bishop combined
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
  
  // Standard chess move behavior
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  
  return newBoard;
};

// Check and checkmate detection functions
export const findKing = (board: Board, color: PieceColor): Position | null => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};

export const isSquareAttacked = (board: Board, position: Position, byColor: PieceColor): boolean => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === byColor) {
        const from = { row, col };
        let moves: Position[] = [];
        
        // Get raw moves without check filtering to avoid infinite recursion
        switch (piece.type) {
          case 'pawn':
            moves = getPawnMoves(board, from, piece.color);
            break;
          case 'rook':
            moves = getRookMoves(board, from, piece.color);
            break;
          case 'knight':
            moves = getKnightMoves(board, from, piece.color);
            break;
          case 'bishop':
            moves = getBishopMoves(board, from, piece.color);
            break;
          case 'queen':
            moves = getQueenMoves(board, from, piece.color);
            break;
          case 'king':
            moves = getKingMoves(board, from, piece.color);
            break;
        }
        
        if (moves.some(move => move.row === position.row && move.col === position.col)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isInCheck = (board: Board, color: PieceColor): boolean => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  
  const enemyColor: PieceColor = color === 'white' ? 'black' : 'white';
  return isSquareAttacked(board, kingPos, enemyColor);
};

export const wouldMoveResultInCheck = (board: Board, from: Position, to: Position, color: PieceColor): boolean => {
  // Simulate the move
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  
  return isInCheck(newBoard, color);
};

export const isCheckmate = (board: Board, color: PieceColor): boolean => {
  if (!isInCheck(board, color)) return false;
  
  // Check if any piece has a valid move that gets out of check
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const from = { row, col };
        const moves = getValidMoves(board, from, piece);
        if (moves.length > 0) {
          return false; // Found a valid move, not checkmate
        }
      }
    }
  }
  
  return true; // No valid moves found, it's checkmate
};

export const isStalemate = (board: Board, color: PieceColor): boolean => {
  if (isInCheck(board, color)) return false; // Can't be stalemate if in check
  
  // Check if any piece has a valid move
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const from = { row, col };
        const moves = getValidMoves(board, from, piece);
        if (moves.length > 0) {
          return false; // Found a valid move, not stalemate
        }
      }
    }
  }
  
  return true; // No valid moves found and not in check, it's stalemate
};

// Game state management
export interface ChessGameManager {
  gameState: GameState;
  queenMoved: { white: boolean; black: boolean };
  handleSquareClick: (position: Position) => void;
  resetGame: () => void;
  addListener: (listener: () => void) => () => void;
}

export const createChessGame = (): ChessGameManager => {
  let gameState: GameState = {
    board: initialBoard,
    currentPlayer: 'white',
    selectedSquare: null,
    validMoves: [],
    gameStatus: 'playing'
  };
  
  let queenMoved = { white: false, black: false };
  let listeners: Array<() => void> = [];

  const notifyListeners = () => {
    listeners.forEach(listener => listener());
  };

  const addListener = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  const handleSquareClick = (position: Position) => {
    const { board, currentPlayer, selectedSquare, validMoves } = gameState;
    const clickedPiece = getPieceAt(board, position);

    // If no square is selected
    if (!selectedSquare) {
      if (clickedPiece && clickedPiece.color === currentPlayer) {
        const moves = getValidMoves(board, position, clickedPiece);
        gameState = {
          ...gameState,
          selectedSquare: position,
          validMoves: moves
        };
        notifyListeners();
      }
      return;
    }

    // If clicking the same square, deselect
    if (selectedSquare.row === position.row && selectedSquare.col === position.col) {
      gameState = {
        ...gameState,
        selectedSquare: null,
        validMoves: []
      };
      notifyListeners();
      return;
    }

    // If clicking a valid move
    const isValidMove = validMoves.some(
      move => move.row === position.row && move.col === position.col
    );

    if (isValidMove) {
      const movedPiece = getPieceAt(board, selectedSquare);
      const newBoard = makeMove(board, selectedSquare, position);
      const nextPlayer: PieceColor = currentPlayer === 'white' ? 'black' : 'white';
      
      // Track if queen has been moved
      if (movedPiece?.type === 'queen') {
        queenMoved = {
          ...queenMoved,
          [movedPiece.color]: true
        };
      }
      
      // Check game status
      let newGameStatus: 'playing' | 'check' | 'checkmate' | 'stalemate' = 'playing';
      
      if (isInCheck(newBoard, nextPlayer)) {
        if (isCheckmate(newBoard, nextPlayer)) {
          newGameStatus = 'checkmate';
          toast(`Checkmate! ${currentPlayer} wins!`);
        } else {
          newGameStatus = 'check';
          toast(`${nextPlayer} is in check!`);
        }
      } else if (isStalemate(newBoard, nextPlayer)) {
        newGameStatus = 'stalemate';
        toast('Stalemate! Game is a draw!');
      }
      
      gameState = {
        board: newBoard,
        currentPlayer: nextPlayer,
        selectedSquare: null,
        validMoves: [],
        gameStatus: newGameStatus
      };

      if (clickedPiece) {
        toast(`${currentPlayer} captured ${clickedPiece.type}!`);
      }
      notifyListeners();
    } else if (clickedPiece && clickedPiece.color === currentPlayer) {
      // Select a different piece of the same color
      const moves = getValidMoves(board, position, clickedPiece);
      gameState = {
        ...gameState,
        selectedSquare: position,
        validMoves: moves
      };
      notifyListeners();
    } else {
      // Invalid move
      gameState = {
        ...gameState,
        selectedSquare: null,
        validMoves: []
      };
      notifyListeners();
    }
  };

  const resetGame = () => {
    gameState = {
      board: initialBoard,
      currentPlayer: 'white',
      selectedSquare: null,
      validMoves: [],
      gameStatus: 'playing'
    };
    queenMoved = { white: false, black: false };
    toast('New game started!');
    notifyListeners();
  };

  return {
    get gameState() { return gameState; },
    get queenMoved() { return queenMoved; },
    handleSquareClick,
    resetGame,
    addListener
  };
};