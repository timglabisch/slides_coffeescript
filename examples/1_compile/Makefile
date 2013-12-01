clean:
	find . -iname "*.js" -exec rm {} \;
	find . -iname "*.map" -exec rm {} \;
	rm -rf build

js:
	coffee -bjc -o build/ \
	lib/di.coffee \
	lib/dispatcher.coffee \
	controller/abstract.coffee \
	controller/hello.coffee \
	service/greeter.coffee \
	main.coffee

run: clean js
	reset
	node build/.js
