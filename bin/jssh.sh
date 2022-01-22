#/bin/sh
JSSH_DIR=/home/pi/Lourah/JSF/jssh
JSSH_BIN=$JSSH_DIR/bin
JSSH_LIBS=$JSSH_DIR/libs
java -cp $JSSH_LIBS/rhino-1.7.13.jar:$JSSH_BIN/jssh.jar  Jssh $1
