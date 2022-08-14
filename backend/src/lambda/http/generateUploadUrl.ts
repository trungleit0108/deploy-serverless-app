import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'
import { getUrl } from '../../helpers/todosAccess'

const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('generateUploadUrl pending')

      const todoId = event.pathParameters.todoId
      const userId = getUserId(event)
      const url = await getUrl(todoId, userId)
      logger.info('deleteTodo fulfilled')

      // Return a presigned URL to upload a file for a TODO item with the provided id
      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: url
        })
      }
    } catch (err) {
      logger.error('deleteTodo failed')
      return {
        statusCode: 404,
        body: `error ${err}`
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)

// export const handler: APIGatewayProxyHandler = async (
//   event: APIGatewayProxyEvent
// ): Promise<APIGatewayProxyResult> => {
//   try {
//     const todoId = event.pathParameters.todoId
//     if (!todoId) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: 'Missing todoId' })
//       }
//     }

//     const url = TodoBusinessLayer.generateUploadUrl(event, logger)
//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         uploadUrl: url
//       }),
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': true
//       }
//     }
//   } catch (err) {
//     logger.error('failed to get signed url', err)
//   }
// }
