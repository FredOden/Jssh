#/bin/sh -v
javac -Xlint:deprecation -d ../gen -cp ../libs/rhino-1.7.13.jar JsActivity.java Js.java Jssh.java && jar -cf ../bin/jssh.jar ../gen/*.class ./MANIFEST.MF
