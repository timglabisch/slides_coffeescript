module.exports = class
  getDom: -> @dom

  dispatch: (req) ->
    req.action ?= 'index'
    throw { msg : 'request needs a controller', request: req} if typeof(req.controller) == "undefined"
    throw { msg : 'action ' + req.action + 'Action' + ' for controller ' +  req.controller + ' doesn\'t exists', request: req} if !@[req.action + 'Action']
    @dom = req.dom || {}

    @[req.action + 'Action'](req)