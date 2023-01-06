const title = document.querySelector('#title');
const selectElement = document.querySelector('#selection');
const toneOfVoiceLabelElement = document.getElementById('toneOfVoiceLabel');
const toneOfVoice = document.getElementById('toneOfVoice');
const keywordsElement = document.getElementById('keywordsLabel');
const keywords = document.getElementById('keywords');
const sliderContainer = document.querySelector('.sliderContainer');
const slider = document.getElementById('myRange');
const tokenSlider = document.getElementById('mytokenRange');
const textareaElement = document.getElementById('prompt');
const spanElement = document.querySelector('#output');
const submitButton = document.getElementById('submitBtn');
const eraseButton = document.getElementById('eraseBtn');
const copyBtn = document.getElementById('copyBtn');
const reGenerateBtn = document.getElementById('re-generateBtn');

// add blog outline after topic

function onSubmit(e) {
  e.preventDefault();

  spanElement.innerText = '';
  const selectValue = selectElement.value;
  const toneOfVoiceValue = toneOfVoice.value;
  const keywordValues = keywords.value;
  const sliderValue = slider.value;
  const tokenSliderValue = tokenSlider.value;

  let voiceInput;

  toneOfVoiceValue === 'formal'
    ? (voiceInput = ' formal tone of voice and')
    : toneOfVoiceValue === 'persuasive'
    ? (voiceInput = ' persuasive tone of voice and')
    : toneOfVoiceValue === 'motivational'
    ? (voiceInput = ' motivational tone of voice and')
    : toneOfVoiceValue === 'humorous'
    ? (voiceInput = ' humorous tone of voice and')
    : toneOfVoiceValue === 'conversational'
    ? (voiceInput = ' conversational tone of voice and')
    : (voiceInput = '');

  let keywordInput;

  keywordValues.length > 0
    ? (keywordInput = 'Keywords to be highlighted: ' + keywordValues + '. \n\n')
    : (keywordInput = '');

  const prompt = document.querySelector('#prompt').value;
  const editedPrompt =
    selectValue === 'blogOutline'
      ? `Write a blog outline for: ${prompt}`
      : selectValue === 'blogTitle'
      ? `Write 5 blog titles about: ${prompt}`
      : selectValue === 'blogIntro'
      ? `${keywordInput}Write a${voiceInput} SEO friendly blog intro about: ${prompt}`
      : selectValue === 'blogBody'
      ? `${keywordInput}Continue this blog intro with a${voiceInput} SEO friendly long form blog body: ${prompt}`
      : selectValue === 'blogOutro'
      ? `${keywordInput}Continue this blog body with a${voiceInput} SEO friendly blog outro: ${prompt}`
      : selectValue === 'paraphraser'
      ? `${keywordInput}Paraphrase this text with a${voiceInput} SEO friendly long form paragraph: ${prompt}`
      : selectValue === 'expand'
      ? `${keywordInput}Expand this text with a${voiceInput} SEO friendly long form paragraph: ${prompt}`
      : `Summarize this: ${prompt}`;

  if (prompt === '') {
    alert('Please provide code');
    return;
  }

  generateText(editedPrompt, sliderValue, tokenSliderValue, selectValue);
}

async function generateText(
  editedPrompt,
  sliderValue,
  tokenSliderValue,
  selectValue
) {
  try {
    showSpinner();

    const response = await fetch('/openai/generatetext', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        editedPrompt,
        sliderValue,
        tokenSliderValue,
        selectValue,
      }),
    });

    if (!response.ok) {
      removeSpinner();
      throw new Error('prompt could not be generated');
    }

    const data = await response.json();

    const aiOutput = data.data;

    //  writing like function for the ai output
    let index = 0;

    let interval = setInterval(() => {
      if (index < aiOutput.length) {
        spanElement.innerHTML += aiOutput.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);

    removeSpinner();

    document
      .getElementById('output')
      .scrollIntoView({ block: 'center', behavior: 'smooth' });
  } catch (error) {
    console.log(error);
  }
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function removeSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

function handleSelectChange() {
  const selectValue = selectElement.value;

  selectValue === 'blogTitle'
    ? ((title.textContent = 'Generate a Blog Titles'),
      (textareaElement.placeholder = 'Describe your blog idea'))
    : selectValue === 'blogOutline'
    ? ((title.textContent = 'Generate Blog Outline'),
      (textareaElement.placeholder = 'Enter your blog title'))
    : selectValue === 'blogIntro'
    ? ((title.textContent = 'Generate a Blog Intro'),
      (textareaElement.placeholder = 'Enter your blog topic/description'))
    : selectValue === 'blogBody'
    ? ((title.textContent = 'Generate a Blog Body'),
      (textareaElement.placeholder = 'Enter your blog intro'))
    : selectValue === 'blogOutro'
    ? ((title.textContent = 'Generate a Blog Outro'),
      (textareaElement.placeholder = 'Enter your blog body'))
    : selectValue === 'paraphraser'
    ? ((title.textContent = 'Paraphrase Text'),
      (textareaElement.placeholder = 'Enter text to be paraphrased'))
    : selectValue === 'expand'
    ? ((title.textContent = 'Expand Text'),
      (textareaElement.placeholder = 'Enter text to be expended'))
    : (title.textContent = 'Summarize Text');

  selectValue !== 'summarize'
    ? ((submitButton.textContent = 'Generate'),
      (keywordsElement.style.display = 'block'),
      (toneOfVoiceLabelElement.style.display = 'block'),
      (sliderContainer.style.display = 'flex'))
    : ((submitButton.textContent = 'Summarize'),
      (keywordsElement.style.display = 'none'),
      (toneOfVoiceLabelElement.style.display = 'none'),
      (sliderContainer.style.display = 'none'));
}

function eraseContent(e) {
  e.preventDefault();

  toneOfVoice.value = 'default';
  keywords.value = '';
  slider.value = 0.5;
  textareaElement.value = '';
  spanElement.value = '';
}

// Submit form when pressed on enter on the keyboard
function enterPress(e) {
  if (e.key === 'Enter') {
    onSubmit(e);
  } else {
    return;
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(spanElement.value);
}

function reGenerate(e) {
  onSubmit(e);
}

textareaElement.addEventListener('keypress', enterPress);

document.querySelector('#image-form').addEventListener('submit', onSubmit);

selectElement.addEventListener('change', handleSelectChange);

eraseButton.addEventListener('click', eraseContent);

copyBtn.addEventListener('click', copyToClipboard);

reGenerateBtn.addEventListener('click', reGenerate);
