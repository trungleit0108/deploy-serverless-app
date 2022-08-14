import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../../auth/utils'
import { TodoItem } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'
import { TodoUpdate } from '../../models/TodoUpdate'
import { updateTodo } from '../../helpers/todosAccess'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('updateTodo pending')
      const todoId = event.pathParameters.todoId
      const todoToUpdate: TodoUpdate = JSON.parse(event.body)
      const userId = getUserId(event)

      const updatedTodo: TodoItem = await updateTodo(
        todoToUpdate,
        todoId,
        userId
      )
      logger.info('updateTodo fulfilled')

      return {
        statusCode: 200,
        body: JSON.stringify({
          updatedTodo
        })
      }
    } catch (err) {
      logger.error('updateTodo failed')
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
//     const item = TodoBusinessLayer.updateTodo(event, logger)
//     return {
//       statusCode: 200,
//       body: JSON.stringify(item),
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': true
//       }
//     }
//   } catch (err) {
//     console.error(err)
//   }
// }
