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
  
module.exports = {
  dummy, totalLikes
}