const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: "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"

});

module.exports = openai;
  