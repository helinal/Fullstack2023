const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('expected amount of JSON blogs are returned', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('all blogs have a correct id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('posting a blog adds it correctly', async () => {
    const newBlog = {
      title: 'uusi title',
      author: 'uusi author',
      url: 'uusi url',
      likes: 5,
    }
      
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
      
    const contents = blogsAtEnd.map(r => r.title)
    expect(contents).toContain(
      'uusi title'
    )
  })

  test('if likes are null then given the value 0', async () => {
    const newBlog = {
      title: 'title',
      author: 'author',
      url: 'url'
    }  
        
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
        
    const response = await api.get('/api/blogs')
    const testBlog = response.body[2]
    expect(testBlog.likes).toBeDefined()
  })
      
  test('if title is null then status code 400', async () => {
    const newBlog = {
      author: 'author',
      url: 'url'
    }  
        
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
        
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
        
  test('is url is null then status code 400', async () => {
    const newBlog = {
      title: 'title',
      author: 'autor'
    }  
        
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
        
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('deletion works', async () => {
    await api.delete('/api/blogs/5a422a851b54a676234d17f7')
      .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length-1)
  })
    
  test('status code 400 if malformatted id', async () => {
    await api.delete('/api/blogs/malformattedId')
      .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('changing a blog', () => {
  const changedBlog = {
    title: 'muokattu title',
    author: 'muokattu author',
    url: 'muokattu url',
    likes: 20
  }  
    
  test('changes a blog correctly', async () => {
    await api.put('/api/blogs/5a422a851b54a676234d17f7')
      .send(changedBlog)
      .expect(200)
    
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
        
    expect(blog.title).toBe('muokattu title')
    expect(blog.likes).toBe(20)
  })
    
  test('status code 400 if malformatted id when trying to change', async () => {
    await api.put('/api/blogs/malformattedId')
      .send(changedBlog)
      .expect(400)
    
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    
    expect(blog.title).toBe('React patterns')
    expect(blog.likes).toBe(1)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'muumiP',
      name: 'Muumipeikko',
      password: 'muumitalo',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})