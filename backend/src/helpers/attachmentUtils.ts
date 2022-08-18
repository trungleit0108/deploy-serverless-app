import * as AWS from 'aws-sdk'

import { createLogger } from '../utils/logger'
import { CreateSignedURLRequest } from '../requests/CreateSignedURLRequest'

const logger = createLogger('todosDataAccess')
const s3 = new AWS.S3({ signatureVersion: 'v4' })

// TODO: Implement the fileStogare logic
export const getPresignedUploadURL = async (
  createSignedUrlRequest: CreateSignedURLRequest
) => {
  try {
    logger.info('getPresignedUploadURL starting')
    return await s3.getSignedUrl('putObject', createSignedUrlRequest)
  } catch (error) {
    logger.error(error)
  }
}
