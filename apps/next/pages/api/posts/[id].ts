import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  const [posts] = await db.query('SELECT * FROM posts WHERE users.email = $email', {
    email: `${id}@gmail.com`
  })

  res.status(200).json({ data: posts })
}