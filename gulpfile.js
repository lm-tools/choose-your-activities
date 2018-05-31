const gulp = require('gulp');
const color = require('ansi-colors');
const log = require('fancy-log');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const { spawn } = require('child_process');
const babel = require('gulp-babel');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
const rev = require('gulp-rev');
const revDelOriginal = require('gulp-rev-delete-original');
const debug = require('gulp-debug');
const http = require('http');
const { lintHtml } = require('lmt-utils');
const checkForDeadLinks = require('./scripts/url-checker');
const labels = require('./app/locales/en.json');
const activities = require('./app/models/activities');
// eslint-disable-next-line global-require
const app = () => { require('./app/app'); };

let node;

const dir = { assets: 'app/assets', output: 'dist/public' };
const exitCodes = { success: 0, error: 1, uncaughtException: 8 };
const exitProcess = (code) => process.exit(code);
const killServer = () => {
  if (node) node.kill();
};

// npm run html-lint
gulp.task('lint-all-html', () => {
  process.env = process.env || 'TEST';
  const port = 3001;
  const url = `http://localhost:${port}`;

  return new Promise(accept =>
    http.createServer(app()).listen(port, () => accept())
  ).then(lintHtml({ url }))
    .then(log(color.green('HTML linting passed')))
    .then(exitProcess(exitCodes.success))
    .catch(err => log(color.red(err)) && exitProcess(exitCodes.error));
});

gulp.task('browserify', () =>
  browserify(`${dir.assets}/js/main.js`)
    .bundle()
    .on('error', function (err) {
      log(color.red('Browserify compilation error:'));
      log(err);
      this.emit('end');
    })
    .pipe(plumber())
    .pipe(source('main.js'))
    .pipe(streamify(babel({ presets: ['es2015'] }))) // babel doesn't support streaming
    .pipe(streamify(uglify())) // uglify doesn't support streaming
    .pipe(gulp.dest(`${dir.output}/js`))
);

gulp.task('js-vendor', () =>
  gulp.src([
    'node_modules/govuk_frontend_toolkit/javascripts/govuk/selection-buttons.js',
    'node_modules/jquery/dist/jquery.min.js',
  ]).pipe(gulp.dest(`${dir.output}/js`))
);

gulp.task('js', ['browserify', 'js-vendor']);

gulp.task('fonts', () => {
  gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest(`${dir.output}/fonts`));
});

gulp.task('css', ['fonts'], () =>
  gulp.src(`${dir.assets}/stylesheets/*.scss`)
    .pipe(plumber())
    .pipe(
      sass({
        includePaths: [
          'src/assets/stylesheets',
          'node_modules/govuk_frontend_toolkit/stylesheets',
          'node_modules/govuk-elements-sass/public/sass',
          'node_modules/font-awesome/scss/',
        ],
      }))
    .pipe(gulp.dest(`${dir.output}/stylesheets/`))
);

gulp.task('revision:rename', ['js', 'css'], () =>
  gulp.src([
    `${dir.output}/**/*.html`,
    `${dir.output}/**/*.css`,
    `${dir.output}/**/*.js`,
    `${dir.output}/**/*.{jpg,png,jpeg,gif,svg}`])
    .pipe(debug())
    .pipe(rev())
    .pipe(revDelOriginal())
    .pipe(gulp.dest(dir.output))
    .pipe(rev.manifest())
    .pipe(gulp.dest(dir.output))
);

// npm run compile
gulp.task('compile', ['revision:rename']);

gulp.task('server', () => {
  killServer();
  node = spawn('node', ['bin/www'], { stdio: 'inherit' });
  node.on('close', (code) => {
    if (code === exitCodes.uncaughtException) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

// npm run watch
gulp.task('watch', ['compile', 'server'], () => {
  gulp.watch(['app/**/*.js', 'bin/www'], ['server']);
  gulp.watch(`${dir.assets}/stylesheets/**/*.scss`, ['css']);
  gulp.watch(`${dir.assets}/js/**/*.js`, ['browserify']);
});

// npm run check-content
gulp.task('check-content', () => {
  const activitiesWithBody = activities.map(name => ({
    name,
    body: labels.activity[name].details,
  }));

  return checkForDeadLinks(activitiesWithBody).then(result => {
    if (result.brokenLinksCount > 0) {
      log(color.red('Found broken links:'));
      log(JSON.stringify(result, null, '  '));
      exitProcess(exitCodes.error);
    }

    log(color.green('All links checked and are OK.'));
  });
});

// clean up if an error goes unhandled.
process.on('exit', () => {
  killServer();
});

