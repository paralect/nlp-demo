const Joi = require('helpers/joi.adapter');
const userService = require('resources/user/user.service');


const schema = {
  firstName: Joi.string()
    .trim()
    .required()
    .options({
      language: {
        any: {
          empty: '!!Your first name must be longer than 1 letter',
          required: '!!First name is required',
        },
      },
    })
    .required(),
  lastName: Joi.string()
    .trim()
    .required()
    .options({
      language: {
        any: {
          empty: '!!Your last name must be longer than 1 letter',
          required: '!!Last name is required',
        },
      },
    })
    .required(),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .trim()
    .lowercase()
    .required()
    .options({
      language: {
        string: { email: '!!Please enter a valid email address' },
        any: { empty: '!!Email is required' },
      },
    }),
  password: Joi.string()
    .trim()
    .min(6)
    .max(40)
    .required()
    .options({
      language: {
        string: {
          min: '!!Password is too short',
          max: '!!Password is too long',
        },
        any: { empty: '!!Password is required' },
      },
    }),
};

const validateFunc = async (data) => {
  const errors = [];

  const isUserExist = await userService.exists({ email: data.email });

  if (isUserExist) {
    errors.push({ email: 'User with this email is already registered.' });
    return {
      errors,
    };
  }


  return {
    value: data,
    errors,
  };
};

module.exports = [
  Joi.validate(schema),
  validateFunc,
];
