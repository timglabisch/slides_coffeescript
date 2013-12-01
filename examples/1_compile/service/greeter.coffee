class serviceGreeter

  greet: (name) ->
    'hello!! ' + name

module.exports = serviceGreeter if typeof module != "undefined"