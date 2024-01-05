import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';
import '../../style/common.scss';

const CharList = (props) => {

    const [charListArr, setCharListArr] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelServices();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getAllCharacters(offset)
            .then(onCharsLoaded);
    }

    const onCharsLoaded = (newCharListArr) => {
        let ended = false;

        if (newCharListArr.length < 9) {
            ended = true;
        }

        setCharListArr(charListArr => [...charListArr, ...newCharListArr]);
        setNewItemsLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const renderItems = (charListArr) => {
        const charList = charListArr.map((item, i) => {
            const imgNotFound = item.thumbnail == 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? true : null; 
            const imgClazz = imgNotFound ? 'char__img char__img_fill' : 'char__img';

            return (
                <CSSTransition key={item.id}  timeout={500} classNames="list-item">
                    <li 
                        ref={el => itemRefs.current[i] = el}
                        tabIndex={0}
                        key={item.id} 
                        className="char__item"
                        onClick={() => {
                            props.onSelectedChar(item.id);
                            focusOnItem(i);
                        }}
                        onFocus={() => focusOnItem(i)}
                        onKeyDown={e => {
                            if (e.key == ' ' || e.key == 'Enter') {
                                props.onSelectedChar(item.id);
                                focusOnItem(i);
                            }
                        }}>
                            <img className={imgClazz} src={item.thumbnail} alt={item.name} />
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            );
        });

        return (
            <TransitionGroup className="char__grid">
                {charList}
            </TransitionGroup>
        );
    }

    const spinner = loading && !newItemsLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = renderItems(charListArr);

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {content}
            
            <button 
                style={{'display': charEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                disabled={newItemsLoading}
                onClick={() => {
                    onRequest(offset);
                }} >
                    <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onSelectedChar: PropTypes.func,
}

export default CharList;