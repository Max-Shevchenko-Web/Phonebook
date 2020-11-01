import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ search, setSearch ] = useState('')

  const addNote =(event) => {
    event.preventDefault();

    const isContains = persons.some(item => item.name === newName);;
    console.log(isContains);
    if (isContains) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(newObject));
    setNewName('');
    setNewNumber('');
  }

  const toCompare = (str1, str2) => {
    const regExp = new RegExp(str2, 'gi')
    return regExp.test(str1.toString())
  }

  const numbersToShow = search
  ? persons.filter(person => toCompare(person.name, search))
  : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with:&nbsp;
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <h2>Add a new numbers</h2>
      <form onSubmit={addNote}>
        <div>
          name:&nbsp;
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>
        <div style={{marginTop: '10px'}}>
          number:&nbsp;
          <input
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {numbersToShow.map(person => {
          return <li key={person.name} >{person.name}:{person.number}</li>
        })}
      </ul>
    </div>
  )
}

export default App
