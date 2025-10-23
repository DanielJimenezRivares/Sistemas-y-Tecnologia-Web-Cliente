const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const { rimraf } = require('rimraf');
const browserSync = require('browser-sync').create();

// File paths
const paths = {
    styles: {
        src: 'scss/**/*.scss',
        dest: 'css'
    },
    scripts: {
        src: 'js/**/*.js',
        dest: 'js/dist'
    },
    images: {
        src: 'img/**/*',
        dest: 'img/dist'
    }
};

// Clean dist folders
function clean() {
    const pathsToDelete = ['css', 'js/dist', 'img/dist'];
    return Promise.all(pathsToDelete.map((p) => rimraf(p)));
}

// Compile SASS, create sourcemaps and minify CSS
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// Optimize JavaScript files
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// Optimize images
function images() {
    return gulp.src(paths.images.src, { encoding: false })
        .pipe(imagemin([
            // imagemin.gifsicle({ interlaced: true }),
            // imagemin.mozjpeg({ quality: 100, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: false },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.images.dest))
}

// Watch files
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch("*.html").on('change', browserSync.reload);
}

// Define complex tasks
const build = gulp.series(clean, gulp.parallel(styles, scripts, images));

// Export tasks
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watch;
exports.build = build;
exports.default = gulp.series(build, watch);