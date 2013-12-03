response.addContent "Content-type: text/html\r\n\r\n"


_di = require './lib/di.coffee'
_dispatcher = require './lib/dispatcher.coffee'
_controllerContent = require './controller/content.coffee'

class main
  di: null

  getContainer: ->
    return @di if @di
    @di = new _di
    @di.configure
      factories:
        dispatcher: (di)->
          new _dispatcher di
        controllerContent: (di) ->
          new _controllerContent
    @di

  handle: (request) ->
    @getContainer().get('dispatcher')().dispatchRoute request

app = new main
app.handle
  controller: 'Content'
