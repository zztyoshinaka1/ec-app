import React from 'react';
import Router from './Router';
import "./assets/reset.css";
import "./assets/style.css";
import {Header} from "./componets/Header";

const App = () => {
  return(
    <>
      <Header />
      <main className="c-main">
        <Router />
      </main>
    </>
  )
};

export default App;