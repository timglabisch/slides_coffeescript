# sudo pkill proj_fcgi
# stop apache :)

compile:
	grunt

prepareFs: compile
	cp build/core.js /usr/share/nginx/html/demo.js

prepareFcgi:
	sudo spawn-fcgi -p 9001 ./proj_fcgi

open:
	sudo service nginx restart
	google-chrome http://localhost/demo.js

all: compile prepareFs prepareFcgi open



