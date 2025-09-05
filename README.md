
♟️ Reverso Chess – Custom Piece Moves

This project is a React component that showcases a set of custom chess piece movement rules. Unlike traditional chess, each piece has unique, modified mechanics to create a new strategic experience.

🚀 Features

Custom move rules for Pawn, Rook, Knight, Bishop, Queen, and King.

Styled UI with cards to display moves clearly.

Interactive hover effects with smooth transitions.

Built with React + Tailwind CSS + shadcn/ui and lucide-react icons.

♜ Custom Move Rules

Pawn ♟️ → Moves diagonally forward into empty squares, captures forward. Cannot move straight.

Rook ♜ → Moves only to the 2nd, 4th, or 6th square in straight lines. Cannot stop on odd-numbered squares.

Knight ♞ → Each turn randomly acts as a rook, bishop, or knight. Restricted to a 3×3 area.

Bishop ♝ → Moves like a normal bishop. On capture, swaps position with a random friendly pawn.

Queen ♛ → Moves like a rook + bishop. Blocked if a pawn is directly in front, but may step one square past it.

King ♚ → Standard king movement (one square in any direction).
