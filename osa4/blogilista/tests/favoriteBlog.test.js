const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Testiblogi',
      author: 'author',
      url: 'blog url',
      likes: 10,
      __v: 0
    }
  ]

  const manyBlogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 1,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 2,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Suosikkititle',
      author: 'Suosikkiauthor',
      url: 'Suosikkiurl',
      likes: 3,
      __v: 0
    } 
  ]

  test('empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })
  
  test('when list has only one blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    
    expect(result).toEqual({
      title: 'Testiblogi',
      author: 'author',
      likes: 10,
    })
  })

  test('list with many blogs', () => {
    const result = listHelper.favoriteBlog(manyBlogs)
    
    expect(result).toEqual({
      title: 'Suosikkititle',
      author: 'Suosikkiauthor',
      likes: 3,
    })
  })
})