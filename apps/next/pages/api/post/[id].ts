import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../lib/db'

import { getToken } from 'next-auth/jwt'

const namespace = process.env.SURREAL_NAMESPACE!
const database = process.env.SURREAL_DATABASE!

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  // read post
  if (req.method === 'GET') {

    const [post] = await db.select(`posts:${id}`)
    res.status(200).json({ data: post })

    // create post
  } else if (req.method === 'POST') {
    const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })

    if (user) {
      // sign into scope user so they can create the post
      await db.signin({
        namespace,
        database,
        scope: 'users',
        sub: user.googleSub,
        email: user.email
      })

      /*      type User = {
              email: string;
              id: string;
              name: string;
              picture: string;
              sub: string;
            };*/

      const info = await db.info()
      /*const info = await db.query<[User[]]>('SELECT * FROM users WHERE email = $email', {
        email: user.email
      })*/

      const post = await db.create('posts', {
        content: req.body,
        users: info!.id // info[0][0]!.id
      })

      res.status(200).json({ data: post })
    }

    // edit post
  } else if (req.method === 'PATCH') {

    const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })

    if (user) {

      // sign into scope user so they can edit the post
      await db.signin({
        namespace,
        database,
        scope: 'users',
        sub: user.googleSub,
        email: user.email
      })

      // update post content
      const [post] = await db.merge(`posts:${id}`, {
        content: req.body
      })

      res.status(200).json({ data: post })
    }

  }


  /*
    await db.let('users', {
    email: `${id}@gmail.com`
  })


  const user = await decode({
    token: req.cookies['next-auth.session-token'],
    secret: process.env.NEXTAUTH_SECRET!
  })

  if (user) {
    try {

      const db = await clientPromise

      await db.signin({
        namespace,
        database,
        scope: 'users',
        sub: user.googleSub,
        email: user.email
      })

      const posts = await db.select('posts')

      await db.invalidate()

      res.status(200).json({ data: posts })
    } catch (err) {
      console.log('err', err)
    }

  }*/
}