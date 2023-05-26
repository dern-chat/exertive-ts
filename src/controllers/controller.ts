import { Request, Response } from 'express'
import Room from '../types/room'
import Message from '../types/message'
import { Server } from 'socket.io'
import * as jwtService from '../services/jwt.service'
import { MESSAGE_EVENT, USER_JOIN_EVENT } from '../socket/event'

export function roomInfoController(room: Room) {
    return (req: Request, res: Response) => {
        console.log('room info requested')

        console.log('auth header: ', req.header('Authorization'))
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) {
            res.sendStatus(401)
            return
        }

        console.log('token: ', token)
        const nickname = jwtService.getNicknameFromToken(token)

        if (!jwtService.isValidToken(token)) {
            res.sendStatus(401)
            return
        }

        res.send({ roomName: room.name, users: room.users, msgs: room.messages, nickname: nickname })
    }
}

export function joinRoomController(room: Room, io: Server) {
    return (req: Request, res: Response) => {
        const nickname: string = req.body.nickname
        const passphrase: string = req.body.passphrase

        if (passphrase !== room.passphrase) {
            res.sendStatus(401)
            return
        }
        const token = jwtService.generateToken(nickname)
        console.log('token: ', token)

        try {
            room.addUser(nickname)
        }
        catch (e) {
            console.log(e)
            res.sendStatus(400)
            return
        }

        io.emit(USER_JOIN_EVENT, nickname)

        console.log('user joined: ', nickname)

        res.cookie('token', token, { httpOnly: true })
        res.send({ roomName: room.name, users: room.users, token: token })
    }
}

export function messageController(room: Room, io: Server) {
    return (req: Request, res: Response) => {
        const { author, content, time } = req.body
        const message = new Message(author, content, time)
        room.addMessage(message)
        console.log('message received: ', message)

        io.emit(MESSAGE_EVENT, message)
        console.log('message broadcasted: ', message)

        res.sendStatus(200)
    }
}

export function messagesController(room: Room) {
    return (req: Request, res: Response) => {
        console.log('messages requested')

        res.send(room.messages)
    }
}
