const logger = require('./logger');

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'Unknown Endpoint'})
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7);
    } else {
        request.token = null;
    }
    
    next();
}

module.exports = {
    unknownEndpoint,
    tokenExtractor
}