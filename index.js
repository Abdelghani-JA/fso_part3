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

app.get('/api/persons',(req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/info',(req, res) => {
  Person.find({})
    .then(persons => {
      res.send(`<span>Phonebook has info for ${persons.length} people</span><br><span>${new Date()}</span>`)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findByIdAndDelete(id).then(result => {
    result ? res.status(204).end() : res.status(404).end()
  })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (body.name && body.number){
    const newPerson = {
      name: body.name,
      number: body.number,
    }
    const person = new Person(newPerson)
    person.save()
      .then(result => {
        res.json(result)})
      .catch(error => next(error))
  } else {
    res.status(400).json({ error: 'content missing' })
  }
})

app.put('/api/persons/:id',(req, res, next) => {
  const updatedPerson = req.body
  for (let value of Object.values(req.body)){
    if (!value) {
      return res.status(400).json({ error: 'content missing' })
    }
  }
  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new:true, runValidators: true, context: 'query' })
    .then(result => res.json(result))
    .catch(error => next(error))
})

const errorHandler = (err, req, res , next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})