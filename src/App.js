import {useCallback, useEffect, useState} from "react";
import blank from './images/blank.png';
import blueCandy from './images/blue-candy.png';
import redCandy from './images/red-candy.png';
import greenCandy from './images/green-candy.png';
import orangeCandy from './images/orange-candy.png';
import purpleCandy from './images/purple-candy.png';
import yellowCandy from './images/yellow-candy.png';
import Scoreboard from "./Components/Scoreboard";

const width = 8;
const candyColors = [
    blueCandy,
    redCandy,
    greenCandy,
    orangeCandy,
    purpleCandy,
    yellowCandy
];



function App() {
    const [currColorGrid, setCurrColorGrid] = useState([])
    const [sqBeingDragged, setSqBeingDragged] = useState(null)
    const [sqBeingReplaced, setSqBeingReplaced] = useState(null)
    const [scoreDisplay, setScoreDisplay] = useState(0)

    const checkForColumnOfFour = useCallback(() => {
        for (let i = 0; i <= 39; i++) {
            const colOfFour = [i, i + width, i + width * 2, i + width * 3];
            const chosenColor = currColorGrid[i];
            const isBlank = currColorGrid[i] === blank

            if (colOfFour.every(sq => currColorGrid[sq] === chosenColor && !isBlank)) {
                // all items are same
                colOfFour.forEach(sq2 => currColorGrid[sq2] = blank);
                console.log("Found 4 col and deleted match");
                setScoreDisplay(prev => prev + 4);
                return true;
            }
        }
    }, [currColorGrid])

    const checkForColumnOfThree = useCallback(() => {
        for (let i = 0; i <= 47; i++) {
            const colOfThree = [i, i + width, i + width * 2];
            const chosenColor = currColorGrid[i];
            const isBlank = currColorGrid[i] === blank


            if (colOfThree.every(sq => currColorGrid[sq] === chosenColor && !isBlank)) {
                // all items are same
                colOfThree.forEach(sq2 => currColorGrid[sq2] = blank);
                // console.log("Found 3 col and deleted match");
                setScoreDisplay(prev => prev + 3);
                return true;
            }
        }
    }, [currColorGrid])

    const checkForRowOfThree = useCallback(() => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2];
            const chosenColor = currColorGrid[i];
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
            const isBlank = currColorGrid[i] === blank;

            if (notValid.includes(i)) continue;

            if (rowOfThree.every(sq => currColorGrid[sq] === chosenColor && !isBlank)){
                // all items are same
                rowOfThree.forEach(sq2 => currColorGrid[sq2] = blank);
                console.log("Found 3 row and deleted match");
                setScoreDisplay(prev => prev + 3);
                return true;
            }
        }
    }, [currColorGrid])

    const checkForRowOfFour = useCallback(() => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3];
            const chosenColor = currColorGrid[i];
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];
            const isBlank = currColorGrid[i] === blank;
            if (notValid.includes(i)) continue;

            if (rowOfFour.every(sq => currColorGrid[sq] === chosenColor && !isBlank)) {
                // all items are same
                rowOfFour.forEach(sq2 => currColorGrid[sq2] = blank);
                console.log("Found 3 row and deleted match");
                setScoreDisplay(prev => prev + 3);
                return true;
            }
        }
    }, [currColorGrid])

    const MoveIntoSquareBelow = useCallback(() => {
        for (let i = 0; i <= 55; i++) {
            const firstRow = [0,1,2,3,4,5,6,7]
            const isFirstRow = firstRow.includes(i)

            if (isFirstRow && currColorGrid[i] === blank) {
                currColorGrid[i] = candyColors[Math.floor(Math.random() * candyColors.length)]
            }

            if (currColorGrid[i + width] === blank){
                currColorGrid[i + width] = currColorGrid[i]
                currColorGrid[i] = blank
            }
        }
    }, [currColorGrid])

    const createBoard = () => {
        const randomColorArrangement = [];
        for (let i = 0; i < width * width; i++) {
            const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
            randomColorArrangement.push(randomColor)
        }
        setCurrColorGrid(randomColorArrangement);
    }

    useEffect(()=>{
        createBoard();
    },[])

    useEffect(()=>{
        const timer = setInterval(()=>{
            checkForColumnOfFour()
            checkForRowOfFour()
            checkForColumnOfThree()
            checkForRowOfThree()
            MoveIntoSquareBelow()
            setCurrColorGrid([...currColorGrid])
        }, 200)

        return () => clearInterval(timer)
    },[checkForColumnOfThree, currColorGrid, checkForColumnOfFour, checkForRowOfFour, checkForRowOfThree, MoveIntoSquareBelow])

    const dragStart = (e) => {
      console.log("start",e.target)
        setSqBeingDragged(e.target);
    }
    const dragDrop = (e) => {
        console.log("end", e.target);
        setSqBeingReplaced(e.target);
    }
    const dragEnd = () => {
        const sqBeingDraggedId = parseInt(sqBeingDragged.getAttribute('data-id'));
        const sqBeingReplacedId = parseInt(sqBeingReplaced.getAttribute('data-id'));

        currColorGrid[sqBeingReplacedId] = sqBeingDragged.getAttribute('src');
        currColorGrid[sqBeingDraggedId] = sqBeingReplaced.getAttribute('src');

        const validMoves = [
            sqBeingDraggedId -1,
            sqBeingDraggedId - width,
            sqBeingDraggedId +1,
            sqBeingDraggedId + width,
        ]
        const isValidMove = validMoves.includes(sqBeingReplacedId)
        const isCol4 = checkForColumnOfFour();
        const isRow4 = checkForRowOfFour();
        const isCol3 = checkForColumnOfThree();
        const isRow3 = checkForRowOfThree();

        if (sqBeingReplacedId && isValidMove && (isCol4 || isRow4 || isCol3 || isRow3)) {
            setSqBeingDragged(null);
            setSqBeingReplaced(null);
        } else {
            currColorGrid[sqBeingReplacedId] = sqBeingReplaced.getAttribute('src');
            currColorGrid[sqBeingDraggedId] = sqBeingDragged.getAttribute('src');
            setCurrColorGrid([...currColorGrid])
        }
    }

  return (
    <div className="app">
        <div className='game'>
        {
            currColorGrid.map((candyColor, idx)=>(
                <img
                    key={idx}
                    src={candyColor}
                    // style={{ backgroundColor: candyColor }}
                    alt={candyColor}
                    data-id={idx}
                    draggable={true}
                    onDragOver={(e)=> e.preventDefault()}
                    onDragEnter={(e)=> e.preventDefault()}
                    onDragLeave={(e)=> e.preventDefault()}
                    onDragStart={dragStart}
                    onDragEnd={dragEnd}
                    onDrop={dragDrop}
                />
            ))
        }
        </div>
        <Scoreboard score={scoreDisplay} />
    </div>
  );
}

export default App;
