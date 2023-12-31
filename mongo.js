const mongoose = require('mongoose')
if (process.argv.length > 2){
  const password = process.argv[2]
  const url = `mongodb+srv://fullstack:${password}@cluster0.et2gkzt.mongodb.net/?retryWrites=true&w=majority`
  mongoose.set('strictQuery',false)
  mongoose.connect(url)
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length >= 5){
    const personName = process.argv[3]
    const personNumber = process.argv[4]
    const person = new Person({
      name:personName,
      number:personNumber
    })
    person.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
  } else{
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
  }
} else{
  console.log('Execute at least with a db user password !');
}
