const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput (data) {
    let errors = {}

    data.password = !isEmpty(data.password)? data.password:''
    data.email = !isEmpty(data.email)? data.email:''



    if(Validator.isEmpty(data.email)){
        errors.email = 'Email field must required'
    }
    if(Validator.isEmpty(data.password)){
        errors.password = 'Password field must required'
    }
    if(!Validator.isEmail(data.email)){
        errors.email = 'Email is incorrect'
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}