var gulp = require('gulp');
var watch = require('gulp-watch');

gulp.task('lint', function () {
	var eslint = require('gulp-eslint');

	return gulp.src(['index.js', 'test/*.js', 'gulpfile.js'])
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError());
});

gulp.task('test', function () {
	var mocha = require('gulp-mocha');

	return gulp.src('test/*.js', { read: false }).pipe(mocha());
});

gulp.task('watch', function () {
	watch(['index.js', 'test/*.js', 'gulpfile.js'], function () {
		var eslint = require('gulp-eslint');

		return gulp.src(['index.js', 'test/*.js', 'gulpfile.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
	});
});

gulp.task('default', ['lint', 'test']);
