//apufunktiot testattavaksi
const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  
  return blogs === null
    ? 0
    : total
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return 0
  }
  
  const favorite = blogs.reduce((best, blog) => best.likes > blog.likes ? best : blog)
       
  return ({
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  })
}
  
module.exports = {
  dummy, totalLikes, favoriteBlog
}