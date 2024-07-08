import {useState} from 'react'
import './App.css'
import confetti from 'canvas-confetti'

const TURNS = {
  X:'x',
  O:'o'
}
const WINNER_COMBOS = [
  [0,1,2], // horizontal
  [3,4,5],
  [6,7,8],
  [0,3,6], // vertical
  [1,4,7],
  [2,5,8],
  [0,4,8], // diagonal
  [2,4,6]
]
export function WinnerModal ({ winner, resetGame }) {
  if (winner === null) return null

  const winnerText = winner === false ? 'Empate' : 'Ganó:'

  return (
    <section className='winner'>
      <div className='text'>
        <h2>{winnerText}</h2>

        <header className='win'>
          {winner && <Square>{winner}</Square>}
        </header>

        <footer>
          <button onClick={resetGame}>Empezar de nuevo</button>
        </footer>
      </div>
    </section>
  )
}
export const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`

  const handleClick = () => {
    updateBoard(index)
  }

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}
function App() {
  //null not winner, false tie, x or o winner
  const [winner, setWinner] = useState(null) 
  
  const [board, setBoard] = useState(
    Array(9).fill(null)
  )
  const [turn, setTurn] = useState(TURNS.X)
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    
  }
  const checkWinnerFrom = (boardToCheck) => {
    // revisamos todas las combinaciones ganadoras
    // para ver si X u O ganó
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a]
      }
    }
    // si no hay ganador
    return null
  }
  
   const checkEndGame = (newBoard) => {
    // revisamos si hay un empate
    // si no hay más espacios vacíos
    // en el tablero
    return newBoard.every((square) => square !== null)
  }
  const updateBoard = (index) => {
    if (board[index] || winner) return
    // cambiar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    const newWinner = checkWinnerFrom(newBoard)
    
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
    
    // guardar aqui partida

  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <section className="game">
        {
          board.map((_,index) => {
            return(
              <Square
              key={index}
              index={index}
              updateBoard={updateBoard}
              >
               {board[index]}
              </Square>
            )
          }
        )
      }
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X} >
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O} >
          {TURNS.O}
        </Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
    
  )
  
}

export default App
