var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

//carrega todas as dependencias
var gulp            = require('gulp'),
    clean           = require('gulp-clean'),
    gutil           = require('gulp-util'),
    sourceMaps      = require('gulp-sourcemaps'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    sass            = require('gulp-sass'),
    browserSync     = require('browser-sync').create(),
    browserify      = require('browserify'),
    autoprefixer    = require('gulp-autoprefixer'),
    gulpSequence    = require('gulp-sequence').use(gulp),
    plumber         = require('gulp-plumber'),
    babelify        = require('babelify'),
    glob            = require('glob'),
    source          = require('vinyl-source-stream');


gulp.task('browserSync', function() {

  browserSync.init({
    server: {
      baseDir: "./app"
    },
    options: {
      reloadDelay: 250
    },
    notify: false
  });

});

//compilando Javascript para deploy
gulp.task('scripts-deploy', function() {
  return gulp.src(['app/scripts/**/*.js'])        
  .pipe(plumber())        
  .pipe(concat('bundle.js'))        
  //.pipe(uglify())
  .pipe(gulp.dest('dist/scripts'));
});

gulp.task('jsx', function () {

  var allFiles = glob.sync('app/scripts/**/*.jsx');

  return browserify({ 
    entries: [allFiles], 
    extensions: ['.jsx'],
    debug: true
  })
    .transform('babelify', {presets: ['es2015', 'react']})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(plumber())
    .pipe(gulp.dest('app/scripts'))
    .pipe(browserSync.reload({stream: true}));
});

//compilando SCSS
gulp.task('styles', function() {
  return gulp.src('app/styles/scss/**/*.scss')        
  .pipe(plumber({
    errorHandler: function (err) {
      console.log(err);
      this.emit('end');
    }
  }))        
  .pipe(sourceMaps.init())        
  .pipe(sass({
    errLogToConsole: true,
    includePaths: [
    'app/styles/scss/'
    ]
  }))
  .pipe(autoprefixer({
    browsers: autoPrefixBrowserList,
    cascade:  true
  }))        
  .on('error', gutil.log)        
  .pipe(concat('styles.css'))        
  .pipe(sourceMaps.write())        
  .pipe(gulp.dest('app/styles'))        
  .pipe(browserSync.reload({stream: true}));
});

//compilando SCSS para deploy
gulp.task('styles-deploy', function() {
  return gulp.src('app/styles/*.css')
  .pipe(gulp.dest('dist/styles'));
});

//watch html
gulp.task('html', function() {
  return gulp.src('app/*.html')
  .pipe(plumber())
  .pipe(browserSync.reload({stream: true}))
  .on('error', gutil.log);
});

//migrando html para deploy
gulp.task('html-deploy', function() {
  gulp.src('app/*')
  .pipe(plumber())
  .pipe(gulp.dest('dist'));

  gulp.src(['app/styles/*.css', '!app/styles/styles.css'])
  .pipe(plumber())
  .pipe(gulp.dest('dist/styles'));
});

gulp.task('font-deploy', function() {
  return gulp.src('app/font/**/*')
    .pipe(gulp.dest('dist/font'));
});

//excluindo diretorio dist
gulp.task('clean', function() {
  return gulp.src('dist')
  .pipe(clean());
})

//tarefa default
gulp.task('default', ['browserSync', 'jsx', 'styles'], function() {
  //lista de watchs

  gulp.watch('app/scripts/jsx/**', ['jsx']);
  gulp.watch('app/styles/scss/**', ['styles']);
  gulp.watch('app/*.html', ['html']);
});

//tarefa de deploy
gulp.task('deploy', gulpSequence('clean', ['scripts-deploy', 'styles-deploy'], 'font-deploy', 'html-deploy'));
