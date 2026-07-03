import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { findUpSync } from 'find-up';

const defaults = {
  flags: '["--save"]',
  peers: true,
  exact: false,
};

const npmFlagsToYarn = {
  '--save': '',
  '---save-exact': '--exact',
  '--save-optional': '--optional',
  '--save-dev': '--dev',
  '--global': '',
};

function quoteSpacesInDep(dep) {
  return dep.includes(' ') ? `"${dep}"` : dep;
}

function filterAndJoin(array, join = ' ') {
  return array.filter((v) => !!v).join(join);
}

function findPkg(dir) {
  const pkgPath = findUpSync('package.json', { cwd: dir });

  if (!pkgPath) {
    throw new Error('No package.json file found');
  }

  return pkgPath;
}

function pickClient(dir) {
  return existsSync(path.join(dir, 'yarn.lock')) ? 'yarn' : 'npm';
}

function buildDeps(pkg, exactFlag, peersFlag) {
  const mainDep = filterAndJoin([pkg.name, exactFlag ? pkg.version : ''], '@');

  if (!peersFlag) return mainDep;

  const pkgPeers = pkg.peerDependencies;
  if (!pkgPeers) return mainDep;

  const peers = Object.keys(pkg.peerDependencies).map(buildDep(pkgPeers));

  return filterAndJoin([mainDep, ...peers]);
}

const buildDep = (obj) => (key) => quoteSpacesInDep([key, obj[key]].join('@'));

function buildInstallCmd(client, isGlobal) {
  const install = [client];
  if (isGlobal && client === 'yarn') install.push('global');
  install.push(client === 'yarn' ? 'add' : 'install');
  return filterAndJoin(install);
}

function buildCmdFlags(client, flags) {
  let response = flags;

  if (client === 'yarn') {
    response = flags.map((flag) => {
      if (Object.prototype.hasOwnProperty.call(npmFlagsToYarn, flag)) {
        return npmFlagsToYarn[flag];
      }

      return flag;
    });
  }

  return filterAndJoin(response);
}

export default function INSTALLCMD({
  content,
  options: _options = {},
  srcPath,
}) {
  const options = Object.assign({}, defaults, _options);
  options.flags = JSON.parse(options.flags);

  let pkgPath;

  if (options.pkg) {
    pkgPath = path.resolve(path.dirname(srcPath), options.pkg);
  } else {
    pkgPath = findPkg(path.dirname(srcPath));
  }

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const client = options.client || pickClient(path.dirname(pkgPath));

  const deps = buildDeps(pkg, options.exact, options.peers !== 'false');
  const installCmd = buildInstallCmd(client, options.flags.global);
  const installFlags = buildCmdFlags(client, options.flags);

  const install = filterAndJoin([installCmd, installFlags, deps]);

  return ['```sh', install, '```'].join('\n');
}
