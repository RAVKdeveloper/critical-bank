import mongoose from 'mongoose'
import { getDatasource } from './datasource.js'

export const getClient = async () => {
  const { MONGO_URL } = await getDatasource()
  return await mongoose.connect(MONGO_URL)
}
