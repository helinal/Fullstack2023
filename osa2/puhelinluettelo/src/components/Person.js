const Person = ({person, maybeDelete}) => {
    return (
      <>
        <li>{person.name} {person.number}</li>
        <button onClick={maybeDelete}>delete</button>
      </>
    )
  }

export default Person