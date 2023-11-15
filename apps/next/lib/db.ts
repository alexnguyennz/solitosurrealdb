import { Surreal } from 'surrealdb.js'

const connectionString = process.env.SURREAL_ENDPOINT!
const namespace = process.env.SURREAL_NAMESPACE!
const database = process.env.SURREAL_DATABASE!
const username = process.env.SURREAL_USERNAME!
const password = process.env.SURREAL_PASSWORD!

const db = new Surreal()

db.connect(`${connectionString}/rpc`, {
  namespace, database, auth: { username, password }
})

export { db }