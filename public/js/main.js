const title = document.querySelector('#title');
const selectElement = document.querySelector('#selection');
const toneOfVoiceLabelElement = document.getElementById('toneOfVoiceLabel');
const toneOfVoice = document.getElementById('toneOfVoice');
const keywordsElement = document.getElementById('keywordsLabel');
const keywords = document.getElementById('keywords');
const sliderContainer = document.querySelector('.sliderContainer');
const slider = document.getElementById('myRange');
const textareaElement = document.getElementById('prompt');
const spanElement = document.querySelector('#output');
const submitButton = document.getElementById('submitBtn');
const eraseButton = document.getElementById('eraseBtn');
const copyBtn = document.getElementById('copyBtn');
const reGenerateBtn = document.getElementById('re-generateBtn');

// create a rangle slider for temperature!

function onSubmit(e) {
  e.preventDefault();

  spanElement.innerText = '';
  const selectValue = selectElement.value;
  const toneOfVoiceValue = toneOfVoice.value;
  const keywordValues = keywords.value;
  const sliderValue = slider.value;

  let voiceInput;

  toneOfVoiceValue === 'formal'
    ? (voiceInput = ' formal and')
    : toneOfVoiceValue === 'persuasive'
    ? (voiceInput = ' persuasive and')
    : toneOfVoiceValue === 'motivational'
    ? (voiceInput = ' motivational and')
    : toneOfVoiceValue === 'humorous'
    ? (voiceInput = ' humorous and')
    : toneOfVoiceValue === 'conversational'
    ? (voiceInput = ' conversational and')
    : (voiceInput = '');

  let keywordInput;

  keywordValues.length > 0
    ? (keywordInput = 'Keywords: ' + keywordValues + '. \n\n')
    : (keywordInput = '');

  const prompt = document.querySelector('#prompt').value;
  const editedPrompt =
    selectValue === 'blogIntro'
      ? `${keywordInput}Write a${voiceInput} SEO friendly blog intro about: ${prompt}`
      : selectValue === 'blogBody'
      ? `${keywordInput}Continue this blog intro with a${voiceInput} SEO friendly long form blog body: ${prompt}`
      : selectValue === 'blogOutro'
      ? `${keywordInput}Continue this blog body with a${voiceInput} SEO friendly blog outro: ${prompt}`
      : `Summarize this: ${prompt}`;

  if (prompt === '') {
    alert('Please provide code');
    return;
  }

  generateText(editedPrompt, sliderValue);
}

async function generateText(editedPrompt, sliderValue) {
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
      }),
    });

    if (!response.ok) {
      removeSpinner();
      throw new Error('prompt could not be generated');
    }

    const data = await response.json();

    const aiOutput = data.data;

    //  below lines are for writing like function for the ai output
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
  selectValue === 'blogIntro'
    ? ((title.textContent = 'Generate a Blog Intro'),
      (textareaElement.placeholder = 'Enter your blog topic/description'))
    : selectValue === 'blogBody'
    ? ((title.textContent = 'Generate a Blog Body'),
      (textareaElement.placeholder = 'Enter your blog intro'))
    : selectValue === 'blogOutro'
    ? ((title.textContent = 'Generate a Blog Outro'),
      (textareaElement.placeholder = 'Enter your blog body'))
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
