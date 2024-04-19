const axios = require("axios");
require("dotenv").config();

const generateEmojis = async (text) => {
  const apiKey = process.env.EDENAI_API_KEY;

  const sentences = text.split(/[.!?？。！]+/);
  // Remove the last element if it's an empty string
  if (sentences[sentences.length - 1] === "") {
    sentences.pop();
  }

  const sentenceLen = sentences.length;

  let inputText = "";

  // Iterate through each sentence in the text
  sentences.forEach((sentence, index) => {
    inputText += `${index + 1}. `;
    inputText += `"${sentence}"`;
    inputText += "\n";
  });

  const formattedText = `Generate ${
    sentenceLen === 1 ? "a list" : `${sentenceLen} lists`
  } of emojis that correspond to the following sentences:\n\n${inputText}\nThe emojis should match the subject and verb of each sentence. For example, if the sentence is 'I love dogs', I expect the corresponding answer to be 👨‍🦰❤️🐶. Please only include emojis and don't include alphabet-based sentences.`;

  // Translate using deepl-node
  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/text/generation",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    data: {
      providers: "openai",
      text: formattedText,
      temperature: 0.2,
      max_tokens: 200,
      fallback_providers: "",
    },
  };

  try {
    const response = await axios.request(options);
    const { openai } = response.data;
    return openai;
  } catch (error) {
    console.error("Error generating emojis:", error.message);
    return "Translation error. Please try again.";
  }

  // axios.request(options).then(function (response) {
  //   const { openai } = response.data;
  //   // const items = replicate.generatedText;

  //   // Write items to a JSON file
  //   const dirPath = path.join(
  //     __dirname,
  //     ".",
  //     "frontend",
  //     "src",
  //     "generatedImages"
  //   );

  //   // if there is no existing directory, create one
  //   if (!fs.existsSync(dirPath)) {
  //     fs.mkdirSync(dirPath);
  //   }

  //   fs.writeFileSync(
  //     path.join(dirPath, "text.json"),
  //     JSON.stringify(openai, null, 2)
  //   );
  // });
};

module.exports = generateEmojis;

// for image generation
// const options = {
//   method: "POST",
//   url: "https://api.edenai.run/v2/image/generation",
//   headers: {
//     accept: "application/json",
//     "content-type": "application/json",
//     authorization: `Bearer ${apiKey}`,
//   },
//   data: {
//     fallback_providers: "",
//     response_as_dict: true,
//     attributes_as_list: false,
//     show_original_response: false,
//     num_images: 2,
//     providers: "replicate",
//     text: "A huge red ballon flying outside the city.",
//     resolution: "512x512",
//   },
// };
