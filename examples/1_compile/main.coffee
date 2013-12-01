class main
  di: null

  getContainer: ->
    return @di if @di
    @di = new di
    @di.configure
      factories:
        dispatcher: (di)->
          new dispatcher di
        controllerHello: (di) ->
          new controllerHello di.get('serviceGreeter')
        serviceGreeter: ->
          new serviceGreeter
    @di

  handle: (request) ->
    @getContainer().get('dispatcher')().dispatch request.controller


(new main).handle
  controller: 'Hello'
