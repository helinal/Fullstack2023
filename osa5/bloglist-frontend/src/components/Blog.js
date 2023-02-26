import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({blog , handleNewLike}) => {
  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    handleNewLike: PropTypes.func.isRequired
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [infoVisible, setInfoVisible] = useState(false)

  const toggleVisibility = () => {
    setInfoVisible(!infoVisible)
  }

  if (infoVisible) {
    return (
      <div style={blogStyle} className='blog'>
        {blog.title} {blog.author}

        <button onClick={toggleVisibility}>hide</button>

        <div>
          {blog.url}
          <br/>
          likes {blog.likes}
          <button onClick ={() => {handleNewLike(blog)}}>like</button>
          <br/>
          {blog.user.name}
          <br/>
        </div>
      </div>
    )} else {
    return(
      <div style={blogStyle} className='blog'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
    )
  }
}

export default Blog