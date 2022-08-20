import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getPresignedUploadURL } from '../../businessLogic/todos'
import { CreateSignedURLRequest } from '../../requests/CreateSignedURLRequest'

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('generateUploadUrl pending')
      const createSignedURLRequest: CreateSignedURLRequest = {
        Bucket: bucketName,
        Key: event.pathParameters.todoId,
        Expires: parseInt(urlExpiration)
      }
      const uploadUrl = await getPresignedUploadURL(createSignedURLRequest)
      logger.info('generateUploadUrl fulfilled')
      return {
        statusCode: 202,
        body: JSON.stringify({
          uploadUrl
        })
      }
    } catch (error) {
      logger.error('generateUploadUrl failed')
      return {
        statusCode: 404,
        body: `error ${error}`
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    origin: '*',
    credentials: true
  })
)
