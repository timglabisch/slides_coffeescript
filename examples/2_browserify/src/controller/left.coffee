abstractController = require './abstract.coffee'

module.exports = class extends abstractController

  indexAction: (req) ->
    @dom.html 'Controller Left ...'
