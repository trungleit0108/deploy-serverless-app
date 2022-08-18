import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../../auth/utils'
import { TodoItem } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateStatusTodo } from '../../helpers/todos'

const logger = createLogger('updateStatusTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('updateStatusTodo pending')
      const todoId = event.pathParameters.todoId
      const userId = getUserId(event)
      const updateTodoRequest: UpdateTodoRequest = JSON.parse(event.body)

      const updatedTodo: TodoItem = await updateStatusTodo(
        userId,
        todoId,
        updateTodoRequest
      )
      logger.info('updateStatusTodo fulfilled')

      return {
        statusCode: 200,
        body: JSON.stringify({
          updatedTodo
        })
      }
    } catch (error) {
      logger.error('updateStatusTodo failed')
      return {
        statusCode: 404,
        body: `error ${error}`
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
