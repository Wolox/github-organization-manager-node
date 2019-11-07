module.exports = {
  '/repositories': {
    get: {
      tags: ['CRUD operations'],
      description: `Get Repositories:  
        If you run this endpoint without any query parameter it will show the first page with the 100 first repositories of any type.  
        If you run this endpoint with the following query parameters it will show the repositories with pagination.  
        You can pass it 3 parameters:  
        type: Can be one of: all, owner, public, private, member. Default: all  
        limit: per page (max 100). Default: 100  
        page: Results per page (max 100). Default: 0`,
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
  },
  post: {
    tags: ['CRUD operations'],
    description: `Post Repositories:  
        It creates a repository, if techs is provided, it will create as many reposiories as techs are passed.  
        It needs the following parameters:  
        - repositoryName: the name that the repository will recieve.  
        - techs: The array of techs.
        - isPrivate: privacy of the repository (it can be true or false).`,
    operationId: 'createRepositories',
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
        description: 'Repositories were created',
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
};
