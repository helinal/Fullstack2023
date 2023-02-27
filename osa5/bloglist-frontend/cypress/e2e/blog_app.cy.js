describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:3000')
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Muumipeikko',
      username: 'muumiP',
      password: 'muumitalo'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    const user2 = {
      name: 'Muumimamma',
      username: 'muumiM',
      password: 'muumitalojee'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Front page can be opened', function() {
    cy.contains('Log in to the application')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.get('#username')
    cy.contains('password')
    cy.get('#password')
  })

  describe('Login', function() {
    it('Succeeds with correct credentials', function() {
      cy.get('#username').type('muumiP')
      cy.get('#password').type('muumitalo')
      cy.get('#login-button').click()
      cy.contains('Muumipeikko logged in')
    })

    it('Fails with wrong credentials', function() {
      cy.get('#username').type('notright')
      cy.get('#password').type('nope')
      cy.get('#login-button').click()
      cy.get('.error').contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('muumiP')
      cy.get('#password').type('muumitalo')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Google')
      cy.get('#author').type('Göögle')
      cy.get('#url').type('https://www.google.com/')
      cy.get('#create-button').click()
      cy.get('.message').contains('a new blog Google by Göögle added successfully')
    })

    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Google')
      cy.get('#author').type('Göögle')
      cy.get('#url').type('https://www.google.com/')
      cy.get('#create-button').click()
      cy.contains('view').click()
      cy.contains('likes 0')
      cy.contains('like').click()
      cy.contains('likes 1')
    })
  })

  describe('Blog removal', function() {
    beforeEach(function() {
      cy.get('#username').type('muumiP')
      cy.get('#password').type('muumitalo')
      cy.get('#login-button').click()
      cy.contains('new blog').click()
      cy.get('#title').type('Google')
      cy.get('#author').type('Göögle')
      cy.get('#url').type('https://www.google.com/')
      cy.get('#create-button').click()
    })

    it('Correct user can remove a blog', function() {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('.message').contains('blog Google was removed successfully')
    })

    it('Incorrect user cannot remove a blog', function() {
      cy.contains('logout').click()
      cy.get('#username').type('muumiM')
      cy.get('#password').type('muumitalojee')
      cy.get('#login-button').click()
      cy.contains('view').click()
      cy.get('.blog').should('not.contain', 'remove')
    })
  })
})