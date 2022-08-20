// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'p14lhk6v7e'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-opdpg75h.us.auth0.com',            // Auth0 domain
  clientId: 'OmLDFZCWqcM4RZYb9T2HMrFYiIUukxHa',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
