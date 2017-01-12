const fs = require('fs');
const path = require('path');
const findup = require('findup');

const defaults = {
  flags: '["--save"]',
  peers: true,
};

function findPkg(dir) {
  try {
    return path.join(findup.sync(dir, 'package.json'), 'package.json');
  } catch (err) {
    console.log(err);
    throw new Error('No package.json file found');
  }
}

module.exports = function INSTALLCMD(content, _options = {}, config) {
  const options = Object.assign({}, defaults, _options);

  const pkgPath = findPkg(config.originalPath);

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const includePeers = options.peers !== 'false';

  const peerDeps = !!includePeers ?  Object
    .entries(pkg.peerDependencies || {})
    .map(args => args.join('@'))
    .join(' ') :
    [];

  const install = [
    `npm install`,
    ...JSON.parse(options.flags),
    pkg.name,
    peerDeps,
  ].filter((value) => !!value).join(' ')

  return [
    '```sh',
    install,
    '```',
  ].join('\n');
}
