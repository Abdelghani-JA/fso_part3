require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('person', req => req.method === 'POST' ? JSON.stringify(req.body) :'')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

/* let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  },
  {
    "name": "Abdelghani Ja",
    "number": "36-23-6423121",
    "id": 5
  }
] */

app.get('/api/persons',(req, res) =>{
  Person.find({}).then(persons =>{
    res.json(persons)
  })
})

app.get('/api/info',(req, res) => {
  Person.find({})
  .then(persons => {
    res.send(`<span>Phonebook has info for ${persons.length} people</span><br><span>${new Date()}</span>`)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
  .then(person => {
    res.json(person)
  })
  .catch(err => {
    res.status(404).end()
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  if (persons.find(p => p.id === id)) {
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (body.name && body.number){
    const newPerson = {
      name: body.name,
      number: body.number,
    }
    const person = new Person(newPerson)
    person.save().then(result => res.json(result))
    } else {
      //res.status(400).json({error: 'name must be unique'})
      res.status(400).json({error: 'content missing'})
    }
})

/*   const body = req.body
  if (body.name && body.number){
    const person = persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())
    if (!person){
      const newPerson = {
        id:Math.random() * 1e10,
        name: body.name,
        number: body.number,
      }
      persons = persons.concat(newPerson)
      return res.json(newPerson)
    } else {
      return res.status(400).json({error: 'name must be unique'})
    }
  }
  return res.status(400).json({
    error: 'content missing' 
  }) */


app.put('/api/persons/:id',(req, res) =>{
  for (value of Object.values(req.body)){
    if (!value) {
      return res.status(400).json({error: 'content missing'})
    }
  }
  const updatedPerson = {id :req.params.id, ...req.body}
  persons = persons.map(person => person.id === updatedPerson.id ? updatedPerson : person)
  res.json(updatedPerson)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})