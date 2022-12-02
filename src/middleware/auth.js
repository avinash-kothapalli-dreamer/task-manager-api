const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        //  const token = jwt.sign({ _id: 'abc123' },process.env.jwt_secret)
        //  console.log(token)
        const token = req.header('Authorization').replace('Bearer ', '')
        //console.log(token)
        const decoded = jwt.verify(token, process.env.jwt_secret)
       // console.log(decoded)
        //console.log('hello')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
       next()
    } catch (e) {
       // console.log('error')
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth