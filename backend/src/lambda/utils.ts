import { APIGatewayProxyEvent } from 'aws-lambda'
import { parseUserId, getToken } from '../auth/utils'

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authHeader = event.headers.Authorization
  const jwtToken = getToken(authHeader)

  return parseUserId(jwtToken)
}
