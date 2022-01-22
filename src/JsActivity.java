interface JsActivity {
	public void reportError(String errorMsg);
	public void reportWarning(String errorMsg);
  	public String inputStream2String(java.io.InputStream is);
        //public String asset2String(String asset);
        public String path2String(String path);
  	public Js getJs();
  	public Js.JsObject importScript(String scriptName);
	public void log(String s);
	}
