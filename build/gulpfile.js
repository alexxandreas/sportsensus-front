/**
 * gulp serve-debug - запуск с liveserver для отладки из dist/debug
 * gulp serve - то же самое, но из папки dist/release
 * gulp clean - очищает dist
 * gulp build - только сборка (и в debug, и в release)
 * gulp publish - сборка и публикация в public
 * 
 * 
 */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
//var gulpConnect = require('gulp-connect');
//var templateCache = require('gulp-angular-templatecache');
var del = require('del');

var appJs = ['../src/app/**/_*.js','../src/app/**/*.js', '!../src/app/**/!*.js']; // not include config.js 
var appCss = ['../src/app/**/_*.less', '../src/app/**/*.less'];
var appViews = ['../src/app/**/*.html']; // not include index.html 

//var watchStatic_ = ['../src/**/*.{html,scss,less,css,svg}'];
var statics = [
	'../src/static/**/*',
	'../libs/ckeditor*/**/*', // ckeditor загружает свою статику сам - переносим всю папку в static
	'../libs/tinymce*/**/*' // tinymce загружает свою статику сам - переносим всю папку в static
]; // статика
var index = [
	'../src/index.html',
	'../src/favicon.ico'
	];
var debugConfig = '../src/config_debug.js';
var releaseConfig = '../src/config_release.js';
//var index = ['../src/index.html', '../src/config.js']; // файлы, копируемые в dist напрямую

var debugMode = false;
var distDebug = '../dist/debug/';
var distRelease = '../dist/release/';
var publishDir = '../public/';

var libJs = [
	//'../libs/leaflet/dist/leaflet-src.js',
	'../libs/angular/angular.js',
	'../libs/angular-animate/angular-animate.js',
	'../libs/angular-sanitize/angular-sanitize.min.js',
	'../libs/angular-aria/angular-aria.js',
	'../libs/angular-material/angular-material.js',
	'../libs/angular-route/angular-route.js',
	'../libs/angular-cookies/angular-cookies.js',
	'../libs/d3-3.5.6.min.js',
	'../libs/Chart.1.1.1.js',
	
	// '../libs/html2canvas/dist/html2canvas.js',
	// '../libs/html2canvas/dist/html2canvas.svg.js',
	//'../libs/html2canvas.0.4.1.js',
	// '../libs/jspdf/dist/jspdf.debug.js',
	'../libs/jspdf/dist/jspdf.min.js',

	// '../libs/canvg/dist/canvg.bundle.js'
	'../libs/canvg/rgbcolor.js',
	'../libs/canvg/StackBlur.js',
	'../libs/canvg/canvg.js',

	//'../libs/ckeditor/ckeditor.js',
	//'../libs/ckeditor/lang/ru.js',
	
	//'../libs/angular-ckeditor/angular-ckeditor.js',
	
	'../libs/flickity/dist/flickity.pkgd.min.js',
	
	//'../libs/tinymce/tinymce.min.js',
	'../libs/angular-ui-tinymce/dist/tinymce.min.js',
	
	
	
	// '../libs/html2canvas/src/Core.js',
	// '../libs/html2canvas/src/Font.js',
	// '../libs/html2canvas/src/Generate.js',
	// '../libs/html2canvas/src/Queue.js',
	// '../libs/html2canvas/src/Parse.js',
	// '../libs/html2canvas/src/Preload.js',
	// '../libs/html2canvas/src/Renderer.js',
	// '../libs/html2canvas/src/Support.js',
	// '../libs/html2canvas/src/Util.js',
	// '../libs/html2canvas/src/renderers/Canvas.js'


];
var libCss = [
	'../libs/angular-material/angular-material.css',
	// '../libs/ckeditor/contents.css',
	'../libs/flickity/dist/flickity.min.css'
];


// Concatenate and minify JavaScript
gulp.task('app-js', function() {
	return gulp.src(appJs)
		.pipe($.concat('app.js'))
		.pipe(gulp.dest(distDebug+'app'))
		.pipe($.uglify({preserveComments:'license', mangle: false}))
		.pipe(gulp.dest(distRelease+'app'));
});
gulp.task('app-css', function() {
	return gulp.src(appCss)
		 .pipe($.less())
		 .pipe($.concat('app.css'))
		 .pipe(gulp.dest(distDebug+'app'))
		 .pipe($.minifyCss())
		 .pipe(gulp.dest(distRelease+'app'));
});
gulp.task('app-views', function() {
	var options = {
		root: '/views/',
		standalone: true,
		module: 'Views'
	};
	return gulp.src(appViews)
		.pipe($.htmlmin({collapseWhitespace: true, removeComments:true}))
		// .pipe(templateCache('views.js', options))
		.pipe($.angularTemplatecache('views.js', options))
		.pipe(gulp.dest(distDebug+'app'))
		.pipe(gulp.dest(distRelease+'app'));
});
gulp.task('app', ['app-js', 'app-css', 'app-views']);

// Concatenate and minify JavaScript
gulp.task('libs-js', function() {
	return gulp.src(libJs)
		.pipe($.concat('libs.js'))
		.pipe(gulp.dest(distDebug+'app'))
		.pipe($.uglify({preserveComments:'license', mangle: false}))
		.pipe(gulp.dest(distRelease+'app'));
});
gulp.task('libs-css', function () {
	return gulp.src(libCss)
		.pipe($.concat('libs.css'))
		.pipe(gulp.dest(distDebug+'app'))
		.pipe($.minifyCss())
		.pipe(gulp.dest(distRelease+'app'));

});
gulp.task('libs', ['libs-css', 'libs-js']);

gulp.task('copy-static', function () {
	return gulp.src(statics)
		.pipe(gulp.dest(distDebug+'static'))
		.pipe(gulp.dest(distRelease+'static'));
});
gulp.task('copy-index', function () {
	gulp.src(index)
		.pipe(gulp.dest(distDebug))
		.pipe(gulp.dest(distRelease));
	gulp.src(debugConfig)
		.pipe($.rename('config.js'))
		.pipe(gulp.dest(distDebug));
	gulp.src(releaseConfig)
		.pipe($.rename('config.js'))
		.pipe(gulp.dest(distRelease));
});

// Build and serve the output from `dist` folder
gulp.task('watch', function (cb) {
	gulp.watch([index, debugConfig, releaseConfig], function () {
		runSequence(
			'copy-index',
			'live-reload'
		);
	});
	gulp.watch(appCss, function () {
		runSequence(
			'app-css',
			'live-reload'
		);
	});
	gulp.watch(appViews, function () {
		runSequence(
			'app-views',
			'live-reload'
		);
	});
	gulp.watch(appJs, function () {
		runSequence(
			'app-js',
			'live-reload'
		);
	});
	
	//if (debugMode) {
	//	gulp.watch(['../libs/**/*.{css,js}'], ['libs']);
	//}

	return cb();
});



// Build production files, the default task
gulp.task('build', ['clean'], function (cb) {
	runSequence(
		//'fonts',
		'libs',
		'app',
		'copy-static',
		'copy-index',
		//'rebuildStatic',
		cb);
});

gulp.task('serve-debug', function (cb) {
	debugMode = true;
	runSequence('serve', cb);
});

gulp.task('serve', function (cb) {
	runSequence(
		'build',
		'watch',
		'live-server',
		cb);
});

gulp.task('clean', function(cb){
	del(['../dist/*', '!../dist/.git'],
		{dot: true, force: true},
		function (err, paths) {
			return cb();
		}
	);
});

gulp.task('live-server', function () {
	$.connect.server({
	//gulpConnect.server({
		root: debugMode ? distDebug : distRelease,
		fallback: (debugMode ? distDebug : distRelease)+'index.html',
		livereload: true,
		port:8081
	});
});
 
gulp.task('live-reload', function () {
	gulp.src('../dist/**/*')
		//.pipe(gulpConnect.reload());
		.pipe($.connect.reload());
});

gulp.task('publish', function (cb) {
	runSequence(
		'build',
		'clean-public',
		'copy-to-public',
		cb);
});

gulp.task('clean-public', function(cb){
	del([publishDir + '/*', '!' + publishDir + '/.git'],
		{dot: true, force: true},
		function (err, paths) {
			return cb();
		}
	);
});

gulp.task('copy-to-public', function () {
	return gulp
		.src(distRelease + '/**/*')
		.pipe(gulp.dest(publishDir))
});
