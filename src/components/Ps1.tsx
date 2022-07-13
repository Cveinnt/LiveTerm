import React from 'react';
import config from '../../config.json';

export const Ps1 = () => {
  let [visitorName, setVisitorName] = React.useState('');
  React.useEffect(() => {
    let name = window.sessionStorage.getItem('visitorName');
    setVisitorName(name);
  }, [visitorName]);
  return (
    <div>
      <span className="text-light-yellow dark:text-dark-yellow">
        {visitorName}
      </span>
      <span className="text-light-gray dark:text-dark-gray">@</span>
      <span className="text-light-green dark:text-dark-green">
        {config.ps1_hostname}
      </span>
      <span className="text-light-gray dark:text-dark-gray">:$ ~ </span>
    </div>
  );
};

export default Ps1;
