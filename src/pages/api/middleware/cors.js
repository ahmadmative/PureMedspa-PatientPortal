import Cors from 'cors'

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

// Initialize the cors middleware with specific configuration
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: [
      'https://stgwbclientapi.azurewebsites.net',
      'http://localhost:3000',
    ],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  })
)

export default cors 