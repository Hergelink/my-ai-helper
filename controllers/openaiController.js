const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const textGenerator = async (req, res) => {
  const userPrompt = req.body.editedPrompt;
  const tempValue = req.body.sliderValue;
  const temp = Number(tempValue);


  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: userPrompt,
      temperature: temp,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      best_of: 1,
    });

    const aiOutput = response.data.choices[0].text;

    res.status(200).json({
      success: true,
      data: aiOutput,
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.status(400).json({
      success: false,
      error: 'Prompt cannot be generated',
    });
  }
};

module.exports = { textGenerator };
