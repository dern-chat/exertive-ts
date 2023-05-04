import express, { Express } from 'express'
import { Server } from 'socket.io'
import bodyparser from 'body-parser'
import { createServer } from 'http'
import Room from './types/room'
import * as controllers from './controllers/controller'
import * as dotenv from 'dotenv'

dotenv.config()

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
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  next()
})

const room: Room = new Room("Test Room", '1234')

app.get('/', controllers.indexController)
app.get('/api/room-info', controllers.roomInfoController(room))
app.post('/api/join-room', controllers.joinRoomController(room))
app.post('/api/message', controllers.messageController(room, io))
app.get('/api/messages', controllers.messagesController(room))

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    console.log(msg);
    io.emit('broadcast-message', `${msg}`)
  })
  socket.on('user-enter', (msg) => {
    console.log(msg);
    io.emit('broadcast-user-enter', `${msg}`)
  })
})

http.listen(2323, () => {
  console.log('listening on http://localhost:2323')
})