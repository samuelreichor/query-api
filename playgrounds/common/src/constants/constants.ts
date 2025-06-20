export const baseConfig = {
  baseUrl: 'https://backend-craftcms.ddev.site:8443',
  authToken: 'Bearer tyE9LViYm0HvcVbUErN1wwIa3qyeby1K',
  siteMap: [
    {
      handle: 'en',
      path: '/',
      origin: 'http://localhost:3000',
      id: 1,
    },
    {
      handle: 'de',
      path: '/de',
      origin: 'http://localhost:3000/de',
      id: 2,
    },
    {
      handle: 'es',
      path: '/es',
      origin: 'http://localhost:3000/es',
      id: 3,
    },
  ],
}
