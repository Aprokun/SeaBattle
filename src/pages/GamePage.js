import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { Board } from "../models/Board";
import BoardComponent from "../components/BoardComponent";
import ActionsInfo from "../components/ActionsInfo";

const wss = new WebSocket('ws://localhost:4000')

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

    const navigate = useNavigate()

    function shoot(x, y) {
        wss.send(JSON.stringify({ event: 'shoot', payload: { username: localStorage.nickname, x, y, gameId } }))
    }

    useEffect(() => {
        wss.send(JSON.stringify({ event: 'connect', payload: { username: localStorage.nickname, gameId } }))
        restart()
    }, [])

    function ready() {
        wss.send(JSON.stringify({ event: 'ready', payload: { username: localStorage.nickname, gameId } }))
        setShipsReady(true)
    }

    wss.onmessage = function (resp) {

        const { type, payload } = JSON.parse(resp.data)
        const { username, x, y, canStart, rivalName, success } = payload

        switch (type) {

            case 'connectToPlay':
                if (!success) {
                    return navigate('/')
                }
                setRivalName(rivalName)
                break

            case 'readyToPlay':
                if (payload.username === localStorage.nickname && canStart) {
                    setCanShoot(true)
                }
                break

            case 'afterShootByMe':
                console.log('afterShoot', username !== localStorage.nickname)
                if (username !== localStorage.nickname) {

                    const isPerfectHit = myBoard.cells[x][y].mark?.name === 'ship'
                    changeBoardAfterShoot(myBoard, setMyBoard, x, y, isPerfectHit)
                    wss.send(JSON.stringify({ event: 'checkShoot', payload: { ...payload, isPerfectHit } }))
                    if (!isPerfectHit) {
                        setCanShoot(true)
                    }
                }
                break

            case 'isPerfectHit':
                if (username === localStorage.nickname) {
                    changeBoardAfterShoot(enemyBoard, setEnemyBoard, x, y, payload.isPerfectHit)
                    setCanShoot(payload.isPerfectHit)
                }
                break

            default:
                break
        }
    }

    function changeBoardAfterShoot(board, setBoard, x, y, isPerfectHit) {
        isPerfectHit ? board.addDamage(x, y) : board.addMiss(x, y)
        const newBoard = board.getCopyBoard()
        setBoard(newBoard)
    }

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
            <ActionsInfo ready={ready} canShoot={canShoot} shipsReady={shipsReady}/>
        </div>
    )
}

export default GamePage