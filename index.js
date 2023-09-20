const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
morgan.token('person', req => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

let persons = [
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
  }
]

app.get('/api/persons',(req, res) =>{
  res.json(persons)
})

app.get('/api/info',(req, res) =>{
  res.send(`<span>Phonebook has info for ${persons.length} people</span><br><span>${new Date()}</span>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
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
  })
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})