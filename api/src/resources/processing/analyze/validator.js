const Joi = require('helpers/joi.adapter');

const schema = {
  text: Joi.string()
    .trim()
    .min(20)
    .max(4000)
    .options({
      language: {
        string: {
          min: '!!Text must be longer than 20 letter',
          max: '!!Text must be less than 4000 letter',
        },
      },
    }),
  image: Joi.any().required(),
};

const validateFunc = async (data) => {
  const errors = [];

  return {
    value: data,
    errors,
  };
};

module.exports = [
  Joi.validate(schema),
  validateFunc,
];
