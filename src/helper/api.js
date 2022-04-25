import axios from 'axios';
const KEY = "26886697-f132e609f22bab827cfdbeee1";
const BASE_URL = 'https://pixabay.com/api/';



const options = {
      params: {
        key: `${KEY}`,
        q: '',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
      },
};
    
const  getPictures = async ()=> {
    const response = await axios.get(`${BASE_URL}`, options);
    incrementPage();
    return response;
  }

const incrementPage= ()=> {
    options.params.page += 1;
}

  const resetPage = () => {
  options.page = 1;
  }

const  getSearchQuery=()=> {
    return options.params.q;
  }

const  searchQuery=(newQuery)=> {
    options.params.q = newQuery;
  }

  const getPageNumber= ()=> {
    return options.params.page;
  }

  const pageNumber =(newNumber) =>{
    options.params.page = newNumber;
  }

  
export {getPictures, incrementPage, resetPage, getSearchQuery, searchQuery, getPageNumber, pageNumber}