import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

import { createLogger } from '../utils/logger'
import { CreateSignedURLRequest } from '../requests/CreateSignedURLRequest'

const logger = createLogger('todosDataAccess')
const s3 = new XAWS.S3({ signatureVersion: 'v4' })

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
