const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

userRouter.post('/', async (request, response) => {
    const body = request.body;

    if (!(!!body.password) || body.password.length < 6){
        return response.status(400).json({error: 'Password is too short, must be greater than 6 letters'});
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    let savedUser;

    try {
        savedUser = await user.save();
    } catch (ValidationError) {
        return response.status(400).json({ error: ValidationError.message })
    }

    response.json(savedUser);
})

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users);
})

module.exports = userRouter;