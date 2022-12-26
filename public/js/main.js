const title = document.querySelector('#title');
const selectElement = document.querySelector('#selection');
const toneOfVoiceLabelElement = document.getElementById('toneOfVoiceLabel');
const toneOfVoice = document.getElementById('toneOfVoice');
const keywordsElement = document.getElementById('keywordsLabel');
const keywords = document.getElementById('keywords');
const textareaElement = document.getElementById('prompt');
const spanElement = document.querySelector('#output');
const submitButton = document.getElementById('submitBtn');
const eraseButton = document.getElementById('eraseBtn');
const copyBtn = document.getElementById('copyBtn');
const reGenerateBtn = document.getElementById('re-generateBtn');

function onSubmit(e) {
  e.preventDefault();

  spanElement.innerText = '';
  const selectValue = selectElement.value;
  const toneOfVoiceValue = toneOfVoice.value;
  const keywordValues = keywords.value;

  let voiceInput;

  toneOfVoiceValue === 'formal'
    ? (voiceInput = 'formal')
    : toneOfVoiceValue === 'persuasive'
    ? (voiceInput = 'persuasive')
    : toneOfVoiceValue === 'motivational'
    ? (voiceInput = 'motivational')
    : toneOfVoiceValue === 'humorous'
    ? (voiceInput = 'humorous')
    : toneOfVoiceValue === 'conversational'
    ? (voiceInput = 'conversational')
    : voiceInput;

  const prompt = document.querySelector('#prompt').value;
  const editedPrompt =
    selectValue === 'blogIntro'
      ? `Keywords: ${keywordValues}.\n\nWrite a ${voiceInput} and SEO friendly blog intro about: ${prompt}`
      : selectValue === 'blogBody'
      ? `Keywords: ${keywordValues}.\n\nContinue this blog intro with a ${voiceInput} and SEO friendly blog body: ${prompt}`
      : selectValue === 'blogOutro'
      ? `Keywords: ${keywordValues}.\n\nContinue this blog body with a ${voiceInput} and SEO friendly blog outro: ${prompt}`
      : `Summarize this: ${prompt}`;

  if (prompt === '') {
    alert('Please provide code');
    return;
  }

  console.log(editedPrompt);
  generateCorrectEnglish(editedPrompt);
}

async function generateCorrectEnglish(editedPrompt) {
  try {
    showSpinner();

    const response = await fetch('/openai/codehelp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        editedPrompt,
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
      (toneOfVoiceLabelElement.style.display = 'block'))
    : ((submitButton.textContent = 'Summarize'),
      (keywordsElement.style.display = 'none'),
      (toneOfVoiceLabelElement.style.display = 'none'));
}

function eraseContent() {
  spanElement.innerText = '';
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
