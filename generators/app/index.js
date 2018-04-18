'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // 拥有一个Yeoman图形欢迎
    this.log(yosay(
      'Welcome to the impressive ' + chalk.red('generator-ys') + ' generator!'
    ));

    //promts是问题集合，在调用this.promt使其在运行yo的时候提出来
  return this.prompt([{
      type    : 'input',
      name    : 'appname',
      message : 'give Your project a name',
      default : this.appname     //appname是内置对象，代表工程名，这里就是ys
    }, {
      type    : 'confirm',
      name    : 'cool',
      message : 'Would you like to enable the Cool feature?'
    },
    {
        type: 'input',
        name: 'projectDesc',
        message: 'Please input project description:'
      },
      {
        type: 'list',
        name: 'projectLicense',
        message: 'Please choose license:',
        choices: ['MIT', 'ISC', 'Apache-2.0', 'AGPL-3.0']
      },
    {
       type    : 'input',
       name    : 'username',
       message : 'What\'s your GitHub username',    //里面的单引号需要转义
       store   : true
     }
    //打印出answers回复内容
    ]).then((answers) => {
      this.log('appname ：', answers.appname);
      this.log('cool feature ：', answers.cool);
      this.log('username ：', answers.username);
      this.log('projectDesc ：', answers.projectDesc);
      this.log('projectLicense ：', answers.projectLicense);

      //最后将用户输入的数据存在this.props中，以方便后面调用。
      this.props = answers;
    })
  }

  defaults () {           //判断工程名同名文件夹是否存在，不存在则自动创建
    if (path.basename(this.destinationPath()) !== this.props.appname) {
      this.log(
        'Your generator must be inside a folder named ' + this.props.appname + '\n' +
        'I\'ll automatically create this folder.'
      );
      //mkdirp是我们引用的模块，用来创建文件夹,此时没有设置项目根目录，则在当前目录创建
      mkdirp(this.props.appname);
      //this.destinationRoot则是设置要创建的工程的根目录为工程名文件夹。
      this.destinationRoot(this.destinationPath(this.props.appname));
    }
  }

  writing() {
    mkdirp('css');
    mkdirp('js');
    this.fs.copy(
      this.templatePath('public/index.html'),
      this.destinationPath('index.html'),
      { title: '输入活动名称' }   
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

  install() {
    this.npmInstall(['lodash'], { 'save-dev': true });
    this.npmInstall(['jquery'], { 'save-dev': true });
  }
};
