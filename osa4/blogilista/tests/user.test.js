const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('when there is initially one user at db', () => {
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

describe('creating a new user', () => {
  test('creation works if done correctly', async () => {
    const newUser = {
      username: 'username',
      name: 'name',
      password: 'password'
    }
  
    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(2)
    const returnedUser = (response.body[1])
    
    expect(returnedUser.username).toBe('username')
    expect(returnedUser.name).toBe('name')
  })
  
    
  test('too short of a username results in 400', async () => {
    const newUser = {
      'username': 'te',
      'name': 'tester',
      'password': 'password'
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.error).toBe('User validation failed: username: Path `username` (`te`) is shorter than the minimum allowed length (3).')    
  })
  
  test('not unique username results in 400', async () => {
    const newUser = {
      'username': 'testUser',
      'name': 'tester',
      'password': 'password'
    }
  
    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.error).toBe('User validation failed: username: Error, expected `username` to be unique. Value: `testUser`')    
  })
  
  test('too short of a password results in 400', async () => {
    const newUser = {
      'username': 'testUser',
      'name': 'tester',
      'password': 'pa'
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.error).toBe('password too short: must be at least 3 characters')    
  })
})
  
afterAll(async () => {
  await mongoose.connection.close()
})