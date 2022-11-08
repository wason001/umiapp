import type { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'
import { verifyToken } from "../../../utils/jwt";
 
export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  let prisma: PrismaClient
  switch(req.method) {
    case 'GET':
      prisma = new PrismaClient()
      const allPosts = await prisma.post.findMany({ include: { author: true }})
      res.status(200).json(allPosts)
      await prisma.$disconnect()
      break

    case 'POST':
      if (!req.cookies?.token) {
        return res.status(401).json({
          message: 'Unauthorized'
        })
      }
      const authorId = (await verifyToken(req.cookies.token)).id
      prisma = new PrismaClient()
      const { title, content, imageUrl, tags } = req.body
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          createdAt: new Date(),
          authorId,
          tags: tags.join(','),
          imageUrl
        }
      })
      res.status(200).json(newPost)
      await prisma.$disconnect()
      break

    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}