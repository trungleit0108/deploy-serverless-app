import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { CreateSignedURLRequest } from '../requests/CreateSignedURLRequest'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({ signatureVersion: 'v4' })

// TODO: Implement the fileStogare logic
export const getPresignedUploadURL = async (
  createSignedUrlRequest: CreateSignedURLRequest
) => {
  return await s3.getSignedUrl('putObject', createSignedUrlRequest)
}
