#!/bin/sh
# This script installs LiveTerm.
#
# Found a bug? Report it here: https://github.com/Cveinnt/LiveTerm/issues

set -e -u

eval "git clone 'https://github.com/Cveinnt/LiveTerm.git'"

cd LiveTerm

echo "LiveTerm cloned! Installing dependencies..."

if command -v yarn >/dev/null 2>&1 ; then
  yarn install
else
  cat 1>&2 << 'EOA'
/=====================================\\
|       COMMAND NOT FOUND: 'yarn'      |
\\=====================================/

Uh oh! We couldn't find 'yarn' installed on your system.

You should first install 'yarn' on your system. 

For more information, visit yarn's installation page:

  https://classic.yarnpkg.com/lang/en/docs/install/

EOA
  exit 1
fi

cat <<-'EOM'


 █████        ███                       ███████████                                   
░░███        ░░░                       ░█░░░███░░░█                                   
 ░███        ████  █████ █████  ██████ ░   ░███  ░   ██████  ████████  █████████████  
 ░███       ░░███ ░░███ ░░███  ███░░███    ░███     ███░░███░░███░░███░░███░░███░░███ 
 ░███        ░███  ░███  ░███ ░███████     ░███    ░███████  ░███ ░░░  ░███ ░███ ░███ 
 ░███      █ ░███  ░░███ ███  ░███░░░      ░███    ░███░░░   ░███      ░███ ░███ ░███ 
 ███████████ █████  ░░█████   ░░██████     █████   ░░██████  █████     █████░███ █████
░░░░░░░░░░░ ░░░░░    ░░░░░     ░░░░░░     ░░░░░     ░░░░░░  ░░░░░     ░░░░░ ░░░ ░░░░░ 
                                                                                

LiveTerm has been downloaded to the current directory.
You can start developing it with:

cd LiveTerm && yarn dev

This will open a local port at http://localhost:3000, 
where you can preview your website. To apply changes, edit:

config.json

And the changes should be applied upon saves!

EOM