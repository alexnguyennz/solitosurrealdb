import { Surreal, ExperimentalSurrealHTTP } from 'surrealdb.js'

const connectionString = process.env.SURREAL_ENDPOINT!
const namespace = process.env.SURREAL_NAMESPACE!
const database = process.env.SURREAL_DATABASE!
const username = process.env.SURREAL_USERNAME!
const password = process.env.SURREAL_PASSWORD!

const clientPromise = new Promise<Surreal>(async (resolve, reject) => {
  const db = new Surreal()
  try {
    
    await db.connect(`${connectionString}/rpc`, {
      namespace, database, auth: { username, password }
    })

    resolve(db)
  } catch (e) {
    reject(e)
  }
})

export default clientPromise