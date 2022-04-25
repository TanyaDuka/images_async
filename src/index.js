import './common.css';
//import ApiService from './helper/api.js';
import markup from './helper/markup.js';
import LoadMoreBtn from './helper/loadMoreBtn.js';


import {getPictures, incrementPage, resetPage, getSearchQuery, searchQuery, getPageNumber, pageNumber} from './helper/api.js'


import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const searchButton = document.querySelector('[type=submit]');
const gallery = document.querySelector('.gallery');

const options = {
  simpleLightBox: {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  },
};

//const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});
let galleryLightBox = new SimpleLightbox('.gallery a', options.simpleLightBox);

function dataProcessing(data) {
  searchButton.disabled = false;
  if (data.data.totalHits === 0) {
    loadMoreBtn.hide();
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  if (data.data.totalHits !== 0 && data.data.hits.length === 0) {
    //searchButton.disabled = true;
    loadMoreBtn.hide();
    return Notify.warning(`We're sorry, but you've reached the end of search results.`);
  }

  gallery.insertAdjacentHTML('beforeend', markup(data.data.hits));

  galleryLightBox.refresh();

  if (options.page === 2) {
    return Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
  } else {
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2 + 120,
      behavior: 'smooth',
    });
  }
}

async function loadPictures() {
  try {
    const response = await getPictures();
    const showBtn =  loadMoreBtn.show();
    const process = await dataProcessing(response);
    
    //searchButton.classList.remove('is-hidden');
    return process;
  } catch (error) {
    //const showBtn = await loadMoreBtn.hide();
    console.log(error);
    Notify.failure('Something went wrong, please try again...');
  }
}

function onFormSubmit(event) {
  event.preventDefault();

  const isFilled = event.currentTarget.elements.searchQuery.value.trim();
  if (isFilled) {
    //searchButton.classList.add('is-hidden');
    searchQuery(isFilled);
    resetPage();
    gallery.innerHTML = '';
    loadPictures();
  } else {
    //searchButton.classList.remove('is-hidden');
    //const showBtn =  loadMoreBtn.hide();
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

form.addEventListener('submit', onFormSubmit);

function onLoadMore() {
  loadPictures();
}

loadMoreBtn.refs.button.addEventListener('click', onLoadMore);