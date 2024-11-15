/* eslint-disable */

'use strict'
const { getDatasource } = require('./datasource')
const MongoClient = require('mongodb').MongoClient

module.exports = class MongoDbStore {
  async load(fn) {
    const { MONGO_URL } = await getDatasource()

    let client = null
    let data = null
    try {
      client = await MongoClient.connect(MONGO_URL)
      const db = client.db()
      data = await db.collection('db_migrations').find().toArray()
      if (data.length !== 1) {
        console.log(
          'Cannot read migrations from database. If this is the first time you run migrations, then this is normal.',
        )
        return fn(null, {})
      }
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      client.close()
    }
    return fn(null, data[0])
  }

  async save(set, fn) {
    const { MONGO_URL } = await getDatasource()

    let client = null
    let result = null
    try {
      client = await MongoClient.connect(MONGO_URL)
      const db = client.db()
      result = await db.collection('db_migrations').updateOne(
        {},
        {
          $set: {
            lastRun: set.lastRun,
          },
          $push: {
            migrations: { $each: set.migrations },
          },
        },
        { upsert: true },
      )
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      client.close()
    }

    return fn(null, result)
  }
}
