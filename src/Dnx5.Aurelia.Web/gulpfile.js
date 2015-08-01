/// <binding Clean='clean' ProjectOpened='watch' />

var gulp = require("gulp"),
	del = require("del"),
	runseq = require("run-sequence"),
	fs = require("fs"),
	browserSync = require("browser-sync"),
	tsc = require("gulp-typescript"),
	sass = require("gulp-sass"),
	sourcemaps = require("gulp-sourcemaps"),
	uglify = require("gulp-uglify"),
	merge = require("merge2");


eval("var project = " + fs.readFileSync("./project.json"));

var tsProject = tsc.createProject('tsconfig.json', { sortOutput: true });

var paths = {
	bower: "./bower_components/",
	lib: "./" + project.webroot + "/lib/",
	sass: {
		src: ["./assets/styles/**/*.scss"],
		dest: "./" + project.webroot + "/styles/"
	},
	ts: {
		src: ["./app/**/*.ts"],
		dest: "./" + project.webroot + "/app/"
	},
	publicRoot: "./" + project.webroot
};

// ** Watching ** //

gulp.task("watch", ["serve"], function () {

	gulp.watch(paths.sass.src, ["compile:sass", browserSync.reload]).on("change", reportChange);
	gulp.watch(paths.ts.src, ["compile:ts", browserSync.reload]).on("change", reportChange);

});

// ** Compile ** //

gulp.task("build", ["clean"], function (cb) {

	runseq(["compile:sass", "copy"], cb);

});


gulp.task("compile:sass", function () {
	gulp.src(paths.sass.src)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(paths.sass.dest));

});

gulp.task("compile:ts", function () {
	var tsResult = gulp
		.src(paths.ts.src)
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject));

	return merge([
		tsResult.js
			//.pipe(concat(paths.distFileName))
			.pipe(sourcemaps.write("."))
			.pipe(gulp.dest(paths.ts.dest))
	]);
});



gulp.task("clean", function (cb) {
	del([paths.lib, paths.sass.dest], cb);

});

gulp.task("copy", function () {
	var bower = {
		"bootstrap": "bootstrap/dist/**/*.{js,map,css,ttf,svg,woff,eot}",
		"bootstrap-touch-carousel": "bootstrap-touch-carousel/dist/**/*.{js,css}",
		"hammer.js": "hammer.js/hammer*.{js,map}",
		"jquery": "jquery/jquery*.{js,map}",
		"jquery-validation": "jquery-validation/jquery.validate.js",
		"jquery-validation-unobtrusive": "jquery-validation-unobtrusive/jquery.validate.unobtrusive.js"
	}

	for (var destinationDir in bower) {
		gulp.src(paths.bower + bower[destinationDir])
			.pipe(gulp.dest(paths.lib + destinationDir));
	}
});

// ** Serve ** //

gulp.task("serve", function (cb) {

	//browserSync({
	//	open: false,
	//	port: 9000,
	//	server: {
	//		baseDir: [paths.publicRoot],
	//		middleware: function (req, res, next) {
	//			res.setHeader("Access-Control-Allow-Origin", "*");
	//			next();
	//		}
	//	}
	//}, cb);
	browserSync({
		//open: false,
		// Using a localhost address with a port
		//proxy: "localhost:37084"
		// Proxy with middleware
		//proxy: {
		//	target: "localhost:37084",
		//	middleware: function (req, res, next) {
		//		//console.log(req.url);
		//		next();
		//	}
		//}
	}, cb);

});

function reportChange(event) {
	console.log("File " + event.path + " was " + event.type + ", running tasks...");
}