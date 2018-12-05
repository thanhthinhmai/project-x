const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

function getUserId(context) {
    const Authorization = context.request.get('Authorization')
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const {id} = jwt.verify(token, process.env.JWT_SECRET)
        return id
    }
    throw new Error('Not authentication')
}

module.exports = {
    getUserId
}