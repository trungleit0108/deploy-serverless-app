import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { getTodos } from '../../businessLogic/todos'

const logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('getTodos pending')

      const userId: string = getUserId(event)
      const items: TodoItem[] = await getTodos(userId)
      logger.info('getTodos fulfilled')

      return {
        statusCode: 200,
        body: JSON.stringify({
          items
        })
      }
    } catch (error) {
      logger.error('getTodos failed')
      logger.error(error)
    }
  }
)

handler.use(
  cors({
    origin: '*',
    credentials: true
  })
)
