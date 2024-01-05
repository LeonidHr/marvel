import { useHttp } from "../hooks/http.hook";

const useMarvelServices = () => {
  const {loading, request, error, clearError} = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=8dd8d5ec31b5fa8d8275b67e0d90aa4b';
  const _baseOffset = 210;
  const _baseLimit = 9;

  const getCharacterByName = async (name) => {
    const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  }

  const getAllCharacters = async (offset = _baseOffset, limit = _baseLimit) => {
    const res = await request(`${_apiBase}characters?limit=${limit}&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  }

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  }

  const getAllComics = async (offset = 0) => {
    const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformComics);
  }

  const getComics = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  }

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1] ? char.urls[1].url : null,
      comics: char.comics ? char.comics.items : null,
    };
  }

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description || "There is no description",
      thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
      homepage: comics.urls[0].url,
      pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
      language: comics.textObjects.language || 'en-us',
      price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not aviable',
    };
  }

  return {
    loading, 
    error, 
    clearError, 
    getAllCharacters, 
    getCharacter, 
    getAllComics, 
    getComics, 
    getCharacterByName
  };
}

export default useMarvelServices;