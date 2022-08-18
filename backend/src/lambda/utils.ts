import { APIGatewayProxyEvent } from 'aws-lambda'
import { getUserId } from '../auth/utils'

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserIdFromEvent(event: APIGatewayProxyEvent): string {
  return getUserId(event)
}
