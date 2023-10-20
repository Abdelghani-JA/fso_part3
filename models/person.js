const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number:{
    type: String,
    minLength: 8,
    validate:{
      validator:function(str){
        const hyphen = str.indexOf('-')
        if(hyphen>1 && hyphen<4){
          let strP1 = str.slice(0,hyphen)
          let strP2 = str.slice(hyphen+1)
          return isFinite(strP1) && isFinite(strP2) ? true : false
        } else {
          return false
        }
      }
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema )