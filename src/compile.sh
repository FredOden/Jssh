#/bin/sh -v
javac -Xlint:deprecation -d ../gen -cp ../libs/rhino-1.7.13.jar JsActivity.java Js.java Jssh.java && jar -cvmf ./MANIFEST.MF ../bin/jssh.jar ../gen/*.class
