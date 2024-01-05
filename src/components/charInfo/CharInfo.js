import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import useMarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
 
import './charInfo.scss';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null); 

    const {loading, error, clearError, getCharacter} = useMarvelServices();

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;

        if (!charId) {
            return;
        }

        clearError();

        getCharacter(charId)
            .then(onCharLoaded);
    }

    const onCharLoaded = (char) => {  
        setChar(char);
    }

    const skeleton = char || loading || error ? null : <Skeleton/>
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <>
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        </>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    const imgNotFound = thumbnail == 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? true : null; 
    const imgClazz = imgNotFound ? 'char__img char__img_fill' : 'char__img';
    // const url = "http://gateway.marvel.com/v1/public/comics/43505";
    // const lastDigits = url.match(/\d+$/)[0];

    // console.log(comics);
    return (
        <>
            <div className="char__basics">
                <img className={imgClazz} src={thumbnail} alt={name} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            {comics.length ? null : 'There is no comics with this character'}

            <ul className="char__comics-list">
                {
                    comics.map((item, i) => {
                        if (i >= 10) return
                        const id = item.resourceURI.match(/\d+$/)[0];

                        return (
                            <li key={i} className="char__comics-item">
                                <Link to={`/comics/${id}`} >
                                    {item.name}
                                </Link>
                            </li>
                        )       
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;