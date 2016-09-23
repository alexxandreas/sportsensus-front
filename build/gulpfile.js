var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
//var gulpConnect = require('gulp-connect');
//var templateCache = require('gulp-angular-templatecache');
var del = require('del');

var appJs = ['../src/app/**/_*.js','../src/app/**/*.js']; // not include config.js 
var appCss = ['../src/app/**/_*.less', '../src/app/**/*.less'];
var appViews = ['../src/app/**/*.html']; // not include index.html 

//var watchStatic_ = ['../src/**/*.{html,scss,less,css,svg}'];
var statics = ['../src/static/**/*']; // статика
var index = '../src/index.html';
var debugConfig = '../src/config_debug.js';
var releaseConfig = '../src/config_release.js';
//var index = ['../src/index.html', '../src/config.js']; // файлы, копируемые в dist напрямую

var debugMode = false;
var distDebug = '../dist/debug/';
var distRelease = '../dist/release/';

var libJs = [
	//'../libs/leaflet/dist/leaflet-src.js',
	'../libs/angular/angular.js',
	'../libs/angular-animate/angular-animate.js',
	'../libs/angular-aria/angular-aria.js',
	'../libs/angular-material/angular-material.js',
	'../libs/angular-route/angular-route.js',
	'../libs/angular-cookies/angular-cookies.js',
	'../libs/d3-3.5.6.min.js',
	'../libs/radarChart.js',
	'../libs/Chart.1.1.1.js',
	'../libs/Chart.StackedBar.js'
	

];
var libCss = [
	'../libs/angular-material/angular-material.css'
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
		port:9087
	});
});
 
gulp.task('live-reload', function () {
	gulp.src('../dist/**/*')
		//.pipe(gulpConnect.reload());
		.pipe($.connect.reload());
});

