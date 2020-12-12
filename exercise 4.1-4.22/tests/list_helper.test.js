const listHelper = require('../utils/list_helper');
const { listWithOneBlog } = require('./data');
const data = require('./data');

test('dummy returns one', () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
})

describe('total likes', () => {

    test("when list has only one blog, equals likes of that blog", () => {
        const result = listHelper.totalLikes(data.listWithOneBlog);
        expect(result).toBe(5);
    })

    test("when list has many blogs, equals the sum of likes of them all", () => {
        const result = listHelper.totalLikes(data.listWithManyBlogs);
        expect(result).toBe(36);
    })
})

describe('most favorite blog', () => {

    test("list with on blog returns that blog", () => {
        const result = listHelper.favoriteBlog(data.listWithOneBlog);

        expect(result).toEqual(...listWithOneBlog);
    })

    test("list with many blogs returns the most favorite", () => {
        const result = listHelper.favoriteBlog(data.listWithManyBlogs);
        expect(result).toEqual(
            {
                _id: "5a422b3a1b54a676234d17f9", 
                title: "Canonical string reduction", 
                author: "Edsger W. Dijkstra", 
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
                likes: 12, 
                __v: 0 
            }
        )
    })
})

describe('most blogs of an author', () => {

    test('author with most blogs is returned in list with many blogs', () => {
        let result = listHelper.mostBlogs(data.listWithManyBlogs);

        expect(result).toEqual({author: 'Robert C. Martin', blogs: 3})
    })

    test('author with most blogs is returned in list with one blog', () => {
        let result = listHelper.mostBlogs(data.listWithOneBlog);

        expect(result).toEqual({author: 'Edsger W. Dijkstra', blogs: 1})
    })

    
    test('Most blogs function handles an empty list', () => {
        let result = listHelper.mostBlogs([]);

        expect(result).toEqual(null);
    })
})

describe('authors with most likes', () => {
    
    test('author with most likes is returned from list of many blogs', () => {
        let result = listHelper.mostLikes(data.listWithManyBlogs);

        expect(result).toEqual({author: 'Edsger W. Dijkstra', likes: 17})
    })

    test('author with most likes is returned from list of one blog', () => {
        let result = listHelper.mostLikes(data.listWithOneBlog);

        expect(result).toEqual({author: 'Edsger W. Dijkstra', likes: 5})
    })

})