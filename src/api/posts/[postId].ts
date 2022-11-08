import type { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'
import { Redis } from '@upstash/redis'
import https from "https"
const agent = new https.Agent({ keepAlive: true });
 
export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  let prisma: PrismaClient
  switch(req.method) {
    case 'GET':
      const { postId } = req.params
      // const redis = Redis.fromEnv({ agent })
      // let post = await redis.get('post-' + postId)
      // if (post) {
      //   res.status(200).json(post)
      //   return
      // }
      // if (!post) {
        prisma = new PrismaClient()
        let post = await prisma.post.findUnique({
          where: { id: +postId },
          include: { author: true }
        })
        if (post) {
          res.status(200).json(post)
        } else {
          res.status(404).json({ error: 'Post not found.' })
        }
        // await redis.set('post-' + postId, JSON.stringify(post))
        await prisma.$disconnect()
      // }
      break

    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}