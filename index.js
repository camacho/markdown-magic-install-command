import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { findUpSync } from 'find-up';

const defaults = {
  flags: '["--save"]',
  peers: true,
  exact: false,
};

const installMappings = {
  '--global': { npm: '--global', yarn: '', pnpm: '--global', bun: '' },
  '--save': { npm: '--save', yarn: '', pnpm: '', bun: '' },
  '--save-exact': {
    npm: '--save-exact',
    yarn: '--exact',
    pnpm: '--save-exact',
    bun: '--exact',
  },
  '--save-optional': {
    npm: '--save-optional',
    yarn: '--optional',
    pnpm: '--save-optional',
    bun: '--optional',
  },
  '--save-dev': {
    npm: '--save-dev',
    yarn: '--dev',
    pnpm: '--save-dev',
    bun: '--dev',
  },
};

function quoteSpacesInDep(dep) {
  return dep.includes(' ') ? `"${dep}"` : dep;
}

function filterFalseyAndJoin(array, join = ' ') {
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
  if (
    existsSync(path.join(dir, 'bun.lock')) ||
    existsSync(path.join(dir, 'bun.lockb'))
  ) {
    return 'bun';
  }

  if (existsSync(path.join(dir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  if (existsSync(path.join(dir, 'yarn.lock'))) {
    return 'yarn';
  }

  return 'npm';
}

function buildDeps(pkg, exactFlag, peersFlag) {
  const mainDep = filterFalseyAndJoin(
    [pkg.name, exactFlag ? pkg.version : ''],
    '@',
  );

  if (!peersFlag) return mainDep;

  const pkgPeers = pkg.peerDependencies;
  if (!pkgPeers) return mainDep;

  const peers = Object.keys(pkg.peerDependencies).map(buildDep(pkgPeers));

  return filterFalseyAndJoin([mainDep, ...peers]);
}

const buildDep = (obj) => (key) => quoteSpacesInDep([key, obj[key]].join('@'));

function buildInstallCmd(client, isGlobal) {
  return `${client}${isGlobal && ['yarn', 'bun'].includes(client) ? ' global' : ''} add`;
}

function buildCmdFlags(client, flags) {
  return filterFalseyAndJoin(
    flags.map((flag) => installMappings[flag]?.[client] ?? flag),
  );
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

  const cmd = filterFalseyAndJoin([
    buildInstallCmd(client, options.flags.global),
    buildCmdFlags(client, options.flags),
    buildDeps(pkg, options.exact, options.peers !== 'false'),
  ]);

  return `\`\`\`sh\n${cmd}\n\`\`\``;
}
