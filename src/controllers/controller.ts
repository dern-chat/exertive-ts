import { Request, Response } from 'express'
import Room from '../types/room'
import Message from '../types/message'
import { Server } from 'socket.io'
import * as jwtService from '../services/jwt.service'
import { MESSAGE_EVENT, USER_JOIN_EVENT } from '../socket/event'
import { checkAuth } from '../services/auth.service'

export function roomInfoController(room: Room) {
    return (req: Request, res: Response) => {
        if (!checkAuth(req)) {
            res.sendStatus(401)
            return
        }

        const nickname = jwtService.getNicknameFromReq(req)

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

        try {
            room.addUser(nickname)
        }
        catch (e) {
            res.sendStatus(400)
            return
        }

        io.emit(USER_JOIN_EVENT, nickname)

        res.cookie('token', token, { httpOnly: true })
        res.send({ roomName: room.name, users: room.users, token: token })
    }
}

export function messageController(room: Room, io: Server) {
    return (req: Request, res: Response) => {
        if (!checkAuth(req)) {
            res.sendStatus(401)
            return
        }

        const { author, content, time } = req.body
        const message = new Message(author, content, time)
        room.addMessage(message)

        io.emit(MESSAGE_EVENT, message)

        res.sendStatus(200)
    }
}

export function messagesController(room: Room) {
    return (req: Request, res: Response) => {
        res.send(room.messages)
    }
}
