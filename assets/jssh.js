/* (c) 2018-2022 - Lourah : jsFramework::launcher */

var Lourah = {};
 (function(){
 Lourah.jsFramework = new (function(){
  this.getRhinoVersion = () => '@@@JSSH_RINO@@@';
  this.getGenerated = () => '@@@GENERATED@@@';
  this.name = () => '@@@JS_APP_NAME@@@';
  this.root = () => '@@@JSSH_DIR@@@';
  // parentDir for compatibility with source code copied from android
  this.parentDir = () => '/@@@JSSH_FRAMEWORK_DIR@@@';
  this.frameworkDir = () => '/@@@JSSH_FRAMEWORK_DIR@@@';

  this.dir = () => '@@@SCRIPT_FILE_LOCATION@@@';

  this.createThread = function(f){
    return new java.lang.Thread(new java.lang.Runnable({
   		  run: f
       	  }));
 		};
 	};
 })();
 @@@SCRIPT@@@
 })();
