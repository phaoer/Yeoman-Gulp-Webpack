# generator-xy v1.0.0
前端工程化架构，优化工作流，提升开发效率**Create By Pwh**
## 一. 前言
>Yeoman：前端脚手架，快速搭建前端开发环境，优化工作流~
Gulp：工程化构建工具，基于task来处理任务
Webpack：最常见的前端构建工具，类似与gulp，但不如gulp灵活，专注于代码打包编译

OK，主人公们介绍完了，该篇主要说明三个工具的基本用法，安装配置自己解决。

## 二. Yeoman
>Q:
i.在写东西的时候经常会遇到一些重复性的操作和代码，苦于Ctrl+c
ii.人数较多的前端团队10个人拥有十种代码风格，十种项目结构，后期维护及其繁琐

——使用Yeoman 达到One Code Style One Directory Structure

#### 1.安装:

    $ cnpm install -g yo

#### 2.使用：
    yeoman 提供很多generator，可以直接使用

    $ mkdir project-name
    $ cd project-name
    $ yo
    
按照提示选择需要的模板就行了，这里主要说一说怎么私人订制~~~嘻嘻

#### 3.创建自己的generator
yeoman官方提供了generator-generator 来帮助我们自定义生成器，良心啊~~~

    $ cnpm install -g generator-generator
    $ yo generator

然后你的根目录下就会生成如下结构：
![1.png](https://upload-images.jianshu.io/upload_images/7003250-a1d9f03710779de9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
我们需要做的就是在index.js中来创造我们自己的generator
     
     'use strict';
     const Generator = require('yeoman-generator');
     const chalk = require('chalk');
     const yosay = require('yosay');

     module.exports = class extends Generator {
     prompting() {
          // Have Yeoman greet the user.
         this.log(
         yosay(`Welcome to the tiptop ${chalk.red('generator-xy')} generator!`)
     );

    const prompts = [
      {
        type: 'confirm',
        name: 'someAnswer',
        message: 'Would you like to enable this option?',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
    }

    writing() {
     this.fs.copy(
       this.templatePath('dummyfile.txt'),
       this.destinationPath('dummyfile.txt')
     );
    }

    install() {
      this.installDependencies();
     }
    };

可以看到核心的流程是在一个继承了generator的类当中
其实这里generator一共提供了 initializing，prompting，configuring，default，writing，conflicts，install，end这几个函数
>Prompting()方法是执行前的过渡，实现与用户的交互，你可以在prompts问题集中定义一些问题，比如你叫啥，干啥，弄啥，家里几口人，人均几亩地...........然后将用户输入的内容保存在this.props中，方便以后调用。

我们自己来写一个

    prompting() {
          // Have Yeoman greet the user.
         this.log(
         yosay(`Welcome to the tiptop ${chalk.red('generator-xy')} generator!`)
     );
    return this.prompt([{
      type    : 'input',
      name    : 'appname',
      message : 'input your project  name',
      default : this.appname     
    }
    ]).then((answers) => {
      this.log('appname ：', answers.appname);
      this.props = answers;
    })
    }

在后面的方法中，我们便可以通过this.props.appname来获取到输入的项目名称

我们在原来的基础上定义一个defaults方法来生成用户输入的目录

    const path = require('path');
    const mkdirp = require('mkdirp');

    defaults () {           
    if (path.basename(this.destinationPath()) !== this.props.appname) { //判断是否存在该目录
      this.log(
        'Your generator must be inside a folder named ' + this.props.appname + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.appname); // 即 mkdir -p 创建该目录
      this.destinationRoot(this.destinationPath(this.props.appname));
    }
    }

writing方法用来书写创建工程文件的步骤
在这之前我们首先在template文件夹下创建一个public目录，里面创建如下文件作为咱们这个初级教程的全部内容
![2.png](https://upload-images.jianshu.io/upload_images/7003250-9e439c836dee1404.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

开始写writing方法

    writing() {
    mkdirp('css');      //创建css文件夹
    mkdirp('js');      //创建js文件夹
    this.fs.copy(     //调用方法将模板的内容创建到根目录
      this.templatePath('public/index.html'),       //模板文件地址 
      this.destinationPath('index.html'),          //创建在根目录
    ),

    this.fs.copy(
      this.templatePath('public/index.css'),
      this.destinationPath('css/index.css')
    );

    this.fs.copy(
      this.templatePath('public/index.js'),
      this.destinationPath('js/index.js')
    );
  }

最后install方法，官方的api说的很清楚this.installDependencies()，即是用来安装我们项目依赖的

    install() {
      this.npmInstall(['jquery'], { 'save-dev': true });
    }

这里就安装一个jquery作为说明即可。
最后我们在根目录执行

     $ npm link
这样我们就可以在全局使用该generator了
然后切换到开发目录，执行
      
     $ yo xy

按照步骤，最后我们生成的开发目录的结构如下

![3.png](https://upload-images.jianshu.io/upload_images/7003250-3fe52643c1bf9f34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后你就可以开始编码了，so easy今后所有这种类型的项目一个命令几秒钟就可以开始愉快的编码，而且代码风格统一~~~

## 三.  Gulp+Webpack
>这里把Gulp和Webpack放到一起来说。
博主最早是只用了webpack来构建自己的项目，后来加入Gulp对其进行整合，发现配合食用，口感更佳呀
核心依然是plugin

#### !Webpack出口文件即Gulp入口文件

这里也只是讲如何写一个初略的gulpfile.js

核心便是task,src,start,watch等api，详细说明见官网[Gulp Api](https://www.gulpjs.com.cn/docs/api/)
基本工作流程：
i. 通过gulp.src()方法获取到我们想要处理的文件流([Vinyl files](https://github.com/wearefractal/vinyl-fs) 的 [stream](http://nodejs.org/api/stream.html))，
ii. 把文件流通过pipe方法导入到gulp的插件中进行处理，比如调用concat方法合并所有css，再调用minify()压缩css。（具体插件用法，[npm官网](https://www.npmjs.com/)均有介绍）
iii. 把处理后的流再通过pipe方法导入到gulp.dest()中，最后把流中的内容写入到文件中

项目结构
     ![4.png](https://upload-images.jianshu.io/upload_images/7003250-b2ebfec4ee375661.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### gulpfile.js

    //加载外挂：自动瞄准，无后座，锁血，大挪移.......~~~
    var gulp = require('gulp'),
    minify=require('gulp-minify-css');
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    fileinclude = require('gulp-file-include'),
    webpack = require('gulp-webpack');

    gulp.task('css', function() {
    gulp.src('src/css/*.css')
        .pipe(concat('main.css'))
        .pipe(minify())
        .pipe(gulp.dest('dist/css'));
    })

    gulp.task('scripts', function() {
    return gulp.src('src/entry.js')
      .pipe(webpack( require('./webpack.config.js') ))
      .pipe(gulp.dest('dist/js'));
    });

    gulp.task('images', function() {
    return gulp.src('src/images/**/*')
      .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
      .pipe(gulp.dest('dist/images'))
      .pipe(notify({ message: 'Images compile complete' }));
    });

    gulp.task('html', function() {
    return gulp.src('src/**/*.html')
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest('dist/'))
      .pipe(notify({ message: 'html compile complete' }));
    });

    gulp.task('clean', function() {
       return gulp.src(['dist/css', 'dist/js', 'dist/images'], {read: false})
       .pipe(clean());
    });

    gulp.task('default', ['clean'], function() {
       gulp.start('css','scripts', 'images', 'html');
    });


    gulp.task('watch', function() {

       gulp.watch('src/css/**/*.css', ['css']);

       gulp.watch('src/js/**/*.js', ['scripts']);

       gulp.watch('src/images/**/*', ['images']);

       gulp.watch('src/**/*.html', ['html']) ;
   
       livereload.listen();
       gulp.watch(['dist/**']).on('change', livereload.changed);

    });

##### 1.插件的话按需自取，这里我用的插件是包含了处理所有文件的。可以酌情增减
##### 2.gulp.task第一个参数为任务名，gulp task-name 即可执行对应的任务，这里需要解释的就是对于js的处理。刚才说过webpack的出口文件就是gulp的入口文件，这里我们用到了gulp-webpack包来优化。
##### 3.在默认任务这里执行编译之前调用gulp.clean清空上一次的编译结果
##### 4.这里使用了livereload插件，需要配置Chrome（美中不足，显然没有webpack-dev-server实在啊）
##### 5.运行
     
     $ gulp
     $ gulp watch




# The Relentless Pursuit of Perfection 持续更新中


     































    
