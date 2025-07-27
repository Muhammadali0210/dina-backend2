import swaggerAutogen from 'swagger-autogen';


const doc = {
    info: {
        title: 'My API',
        description: 'API documentation without extensive annotations'
    },
    host: 'localhost:3000',
    schemes: ['http']
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/index.js']; // Bu erda barcha endpointlar joylashgan fayllaringizni qo'shing

swaggerAutogen(outputFile, endpointsFiles, doc);
