import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelServices from '../../services/MarvelServices';

import './comicsList.scss';
import '../../style/common.scss';

const ComicsList = () => {
    const [charListArr, setCharListArr] = useState([]);
    const {loading, error, getAllComics} = useMarvelServices();
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    useEffect(() => {
        onRequest();
    }, []);

    const onRequest = (offset) => {
        setNewItemsLoading(true);
        getAllComics(offset)
            .then(onCharListLoaded);
    }

    const onCharListLoaded = (newCharListArr) => {
        if (newCharListArr.length < 8) {
            setComicsEnded(true);
        }

        setNewItemsLoading(false);
        setOffset(offset => offset + 8);
        setCharListArr(charListArr => [...charListArr, ...newCharListArr]);
    }

    const renderItems = (items) => {
        const comics = items.map((item, i) => {
            return (
                <CSSTransition key={i} timeout={500} classNames="list-item">
                    <li key={i} className="comics__item">
                        <Link to={`/comics/${item.id}`}>
                            <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                            <div className="comics__item-name">{item.title}</div>
                            <div className="comics__item-price">{item.price}</div>
                        </Link>
                    </li>
                </CSSTransition>
            );
        });

        return (
            <TransitionGroup className="comics__grid">
                {comics}
            </TransitionGroup>
        );
    }

    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content =  renderItems(charListArr);

    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {content}
            <button 
                onClick={() => onRequest(offset)} 
                style={{'display': comicsEnded ? 'none' : 'block'}}
                disabled={newItemsLoading}
                className="button button__main button__long">
                    <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;