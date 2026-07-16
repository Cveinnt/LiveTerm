import Head from 'next/head';
import React from 'react';
import config from '../../config.json';
import { Input } from '../components/input';
import { History, useHistory } from '../components/History';
import { sumfetch } from '../utils/bin';

interface IndexPageProps {
  inputRef: React.MutableRefObject<HTMLInputElement>;
}

const IndexPage: React.FC<IndexPageProps> = ({ inputRef }) => {
  const containerRef = React.useRef(null);
  const {
    history,
    command,
    lastCommandIndex,
    setCommand,
    setHistory,
    clearHistory,
    setLastCommandIndex,
  } = useHistory([]);

  const init = React.useCallback(() => {
    sumfetch([]).then((out) => setHistory(out));
  }, []);

  React.useEffect(() => {
    init();
  }, [init]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView();
      inputRef.current.focus({ preventScroll: true });
    }
  }, [history]);

  return (
    <>
      <Head>
        <title>{config.title}</title>
      </Head>

      <div className="p-4 md:p-8 overflow-hidden h-full">
        <div ref={containerRef} className="overflow-y-auto h-full">
          <History history={history} />
          <Input
            inputRef={inputRef}
            containerRef={containerRef}
            command={command}
            history={history}
            lastCommandIndex={lastCommandIndex}
            setCommand={setCommand}
            setHistory={setHistory}
            setLastCommandIndex={setLastCommandIndex}
            clearHistory={clearHistory}
          />
        </div>
      </div>

      <a
        href={config.resume_url}
        target="_blank"
        rel="noreferrer"
        className="resume-fab"
      >
        resume ↗
      </a>
    </>
  );
};

export default IndexPage;
