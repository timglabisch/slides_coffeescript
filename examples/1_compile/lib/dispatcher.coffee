class dispatcher
  constructor: (@di)->

  dispatch:(controller, action) ->
    @dispatchRoute
      action: action
      controller: controller

  dispatchRoute: (route) ->
    try
      @di.get('controller' + route.controller)().dispatch route
    catch e
      console.log e.msg if e.msg
      console.log e.message if e.message
      console.log e
      throw "Controller " + route.controller + " doesnt exists?"


module.exports = dispatcher if typeof module != "undefined"