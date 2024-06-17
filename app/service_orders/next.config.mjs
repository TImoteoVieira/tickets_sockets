export default {
    async redirects() {
      return [
        {
          source: '/',
          has: [
            {
              type: 'cookie',
              key: 'token',
              value: '^(?!).*$' // Verifica se o token está presente
            }
          ],
          destination: '/login',
          permanent: false
        }
      ];
    }
  };
  