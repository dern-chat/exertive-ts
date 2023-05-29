import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { getTokenFromRequest } from './token.service'

export function generateToken(nickname: string) {
    return jwt.sign({ nickname: nickname }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
}

export function isValidToken(token: string) {
    try {
        jwt.verify(token, process.env.JWT_SECRET as string)
        return true
    }
    catch (e) {
        return false
    }
}

export function getNicknameFromToken(token: string): string {
    const decoded = jwt.decode(token)
    if (typeof decoded === 'string') {
        throw new Error('Invalid token')
    }
    return decoded?.nickname || 'anonymous'
}

export function getNicknameFromReq(req: Request): string {
    const token = getTokenFromRequest(req) || ''

    return getNicknameFromToken(token) || 'anonymous'
}
