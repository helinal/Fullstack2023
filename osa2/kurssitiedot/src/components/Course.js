const Course = ({course}) => {
    return (
      <>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
      </> 
    )
  }
  
  const Header = ({course}) => {
    return (
      <>
        <h2>{course.name}</h2>
      </>
    )
  }

  const Part = ({part}) => {
    return (
      <>
        <p>{part.name} {part.exercises}</p>
      </>
    )
  }
  
  const Content = ({course}) => {
    const content = course.parts.map(part => <Part key={part.id} part = {part}/>)
    
    return (
      <>
        {content}
      </>
    )
  }
  
  const Total = ({course}) => {
    const exercises = course.parts.map(parts => parts.exercises)
    const sum = exercises.reduce((a,b) => a+b)
    
    return (
        <p>
          <b>
            total of {sum} exercises
          </b>
        </p>
    )
  }

export default Course