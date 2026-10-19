const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));

function pagesUrl(repoSlug) {
  if (!/^[A-Za-z0-9][A-Za-z0-9-]*\/[A-Za-z0-9_.-]+$/.test(repoSlug)) {
    throw new Error('TRAVIS_REPO_SLUG must have the form owner/repository.');
  }
  const [owner, repository] = repoSlug.split('/');
  const siteRoot = `https://${owner.toLowerCase()}.github.io`;
  return repository.toLowerCase() === `${owner.toLowerCase()}.github.io`
    ? siteRoot
    : `${siteRoot}/${repository}`;
}

try {
  const publicUrl = process.env.PUBLIC_URL || (
    process.env.TRAVIS_REPO_SLUG
      ? pagesUrl(process.env.TRAVIS_REPO_SLUG)
      : packageJson.homepage || '.'
  );

  console.log(`Building GitHub Pages files with asset URL: ${publicUrl}`);
  const result = spawnSync(
    process.execPath,
    [require.resolve('react-scripts/scripts/build')],
    {
      cwd: projectRoot,
      stdio: 'inherit',
      env: { ...process.env, PUBLIC_URL: publicUrl },
    }
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);

  const outputDirectory = path.resolve(projectRoot, process.env.BUILD_PATH || 'build');
  const indexPath = path.join(outputDirectory, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error('Production build did not create index.html.');

  // Keep index.html as the site entry file and add a fallback for SPA paths.
  fs.copyFileSync(indexPath, path.join(outputDirectory, '404.html'));
  fs.writeFileSync(path.join(outputDirectory, '.nojekyll'), '');
  console.log('Pages files ready: index.html, 404.html and .nojekyll.');
} catch (error) {
  console.error(`Pages build failed: ${error.message}`);
  process.exit(1);
}
