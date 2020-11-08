const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    let result = blogs.reduce((acc, blog) => {
        return acc + blog.likes;
    }, 0)

    return result;
}

const favoriteBlog = (blogs) => {
    const result = blogs.reduce((f, s) => {return f.likes > s.likes ? f : s})
    return result;
}

const mostBlogs = (blogs) => {
    const obj = new Object();

    if(blogs.length < 1) {
        return null;
    }

    blogs.forEach(blog => {
        if (Object.keys(obj).includes(blog.author)) {
            obj[blog.author] = obj[blog.author] + 1;
        } else {
            obj[blog.author] = 1;
        }
    })

    let result = Object.entries(obj).reduce((a, b) => a[1] > b[1] ? a : b);

    return !!result ? {author: result[0], blogs: result[1]} : null;
}

const mostLikes = (blogs) => {
    const obj = new Object();

    if(blogs.length < 1) {
        return null;
    }

    blogs.forEach(blog => {
        if (Object.keys(obj).includes(blog.author)) {
            obj[blog.author] = obj[blog.author] + blog.likes;
        } else {
            obj[blog.author] = blog.likes;
        }
    })

    let result = Object.entries(obj).reduce((a, b) => a[1] > b[1] ? a : b);

    return !!result ? {author: result[0], likes: result[1]} : null;
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}