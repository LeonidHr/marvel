import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AppBanner from '../appBanner/AppBanner';
import Spinner from '../spinner/Spinner';
import useMarvelServices from '../../services/MarvelServices';

import ErrorMessage from '../errorMessage/ErrorMessage';

const SinglePage = ({Component, dataType}) => {

    const { id } = useParams();
    const [ data, setData ] = useState(null);
    const { loading, error, clearError, getComics, getCharacter } = useMarvelServices();
    
    useEffect(() => {
        onRequest();
    }, [id]);

    const onRequest = () => {
        clearError();

        switch(dataType) {
            case 'comic':
                getComics(id)
                    .then(onDataLoaded);
                break;
            case 'character':
                getCharacter(id)
                    .then(onDataLoaded);
                break;
        }
    }

    const onDataLoaded = (data) => {
        setData(data);
    }

    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error || !data) ? <Component data={data} /> : null;

    return (
        <>
            <AppBanner/>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

export default SinglePage;