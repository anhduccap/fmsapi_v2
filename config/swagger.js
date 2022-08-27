const swaggerDocumentation = {
    openapi: '3.0.0',
    info: {
        title: 'FMS API',
        version: '0.0.1',
        description: ''
    },
    tags: [
        {
            name: 'User',
            description: 'User routes',
        },
    ],
    paths: {
        '/users': {
            get: {
                tags: ['User']
            },
        },
    },
};

module.exports = swaggerDocumentation;
