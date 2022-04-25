const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateEduInput (data) {
    let errors = {}

    data.school = !isEmpty(data.school)? data.school:''
    data.degree = !isEmpty(data.degree)? data.degree:''
    data.from = !isEmpty(data.from)? data.from:''
    data.fieldofstudy = !isEmpty(data.fieldofstudy)? data.fieldofstudy:''

    if(Validator.isEmpty(data.school)){
        errors.school = 'Job field must required'
    }
    if(Validator.isEmpty(data.degree)){
        errors.degree = 'Degree field must required'
    }
    if(Validator.isEmpty(data.from)){
        errors.from = 'From date field must required'
    }
    if(Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy = 'Study field must required'
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}