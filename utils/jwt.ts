import jwt from "jsonwebtoken"

// const secret = process.env.JWT_SECRET
const secret = 'wason####wason'

export function signToken(id: number) {
    console.log('secret', secret)
    if (!secret) {
        throw new Error('Environment variable JWT_SECRET is not defined!')
    }

    return new Promise<string>((resolve, reject) => {
        jwt.sign({ id }, secret, {}, (err, token) => {
            if (err || !token) {
                return reject(err)
            }
            resolve(token)
        })
    })
}

export function verifyToken(token: string) {
    if (!secret) {
        throw new Error('Environment variable JWT_SECRET is not defined!')
    }
    return new Promise<{ id: number }>((resolve, reject) => {
        jwt.verify(token, secret, (err, payload) => {
            if (err || !payload) {
                return reject(err)
            }
            resolve(payload as { id: number })
        })
    })
}