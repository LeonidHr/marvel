import { Component } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelServices from '../../services/MarvelServices';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {

    state = {
       char: {},
       loading: true,
       error: false,
    }

    marvelSerivce = new MarvelServices();

    onCharLoading = () => {
        this.setState({loading: true});
    }

    componentDidMount() {
        this.updateChar();
    }

    onCharLoaded = (char) => {
        this.setState({char, loading: false});  
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        });
    }
    
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelSerivce
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }
    
    render() {
        const {char, loading, error} = this.state;
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? <View char={char} /> : null;

        return (
            <div className="randomchar">
                {spinner}
                {errorMessage}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = (char) => {
    const {name, description, thumbnail, homepage, wiki} = char.char;
    const imgNotFound = thumbnail == 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? true : null; 
    const imgClazz = imgNotFound ? 'randomchar__img randomchar__img_contain' : 'randomchar__img';

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className={imgClazz} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main" target='_blank'>
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary" target='_blank'>
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default RandomChar;