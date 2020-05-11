const validate = require('middlewares/validate');
const NLPService = require('services/nlp.service');

const validator = require('./validator');

const handler = async (ctx) => {
  try {
    const { text, image } = ctx.validatedRequest.value;

    const result = await NLPService.analyzeText(text);
    const vehicleColors = await NLPService.recognizeVehicleColor(image);

    ctx.body = {
      ...result,
      entities: [
        ...result.entities,
        ...vehicleColors,
      ],
    };
  } catch (error) {
    ctx.status = 422;
    ctx.body = { errors: [{ _global: error.message }] };
  }
};

module.exports.register = (router) => {
  router.post('/analyze', validate(validator), handler);
};
