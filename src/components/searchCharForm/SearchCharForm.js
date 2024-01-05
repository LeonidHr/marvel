import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";

import useMarvelServices from "../../services/MarvelServices";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './searchCharForm.scss';

const SearchCharForm = () => {
  const [ char, setChar ] = useState(null);
  const { loading, error, getCharacterByName, clearError } = useMarvelServices();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onCharLoaded = (char) => {
    setChar(char);
  }

  const updateChar = (name) => {
    clearError();

    getCharacterByName(name.search)
      .then(onCharLoaded);
  }

  const errorMessage = error ? <div className="critical-error"><ErrorMessage/></div> : null;
  const results = !char ? null : char.length > 0 ?
    <div className="search-form__item">
      <div className="search-form__success">There is! Visit {char[0].name} page?</div>
      <Link to={`characters/${char[0].id}`} className="button button__secondary">
        <div className="inner">
          TO PAGE
        </div>
      </Link>
    </div> : watch('search') ?
    <div className="error">The character was not found. Check the name and try again</div> :
    null

  return (
    <div className="search-form">
      <h2 className="search-form__title">Or find a character by name:</h2>
      <form onSubmit={handleSubmit(updateChar)} className="search-form__form">
        <div className="search-form__item">
          <input 
            {...register('search', {required: 'This field is required'})} 
            className="search-form__input" 
            type="text" 
            placeholder="Enter name" />
          <button disabled={loading} type="submit" className="button button__main">
            <div className="inner">
              FIND
            </div>
          </button>
        </div>
        {errors.search ? <div className="error">{errors.search.message}</div> : null}
        {errorMessage}
        {results}
      </form>
    </div>
  );
}

export default SearchCharForm;