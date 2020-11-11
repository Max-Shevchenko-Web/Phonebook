import React, { useState, useEffect } from 'react'
import personsService from'./services/personsService';
import Notification from './components/Notification ';

const App = () => {
  const [ persons, setPersons ] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ search, setSearch ] = useState('');
  const [notification, setNotification] = useState({
    message: null,
    typeOfClass: ''
  })

  useEffect(()=>{
    personsService
      .getAll()
      .then(persons => {
        setPersons(persons);
      })
  },[])

  const dispatchNotification = (newNotification) => {
    setNotification(newNotification)
    setTimeout(() => {
      setNotification({message: null, typeOfClass: ''})
    }, 5000)
  }

  const addPerson =(event) => {
    event.preventDefault();

    const newObject = {
      name: newName,
      number: newNumber
    }

    // если такое имя уже есть всписке
    const isContains = persons.some(item => {
      if (item.name === newName) {
        // предлагаем заменить ранее записаную запись
        const result = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);

        if (result) {
          personsService
              .update(item.id, newObject)
              .then(data => {
                // обновляем список только в нужном нам месте
                setPersons(persons.map(person => person.id !== item.id ? person : data))
                dispatchNotification({
                    message : `${newName} updated`,
                    typeOfClass : 'info'
                })
              })
        }
        return true
      } else {
        return false
      }
    });

    // если такое имени нет создаем новое
    if(!isContains) {
      personsService.create(newObject).then(person=> {
        setPersons(persons.concat(person));
        setNewName('');
        setNewNumber('');
        dispatchNotification({
          message : `Added ${person.name}`,
          typeOfClass : 'info'
        })
      })
      .catch(error => {
        console.log(error.response.data)
        dispatchNotification({
          // message: JSON.stringify(error.response.data),
          message: `${newName} not added`,
          typeOfClass: 'error'
        })
      })
    }
}

  const deleteNote = ({name, id}) => {
    const result = window.confirm(`Delete ${name} ?`);
    if (result) {
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          dispatchNotification({
            message : `${name} was removed`,
            typeOfClass : 'info'
          })
        })
        .catch(error => {
          console.log(error);
          dispatchNotification({
            message: `Information of ${name} has already been removed from server`,
            typeOfClass: 'error'
          })
          setPersons(persons.filter(p => p.id !== id))
        })

    } else {
      return null
    }
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
      <Notification message={notification.message} className={notification.typeOfClass}/>
      <div>
        filter shown with:&nbsp;
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <h2>Add a new numbers</h2>
      <form>
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
          <button onClick={addPerson}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {numbersToShow.map(person => {
          return (
            <div key={person.name}>
              <li  >{person.name}:{person.number}</li>
              <button onClick={() => deleteNote(person)}>delete</button>
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default App
