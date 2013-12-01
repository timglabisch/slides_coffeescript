class controllerHello extends controllerAbstract

  constructor: (@serviceGreeter) ->

  indexAction: (req) ->
    console.log 'YAAYYYY!!'
    console.log @serviceGreeter().greet 'folks'
