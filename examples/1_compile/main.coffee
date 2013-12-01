class main
  di: null

  getContainer: ->
    return @di if !@di?
    @di = new diContainer
    @di.configure
      factories:
        dispatcher: (di)->
          new dispatcher di
        helloController: ->
          new helloController
    @di

  handle: (request) ->
    @getContainer().get('dispatcher')().dispatch request.controller


(new main).handle
  controller: 'hello'
