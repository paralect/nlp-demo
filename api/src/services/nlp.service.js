const fs = require('fs');
const sharp = require('sharp');
const vision = require('@google-cloud/vision');
const { NaturalLanguageUnderstandingV1 } = require('ibm-watson/sdk');
const { IamAuthenticator } = require('ibm-watson/auth');
const { rgbToHex } = require('helpers/base.helper');

class NaturalLanguageProcessingService {
  constructor() {
    const { apikey, url } = process.env.IBM_CONFIG;

    this.ibmNLU = new NaturalLanguageUnderstandingV1({
      version: '2020-05-11',
      authenticator: new IamAuthenticator({
        apikey,
      }),
      url,
    });

    this.keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    this.visionClient = new vision.ImageAnnotatorClient({
      keyFile: this.keyFile,
    });
    this.vehicleNames = ['Car', 'Vehicle', 'Toy vehicle'];
    this.recognizeColorScore = 0.01;
  }

  async analyzeText(text) {
    const response = await this.ibmNLU.analyze({
      text,
      features: {
        sentiment: {},
        categories: {},
        concepts: {},
        entities: {},
        keywords: {},
        emotion: {},
        semantic_roles: {},
      },
    });

    return response.result;
  }

  async localizeVehicle(image) {
    const imageBuffer = fs.readFileSync(image.path);
    const sharpImage = sharp(imageBuffer);

    const imageData = await sharpImage.metadata();

    const [localizationResult] = await this.visionClient.objectLocalization({
      image: { content: imageBuffer },
    });
    const objects = localizationResult.localizedObjectAnnotations;
    const vehicleObject = objects.find((o) => this.vehicleNames.includes(o.name));

    if (!vehicleObject) {
      throw new Error(`Vehicle not recognized. Objects in the image: ${objects.map((o) => o.name).join(', ')}`);
    }

    const topLeftCoord = vehicleObject.boundingPoly.normalizedVertices[0];
    const bottomRightCoord = vehicleObject.boundingPoly.normalizedVertices[2];
    const vehicleImage = await sharpImage.extract({
      top: Math.ceil(topLeftCoord.y * imageData.height),
      left: Math.ceil(topLeftCoord.x * imageData.width),
      width: Math.floor((bottomRightCoord.x - topLeftCoord.x) * imageData.width),
      height: Math.floor((bottomRightCoord.y - topLeftCoord.y) * imageData.height),
    }).toBuffer();

    return vehicleImage;
  }

  async recognizeVehicleColor(image) {
    const vehicleImage = await this.localizeVehicle(image);

    const [result] = await this.visionClient.imageProperties({
      image: { content: vehicleImage },
    });
    const vehicleImageColors = result.imagePropertiesAnnotation.dominantColors.colors;
    const vehicleColors = vehicleImageColors
      .filter((c, i) => c.score > this.recognizeColorScore && i < 2)
      .map((color) => ({
        originalValue: color,
        text: rgbToHex(color.color),
        type: 'Color',
        confidence: color.score,
      }));

    return vehicleColors;
  }
}

module.exports = new NaturalLanguageProcessingService();
