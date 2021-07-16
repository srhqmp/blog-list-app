describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/test/reset')
    const user = {
      name: 'Test User',
      username: 'username',
      password: 'password',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('login').click()
    cy.get('#username').parent().should('contain', 'username:')
    cy.get('#password').parent().should('contain', 'password:')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('username')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('Test User logged in')
      cy.get('.success')
        .should('contain', 'Successfully logged in Test User')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('username')
      cy.get('#password').type('wrong password')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    describe('When logged in', function () {
      beforeEach(function () {
        // log in user here
        const user = {
          username: 'username',
          password: 'password',
        }

        cy.login(user)
      })

      it('A blog can be created', function () {
        cy.contains('create new blog').click()
        cy.get('#title').type('Test Blog Title')
        cy.get('#author').type('Test Author')
        cy.get('#url').type('Test URL')

        cy.get('#create-blog').click()

        cy.get('.success').should(
          'contain',
          'a new blog Test Blog Title by Test Author added'
        )

        cy.get('.blogTitle').should('contain', 'Test Blog Title')
        cy.get('.blogAuthor').should('contain', 'Test Author')
      })

      it('A user can like a blog', function () {
        const blog = {
          title: 'Test Like',
          author: 'Test Author',
          url: 'Test Url',
        }
        cy.createABlog(blog)

        cy.get('#toggleVisibilityButton').click()
        cy.get('#likeButton').click().as('likeButton')
        cy.get('.blogLikes').as('likes').should('contain', '1 like')

        cy.get('@likeButton').click()
        cy.get('@likes').should('contain', '2 likes')
      })

      it('Ensure a user who created a blog can delete it', function () {
        const blog = {
          title: 'Test Remove',
          author: 'Test Author',
          url: 'Test Url',
        }
        cy.createABlog(blog)

        cy.get('#toggleVisibilityButton').click()
        cy.get('#removeButton').click()
        cy.get('.success').should(
          'contain',
          'Successfully deleted blog Test Remove'
        )
      })

      it('Ensure a user cannot delete blog of others', function () {
        const blog = {
          title: 'Test Blog User 1',
          author: 'User 1',
          url: 'Test Url',
        }
        cy.createABlog(blog)
        cy.get('#logout-button').click()

        const user2 = {
          username: 'user2',
          name: 'USER 2',
          password: 'password',
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user2)
        cy.login(user2)

        cy.get('.blogTitle').should('contain', 'Test Blog User 1')
        cy.get('.blogAuthor').should('contain', 'User 1')
        cy.get('#toggleVisibilityButton').click()
        cy.get('#removeButton').should('not.exist')
      })

      it('Blogs are ordered according to likes with the blog with most likes being first', function () {
        const blogs = [
          {
            title: 'Test Blog 1',
            author: 'Test Author',
            url: 'Test Url',
          },
          {
            title: 'Test Blog 2',
            author: 'Test Author',
            url: 'Test Url',
          },
          {
            title: 'Test Blog 3',
            author: 'Test Author',
            url: 'Test Url',
          },
        ]
        cy.createABlog(blogs[0])
        cy.get('.success').should(
          'contain',
          'a new blog Test Blog 1 by Test Author added'
        )
        cy.createABlog(blogs[1])
        cy.get('.success').should(
          'contain',
          'a new blog Test Blog 2 by Test Author added'
        )
        cy.createABlog(blogs[2])
        cy.get('.success').should(
          'contain',
          'a new blog Test Blog 3 by Test Author added'
        )

        cy.get('.blogTitle')
          .contains('Test Blog 3')
          .parent()
          .parent()
          .as('blog3')
        cy.get('@blog3').contains('show').click()
        cy.get('@blog3').contains('like').as('likeButton3')
        cy.get('@likeButton3').click().click().click()

        cy.get('.blogTitle')
          .contains('Test Blog 2')
          .parent()
          .parent()
          .as('blog1')
        cy.get('@blog1').contains('show').click()
        cy.get('@blog1').contains('like').as('likeButton1')
        cy.get('@likeButton1').click()

        cy.reload()

        cy.get('.blogTitle').then((blogs) => {
          const order = ['Test Blog 3', 'Test Blog 2', 'Test Blog 1']
          blogs.map((i, blog) => expect(blog.innerText).to.equal(order[i]))
        })
      })
    })
  })
})
