const Person = ({person, maybeDelete}) => {
    return (
      <>
        <li className='person'>
          {person.name} {person.number}
          <button onClick={maybeDelete}>delete</button>
        </li>
      </>
    )
  }

export default Person