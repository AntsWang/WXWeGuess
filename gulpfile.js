var gulp = require("gulp");
var uglify = require('gulp-uglify');//压缩js
var concat = require('gulp-concat');//合并js
var jshint = require('gulp-jshint');
var minify = require('gulp-minify-css');
var replace = require('gulp-replace');
var gulpSequence = require('gulp-Sequence');

gulp.task('component', function () {
    gulp.src([
            'context/component/comm/*.js',
			'context/component/guess/notice.js',
            'context/component/guess/header.js',
            'context/component/guess/leagueitem.js',
            'context/component/guess/timeitem.js',
            'context/component/guess/matchitem.js',
            'context/component/guess/live.js',
            'context/component/guess/mix.js',
            'context/component/guess/guess.js',
            'context/component/leagues/*.js',
            'context/component/publish/confirmpub.js',
			'context/component/publish/messagepub.js',
			'context/component/publish/successpub.js',
            'context/component/betlist/*.js',
            'context/component/match/matchheader.js',
            'context/component/match/match.js',
            'context/component/ranking/ranking.js'
    ])
        .pipe(jshint())
        .pipe(concat('component.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('context/'));
});
gulp.task('script', function () {
    gulp.src(['context/scripts/*.js', '!context/scripts/api_local_debug.js'])
        .pipe(jshint())
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('context/'));
});
gulp.task('script-d-r', function () {
    gulp.src(['context/scripts/*.js'])
        .pipe(jshint())
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('context/'));
});
gulp.task('css', function () {
    gulp.src(['context/css/*.css', '!context/css/main.min.css'])
        .pipe(minify())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('context/css/'));
});

gulp.task('index', function () {
    gulp.src(['index.htm']).pipe(replace('{G{VERSION}G}', new Date().valueOf())).pipe(gulp.dest('dest/'));
});
gulp.task('cpjs', function () {
    gulp.src(['context/component.min.js', 'context/scripts.min.js', 'context/index.js']).pipe(gulp.dest('dest/context/'));
});
gulp.task('cpcss', function () {
    gulp.src(['context/css/main.min.css']).pipe(gulp.dest('dest/context/css/'));
});
gulp.task('image', function () {
    gulp.src(['context/image/**/*']).pipe(gulp.dest('dest/context/image/'));
});
gulp.task('lib', function () {
    gulp.src(['context/lib/vue.js', 'context/lib/vue-router.js', 'context/lib/vue-resource.js', 'context/lib/iscroll-lite.js'])
        .pipe(jshint())
        .pipe(concat('libs.min.js'))
        .pipe(uglify()).pipe(gulp.dest('dest/context/lib/'));
});
gulp.task('fonts', function () {
    gulp.src(['context/fonts/**/*']).pipe(gulp.dest('dest/context/fonts/'));
});

gulp.task('release', function (callback) {
    gulpSequence(
	'component',
	'script',
	'css',
	'index',
    'cpjs',
    'cpcss',
	'image',
	'lib',
	'fonts',
	callback);
});


gulp.task('debug-release', function (callback) {
    gulpSequence(
	'component',
	'script-d-r',
	'css',
	'index',
    'cpjs',
    'cpcss',
	'image',
	'lib',
	'fonts',
	callback);
});