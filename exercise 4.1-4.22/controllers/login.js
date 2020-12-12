const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findOne({ username: body.username })
    const passwordConfirmation = user === null ? false : await bcrypt.compare(body.password, user.passwordHash);

    if ( !(user && passwordConfirmation) ) {
        return response.status(401).json({
            error: "Invalid Username or Password.",
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    return response.status(200).send({ token, user: user.username, name: user.name })
})

module.exports = loginRouter;