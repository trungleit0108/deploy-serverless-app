import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodoAttachment } from '../../helpers/todosAccess'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../../auth/utils'

const logger = createLogger('updateTodoAttachment')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Starting update todo attachment')
    logger.info(event)
    const todoId = event.pathParameters.todoId
    logger.info(todoId)
    const userId: string = getUserId(event)
    const updatedItem = await updateTodoAttachment(userId, todoId)

    logger.info('updatedItemmmmmmmmmmmm')
    logger.info(updatedItem)
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: updatedItem
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    origin: '*',
    credentials: true
  })
)
