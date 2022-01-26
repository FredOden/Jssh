/**
 * JsFramework: Make Android scriptable with javascript
 *
 * @author fred.oden@gmail.com
 */


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.lang.System;

public class Jssh implements JsActivity {

  private Js js;
  private String starter; //computed version of assets starter to build globals (Lourah) at each run of scripts

  /**
   * To make possible to develop specific errorReporter from javascript
   * for both reportError and reportWarning.
   */
  public interface ErrorReporter {
     void report(String m);
  }

  /**
   * default ErrorReporter -> to stderr
   */
   public ErrorReporter errorReporter = new ErrorReporter() {
    public void report(String m) {
	System.err.println(m);
    }
  };

  /**
   * To make possible to develop specific logger from javascipt.
   */
  public interface Logger {
		  void log(String s);
  }

  /**
   * default Logger -> stdout
   */
  public Logger logger = new Logger() {
    public void log(String m) {
	System.out.println(m);
    }
  };

  public static SimpleDateFormat timestamp = new SimpleDateFormat("[yyyy-MM-dd hh:mm:ss.SSS]");

  /**
   * As notification appears on the user interface, the report is always
   * executed synchronized. (As javascript application can be
   * multithreaded).
   * @param s  message
   */
  public void log(String s) {
	synchronized(this) {
	Date now = new Date();
    logger.log(timestamp.format(now) + "   " + s);
	}
  }


  /**
   * As notification appears on the user interface, the report is always
   * executed synchronized. (As javascript application can be
   * multithreaded).
   * @param error  message
   */
  public void reportError(String error) {
		synchronized(this) {
		Date now = new Date();
        errorReporter.report(timestamp.format(now) + "!!!reportError::" + error);
		}
  }

  /**
   * As notification appears on the user interface, the report is always
   * executed synchronized. (As javascript application can be
   * multithreaded).
   * @param warning  message
   */
  public void reportWarning(String warning) {
		synchronized(this) {
		Date now = new Date();
        errorReporter.report(timestamp.format(now) + "???reportWarning::" + warning);
		}
  }


  public static void main (String[] args){
    System.out.println("jssh::started::" + args[0]);
    new Jssh(args[0]);
   }

  /**
   * Create this activity
   * @param savedInstanceState
   */
  public Jssh(String scriptFile) {
		  String progress = "init";
		  try {
		  progress = "load scriptFile::" + scriptFile;
		  String script = path2String(scriptFile);
		  progress = "load starter::";
		  String jsshjs = path2String(System.getenv("JSSH_STARTER"));
		  progress = "load JSSH_DIR::" + System.getenv("JSSH_DIR");
		  jsshjs = jsshjs.replaceAll("@@@JSSH_DIR@@@", System.getenv("JSSH_DIR"));
		  progress = "load JSSH_FRAMEWORK_DIR::";
		  jsshjs = jsshjs.replaceAll("@@@JSSH_FRAMEWORK_DIR@@@", System.getenv("JSSH_FRAMEWORK_DIR"));
		  progress = "load JSSH_RHINO::";
		  jsshjs = jsshjs.replaceAll("@@@JSSH_RHINO@@@", System.getenv("JSSH_RHINO"));
		  File fScriptFile = new File(scriptFile);
		  String scriptFileLocation = fScriptFile.getParent();
		  if (scriptFileLocation == null) scriptFileLocation = ".";
		  String name = fScriptFile.getName();
		  progress = "load SCRIPT_FILE_LOCATION::";
		  jsshjs = jsshjs.replaceAll("@@@SCRIPT_FILE_LOCATION@@@", scriptFileLocation);
		  progress = "load JS_APP_NAME::";
		  jsshjs = jsshjs.replaceAll("@@@JS_APP_NAME@@@", name);
		  progress = "load SCRIPT::";
		  jsshjs = jsshjs.replaceAll("@@@SCRIPT@@@", "console.log('Asset loaded');");
		  starter = jsshjs;
    	  js = new Js(this);
		  loadScript(starter, System.getenv("JSSH_LOADER"));
		  log(name + "::" + loadScript(script, scriptFile).s);
		  } catch(Exception e) {
				  reportError("load::" + scriptFile + "::" + progress + "::" + e);
		  }
  }

  public static File root = null;

  /**
   * Common method to load a source code (utf-8) from an InputStream
   * @param is to read
   * @return full source code content
   */
  public String inputStream2String(InputStream is) {
    StringBuffer sb = new StringBuffer();
    try {
       BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
       int c = 0;
       while((c = br.read()) != -1) {
         sb.append((char)c);
       }
       br.close();
       
    } catch (Exception ioe) {
     reportError("inputStream2string::" + ioe);
    } 
    return sb.toString();
  }

  /**
   * read source code from external storage file
   * @param path  of the file
   * @return full source code content
   */
  public String path2String(String path) {
    try {
      File f = new File(path);
      return inputStream2String(new FileInputStream(f));
    } catch (IOException ioe) {
      return ioe.getMessage();
    }
  }

  public Js getJs() {
    return js;
  }


  /**
   * Called from javascript for modular purpose
   * @param scriptName
   * @return execution status or value
   */
  public Js.JsObject importScript(String scriptName) {
    Js.JsObject o;
    o = js.eval(path2String(scriptName), scriptName);
    if (!o.ok) {
      reportError("importScript::" + o.s);
    }
    return o;
  }

  private Js.JsObject loadScript(String script, String scriptName) {
	Js.JsObject o;
	o = js.eval(script, scriptName);
	if (!o.ok) {
		reportError("loadScript::" + o.s);
	}
	return o;
  }
  
  private Jssh self = this;

  /**
   * JsSpawner:
   *   execute a script in a different scope
   *   load asset starter before loading script to share global context (Lourah)
   *   see $JSSH_STARTER for more
   */
  public class JsSpawner {
     private String script;
	 private String scriptName;
	 private Js jsSpawned;
	 public JsSpawner(String scriptName) {
			 this.scriptName = scriptName;
			 script = self.path2String(scriptName);
			 jsSpawned = new Js(self);
	 }
  	 public Js.JsObject spawn() {
			 Js.JsObject o;
			 o = jsSpawned.eval(starter, System.getenv("JSSH_STARTER"));
			 if (o.ok) {
					 o = jsSpawned.eval(script, this.scriptName);
			 }
			 if (!o.ok) {
					 reportError("JsSpawner::spawn::" + o.s);
			 }
			 return o;
	 }
  };

  public Js.JsObject spawnScript(String scriptName) {
		  return (new JsSpawner(scriptName)).spawn();
  }

  /**
   * for display purpose
   * @param e exception error
   * @return
   */
  private String stringifyStackTrace(Exception e) {
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    e.printStackTrace(pw);
    return "{" + sw.toString() + "}";
  }
}
