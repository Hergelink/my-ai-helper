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
    selectValue === 'blogIntro'
      ? 'Write a SEO friendly blog intro about: ' + prompt + 'Keywords: AI, agriculture, biotech'
      : selectValue === 'blogBody'
      // ? 'Write a SEO friendly blog body about: ' + prompt
      ? 'Write a SEO friendly blog body from this blog intro: ' + prompt
      : selectValue === 'blogOutro'
      // ? 'Write a SEO friendly blog outro about: ' + prompt
      ? 'Write a SEO friendly blog outro from this blog body: ' + prompt
      : 'Summarize this: ' + prompt;

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
  selectValue === 'blogIntro'
    ? (title.textContent = 'Generate a Blog Intro')
    : selectValue === 'blogBody'
    ? (title.textContent = 'Generate a Blog Body')
    : selectValue === 'blogOutro'
    ? (title.textContent = 'Generate a Blog Outro')
    : (title.textContent = 'Summarize Text');

  // selectValue === 'blogIntro'
  //   ? (submitButton.textContent = 'Generate')
  //   : (submitButton.textContent = 'Summarize');

  selectValue !== 'summarize'
    ? (submitButton.textContent = 'Generate')
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
