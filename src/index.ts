import express, { Express } from 'express'
import { Server } from 'socket.io'
import bodyparser from 'body-parser'
import { createServer } from 'http'
import Room from './types/room'
import * as controllers from './controllers/controller'
import * as dotenv from 'dotenv'
import prompts from 'prompts'

(async () => {
    dotenv.config();

    const userInput = await prompts([
        {
            type: 'text',
            name: 'roomName',
            message: 'Enter room name',
            initial: 'Chat Room',
            validate: value => value.length < 3 ? `Room name must be at least 3 characters` : true
        },
        {
            type: 'password',
            name: 'roomPassword',
            message: 'Enter room password',
            validate: value => value.length < 8 ? `Room password must be at least 8 characters` : true
        }
    ])

    const app: Express = express()
    const http = createServer(app)
    const io = new Server(http, {
        cors: {
            origin: '*',
        }
    })

    app.use(bodyparser.json())
    app.use(bodyparser.urlencoded({ extended: false }))
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')
        res.setHeader('Access-Control-Allow-Credentials', 'true')

        next()
    })

    const room: Room = new Room(userInput.roomName, userInput.roomPassword)

    app.get('/', controllers.indexController)
    app.get('/api/room-info', controllers.roomInfoController(room))
    app.post('/api/join-room', controllers.joinRoomController(room, io))
    app.post('/api/message', controllers.messageController(room, io))
    app.get('/api/messages', controllers.messagesController(room))

    io.on('connection', (socket) => {
        socket.on('user-enter', (msg) => {
            console.log(msg);
            io.emit('broadcast-user-enter', `${msg}`)
        })
    })

    http.listen(2323, () => {
        console.log('listening on http://localhost:2323')
    })
})()
