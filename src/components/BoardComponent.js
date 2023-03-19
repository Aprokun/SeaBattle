import React from "react";
import CellComponent from "./CellComponent";

const BoardComponent = ({ board, setBoard, shipsReady, isMyBoard, canShoot, shoot }) => {

    const boardClasses = ['board']

    console.log(board)

    function addMark(x, y) {

    }

    if (canShoot) {
        boardClasses.push('active-shoot')
    }

    return (
        <div className={boardClasses.join(' ')}>
            {board.cells.map((row, index) =>
                <React.Fragment key={index}>
                    {row.map(cell =>
                        <CellComponent key={cell.id} cell={cell} addMark={addMark}/>
                    )}
                </React.Fragment>
            )}
        </div>
    )
}

export default BoardComponent