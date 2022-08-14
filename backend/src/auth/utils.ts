import { decode } from 'jsonwebtoken'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { JwtPayload } from './JwtPayload'

export function getUserId(event: APIGatewayProxyEvent): string {
  const authHeader = event.headers.Authorization
  const jwtToken = getToken(authHeader)

  return parseUserId(jwtToken)
}

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export function getToken(authHeader: string): string {
  if (!authHeader) {
    throw new Error('No authentication header')
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header')
  }

  return authHeader.split(' ')[1]
}
