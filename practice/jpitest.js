const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
    .alphanum()
    .min(6)
    .max(20)
    .required(),

    age: Joi.number()
    .required()
})

console.log(schema.validate({username: "ssdfjfjf", age: 456}));