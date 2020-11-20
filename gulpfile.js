const gulp = require('gulp');
const bump = require('gulp-bump');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;

gulp.task('build', function () {
  return pipeline(
    gulp.src('lib/*.js'),
    uglify(),
    gulp.dest('dist')
  );
});

gulp.task('watch', function () {
  return gulp.watch(['lib/*.js'], gulp.task('build'))
});

gulp.task('bump', function () {
  const allowedTypes = {
    'major': 'major',
    'minor': 'minor',
    'patch': 'patch'
  }
  const argv = require('yargs').argv;
  console.log('type: ', argv.type);
  const type = allowedTypes[argv.type] || 'patch';
  console.log('BUMP: ', type);
  return gulp.src('./package.json')
    .pipe(bump({ type: type }))
    .pipe(gulp.dest('./'));
});