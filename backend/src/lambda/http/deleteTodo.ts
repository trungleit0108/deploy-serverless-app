import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todos'

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
