import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../helpers/todosAccess'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('deleteTodo pending')

      const todoId = event.pathParameters.todoId
      const userId = getUserId(event)
      await deleteTodo(todoId, userId)
      logger.info('deleteTodo fulfilled')

      return {
        statusCode: 204,
        body: ''
      }
    } catch (e) {
      logger.error('deleteTodo failed')
      return {
        statusCode: 404,
        body: `error ${e}`
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
//     TodoBusinessLayer.deleteTodo(event, logger)

//     return {
//       statusCode: 200,
//       body: null,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': true
//       }
//     }
//   } catch (err) {
//     logger.error(err)
//   }
// }
