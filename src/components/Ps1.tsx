import React from 'react';
import config from '../../config.json';

export const Ps1: React.FC<{ username?: string }> = ({ username }) => {
  const name = username && username.length > 0 ? username : config.ps1_username;
  return (
    <div>
      <span className="text-light-yellow dark:text-dark-yellow">{name}</span>
      <span className="ps1-separator">@</span>
      <span className="ps1-host">{config.ps1_hostname}</span>
      <span className="ps1-path">:$ ~ </span>
    </div>
  );
};

export default Ps1;
