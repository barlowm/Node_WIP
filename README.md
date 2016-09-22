# Node Express Template
Taken from the OMA Tech Evaulation task for Thorn Technologies.
The basics are an Node JS Express Server but split into multiple files and folders (as necessary) which goes beyond what most of the existing demos out there show (which is all the routes in the same file and part of the same function).

It also has an example GULP file that prompts for and performs the different tasks as necessary.

**ToDo**<br> 
* Need to enhance the gulp tasks to include other static analysis and consolidation processes.<br>
* Add "watch" functionality in build/run process
* Keep the binary code processing that's there for the OMA Package #0 header but separate it so that it's not primary.<br>
* Break the file structure down even further.<br>
	* Try to come up with a method of bundling all the individual files into a single JS file but need to figure out a way to ensure that the multiple "require()" statements within the different files don't mess up the ***CAT*** process.<br>
	* Try and come up with a process that would allow gulp to launch the server using forever or nodemon but to have the server task keep running in the background (want to still be able to run other tasks in the same command window while the server task is still running).



##Don't use [console.log](https://www.toptal.com/nodejs/top-10-common-nodejs-developer-mistakes#mistake-9-using-consolelog-for-debugging-purposes) 
In Node.js, “console.log” allows you to print almost anything to the console. Pass an object to it and it will print it as a JavaScript object literal. It accepts any arbitrary number of arguments and prints them all neatly space-separated. There are a number of reasons why a developer may feel tempted to use this to debug his code; however, it is strongly recommended that you avoid “console.log” in real code. You should avoid writing “console.log” all over the code to debug it and then commenting them out when they are no longer needed. Instead, use one of the amazing libraries that are built just for this, such as [debug](https://www.npmjs.com/package/debug).

Packages like these provide convenient ways of enabling and disabling certain debug lines when you start the application. For example, with debug it is possible to prevent any debug lines from being printed to the terminal by not setting the DEBUG environment variable. Using it is simple:

// app.js
var debug = require(‘debug’)(‘app’)
debug(’Hello, %s!’, ‘world’)
To enable debug lines, simply run this code with the environment variable DEBUG set to “app” or “*”:

DEBUG=app node app.js
 

----------
##ORIGINAL OMA Readme<br>



Sample OMA_DM Server that returns a Package #0

This has been tested using Node.JS version 5.7.0

**To install:**<br>
From a windows command line prompt run:<br>
- npm install

Once the node modules have been installed there are several GULP tasks which can be run from the command line prompt by typing "**gulp**":<br>
- **Lint** Perform lint check on source code (the result is in the reports folder, LintReport.html)<br>
- **Build** Remove all console logging and push modified source to dist folder<br>
- **Post** Prompt for info and issue POST passing binary data to OMA Server
this will prompt for a Ver# and OC# (done as a sanity check and test)<br>
- **Get** Issue a simple get to the OMA server

**Launch Server**<br>
To launch the server using the raw source, from a command line prompt type:<br>
- Node src\index.js<br>
Then from a separate command line window select either POST or GET from the gulp menu.

To launch the server using the Built source (which simply removes all console logs from the source), from a command line prompt type:<br>
- Node dist\index.js<br>
Then from a separate command line window select either POST or GET from the gulp menu.


**Note:**<br>
Default version # and option count values are stored in the config/default.json file as are any messages that are returned by the server.