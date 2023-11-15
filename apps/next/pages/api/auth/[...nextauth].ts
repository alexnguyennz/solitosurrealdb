import NextAuth, { type NextAuthOptions } from 'next-auth'

import GoogleProvider from 'next-auth/providers/google'
import { SurrealDBAdapter } from '@auth/surrealdb-adapter'
import clientPromise from '../../../lib/surrealdb'

import { Surreal } from 'surrealdb.js'

import { db } from '../../../lib/db'

const connectionString = process.env.SURREAL_ENDPOINT!
const namespace = process.env.SURREAL_NAMESPACE!
const database = process.env.SURREAL_DATABASE!
const username = process.env.SURREAL_USERNAME!
const password = process.env.SURREAL_PASSWORD!

// const db = new Surreal()

export const authOptions: NextAuthOptions = {
  adapter: SurrealDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ account, profile }) {

      if (account?.provider === 'google' && profile?.email) {
        return profile?.email.endsWith('@gmail.com')
      }

      return true
    },
    async jwt({ token, account, profile }) {

      if (profile) {

        token.googleSub = profile.sub

        try {
          await db.signin({
            namespace,
            database,
            scope: 'users',
            sub: profile.sub,
            email: token.email
          })
        } catch {
          // otherwise sign up
          await db.signup({
            namespace,
            database,
            scope: 'users',
            sub: profile.sub,
            name: token.name,
            email: token.email,
            picture: token.picture
          })
        }

      }

      return token
    }
  }
  /* events: {
     async signIn() {
       console.log('signin event')

       const test = await clientPromise

       // trying to fix
       await test.invalidate()
     }
   }*/
}

export default NextAuth(authOptions)


/*
await db.connect(`${connectionString}/rpc`, {
  namespace, database, auth: { username, password }
})

try {

  const [user] = await db.select(`users:⟨${token.email}⟩`)
  console.log('user', user)

  if (!user) {
    const tokens = await db.signup({
      namespace: 'test',
      database: 'test',
      scope: 'account',
      id: token.email,
      email: token.email
    })

    console.log('signed up token', tokens)
  } else {
    // signin works with existing email
    const tokenTest = await db.signin({
      namespace: 'test',
      database: 'test',
      scope: 'account',
      email: token.email
    })

    console.log('signin test', tokenTest)
  }

} catch (err) {
  console.log('scope err', err)
}

await db.invalidate()*/
