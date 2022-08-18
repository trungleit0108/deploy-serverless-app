import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { createTodo } from '../../helpers/todos'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('createTodo pending')

      const userId = getUserId(event)
      const createTodoRequest: CreateTodoRequest = JSON.parse(event.body)
      const createdTodo: TodoItem = await createTodo(createTodoRequest, userId)

      logger.info('createTodo fulfilled')
      return {
        statusCode: 201,
        body: JSON.stringify({
          item: createdTodo
        })
      }
    } catch (err) {
      logger.error('createTodo failed', err)
      return {
        statusCode: 500,
        body: JSON.stringify({
          err
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
