"use strict";

const gulp = require("gulp");
const request = require("request");
const inquirer = require("inquirer");
const config = require("config");
const fs = require("fs-extra");
const hi = require("./src/controller/genHeader.js");

const src = ["src/**/*.js","!node_modules/**"];
const dist = "./dist";
const compiled = [dist + "/*.js"];

 // Include gulp plugins - See http://andy-carter.com/blog/automatically-load-gulp-plugins-with-gulp-load-plugins
const plugins = require("gulp-load-plugins")();


/**
 *
 * Local functions
 *
 **/
const Validate = function(variable, type, max) {
    if (/^\d*$/.test(variable)) {
        if (variable >= 0 && variable <= max) {
            return true;
        }
        else {
            console.log(`\n -- INValid ${type} # Entered - ${variable} (number must be between 0 and ${max}, inclusive)`);
        }
    }
    else {
        console.log(`\n -- INValid ${type} # Entered - ${variable} (must be a number between 0 and ${max}, inclusive)`);
    }
    return false;
};

const questions = [
  {
    type: "input",
    name: "ver",
    message: "What version (0-15)",
    validate: function(value) {
        return Validate(value, "Version", 15);
    }
  },
  {
    type: "input",
    name: "oc",
    message: "What OC (0-31)",
    validate: function(value) {
        return Validate(value, "OC", 31);
    }
  }
];

/**
 *
 * Individual Task Processing functions
 *
 **/
const PostWithData = function(done) {
    var done2 = function() {
        // Used to indicate completeness of the process...
    }
    inquirer.prompt(questions).then(function (answers) {
        var theData = hi.genHeader(answers);
        var URL = config.get("OMA_DM.protocol") + config.get("OMA_DM.host") + ":" + config.get("OMA_DM.port") + config.get("OMA_DM.baseRoute");

        request.post({
            headers: {"content-type" : "application/octet-stream"},
            url:     URL,
            body:    theData
        }, function(error, response, body){
            if (response) {
                console.log(`Received from server - Status Code ${response.statusCode}; Message ${body}`);
            }
            else if ("ECONNREFUSED" === error.code) {
                console.log("No Response from Server");
            }else {
                console.log(error.code);
            }
        });
        done2();
    });
};


const PostNoData = function() {
    var thePort = config.get("OMA_DM.port");
    var theRoute = config.get("OMA_DM.baseRoute");
    var URL = `http://localhost:${thePort}${theRoute}`;
    request.post({ 
        "url" : URL,
        "headers": {"content-type" : "application/octet-stream"}
    }, 
    function(error, response, body){
        console.log("Sent NO Data to server");
        if (response) {
            console.log(`Received from server - Status Code ${response.statusCode}; Message ${body}`);
        }
        else if ("ECONNREFUSED" === error.code) {
            console.log("No Response from Server");
        }else {
            console.log(error.code);
        }
    });
};

const get = function() {
    var thePort = config.get("OMA_DM.port");
    var theRoute = config.get("OMA_DM.baseRoute");
    var URL = `http://localhost:${thePort}${theRoute}`;
    request.get({ 
        "url" : URL 
    }, 
    function(error, response, body){
        console.log("GETting Data from server");
        if (response) {
            console.log(`Received from server - Status Code ${response.statusCode}; Message ${body}`);
        }
        else if ("ECONNREFUSED" === error.code) {
            console.log("No Response from Server");
        }else {
            console.log(error.code);
        }
    });
};

const lint = function() {
    console.log("Checking Source Code for Lint");
    fs.ensureDirSync("reports");
    return gulp.src(src)
    .pipe(plugins.eslint({config: ".eslintrc"}))
    .pipe(plugins.eslint.format("html", fs.createWriteStream("reports/LintReport.html")))
    .pipe(gulp.dest(dist))
    .pipe(plugins.notify({ message: "LINT task complete, saving report in 'reports/LintReport.html'.", onLast:true }));
};

const logging = function() {
    console.log("Removing logging code from source");
    return gulp.src(src)
    .pipe(plugins.removeLogging({}))
    .pipe(gulp.dest(dist))
    .pipe(plugins.notify({ message: "REMOVE LOGGING task complete, saving modified source in " + dist, onLast:true }));
};

const prettify = function() {
    return gulp.src(dist)
    .pipe(plugins.prettify())
    .pipe(gulp.dest(dist))
    .pipe(plugins.notify({ message: "BEAUTIFY task complete, saving modified source in " + dist, onLast:true }));
};


const MochaTest = function() {
    console.log("Running Tests...");
    return gulp.src('tests/test2.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(plugins.mocha({reporter: 'good-mocha-html-reporter', savePath: 'reports', filename: 'TestsReport.html'}));
};

const forever = function() {
  var foreverMonitorOptions = { 
    "env": process.env,
    "args": process.argv,
    "sourceDir": "src",
    "watch": true,
    "watchIgnorePatterns":  [".*", "*.bak", "node_modules/**", "public/**", "temp/**"]
  }
  
  plugins.foreverMonitor('index.js', foreverMonitorOptions)
  .on('watch:restart', function(fileInfo) { 
    console.log('server was restarted');
  })
  .on('exit', function() {
    console.log('server was closed');
  });
};

/**
 *
 * The Tasks
 *
 **/

gulp.task("test", function() {
    MochaTest();
});

gulp.task("lint", function(){ 
    lint(); 
});

gulp.task("logging", function(){ 
    logging(); 
});

gulp.task("post", function(){
    PostWithData();
});

gulp.task("postND", function(){ 
    PostNoData(); 
});

gulp.task("get", function(){ 
    get(); 
});

gulp.task("prettify", ['logging'], function() {
    prettify();
});


gulp.task('run:server', function() {
    forever();
});





gulp.task('default', function(done) {
    var promptData = {
        "type" : "list",
        "name" : "action",
        "message" : "Select the action to perform",
        "default" : 0,
        "choices" : [
            "Lint - Perform lint check on source code",
            "Build - Remove all console logging and push modified source to dist folder",
            "Post - Prompt for info and issue POST passing binary data to OMA Server",
            "PostND - Simple post with NO data to OMA Server",
            "Get - Issue a simple get to the OMA server",
            "Test - Run mocha test scripts",
            "Forever - Launch the server, restart if src files change"
        ],
        filter: function(answer) {
            return answer.substring(0,answer.indexOf(' '));
        }
    };
    inquirer.prompt([promptData]).then(function(answer) {
        switch(answer.action) {
            case "Lint":
                lint();
                done();
                break
            case "Build":
                logging();
                done();
                break
            case "Post":
                PostWithData();
                break
            case "PostND":
                PostNoData();
                done();
                break
            case "Get":
                get();
                done();
                break
            case "Test":
                MochaTest();
                done();
                break
            case "Forever":
                forever();
                done();
                break
        }
    });
});



