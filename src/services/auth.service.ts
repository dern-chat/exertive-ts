import { Request } from 'express'
import { getTokenFromRequest } from './token.service'

export function checkAuth(req: Request): boolean {
    const token = getTokenFromRequest(req)
    if (!token) {
        return false
    }

    return true
}
