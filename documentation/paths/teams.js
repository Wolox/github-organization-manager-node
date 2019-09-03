module.exports = {
  '/teams': {
    get: {
      tags: ['CRUD operations'],
      description: `Get teams
      keep in mind that the behavior is different when you run this endpoint without any query parameter.  
      If no parameters are passed, it will retrieve all of the Teams.  
      You can pass it 2 parameters:  
      per_page: Results per page (max 100)  
      page: Page number of the results to fetch.`,
      operationId: 'getTeams',
      parameters: [
        {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            default: 100
          },
          required: false
        },
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
          description: 'Teams were obtained',
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
