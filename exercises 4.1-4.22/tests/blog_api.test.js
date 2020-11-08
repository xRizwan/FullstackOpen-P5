const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const api = supertest(app);
const jwt = require('jsonwebtoken');
const { listWithTwoBlogs } = require('./data');

beforeEach(async (done) => {
    await Blog.deleteMany({});

    const blogs = listWithTwoBlogs.map(blog => new Blog(blog));
    const pendingArray = blogs.map(blog => blog.save());
    
    await Promise.all(pendingArray);
    done();
})

test('api returns correct data in correct format', async (done) => {

    const result = await api.get('/api/blogs');
    expect(result.body).toHaveLength(2);

    done();
})

test('mongodb unique identified is name id not _id', async (done) => {
    const result = await api.get('/api/blogs');
    expect(result.body[0].id).toBeDefined();

    done();
})

test('blogs are added correctly when authorized', async (done) => {
    const newBlog = {
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5, 
    }

    let newUser = {
        name: 'rizwan',
        username: 'coolman',
    }

    newUser = await new User(newUser);
    const user = await newUser.save();
    const token = jwt.sign({username: user.username, id: user._id}, process.env.SECRET);

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const result = await api.get('/api/blogs')

    expect(result.body).toHaveLength(listWithTwoBlogs.length + 1);

    done();
})

test('if likes missing, default to 0 when creating new blog while being authorized', async (done) => {
    const newBlog = {
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    }

    const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    expect(result.body.likes).toEqual(0);

    done();
}, 10000)

test('if title or url missing, api returns status code 400 BAD REQUEST if authorized', async (done) => {
    const blogWithNoURL = {
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        likes: 0,
    }

    const blogWithNoTitle = {
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 0,
    }

    await api
        .post('/api/blogs')
        .send(blogWithNoURL)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(blogWithNoTitle)
        .expect(400);

    done();
}, 10000)

test('can delete a blog by id if its valid and user is authorized', async (done) => {
    await api
    .delete('/api/blogs/5a422a851b54a676234d17f7')
    .expect(204)

    const result = await api.get('/api/blogs');

    expect(result.body.length).toEqual(listWithTwoBlogs.length - 1);

    done();
}, 10000)

test('deleting with invalid id returns error', (done) => {
    api.delete('/api/blogs/342134')
    .expect(404)

    done();
}, 10000)

afterAll(async (done) => {
    mongoose.connection.close();
    done()
})