import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { CreateSignedURLRequest } from '../requests/CreateSignedURLRequest'

import { createLogger } from '../utils/logger'
// const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new AWS.S3({ signatureVersion: 'v4' })
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const logger = createLogger('createAttachmentPresignedUrlllllllllll')
// export function createAttachmentPresignedUrl(todoId: string): string {
//   const createSignedURLRequest: CreateSignedURLRequest = {
//     Bucket: bucketName,
//     Key: todoId,
//     Expires: urlExpiration
//   }
//   return s3.getSignedUrl('putObject', createSignedURLRequest)
// }

export const createAttachmentPresignedUrl = async (
  todoId: string
): Promise<string> => {
  logger.info('bucketNameeeeeeeeeeeeeeeeeeeeeee')
  logger.info(bucketName)

  return await s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpiration)
  })
}

// TODO: Implement the fileStogare logic
export const getPresignedUploadURL = async (
  createSignedUrlRequest: CreateSignedURLRequest
) => {
  return await s3.getSignedUrl('putObject', createSignedUrlRequest)
}
