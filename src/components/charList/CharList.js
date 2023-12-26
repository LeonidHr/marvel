import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';


class CharList extends Component {

    state = {
        charListArr: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 210,
        charEnded: false,
        limit: 9,
    }

    marvelServices = new MarvelServices();

    componentDidMount = () => {
        const limit = this.onChangeLimit();
        this.onRequest(this.state.offset, limit);
    }

    onRequest = (offset, limit) => {
        this.onCharsLoading();
        this.marvelServices
            .getAllCharacters(offset, limit)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    onChangeLimit = () => {
        let limit;
        const {offset} = this.state;
        const storageOffset = sessionStorage.getItem('offset');

        if (!storageOffset) {
            sessionStorage.setItem('offset', offset);
        }

        if (+storageOffset - offset >= 9) {
            limit = (+storageOffset - offset) + 9;
            this.setState({
                offset: +storageOffset,
            });
        }

        return limit;
    }

    onChangeOffset = () => {
        const storageOffset = sessionStorage.getItem('offset');
        if (storageOffset) {
            sessionStorage.setItem('offset', +storageOffset + 9);
        }
    }

    onCharsLoading = () => {
        this.setState({newItemsLoading: true})
    }

    onCharsLoaded = (newCharListArr) => {
        let ended = false;

        if (newCharListArr.length < 9) {
            ended = true;
        }

        this.setState(({charListArr, offset}) => ({
            charListArr: [...charListArr, ...newCharListArr],
            loading: false,
            newItemsLoading: false,
            offset: +offset + 9,
            charEnded: ended,
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }

    itemRefs = [];

    setRefs = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems = (charListArr) => {
        const charList = charListArr.map(({id, name, thumbnail}, i) => {
            const imgNotFound = thumbnail == 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? true : null; 
            const imgClazz = imgNotFound ? 'char__img char__img_fill' : 'char__img';

            return (
                <li 
                    ref={this.setRefs}
                    tabIndex={0}
                    key={id} 
                    className="char__item"
                    onClick={() => {
                        this.props.onSelectedChar(id);
                        this.focusOnItem(i);
                    }}
                    onFocus={() => this.focusOnItem(i)}
                    onKeyDown={e => {
                        if (e.key == ' ' || e.key == 'Enter') {
                            this.props.onSelectedChar(id);
                            this.focusOnItem(i);
                        }
                    }}>
                        <img className={imgClazz} src={thumbnail} alt={name} />
                        <div className="char__name">{name}</div>
                </li>
            );
        });

        return (
            <ul className="char__grid">
                {charList}
            </ul>
        );
    }

    render() {
        const {charListArr, loading, error, newItemsLoading, offset, charEnded} = this.state;

        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? this.renderItems(charListArr) : null;

        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                
                <button 
                    style={{'display': charEnded ? 'none' : 'block'}}
                    className="button button__main button__long"
                    disabled={newItemsLoading}
                    onClick={() => {this.onRequest(offset); this.onChangeOffset();}} >
                        <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onSelectedChar: PropTypes.func,
}

// char__item_selected
export default CharList;