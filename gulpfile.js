var gulp = require('gulp'),

// Pour javascript
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),

// Pour Sass et Css
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),

// Pour les images
imagemin = require('gulp-imagemin'),

// Pour les sprites
spritesmith = require('gulp.spritesmith'),

// BrowserSync
browserSync = require('browser-sync').create();




// ENVIRONEMENT 
/* --------------------
---------------------- */

var base_dir = 'src_dev/';

var path = {
  
  // JAVASCRIPT --------------------------
  js                  : base_dir + 'js/*.js',
  
  
  // SASS --------------------------------
  sassWatch           : base_dir + 'sass/**/*.scss',
  sass                : base_dir + 'sass/style.scss',
  
  
  // IMAGE  ------------------------------
  image               : base_dir + 'images/*.*',
  
  
  // SPRITES  ----------------------------
  sprite              : base_dir + 'sprites/sprites/*.png',
  spriteTemplate      : base_dir + 'sass/config/_sprites.scss.handlebars',
  
  spritefull          : base_dir + 'sprites/spritesfull/*.png',
  spritefullTemplate  : base_dir + 'sass/config/_spritesfull.scss.handlebars',
};

var output = {
  
  // JAVASCRIPT --------------------------
  jsName            : 'main.min.js',
  jsFolder          : 'js',
  
  
  // SASS --------------------------------
  sass              : '.', // style.css to racine


  // IMAGE  ------------------------------
  image             : 'images',
  

  // SPRITES  ----------------------------
  spriteFolder      : 'sprites',
  
  spriteName        : 'sprite.png',
  spriteCssName     : '../src_dev/sass/modules/sprites/_sprite.scss',
  
  spritefullName    : 'spritefull.png',
  spritefullCssName : '../src_dev/sass/modules/sprites/_spritefull.scss',
}



// Serve
/* --------------------
Utilisation en direct de tous les modules
---------------------- */

  // ---    Start server
  gulp.task('serve', ['browser-serve','watch-js', 'watch-sass', 'watch-sprite','watch-spritefull', 'browser-onchange']);
  
  // ---    Start proxy + watch js/sass + browzer sync ------
  gulp.task('proxy', ['browser-proxy','watch-js', 'watch-sass', 'watch-sprite','watch-spritefull', 'browser-onchange']);

// Browser sync
/* --------------------
actualisation et mise à jour automatique des navigateurs
---------------------- */

// Static server
gulp.task('browser-serve', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Proxy
gulp.task('browser-proxy', function() {
    browserSync.init({
        proxy: "yourlocal.dev"
    });
});

//change
gulp.task('browser-onchange', function(){
  gulp.watch('*.html').on('change', browserSync.reload);
});


// JS optimisation 
/* --------------------
Concaténation et uglify les fichiers js à chaque 
modification

=> watch-js : Ecoute et opimise à chaque modification.
=> js : Optimise une seul fois à la demande. 
---------------------- */

gulp.task('watch-js', function(){
  gulp.watch( path.js , ['js']);
});

gulp.task('js', function() {
  return gulp.src( path.js )
    .pipe(uglify())
    .pipe(concat(output.jsName))
    .pipe(gulp.dest(output.jsFolder));
});




// SCSS : Traitement et Optimisation 
/* --------------------
Conversion, Concaténation et préfixage des fichiers scss en css à chaque 
modification

=> watch-sass : Ecoute et opimise à chaque modification.
=> sass : Optimise une seul fois à la demande. 
---------------------- */

gulp.task('watch-sass', function(){
  gulp.watch( path.sassWatch , ['sass']);
});

gulp.task('sass', function() {
  return gulp.src( path.sass )
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest( output.sass ));
});



// Images : Traitement et Optimisation 
/* --------------------
Conversion, Concaténation et préfixage des fichiers scss en css à chaque 
modification

=> watch-sass : Ecoute et opimise à chaque modification.
=> sass : Optimise une seul fois à la demande. 
---------------------- */

gulp.task('watch-image', function(){
  gulp.watch( path.image , ['image'])
});

gulp.task('image', function () {
    return gulp.src( path.image )
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest( output.image ));
});



// Sprites : Traitement et Optimisation 
/* --------------------
Création de sprites à partir d'une librairie d'images

=> watch-sprite / watch-spritefull : Ecoute et opimise à chaque modification des dossier.
=> sprite, spritefull : Optimise une seul fois à la demande. 
---------------------- */

gulp.task('watch-sprite', function(){
  gulp.watch( path.sprite , ['sprite'])
});

gulp.task('sprite', function () {
  var spriteData = gulp.src( path.sprite ).pipe(spritesmith({
    imgName: output.spriteName ,
    cssName: output.spriteCssName,
    cssTemplate: path.spriteTemplate,
  }));
  
  var imageStream = spriteData.img
      .pipe(imagemin())
      .pipe(gulp.dest('sprites'));

  return imageStream;
});


gulp.task('watch-spritefull', function(){
  gulp.watch( path.spritesfull , ['spritefull'])
});


gulp.task('spritefull', function () {
  var spriteData = gulp.src( path.spritefull ).pipe(spritesmith({
    imgName: output.spritefullName,
    cssName: output.spritefullCssName,
    cssTemplate: path.spritefullTemplate,
  }));

    var imageStream = spriteData.img
      .pipe(imagemin())
      .pipe(gulp.dest( output.spriteFolder ));

  return imageStream;
});