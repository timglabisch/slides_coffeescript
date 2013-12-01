js:
	rm -rf build
	coffee -bjc -o build/ \
	lib/di.coffee \
	lib/dispatcher.coffee \
	controller/abstract.coffee \
	controller/hello.coffee \
	service/greeter.coffee \
	main.coffee

run: js
	reset
	node build/.js
