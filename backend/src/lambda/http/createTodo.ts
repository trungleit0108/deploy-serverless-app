import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { createTodo } from '../../helpers/todosAccess'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('createTodo pending')

      const userId = getUserId(event)
      const todo: TodoItem = { ...JSON.parse(event.body), userId }
      const createdTodo: TodoItem = await createTodo(todo)

      logger.info('createTodo fulfilled')
      return {
        statusCode: 201,
        body: JSON.stringify({
          item: createdTodo
        })
      }
    } catch (err) {
      logger.error('createTodo failed')
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

// export const handler: APIGatewayProxyHandler = async (
//   event: APIGatewayProxyEvent
// ): Promise<APIGatewayProxyResult> => {
//   try {
//     const todoObj = TodoBusinessLayer.createTodo(event, logger)
//     return {
//       statusCode: 200,
//       body: JSON.stringify(todoObj),
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': true
//       }
//     }
//   } catch (err) {
//     logger.error(`fail to create item`, err)
//   }
// }
