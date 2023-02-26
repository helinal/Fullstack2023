const Remove = ({ blog, removeBlog }) => {
    const blogUser = blog.user.username
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    const user = JSON.parse(loggedUserJSON)
    const currentUser = user.username
  
    if (currentUser === blogUser) {
      return(
        <button onClick={() => {removeBlog(blog)}}> remove </button>
      )
    } else {
      return null
    }
  }
  
  export default Remove