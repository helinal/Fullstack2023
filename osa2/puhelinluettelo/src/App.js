import { useState, useEffect } from 'react'
import Person from './components/Person'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    //otetaan talteen pelkät henkilöiden nimet:
    const personNames = persons.map(person => person.name)

    //filtteröinti ja sen jälkeen palvelimen kanssa kommunikointi:
    if (personNames.includes(newName)) {
      alert(`${newName} is already added to the phonebook :(`)
    } else {
      const personObject = {
        name: newName, 
        number: newNumber
      }
      setPersons(persons.concat(personObject))

      personService
        .create(personObject)
        .then(returnedPerson => 
          setPersons(persons.concat(returnedPerson)))
          setNewName('')
          setNewNumber('')
    }
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setShowAll(event.target.value)
  }

  const personsToShow = showAll === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(showAll.toLowerCase()))

  return (
    <>
      <h1>The Phonebook</h1>
      <Filter showAll={showAll} handleFilterChange={handleFilterChange}/>

      <h2>Add a new contact:</h2>
      <PersonForm addPerson={addPerson} newName={newName} 
      handlePersonChange={handlePersonChange} newNumber={newNumber} 
      handleNumberChange={handleNumberChange}
      />

      <h2>Numbers:</h2>
      <Persons personsToShow={personsToShow}/>
    </>
  )
}

const Filter = (props) => {
  return (
    <form>
        <div>
          Filter the contacts: <br></br> 
          <input value={props.showAll} onChange={props.handleFilterChange}/> 
        </div>
      </form>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
        <div>
          Name: 
          <input value={props.newName} onChange={props.handlePersonChange} />
        </div>
        <div>
          Number:
          <input value={props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = (props) => {
  return (
    <ul>
        {props.personsToShow.map(person => 
          <Person key={person.id} person={person} />
        )}
      </ul>
  )
}

export default App