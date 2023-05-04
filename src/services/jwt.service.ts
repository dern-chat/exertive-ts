import jwt from 'jsonwebtoken'

export function generateToken(username: string) {
  return jwt.sign({ username: username }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
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