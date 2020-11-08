const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    
    return response.json(blogs);
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body;
    const token = request.token;
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (JsonWebTokenError) {
        return response.status(401).json({ error: "Invalid Token" });
    }

    if(!token || !decodedToken.id) {
        return response.status(401).json({ error: "Token missing or invalid" });
    }

    const user = await User.findById(decodedToken.id)

    let keys = Object.keys(body);
    if (!keys.includes('title') || !keys.includes('url')) {
        return response.status(400).end();
    }
    
    const blog = new Blog({
        title: body.title,
        url: body.url,
        author: body.author,
        likes: body.likes,
        user: user.id,
    })

    let result;

    try {
        result = await blog.save()
    } catch (ValidationError) {
        return response.status(400).json({ error: ValidationError.message })
    }

    user.blogs = user.blogs.concat(result.id)
    await user.save();

    return response.status(201).json(result);
})

blogsRouter.get('/:id', async (request, response) => {
    const id = request.params.id;

    let result;
    
    try {
        result = await Blog.findById(id).populate('user', {username: 1, name: 1})
    } catch (error) {
        response.status(404).json({error: "Invalid ID"})
    }

    return response.json(result)
})


blogsRouter.delete('/:id', async (request, response) => {

    const token = request.token;
    const decodedToken = jwt.decode(token, process.env.SECRET);

    if (!token || !decodedToken.id){
        return response.status(401).json({ error: "Unauthorized" })
    }

    const user = await User.findById(decodedToken.id)
    const userid = user._id;
    let blog;

    try {
        blog = await Blog.findById(request.params.id);
    } catch (error) {
        return response.status(404).json({ error: "Invalid ID" })
    }

    let blogCreatorId = blog.user._id;
    
    if (!(userid.toString() === blogCreatorId.toString())){
        return response.status(401).json({ error: "Unauthorized" })
    }
    
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end();

})

blogsRouter.put('/:id', async (request, response) => {

    const body = request.body;
    const updated = {
        likes: !!body.likes ? body.likes : 0
    }

    let result;

    try {
        result = await Blog.findByIdAndUpdate(request.params.id, updated, { new: true })
        
    } catch (error) {
        return response.status(404).json({error: "Invalid ID"})
    }
    
    return response.json(result);
})


module.exports = blogsRouter;