module.exports = {
  '/users': {
    get: {
      tags: ['CRUD operations'],
      description: 'Get users',
      operationId: 'getUsers',
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1
          },
          required: false
        }
      ],
      responses: {
        200: {
          description: 'Users were obtained',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Users'
              }
            }
          }
        }
      }
    }
  }
};
