const joi = require("@hapi/joi");
const userModel = require("../models/userModel");

const validateCreateUser = (data) => {
    try {
        const validateSchema = joi.object({
            firstName: joi.string().min(3).max(30).regex(/^[a-zA-Z]+$/).required().messages({
                "string.empty": "First name cannot be empty", 
                "string.pattern.base": "Kindly use alphabet alone",
            }), 
            lastName: joi.string().min(3).max(30).regex(/^[a-zA-Z]+$/).required().messages({
                "string.empty": "Last name cannot be empty", 
                "string.pattern.base": "Kindly use alphabet alone"
            }), 
            email: joi.string().min(3).email().required().messages({
                "string.empty": "Email cannot be empty", 
            }), 
            gender: joi.string().valid("male", "female").required(),
            password: joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required().messages({
                'string.empty': 'password cannot be left empty', 
                'string.min': 'password must be at least 8 characters long', 
                "string.pattern.base": "Password must be at least one Uppercase, Lowercase, Number and Special characters",
                'any.required': 'password is required', 
            }),
        })
        return validateSchema.validate(data);
    } catch (err) {
        console.log(err.message);
    }
}


module.exports = validateCreateUser