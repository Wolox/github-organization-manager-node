module.exports = {
  '/repositories': {
    get: {
      tags: ['CRUD operations'],
      description: `Get Repositories:  
        keep in mind that the behavior is different when you run this endpoint without any query parameter.  
        You can pass it 3 parameters:  
        type: Can be one of all, owner, public, private, member. Default: all  
        limit: per page (max 100)  
        page: Results per page (max 100)`,
      operationId: 'getRepositories',
      parameters: [
        {
          name: 'type',
          in: 'query',
          schema: {
            type: 'string',
            default: 'all'
          },
          required: false
        },
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
            default: 2
          },
          required: false
        }
      ],
      responses: {
        200: {
          description: 'Repositories were obtained',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Repositories'
              }
            }
          }
        }
      }
    }
  }
};
