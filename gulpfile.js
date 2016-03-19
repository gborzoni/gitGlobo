var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

//carrega todas as dependencias
var gulp            = require('gulp'),
    clean           = require('gulp-clean'),
    gutil           = require('gulp-util'),
    sourceMaps      = require('gulp-sourcemaps'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    sass            = require('gulp-sass'),
    cleanCSS        = require('gulp-clean-css'),
    browserSync     = require('browser-sync'),
    autoprefixer    = require('gulp-autoprefixer'),
    gulpSequence    = require('gulp-sequence').use(gulp),
    plumber         = require('gulp-plumber')

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "app/"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});

//compilando Javascripts
gulp.task('scripts', function() {
    return gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
                .pipe(plumber())        
                .pipe(concat('app.js'))        
                .on('error', gutil.log)        
                .pipe(gulp.dest('app/scripts'))        
                .pipe(browserSync.reload({stream: true}));
});

//compilando Javascript para deploy
gulp.task('scripts-deploy', function() {
    return gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])        
                .pipe(plumber())        
                .pipe(concat('app.js'))        
                //.pipe(uglify())
                .pipe(gulp.dest('dist/scripts'));
});

//compilando SCSS
gulp.task('styles', function() {
    return gulp.src('app/styles/scss/init.scss')        
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
    return gulp.src('app/styles/scss/init.scss')
                .pipe(plumber())        
                .pipe(sass({
                      includePaths: [
                          'app/styles/scss',
                      ]
                }))
                .pipe(autoprefixer({
                  browsers: autoPrefixBrowserList,
                  cascade:  true
                }))        
                .pipe(concat('styles.css'))
                .pipe(cleanCSS())        
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

//excluindo diretorio dist
gulp.task('clean', function() {
    return gulp.src('dist')
            .pipe(clean());
})

//tarefa default
gulp.task('default', ['browserSync', 'scripts', 'styles'], function() {
    //lista de watchs
    gulp.watch('app/scripts/src/**', ['scripts']);
    gulp.watch('app/styles/scss/**', ['styles']);
    gulp.watch('app/*.html', ['html']);
});

//tarefa de deploy
gulp.task('deploy', gulpSequence('clean', ['scripts-deploy', 'styles-deploy'], 'html-deploy'));
