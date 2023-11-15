import type { NextApiRequest, NextApiResponse } from 'next'

import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client()

import { db } from '../../../../lib/db'

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

    const { content, token } = req.body

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const user = ticket.getPayload()

    if (user) {
      // sign into scope user so they can create the post
      await db.signin({
        namespace,
        database,
        scope: 'users',
        sub: user.sub,
        email: user.email
      })

      const info = await db.info()

      const post = await db.create('posts', {
        content,
        users: info!.id
      })

      res.status(200).json({ data: post })
    }

    // edit post
  } else if (req.method === 'PATCH') {

    const { content, token } = req.body

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const user = ticket.getPayload()

    if (user) {

      // sign into scope user so they can edit the post
      await db.signin({
        namespace,
        database,
        scope: 'users',
        sub: user.sub,
        email: user.email
      })

      // update post content
      const [post] = await db.merge(`posts:${id}`, {
        content
      })

      res.status(200).json({ data: post })
    }

  }
}