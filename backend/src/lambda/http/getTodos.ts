import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { getTodos } from '../../helpers/todosAccess'

const logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('createTodo pending')

      const userId = getUserId(event)
      const items: TodoItem[] = await getTodos(userId)
      logger.info('createTodo fulfilled')

      return {
        statusCode: 200,
        body: JSON.stringify({
          items
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
//   // TODO: Get all TODO items for a current user
//   try {
//     console.log('Processing event: ', event)
//     const items = await getAllGroups(event) // notice the await her
//     return {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': true
//       },
//       body: JSON.stringify({
//         items
//       })
//     }
//   } catch (err) {
//     logger.error(`fail to get todo item`)
//   }
// }
