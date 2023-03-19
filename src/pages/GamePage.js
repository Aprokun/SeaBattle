import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { Board } from "../models/Board";
import BoardComponent from "../components/BoardComponent";

const GamePage = () => {

    const [myBoard, setMyBoard] = useState(new Board())
    const [enemyBoard, setEnemyBoard] = useState(new Board())
    const [rivalName, setRivalName] = useState('')
    const [shipsReady, setShipsReady] = useState(false)
    const [canShoot, setCanShoot] = useState(false)

    const { gameId } = useParams()

    function restart() {

        const myNewBoard = new Board()
        const enemyNewBoard = new Board()

        myNewBoard.initCells()
        enemyNewBoard.initCells()

        setMyBoard(myNewBoard)
        setEnemyBoard(enemyNewBoard)
    }

    function shoot(x, y) {

    }

    useEffect(() => { restart() }, [])

    return (
        <div>
            <p>Добро пожаловать в "Морской бой"</p>
            <div className={'boards-container'}>
                <div>
                    <p className={'nick'}>{localStorage.nickname}</p>
                    <BoardComponent
                        board={myBoard}
                        setBoard={setMyBoard}
                        isMyBoard
                        shipsReady={shipsReady}
                        canShoot={false}
                    />
                </div>
                <div>
                    <p className={'nick'}>{rivalName || 'Соперник неизвестен'}</p>
                    <BoardComponent
                        board={enemyBoard}
                        setBoard={setEnemyBoard}
                        canShoot={canShoot}
                        shipsReady={shipsReady}
                        shoot={shoot}
                    />
                </div>
            </div>
        </div>
    )
}

export default GamePage;