const fs = require('fs');
const path = require('path');
const findup = require('findup');

const defaults = {
  flags: '["--save"]',
  peers: true,
  exact: false
};

npmFlagsToYarn = {
  '--save': '',
  '---save-exact': '--exact',
  '--save-optional': '--optional',
  '--save-dev': '--dev',
  '--global': ''
}

function filterAndJoin(array, join = ' ') {
  return array.filter(v => !!v).join(join);
}

function findPkg(dir) {
  try {
    return path.join(findup.sync(dir, 'package.json'), 'package.json');
  } catch (err) {
    console.log(err);
    throw new Error('No package.json file found');
  }
}

function pickClient(dir) {
  return  fs.existsSync(path.join(dir, 'yarn.lock')) ? 'yarn' : 'npm';
}

function buildDeps(pkg, exactFlag, peersFlag) {
  const mainDep = filterAndJoin([pkg.name, exactFlag ? pkg.version : ''], '@');

  if (!peersFlag) return mainDep;

  const pkgPeers = pkg.peerDependencies;
  if (!pkgPeers) return mainDep;

  const peers = Object.keys(pkg.peerDependencies).map(buildDep(pkgPeers));

  return filterAndJoin([mainDep, ...peers]);
}

const buildDep = obj => key => [key, obj[key]].join('@');

function buildInstallCmd(client, isGlobal) {
  const install = [client];
  if (isGlobal && client === 'yarn') install.push('global');
  install.push(client === 'yarn' ? 'add' : 'install');
  return filterAndJoin(install);
}

function buildCmdFlags(client, flags) {
  let response = flags;

  if (client === 'yarn') {
    response = flags.map(flag => {
      if (Object.prototype.hasOwnProperty.call(npmFlagsToYarn, flag)) {
        return npmFlagsToYarn[flag]
      }

      return flag
    })
  }

  return filterAndJoin(response);
}

function INSTALLCMD(content, _options = {}, config = {}) {
  const options = Object.assign({}, defaults, _options);
  options.flags = JSON.parse(options.flags);

  let pkgPath;

  if (options.pkg) {
    pkgPath = path.resolve(path.dirname(config.originalPath), options.pkg);
  } else {
    pkgPath = findPkg(config.originalPath);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const client = options.client ||  pickClient(path.dirname(pkgPath));

  const deps = buildDeps(pkg, options.exact, options.peers !== 'false');
  const installCmd = buildInstallCmd(client, options.flags.global);
  const installFlags = buildCmdFlags(client, options.flags);

  const install = filterAndJoin([installCmd, installFlags, deps]);

  return [
    '```sh',
    install,
    '```',
  ].join('\n');
}

module.exports = INSTALLCMD;

if (require.main === module) console.log(INSTALLCMD('', undefined, { originalPath: __filename}))
