const WebSocket = require('ws')

const games = {}
const port = 4000;

function initGames(client, gameId) {

    // Если игры нет
    if (!games[gameId]) {
        games[gameId] = [client]
    }

    // Если в игре 1 человек
    if (games[gameId] && gameId[gameId]?.length < 2) {
        games[gameId] = [...games[gameId], client]
    }

    // Если в игре 2 человека
    if (games[gameId] && games[gameId].length === 2) {
        games[gameId] = games[gameId].filter(wsc => wsc.nickname !== client.nickname)
        games[gameId] = [...games[gameId], client]
    }
}

function broadcast(req) {

    const { username, gameId } = req.payload

    let res;

    games[gameId].forEach(client => {

        switch (req.event) {

            case 'connect':
                res = {
                    type: 'connectToPlay',
                    payload: {
                        success: true,
                        rivalName: games[gameId].find(user => user.nickname !== client.nickname)?.nickname,
                        username: client.nickname
                    }
                }
                break

            case 'ready':
                res = { type: 'readyToPlay', payload: { canStart: games[gameId].length > 1, username } }
                break

            case 'shoot':
                res = { type: 'afterShootByMe', payload: req.payload }
                break

            case 'checkShoot':
                res = {type: 'isPerfectHit', payload: req.payload }
                break

            default:
                req = { type: 'logout', payload: req.payload }
                break
        }

        client.send(JSON.stringify(res))
    })

}

const start = () => {

    const wss = new WebSocket.Server(
        { port: port },
        () => console.log('Server start on port ' + port)
    )

    wss.on('connection', (client) => {

        client.on('message', async (msg) => {

            const req = JSON.parse(msg.toString())

            if (req.event === 'connection') {

                client.nickname = req.payload.username
                initGames(client, req.payload.gameId)
            }

            broadcast(req)
        })
    })
}

start()