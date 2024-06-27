import { useEffect, useState } from "react"
import "./App.css"

const BASE_URL = "/api/fe/wordle-words"

const GUESS_LENGTH = 5

function App() {
  const [worldList, setWorldList] = useState([])
  const [wordToGuess, setWordToGuess] = useState("REACT")
  const [guessList, setGuessList] = useState(Array(6).fill(null))
  const [currentGuess, setCurrentGuess] = useState("")
  const [isGameOver, setIsGameOver] = useState(false)

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver) {
        return
      }
      if (event.key === "Enter") {
        if (currentGuess.length !== 5) {
          return
        }
        console.log("index and workd", worldList, currentGuess, worldList.indexOf(currentGuess));
        if (worldList.indexOf(currentGuess.toUpperCase()) === -1) {
          setCurrentGuess("")
          return;
        }
        const newGuesses = [...guessList]
        newGuesses[guessList.findIndex((val) => val == null)] = currentGuess
        setGuessList(newGuesses)
        setCurrentGuess("")

        const isCorrect = currentGuess === wordToGuess
        if (isCorrect) {
          setIsGameOver(true)
          return;
        }
      }
      if (currentGuess.length >= 5) {
        return
      }

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1))
        return
      }
      setCurrentGuess((oldGuess) => oldGuess + event.key)
    }

    document.addEventListener("keydown", handleType)
    return () => {
      document.removeEventListener("keydown", handleType)
    }
  }, [currentGuess, guessList, isGameOver, wordToGuess, worldList])

  useEffect(() => {
    const fetchWordList = async () => {
      const response = await fetch(BASE_URL)
      const data = await response.json()
      setWorldList(data)
      const randomWord = data[Math.floor(Math.random() * data.length)]
      setWordToGuess(randomWord)
      console.log(randomWord);
    }

    fetchWordList()
  }, [])

  return (
    <div className="game-container">
      <div className="board">
        {guessList.map((guess, i) => {
          const isCurrentGuess = i === guessList.findIndex((val) => val == null)
          return (
            <Row
              guess={isCurrentGuess ? currentGuess : guess ?? ""}
              isFinal={!isCurrentGuess && guess != null}
              wordToGuess={wordToGuess}
            />
          )
        })}
      </div>
    </div>
  )
}

export default App

const Row = ({ guess, isFinal, wordToGuess }) => {
  const tiles = []

  for (let i = 0; i < GUESS_LENGTH; i++) {
    const char = guess[i]
    let className = "tile"
    if (isFinal) {
      if (char.toUpperCase() === wordToGuess[i]) {
        className += " correct"
      } else if (wordToGuess.includes(char.toUpperCase())) {
        className += " close"
      } else {
        className += " incorrect"
      }
    }
    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    )
  }

  return <div className="line">{tiles}</div>
}
