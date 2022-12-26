const textareaElement = document.getElementById('prompt');
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
      : 'Summarize this:  ' + prompt;

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

function handleSelectChange() {
  const selectValue = selectElement.value;
  selectValue === 'translate'
    ? (title.textContent = 'Translate JavaScript => Python')
    : (title.textContent = 'Summarize');

  selectValue === 'translate'
    ? (submitButton.textContent = 'Translate')
    : (submitButton.textContent = 'Summarize');
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

textareaElement.addEventListener('keypress', enterPress);

document.querySelector('#image-form').addEventListener('submit', onSubmit);

selectElement.addEventListener('change', handleSelectChange);

eraseButton.addEventListener('click', eraseContent);
