var _ = require('lodash');
var buildConfig = require('./scripts/build/config');
var fs = require('fs');
var gulp = require('gulp');
var karma = require('karma').server;
var path = require('path');
var VinylFile = require('vinyl');
var argv = require('yargs').argv;
var cached = require('gulp-cached');
var concat = require('gulp-concat');
var del = require('del');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var through2 = require('through2');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var exec = require('child_process').exec;
var babel = require('gulp-babel');
var traceur = require('gulp-traceur');
var webpack = require('gulp-webpack');
var lazypipe = require('lazypipe');



gulp.task('build', function() {
  runSequence(
    'clean',
    'ionic.copy.js',
    'ionic.examples',
    'sass',
    'fonts',
    'polyfills');
})

gulp.task('watch', function() {

  runSequence(
    'clean',
    'ionic.copy.js',
    'ionic.examples',
    'sass',
    'fonts',
    'polyfills',

    function() {
      watch('ionic/**/*.js', function(file) {
        var splt = file.path.split('/');
        var filename = splt[splt.length - 1];

        var dest = file.path.replace(__dirname, '../angular-ionic/modules');
        dest = dest.replace(filename, '')

        doubleCheckDistFiles();

        return gulp.src(file.path).pipe(gulp.dest(dest));
      });

      watch('ionic/components/*/test/**/*', function() {
        doubleCheckDistFiles();
        gulp.start('ionic.examples');
      });

      watch('ionic/components/**/*.scss', function() {
        gulp.start('sass');
      });
    })

});

function doubleCheckDistFiles() {
  if (!fs.existsSync('../angular-ionic/dist/js/dev/es5/css')) {
    gulp.start('sass');
  }

  if (!fs.existsSync('../angular-ionic/dist/js/dev/es5/fonts')) {
    gulp.start('fonts');
  }
}

gulp.task('clean', function(done) {
  del(['../angular-ionic/modules/ionic, ./angular-ionic/modules/examples/src/ionic, dist/'], done);
});

//gulp.task('ionic.copy.js', function(done) {
//  return gulp.src(['ionic/**/*.js', '!ionic/components/*/test/**/*'])
//             .pipe(gulp.dest('../angular-ionic/modules/ionic'));
//});
//
  var traceurOptions = {
    annotations: true,
    types: true,
    outputLanguage: 'es6'
  }

  var babelOptions = {
    optional: ['es7.decorators'],
    /*plugins: [
      './transformers/disable-define',
      'angular2-annotations',
      'type-assertion:after'
    ],*/
    modules: "system"
  };

gulp.task('ionic.traceur.es6', function(done) {
  return gulp.src(['ionic/**/*.js', '!ionic/components/*/test/**/*'])
             .pipe(traceur(traceurOptions))
             //.pipe(concat('ionic.bundle.js'))
             .pipe(gulp.dest('dist/ionic'));
});

gulp.task('ionic.examples', function() {
  var buildTest = lazypipe()
             .pipe(traceur, traceurOptions)
             .pipe(babel, babelOptions)
           
  // Get each test folder with gulp.src
  return gulp.src('ionic/components/*/test/*/**/*')
    .pipe(gulpif(/.js$/, buildTest()))
    .pipe(gulpif(/index.js$/, createTest()))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulp.dest('dist/examples/'))

  function createTest() {
    var indexContents = _.template( 
      fs.readFileSync('scripts/e2e/ionic.template.html')
    )({
      buildConfig: buildConfig
    });

    return through2.obj(function(file, enc, next) {
      // debugger;
       //var Builder = require('systemjs-builder');
       //var builder = new Builder();
       //builder.loadConfig('config.js').then(function(){
       //builder.config(systemjsConfig);
        // builder.build('index'/*, path.join(path.dirname(file.path), 'index.js')*/).then(function(){
           var self = this;
           self.push(new VinylFile({
             base: file.base,
             contents: new Buffer(indexContents),
             path: path.join(path.dirname(file.path), 'index.html'),
           }));
           next(null, file);
         //});
      //})
    });
  }
});


gulp.task('build.system.js', function() {
  var Builder = require('systemjs-builder');
  var builder = new Builder();
  builder.loadConfig('config.js').then(function(){
    //builder.config(systemjsConfig);
    return builder.build('index', 'index.js');
  })
});


gulp.task('sass', function() {
  return gulp.src('ionic/ionic.scss')
    .pipe(sass({
      onError: function(err) {
        console.log(err)
      }
    }))
    .pipe(autoprefixer(buildConfig.autoprefixer))
    .pipe(gulp.dest('../angular-ionic/dist/js/dev/es5/css'));
});


gulp.task('fonts', function() {
  return gulp.src('ionic/components/icon/fonts/**/*')
    .pipe(gulp.dest('../angular-ionic/dist/js/dev/es5/fonts'));
});


gulp.task('polyfills', function() {
  return gulp.src('ionic/animations/web-animations*')
    .pipe(gulp.dest('../angular-ionic/dist/js/dev/es5/polyfills'));
});


gulp.task('update.angular', function(done) {

  if (!fs.existsSync('../angular-ionic')) {
    fs.mkdirSync('../angular-ionic');

    console.log('cloning angular master...');
    exec('git clone git@github.com:angular/angular ../angular-ionic', function() {
      npmInstall();
    });

  } else {
    console.log('angular master: cleaning modules');
    del(['../angular-ionic/modules'], function() {

      console.log('angular master: reset --hard...');
      exec('git reset --hard origin/master', {cwd: '../angular-ionic'}, function () {

        console.log('angular master: git pull origin master...');
        exec('git pull origin master', function () {
          npmInstall();
        });
      });

    })
  }

  function npmInstall() {
    console.log('angular master: npm install (may take a while, chill out)...');
    exec('npm install', {cwd: '../angular-ionic'}, function () {
      done();
    });
  }

});



require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);


// gulp.task('watch', ['default'], function() {
//   gulp.watch(buildConfig.src.scss, ['sass'])
//   gulp.watch([].concat(
//     buildConfig.src.js, buildConfig.src.html,
//     'scripts/e2e/index.template.html'
//   ), ['e2e'])
//   gulp.watch([].concat(
//     buildConfig.src.e2e, buildConfig.src.html,
//     'scripts/e2e/index.template.html'
//   ), ['ionic-js'])
// });

gulp.task('karma', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma.conf.js' })
});

gulp.task('karma-watch', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma-watch.conf.js' })
});

gulp.task('e2e', ['sass'], function() {
  var indexContents = _.template( fs.readFileSync('scripts/e2e/index.template.html') )({
    buildConfig: buildConfig
  });
  var testTemplate = _.template( fs.readFileSync('scripts/e2e/e2e.template.js') )

  var platforms = [
    'android',
    'core',
    'ios',
  ];

  gulp.src(['ionic/**/*.js'])
           .pipe(gulp.dest('dist/src'));

  // Get each test folder with gulp.src
  return gulp.src(buildConfig.src.e2e)
    .pipe(cached('e2e'))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulpif(/main.js$/, processMain()))
    //.pipe(gulpif(/e2e.js$/, createPlatformTests()))
    .pipe(gulp.dest(buildConfig.dist + '/e2e'));

    function processMain() {
      return through2.obj(function(file, enc, next) {
        var self = this;
        self.push(new VinylFile({
          base: file.base,
          contents: new Buffer(indexContents),
          path: path.join(path.dirname(file.path), 'index.html'),
        }));
        next(null, file);
      })
    }

    function createPlatformTests(file) {
      return through2.obj(function(file, enc, next) {
        var self = this
        var relativePath = path.dirname(file.path.replace(/^.*?ionic(\/|\\)components(\/|\\)/, ''))
        var contents = file.contents.toString()
        platforms.forEach(function(platform) {
          var platformContents = testTemplate({
            contents: contents,
            buildConfig: buildConfig,
            relativePath: relativePath,
            platform: platform
          })
          self.push(new VinylFile({
            base: file.base,
            contents: new Buffer(platformContents),
            path: file.path.replace(/e2e.js$/, platform + '.e2e.js')
          }))
        })
        next()
      })
    }

});
