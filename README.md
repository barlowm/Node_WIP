#NodeJS Template for new NodeJS Server Project
This project can be used as a starting point for a NodeJS Server.
It uses NodeJS, Express, Gulp and various tools for building (Gulp), Static Code Checking (eslint), Unit Testing (mocha,supertest)

To get this project working from a virgin Windows Machine perform the following steps:
##Install Node.JS - 
Go to https://nodejs.org/en/download/ and download the appropriate version for the Windows Version (32/64 bit)
This app has been tested with Node JS Version v6.6.0


## Install Gulp
Open a command prompt (I'd recommend installing [ConsoleZ](https://github.com/cbucher/console/wiki/Downloads) )
From the command prompt (in any folder) use npm to install gulp globally:<br>
**C:>npm install -g gulp**

## Establish Node Path environment variable
- Create an environmental variable called NODE_PATH
- Set it to: %AppData%\npm\node_modules
- Close CMD, and Re-Open to get the new ENV variables

##Install Dependencies
From the command prompt (in the project folder) use npm to install the project dependencies:<br>
**C:\My_New_Project>npm install**

##Run gulp
From the command prompt (in the project folder) run the gulp command
**C:\My_New_Project>gulp**

##Execute various tasks
[14:19:04] Using gulpfile C:\My_New_Project\gulpfile.js<br>
[14:19:04] Starting 'default'...<br>
? Select the action to perform (Use arrow keys)<br>
> **Lint** - Perform lint check on source code<br>
  **Build** - Remove all console logging and push modified source to dist folder<br>
  **Post** - Prompt for info and issue POST passing binary data to OMA Server<br>
  **PostND** - Simple post with NO data to OMA Server<br>
  **Get** - Issue a simple get to the OMA server<br>
  **Test** - Run mocha test scripts<br>
  **Forever** - Launch the server, restart if src files change<br>

In order to run the **Post**, **PostND**, **Get** tasks the Server must be launched in a separate command window via the "***gulp forever***" task.


