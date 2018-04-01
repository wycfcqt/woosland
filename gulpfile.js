const gulp = require('gulp');
// compile sass/scss
const sass = require('gulp-sass');
// 显示通知
const notify = require('gulp-notify');
// postcss
const postcss = require('gulp-postcss');
const autoPrefixer = require('autoprefixer');
const cssnano = require('cssnano');
// 删除文件
const del = require('del');
// 压缩js之前eslint下
const eslint = require('gulp-eslint');
// 压缩js
const uglify = require('gulp-uglify');
// 重命名
const rename = require('gulp-rename');
// 插件 cssnano暂时不使用
// 'last 4 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ff > 10'
// 'last 5 versions', 'safari 5', 'not ie < 8', 'opera 12.1', 'ff > 20'
// 'last 5 versions', 'safari 5', 'not ie < 8', 'opera 12.1'
const plugins = [
  autoPrefixer({add: true, browsers: ['> 0.05%', 'not ie <= 8', 'opera >= 12.1', 'ff > 10']}),
  cssnano()
];
// 实时刷新
const browserSync = require('browser-sync');
const reload = browserSync.reload;
// 给url添加MD5文件版本号
const cssVer = require('gulp-make-css-url-version');
// 压缩图片
const imageMin = require('gulp-imagemin');
// 另外一个压缩图片
const smushit = require('gulp-smushit');
gulp.task('images', function () {
  return gulp.src('assets/tmpimgs/*.+(png|jpg|jpeg|gif|svg|)')
    .pipe(imageMin({
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: false, //类型：Boolean 默认：false 无损压缩jpg图片
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(gulp.dest('assets/tmpimgsmin'));
});
gulp.task('images2', function () {
  return gulp.src('assets/tmpimgs/*.{jpg,png}')
    .pipe(smushit({
      verbose: true
    }))
    .pipe(gulp.dest('assets/tmpimgsmin/'))
    .pipe(notify({message: 'jpg or png images min done!!'}));
});
// 编译sass文件
gulp.task('sass', ['clean:assets'], function () {
  return gulp.src(['./assets/sass/*.scss', './assets/sass/**/*.scss'])
  // nested 继承 compact 紧凑 expanded 展开 compressed 压缩
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(cssVer({
      useDate: true
    }))
    .pipe(gulp.dest('./assets/style/'));
  // .pipe(notify({ message: 'sass is done!' }))
});
gulp.task('sass:watch', function () {
  gulp.watch('./assets/sass/**/*.scss', ['sass']);
});
// 清空
gulp.task('clean:assets', function () {
  // return del(['assets/style'])
});
gulp.task('default', ['clean:assets']);
// 监视 less 文件的改动，如果发生变更，运行 'less' 任务，并且重载文件
const fileList = [
  './assets/sass/*.scss',
  './pages/*.html',
  './assets/js/*.js'
];
gulp.task('serve', function () {
  browserSync({
    port: 8123,
    server: {
      baseDir: './'
    }
  });
  gulp.watch(fileList).on('change', reload);
});
gulp.watch('./assets/sass/*.scss', ['sass']);
gulp.task('default', ['serve']);
gulp.task('eslint', function () {
  return gulp.src(['assets/js/*.js', 'm/assets/js/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
gulp.task('compress', function () {
  return gulp.src(['assets/js/*.js', './m/assets/js/*.js', '!node_modules/**']);
});
/*
 *
 Myanmar3,yunghkio,ZawgyiOne,Arial,Helvetica,sans-serif!important
 */