import axios from 'axios';
const API_KEY = `39475716-e1b9a363d760376814942c80f`;
const BASE_URL = `https://pixabay.com/api`;
let page = 1;
let perPage = 40;
const refs = {
  form: document.querySelector('.search-form'),
  inputForm: document.querySelector('form input'),
  gallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.load-more'),
};
refs.buttonLoadMore.classList.add('on-none');

refs.form.addEventListener('submit', onFetch);
function onSubmitForm(e) {
  e.preventDefault();

  const formTarget = e.target;
  const searchFormc = formTarget.elements.searchQuery.value;
  return searchFormc;
}
async function onFetch(e) {
  e.preventDefault();
  onResetPage();
  try {
    const formSub = await onSubmitForm(e);

    const getReq = await axios.get(
      `${BASE_URL}/?key=${API_KEY}&q=${formSub}&image_type=photo&orientation=horizontal&page=${page}&per_page=${perPage}&safesearch=true`
    );
    const resDate = getReq.data;

    createCard(resDate);

    refs.buttonLoadMore.classList.remove('on-none');
  } catch (err) {
    console.log(err.name);
  }
}
async function createCard(fetchData) {
  try {
    clearContainer();
    refs.gallery.insertAdjacentHTML('beforeend', generateMarkup(fetchData));
  } catch (error) {
    console.log(error.name);
  }
}

function generateMarkup(data) {
  // Check if the data and hits are defined before accessing them
  if (data && data.hits && data.hits.length > 0) {
    // Iterate through hits to create markup for each image
    return data.hits
      .map(
        hit => `
      <div class="photo-card">
  <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${hit.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${hit.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${hit.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${hit.downloads}</b>
    </p>
  </div>
</div>
    `
      )
      .join('');
  } else {
    return ''; // Return an empty string if data or hits are undefined or empty
  }
}
function clearContainer() {
  refs.gallery.innerHTML = '';
}
refs.buttonLoadMore.addEventListener('click', onLoadMore);

async function onLoadMore() {
  try {
    page += 1; // Увеличиваем номер страницы при каждом нажатии
    const formSub = refs.inputForm.value;

    const getReq = await axios.get(
      `${BASE_URL}/?key=${API_KEY}&q=${formSub}&image_type=photo&orientation=horizontal&page=${page}&per_page=${perPage}`
    );
    const resData = getReq.data;

    appendCards(resData);
    if (resData.totalHits <= page * perPage) {
      refs.buttonLoadMore.classList.add('on-none');
      showEndMessage();
    }
  } catch (err) {
    console.log(err.name);
  }
}
async function appendCards(fetchData) {
  try {
    refs.gallery.insertAdjacentHTML('beforeend', generateMarkup(fetchData));
  } catch (error) {
    console.log(error.name);
  }
}
function onResetPage() {
  page = 1;
}
function showEndMessage() {
  // Создаем элемент для уведомления
  const endMessage = document.createElement('p');
  endMessage.textContent =
    "We're sorry, but you've reached the end of search results.";
  endMessage.classList.add('end-message');

  // Добавляем уведомление в контейнер
  refs.gallery.appendChild(endMessage);
}
