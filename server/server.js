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
        })
    })
}

start()