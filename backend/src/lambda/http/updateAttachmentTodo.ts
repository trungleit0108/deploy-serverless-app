import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateAttachmentTodo } from '../../dataLayer/todosAccess'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../../auth/utils'

const logger = createLogger('updateAttachmentTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('updateAttachmentTodo pending')
      const todoId = event.pathParameters.todoId
      const userId: string = getUserId(event)
      const updatedItem = await updateAttachmentTodo(userId, todoId)

      logger.info('updateAttachmentTodo fulfilled')
      return {
        statusCode: 200,
        body: JSON.stringify({
          item: updatedItem
        })
      }
    } catch (error) {
      logger.error('updateAttachmentTodo failed')
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
