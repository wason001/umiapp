import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signToken } from '../../utils/jwt';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  // res.status(400).json({ error: "This API is not implemented yet." })
  if (req.method === 'POST') {
      try {
        // 建立一个Prisma客户端,他可以帮忙我们连线到数据库
        const prisma = new PrismaClient();

        const { email, password, name, avatarUrl } = req.body;
        console.log('body', req.body)

        // 在数据库的User库中建立一个新的数据
        const user = await prisma.user.create({
          data: {
            email,
            // 密码是经过 bcrypt加密的
            passwordHash: bcrypt.hashSync(password, 8),
            name,
            avatarUrl
          }
        });

        console.log('user', user)

        // 把建立成功的用户数据(不包括密码)和JWT回传给前端
        res
          .status(201)
          .setCookie('token', await signToken(user.id))
          .json({ ...user, passwordHash: undefined });

        // 处理完请求以后记得断开数据库链接
        await prisma.$disconnect();
      } catch (e: any) {
        res.status(500).json({
          result: false,
          message:
            typeof e.code === 'string'
              ? 'https://www.prisma.io/docs/reference/api-reference/error-reference#' +
                e.code.toLowerCase()
              : e,
        });
      }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
