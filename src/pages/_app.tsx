import React from 'react';
import '../styles/global.css';
import Head from 'next/head';
import config from '../../config.json';
import { useLayoutEffect, useState } from 'react';
const App = ({ Component, pageProps }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onClickAnywhere = () => {
    inputRef.current.focus();
  };

  useLayoutEffect(() => {
    let html = document.querySelector('html');
    html.classList.add('dark');
    let theme = window.sessionStorage.getItem('theme');
    if (theme == 'dark') {
      html.classList.add('dark');
    } else if (theme == 'light') {
      html.classList.remove('dark');
    }
  }, []);

  React.useEffect(() => {
    const askName = 'What is your name?';
    let visitor: string;

    if (!window.sessionStorage) {
      window.prompt(askName);
    }

    visitor = window.sessionStorage.getItem('visitorName');

    if (!visitor) {
      visitor = window.prompt(askName);
      if (['', undefined, null].includes(visitor)) {
        visitor = config.ps1_username;
      }
      window.sessionStorage.setItem('visitorName', visitor);
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
          maximum-scale="1"
        />
      </Head>

      <div
        className="text-light-foreground dark:text-dark-foreground min-w-max text-xs md:min-w-full md:text-base"
        onClick={onClickAnywhere}
      >
        <main className="bg-light-background dark:bg-dark-background w-full h-full p-2">
          <Component {...pageProps} inputRef={inputRef} />
        </main>
      </div>
    </>
  );
};

export default App;
