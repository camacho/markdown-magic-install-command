const fs = require('fs');
const path = require('path');
const findup = require('findup');

const defaults = {
  flags: '["--save"]',
  peers: true,
  exact: false,
  client: 'npm'
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

  let pkgPath;

  if (options.pkg) {
    pkgPath = path.resolve(path.dirname(config.originalPath), options.pkg);
  } else {
    pkgPath = findPkg(config.originalPath);
  }

  const rootDir = path.dirname(pkgPath);

  if (!_options.client &&
    fs.existsSync(path.join(rootDir, 'yarn.lock'))){
    options.client = 'yarn';
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const includePeers = options.peers !== 'false';

  const peerDeps = !!includePeers ?  Object.keys(pkg.peerDependencies || {})
    .map(k => `${k}@${pkg.peerDependencies[k]}`)
    .join(' ') :
    '';

  const main = `${pkg.name}${options.exact ? `@${pkg.version}` : ''}`;

  const install = [
    `${ options.client } install`,
    ...JSON.parse(options.flags),
    main,
    peerDeps,
  ].filter((value) => !!value).join(' ')

  return [
    '```sh',
    install,
    '```',
  ].join('\n');
}
