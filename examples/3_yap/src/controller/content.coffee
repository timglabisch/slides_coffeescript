abstractController = require './abstract.coffee'

module.exports = class extends abstractController

  indexAction: (req) ->
    response.addContent "YAYYYY!!"
