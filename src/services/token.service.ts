import { Request } from 'express'

function getTokenFromReqAuth(req: Request): string | null {
    return req.header('Authorization')?.split(' ')[1] ?? null
}

function getTokenFromReqCookie(req: Request): string | null {
    return req.header('Cookie')?.split(';').find(cookie => cookie.startsWith('token'))?.split('=')[1] ?? null
}

export function getTokenFromRequest(req: Request): string | null {
    return getTokenFromReqAuth(req) ?? getTokenFromReqCookie(req)
}
