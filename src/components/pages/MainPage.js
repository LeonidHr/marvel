import { useState } from "react";
import { Helmet } from "react-helmet";

import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import CharList from "../charList/CharList";
import RandomChar from "../randomChar/RandomChar";
import SearchCharForm from "../searchCharForm/SearchCharForm";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
  const [selectedChar, setChar] = useState(null);

  const onSelectedChar = (id) => {
    setChar(id);
  }

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Marvel information portal"
        />
        <title>Marvel information portal</title>
      </Helmet>
      <ErrorBoundary>
        <RandomChar/>
      </ErrorBoundary>
      <div className="char__content">
        <ErrorBoundary>
          <CharList onSelectedChar={onSelectedChar} />
        </ErrorBoundary>
       <div>
          <ErrorBoundary>
            <CharInfo charId={selectedChar} />
          </ErrorBoundary>
          <ErrorBoundary>
            <SearchCharForm/>
          </ErrorBoundary>
       </div>
      </div>
      <img className="bg-decoration" src={decoration} alt="vision"/>
    </>
  );
}

export default MainPage;