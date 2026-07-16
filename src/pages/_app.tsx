import React from 'react';
import '../styles/global.css';
import Head from 'next/head';
import config from '../../config.json';

const App = ({ Component, pageProps }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onClickAnywhere = () => {
    inputRef.current?.focus();
  };

  // Live updates for the sumfetch datetime and age fields.
  React.useEffect(() => {
    const birth = new Date(2005, 6, 26); // 26 July 2005 (month is 0-based)
    const pad = (n: number) => String(n).padStart(2, '0');
    const fmtNow = () => {
      const n = new Date();
      return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(
        n.getDate(),
      )} ${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
    };
    const computeAge = () => {
      const n = new Date();
      let years = n.getFullYear() - birth.getFullYear();
      const anniv = new Date(
        n.getFullYear(),
        birth.getMonth(),
        birth.getDate(),
      );
      if (n < anniv) years -= 1;
      let lastBD = new Date(n.getFullYear(), birth.getMonth(), birth.getDate());
      if (n < lastBD)
        lastBD = new Date(
          n.getFullYear() - 1,
          birth.getMonth(),
          birth.getDate(),
        );
      const days = Math.floor((n.getTime() - lastBD.getTime()) / 86400000);
      return `${years}y ${days}d`;
    };
    const tick = () => {
      document.querySelectorAll('[data-sum-dt]').forEach((el) => {
        (el as HTMLElement).textContent = fmtNow();
      });
      document.querySelectorAll('[data-sum-age]').forEach((el) => {
        (el as HTMLElement).textContent = computeAge();
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
          maximum-scale="1"
        />
        <link
          rel="preload"
          href="/assets/fonts/Hack-NF.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
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
