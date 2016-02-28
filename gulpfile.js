/**
 * Created by laixiangran on 2016/1/13.
 * homepage：http://www.cnblogs.com/laixiangran/
 * gulpfile.js == gulp config file
 */

var gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"), // css自动添加前缀׺
    minifycss = require("gulp-minify-css"), // 压缩css
    jshint = require("gulp-jshint"), // 校验js
    uglify = require("gulp-uglify"), // 压缩js
    rename = require("gulp-rename"), // 文件重命名
    concat = require("gulp-concat"), // 合并文件
    notify = require("gulp-notify"), // 任务消息提醒
    livereload = require("gulp-livereload"), // 自动刷新页面
    clean = require("gulp-clean"); // 清理文件

gulp.task("scripts", function() {
    return gulp.src("src/*.js")
        .pipe(jshint.reporter("default"))
        .pipe(concat("common.js"))
        .pipe(gulp.dest("dist/"))
        .pipe(rename({
            prefix: "",
            suffix: ".min"
        }))
        .pipe(uglify())
        .pipe(gulp.dest("dist/"))
        .pipe(notify({
            message: "Scripts task complete"
        }));
});

gulp.task("clean", function() {
    return gulp.src("dist/", {read: false})
        .pipe(clean());
});

gulp.task("default", ["clean"], function() {
    gulp.start("scripts");
});

gulp.task("watch", function() {
    gulp.watch("src/*.js", ["scripts"]);
    livereload.listen();
    gulp.watch(["dist/**"]).on("change", livereload.changed);
});