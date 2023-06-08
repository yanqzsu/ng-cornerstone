const { task, src, dest } = require('gulp');
const { join } = require('path');

const buildConfig = {
  projectDir: __dirname,
  publishDir: 'dist/ng-cornerstone',
};

task('copy-resources', () => {
  return src([join(buildConfig.projectDir, 'README.md')]).pipe(dest(join(buildConfig.publishDir)));
});
