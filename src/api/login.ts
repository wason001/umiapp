import type { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signToken } from "../../utils/jwt";
 
export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  console.log('req', req)
  switch(req.method) {
    case 'POST':
      try {
        const { email, password } = req.body
        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
          where: { email }
        })
        console.log('user', user)
        console.log('result', bcrypt.compareSync(password, user ? user.passwordHash : ''))
        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
          return res.status(401).json({
            message: 'Invalid email or password'
          })
        }
        res.status(200).setCookie('token', await signToken(user.id))
        .json({ ...user, passwordHash: undefined })
        await prisma.$disconnect()
      } catch (error: any) {
        res.status(500).json(error)
      }
      break

      default:
        res.status(405).json({ error: 'Method not allowed' })
  }
}