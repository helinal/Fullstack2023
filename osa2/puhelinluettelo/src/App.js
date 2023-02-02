import { useState, useEffect } from 'react'
import axios from 'axios'
import Person from './components/Person'

const App = (props) => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'notes')

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length+1
    }

    //talteen pelkät henkilöiden nimet:
    const personNames = persons.map(person => person.name)

    if (personNames.includes(newName)) {
      alert(`${newName} is already added to the phonebook :(`)
    } else {
      setPersons(persons.concat(personObject))
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