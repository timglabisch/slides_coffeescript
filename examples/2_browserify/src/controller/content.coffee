abstractController = require './abstract.coffee'

module.exports = class extends abstractController

  constructor: (@serviceGreeter) ->

  indexAction: (req) ->
    @dom.html 'Controller Content ...'
