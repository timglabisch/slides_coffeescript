_di = require './lib/di.coffee'
_dispatcher = require './lib/dispatcher.coffee'
_controllerLeft = require './controller/left.coffee'
_controllerContent = require './controller/content.coffee'
_controllerFooter = require './controller/footer.coffee'
_serviceGreeter = require './service/greeter.coffee'

class main
  di: null

  getContainer: ->
    return @di if @di
    @di = new _di
    @di.configure
      factories:
        dispatcher: (di)->
          new _dispatcher di
        controllerLeft: (di) ->
          new _controllerLeft di.get('serviceGreeter')
        controllerContent: (di) ->
          new _controllerContent
        controllerFooter: (di) ->
          new _controllerFooter
        serviceGreeter: ->
          new _serviceGreeter
    @di

  handle: (request) ->
    @getContainer().get('dispatcher')().dispatchRoute request

app = new main
$('document').ready ->
  $('.app_controller').each (i, el) ->
    app.handle
      controller: $(el).data('controller')
      dom: $(el)
