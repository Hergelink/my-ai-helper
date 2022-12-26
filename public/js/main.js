const spanElement = document.querySelector('#output');
const selectElement = document.querySelector('#selection');
const title = document.querySelector('#title');
const submitButton = document.getElementById('submitBtn');
const eraseButton = document.getElementById('eraseBtn');

function onSubmit(e) {
  e.preventDefault();

  spanElement.innerText = '';
  const selectValue = selectElement.value;

  const prompt = document.querySelector('#prompt').value;
  const editedPrompt =
    selectValue === 'translate'
      ? 'Translate this javascript code to python ' + prompt
      : 'Explain what this code does step by step:  ' + prompt;

  if (prompt === '') {
    alert('Please provide code');
    return;
  }

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
    }, 20);

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

function copyToClipboard() {
  const promptValue = document.getElementById('output').innerText;

  navigator.clipboard.writeText(promptValue);
}

function handleSelectChange() {
  const selectValue = selectElement.value;
  selectValue === 'translate'
    ? (title.textContent = 'Translate JavaScript => Python')
    : (title.textContent = 'Explain Code 🦜');

  selectValue === 'translate'
    ? (submitButton.textContent = 'Translate')
    : (submitButton.textContent = 'Explain');
}

function eraseContent() {

  spanElement.innerText = '';
}

document.querySelector('#image-form').addEventListener('submit', onSubmit);

spanElement.addEventListener('click', copyToClipboard);

selectElement.addEventListener('change', handleSelectChange);

eraseButton.addEventListener('click', eraseContent);