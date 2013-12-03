;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (function() {
  function _Class() {}

  _Class.prototype.getDom = function() {
    return this.dom;
  };

  _Class.prototype.dispatch = function(req) {
    if (req.action == null) {
      req.action = 'index';
    }
    if (typeof req.controller === "undefined") {
      throw {
        msg: 'request needs a controller',
        request: req
      };
    }
    if (!this[req.action + 'Action']) {
      throw {
        msg: 'action ' + req.action + 'Action' + ' for controller ' + req.controller + ' doesn\'t exists',
        request: req
      };
    }
    this.dom = req.dom || {};
    return this[req.action + 'Action'](req);
  };

  return _Class;

})();


},{}],2:[function(require,module,exports){
var abstractController,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

abstractController = require('./abstract.coffee');

module.exports = (function(_super) {
  __extends(_Class, _super);

  function _Class(serviceGreeter) {
    this.serviceGreeter = serviceGreeter;
  }

  _Class.prototype.indexAction = function(req) {
    return this.dom.html('Controller Content ...');
  };

  return _Class;

})(abstractController);


},{"./abstract.coffee":1}],3:[function(require,module,exports){
var abstractController,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

abstractController = require('./abstract.coffee');

module.exports = (function(_super) {
  __extends(_Class, _super);

  function _Class(serviceGreeter) {
    this.serviceGreeter = serviceGreeter;
  }

  _Class.prototype.indexAction = function(req) {
    return this.dom.html('Controller Footer ...');
  };

  return _Class;

})(abstractController);


},{"./abstract.coffee":1}],4:[function(require,module,exports){
var abstractController, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

abstractController = require('./abstract.coffee');

module.exports = (function(_super) {
  __extends(_Class, _super);

  function _Class() {
    _ref = _Class.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  _Class.prototype.indexAction = function(req) {
    return this.dom.html('Controller Left ...');
  };

  return _Class;

})(abstractController);


},{"./abstract.coffee":1}],5:[function(require,module,exports){
module.exports = (function() {
  function _Class() {
    this.serviceFactories = {};
    this.servicesByTags = {};
    this.services = {};
  }

  _Class.prototype.set = function(servicename, instance) {
    var _this = this;
    this.services[servicename] = instance;
    this['get' + this._ucfirst(servicename)] = function() {
      return _this.get(servicename)();
    };
    return this;
  };

  _Class.prototype.get = function(serviceName) {
    var _this = this;
    if (typeof this.services[serviceName] !== "undefined") {
      return (function() {
        return _this.services[serviceName];
      });
    }
    if (typeof this.serviceFactories[serviceName] === "function") {
      return (function() {
        return _this.services[serviceName] = _this.serviceFactories[serviceName](_this);
      });
    }
    if (typeof this.serviceFactories[serviceName] === "object") {
      if (typeof this.serviceFactories[serviceName]['factory'] !== "function") {
        throw {
          msg: 'service ' + serviceName + ' needs a factory configuration.',
          serviceName: serviceName
        };
      }
      if (!this.serviceFactories[serviceName]['shared']) {
        return (function() {
          return _this.serviceFactories[serviceName]['factory'](_this);
        });
      }
      return (function() {
        return _this.services[serviceName] = _this.serviceFactories[serviceName](_this);
      });
    }
    throw {
      msg: 'service ' + serviceName + ' doesnt exists.',
      serviceName: serviceName
    };
  };

  _Class.prototype._ucfirst = function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  _Class.prototype.getByTag = function(tag) {
    var t, _results;
    if (!this.servicesByTags[tag]) {
      return [];
    }
    _results = [];
    for (t in this.servicesByTags[tag]) {
      _results.push(this.get(t));
    }
    return _results;
  };

  _Class.prototype.configure = function(configuration) {
    var factoryName, tag, tags, _i, _len,
      _this = this;
    if (configuration['factories']) {
      for (factoryName in configuration['factories']) {
        this.serviceFactories[factoryName] = configuration['factories'][factoryName];
        if (configuration['factories'][factoryName]['tag']) {
          tags = configuration['factories'][factoryName]['tag'];
          if (typeof tags === "string") {
            tags = [tags];
          }
          for (_i = 0, _len = tags.length; _i < _len; _i++) {
            tag = tags[_i];
            if (!this.servicesByTags[tag]) {
              this.servicesByTags[tag] = {};
            }
            this.servicesByTags[tag][factoryName] = factoryName;
          }
        }
        this['get' + (function(f) {
          return _this._ucfirst(f);
        })(factoryName)] = (function(f) {
          return function() {
            return _this.get(f)();
          };
        })(factoryName);
      }
    }
    return this;
  };

  return _Class;

})();


},{}],6:[function(require,module,exports){
module.exports = (function() {
  function _Class(di) {
    this.di = di;
  }

  _Class.prototype.dispatch = function(controller, action) {
    return this.dispatchRoute({
      action: action,
      controller: controller
    });
  };

  _Class.prototype.dispatchRoute = function(route) {
    var e;
    try {
      return this.di.get('controller' + route.controller)().dispatch(route);
    } catch (_error) {
      e = _error;
      if (e.msg) {
        console.log(e.msg);
      }
      if (e.message) {
        console.log(e.message);
      }
      console.log(e);
      throw "Controller " + route.controller + " doesnt exists?";
    }
  };

  return _Class;

})();


},{}],7:[function(require,module,exports){
var app, main, _controllerContent, _controllerFooter, _controllerLeft, _di, _dispatcher, _serviceGreeter;

_di = require('./lib/di.coffee');

_dispatcher = require('./lib/dispatcher.coffee');

_controllerLeft = require('./controller/left.coffee');

_controllerContent = require('./controller/content.coffee');

_controllerFooter = require('./controller/footer.coffee');

_serviceGreeter = require('./service/greeter.coffee');

main = (function() {
  function main() {}

  main.prototype.di = null;

  main.prototype.getContainer = function() {
    if (this.di) {
      return this.di;
    }
    this.di = new _di;
    this.di.configure({
      factories: {
        dispatcher: function(di) {
          return new _dispatcher(di);
        },
        controllerLeft: function(di) {
          return new _controllerLeft(di.get('serviceGreeter'));
        },
        controllerContent: function(di) {
          return new _controllerContent;
        },
        controllerFooter: function(di) {
          return new _controllerFooter;
        },
        serviceGreeter: function() {
          return new _serviceGreeter;
        }
      }
    });
    return this.di;
  };

  main.prototype.handle = function(request) {
    return this.getContainer().get('dispatcher')().dispatchRoute(request);
  };

  return main;

})();

app = new main;

$('document').ready(function() {
  return $('.app_controller').each(function(i, el) {
    return app.handle({
      controller: $(el).data('controller'),
      dom: $(el)
    });
  });
});


},{"./controller/content.coffee":2,"./controller/footer.coffee":3,"./controller/left.coffee":4,"./lib/di.coffee":5,"./lib/dispatcher.coffee":6,"./service/greeter.coffee":8}],8:[function(require,module,exports){
module.exports = (function() {
  function _Class() {}

  _Class.prototype.greet = function(name) {
    return 'hello!! ' + name;
  };

  return _Class;

})();


},{}]},{},[1,2,3,4,5,6,7,8])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9kZXYvcHJvai9zbGlkZXNfY29mZmVlc2NyaXB0L2V4YW1wbGVzLzJfYnJvd3NlcmlmeS9zcmMvY29udHJvbGxlci9hYnN0cmFjdC5jb2ZmZWUiLCIvaG9tZS9kZXYvcHJvai9zbGlkZXNfY29mZmVlc2NyaXB0L2V4YW1wbGVzLzJfYnJvd3NlcmlmeS9zcmMvY29udHJvbGxlci9jb250ZW50LmNvZmZlZSIsIi9ob21lL2Rldi9wcm9qL3NsaWRlc19jb2ZmZWVzY3JpcHQvZXhhbXBsZXMvMl9icm93c2VyaWZ5L3NyYy9jb250cm9sbGVyL2Zvb3Rlci5jb2ZmZWUiLCIvaG9tZS9kZXYvcHJvai9zbGlkZXNfY29mZmVlc2NyaXB0L2V4YW1wbGVzLzJfYnJvd3NlcmlmeS9zcmMvY29udHJvbGxlci9sZWZ0LmNvZmZlZSIsIi9ob21lL2Rldi9wcm9qL3NsaWRlc19jb2ZmZWVzY3JpcHQvZXhhbXBsZXMvMl9icm93c2VyaWZ5L3NyYy9saWIvZGkuY29mZmVlIiwiL2hvbWUvZGV2L3Byb2ovc2xpZGVzX2NvZmZlZXNjcmlwdC9leGFtcGxlcy8yX2Jyb3dzZXJpZnkvc3JjL2xpYi9kaXNwYXRjaGVyLmNvZmZlZSIsIi9ob21lL2Rldi9wcm9qL3NsaWRlc19jb2ZmZWVzY3JpcHQvZXhhbXBsZXMvMl9icm93c2VyaWZ5L3NyYy9tYWluLmNvZmZlZSIsIi9ob21lL2Rldi9wcm9qL3NsaWRlc19jb2ZmZWVzY3JpcHQvZXhhbXBsZXMvMl9icm93c2VyaWZ5L3NyYy9zZXJ2aWNlL2dyZWV0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxDQUFPLEtBQUQsQ0FBTjtDQUNFOztDQUFBLEVBQVEsR0FBUixHQUFRO0NBQUksR0FBQSxPQUFEO0NBQVgsRUFBUTs7Q0FBUixFQUVVLEtBQVYsQ0FBVzs7Q0FDTCxFQUFELEdBQUg7TUFBQTtBQUM2RCxDQUE3RCxFQUF1RSxDQUF2RSxDQUF1RixDQUExQixJQUFB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RUFBQSxPQUFBLE1BQUE7Q0FETixRQUFZO0NBQVosQ0FFZ0IsQ0FBQSxLQUFoQixDQUFpQixLQUFqQjtDQUNzQixDQUFFLENBQUYsQ0FBaEIsV0FBQSxDQUFnQixDQUFoQjtDQUhOLFFBRWdCO0NBRmhCLENBSW1CLENBQUEsS0FBbkIsQ0FBb0IsUUFBcEI7QUFDRSxDQUFBLEVBQUEsY0FBQTtDQUxGLFFBSW1CO0NBSm5CLENBTWtCLENBQUEsS0FBbEIsQ0FBbUIsT0FBbkI7QUFDRSxDQUFBLEVBQUEsY0FBQTtDQVBGLFFBTWtCO0NBTmxCLENBUWdCLENBQUEsS0FBaEIsQ0FBZ0IsS0FBaEI7QUFDRSxDQUFBLEVBQUEsY0FBQTtDQVRGLFFBUWdCO1FBVGxCO0NBSEYsS0FFQTtDQVlDLEdBQUEsT0FBRDtDQWpCRixFQUVjOztDQUZkLEVBbUJRLEdBQVIsQ0FBUSxFQUFDO0NBQ04sRUFBRCxDQUFDLEdBQUQsSUFBQSxDQUFBLENBQUE7Q0FwQkYsRUFtQlE7O0NBbkJSOztDQVJGOztBQThCQSxDQTlCQSxFQThCQSxDQTlCQTs7QUErQkEsQ0EvQkEsRUErQm9CLEVBQXBCLElBQW9CLENBQXBCO0NBQ0UsQ0FBOEIsQ0FBSixDQUExQixLQUFBLFFBQUE7Q0FDTSxFQUFELEdBQUgsS0FBQTtDQUNFLENBQVksRUFBQSxFQUFaLElBQUEsRUFBWTtDQUFaLENBQ0ssQ0FBTCxHQUFBO0NBSHNCLEtBQ3hCO0NBREYsRUFBMEI7Q0FEUjs7OztBQy9CcEIsQ0FBTyxLQUFELENBQU47Q0FFRTs7Q0FBQSxFQUFPLENBQUEsQ0FBUCxJQUFRO0NBQUQsRUFDUSxPQUFiLENBQUE7Q0FERixFQUFPOztDQUFQOztDQUZGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBjbGFzc1xuICBnZXREb206IC0+IEBkb21cblxuICBkaXNwYXRjaDogKHJlcSkgLT5cbiAgICByZXEuYWN0aW9uID89ICdpbmRleCdcbiAgICB0aHJvdyB7IG1zZyA6ICdyZXF1ZXN0IG5lZWRzIGEgY29udHJvbGxlcicsIHJlcXVlc3Q6IHJlcX0gaWYgdHlwZW9mKHJlcS5jb250cm9sbGVyKSA9PSBcInVuZGVmaW5lZFwiXG4gICAgdGhyb3cgeyBtc2cgOiAnYWN0aW9uICcgKyByZXEuYWN0aW9uICsgJ0FjdGlvbicgKyAnIGZvciBjb250cm9sbGVyICcgKyAgcmVxLmNvbnRyb2xsZXIgKyAnIGRvZXNuXFwndCBleGlzdHMnLCByZXF1ZXN0OiByZXF9IGlmICFAW3JlcS5hY3Rpb24gKyAnQWN0aW9uJ11cbiAgICBAZG9tID0gcmVxLmRvbSB8fCB7fVxuXG4gICAgQFtyZXEuYWN0aW9uICsgJ0FjdGlvbiddKHJlcSkiLCJhYnN0cmFjdENvbnRyb2xsZXIgPSByZXF1aXJlICcuL2Fic3RyYWN0LmNvZmZlZSdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBleHRlbmRzIGFic3RyYWN0Q29udHJvbGxlclxuXG4gIGNvbnN0cnVjdG9yOiAoQHNlcnZpY2VHcmVldGVyKSAtPlxuXG4gIGluZGV4QWN0aW9uOiAocmVxKSAtPlxuICAgIEBkb20uaHRtbCAnQ29udHJvbGxlciBDb250ZW50IC4uLidcbiIsImFic3RyYWN0Q29udHJvbGxlciA9IHJlcXVpcmUgJy4vYWJzdHJhY3QuY29mZmVlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIGV4dGVuZHMgYWJzdHJhY3RDb250cm9sbGVyXG5cbiAgY29uc3RydWN0b3I6IChAc2VydmljZUdyZWV0ZXIpIC0+XG5cbiAgaW5kZXhBY3Rpb246IChyZXEpIC0+XG4gICAgQGRvbS5odG1sICdDb250cm9sbGVyIEZvb3RlciAuLi4nXG4iLCJhYnN0cmFjdENvbnRyb2xsZXIgPSByZXF1aXJlICcuL2Fic3RyYWN0LmNvZmZlZSdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBleHRlbmRzIGFic3RyYWN0Q29udHJvbGxlclxuXG4gIGluZGV4QWN0aW9uOiAocmVxKSAtPlxuICAgIEBkb20uaHRtbCAnQ29udHJvbGxlciBMZWZ0IC4uLidcbiIsIiMgQGxpY2Vuc2UgICAgTmV3IEJTRCBMaWNlbnNlLCBmZWVsIGZyZWUgdG8gbWluaWZ5IHRoaXNcbiMgQGNvcHlyaWdodCAgQ29weXJpZ2h0IChjKSAyMDEzIHRpbSBnbGFiaXNjaFxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBzZXJ2aWNlRmFjdG9yaWVzID0ge31cbiAgICBAc2VydmljZXNCeVRhZ3MgPSB7fVxuICAgIEBzZXJ2aWNlcyA9IHt9XG5cbiAgc2V0OiAoc2VydmljZW5hbWUsIGluc3RhbmNlKSAtPlxuICAgIEBzZXJ2aWNlc1tzZXJ2aWNlbmFtZV0gPSBpbnN0YW5jZVxuICAgIEBbJ2dldCcgKyBAX3VjZmlyc3Qoc2VydmljZW5hbWUpXSA9ID0+IEBnZXQoc2VydmljZW5hbWUpKClcbiAgICBAXG5cbiAgZ2V0OiAoc2VydmljZU5hbWUpIC0+XG4gICAgcmV0dXJuICg9PiBAc2VydmljZXNbc2VydmljZU5hbWVdKSBpZiB0eXBlb2YoQHNlcnZpY2VzW3NlcnZpY2VOYW1lXSkgIT0gXCJ1bmRlZmluZWRcIlxuXG4gICAgaWYgdHlwZW9mIEBzZXJ2aWNlRmFjdG9yaWVzW3NlcnZpY2VOYW1lXSA9PSBcImZ1bmN0aW9uXCJcbiAgICAgIHJldHVybiAoPT4gQHNlcnZpY2VzW3NlcnZpY2VOYW1lXSA9IEBzZXJ2aWNlRmFjdG9yaWVzW3NlcnZpY2VOYW1lXShAKSlcblxuICAgIGlmIHR5cGVvZiBAc2VydmljZUZhY3Rvcmllc1tzZXJ2aWNlTmFtZV0gPT0gXCJvYmplY3RcIlxuICAgICAgdGhyb3cge21zZzogJ3NlcnZpY2UgJyArIHNlcnZpY2VOYW1lICsgJyBuZWVkcyBhIGZhY3RvcnkgY29uZmlndXJhdGlvbi4nLCBzZXJ2aWNlTmFtZTogc2VydmljZU5hbWV9IGlmIHR5cGVvZiBAc2VydmljZUZhY3Rvcmllc1tzZXJ2aWNlTmFtZV1bJ2ZhY3RvcnknXSAhPSBcImZ1bmN0aW9uXCJcbiAgICAgIHJldHVybiAoPT4gQHNlcnZpY2VGYWN0b3JpZXNbc2VydmljZU5hbWVdWydmYWN0b3J5J10oQCkpIGlmICFAc2VydmljZUZhY3Rvcmllc1tzZXJ2aWNlTmFtZV1bJ3NoYXJlZCddXG4gICAgICByZXR1cm4gKD0+IEBzZXJ2aWNlc1tzZXJ2aWNlTmFtZV0gPSBAc2VydmljZUZhY3Rvcmllc1tzZXJ2aWNlTmFtZV0oQCkpXG5cbiAgICB0aHJvdyB7bXNnOiAnc2VydmljZSAnICsgc2VydmljZU5hbWUgKyAnIGRvZXNudCBleGlzdHMuJywgc2VydmljZU5hbWU6IHNlcnZpY2VOYW1lfVxuXG4gIF91Y2ZpcnN0OiAocykgLT5cbiAgICBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcblxuICBnZXRCeVRhZzogKHRhZykgLT5cbiAgICByZXR1cm4gW10gaWYgIUBzZXJ2aWNlc0J5VGFnc1t0YWddXG4gICAgQGdldCh0KSBmb3IgdCBvZiBAc2VydmljZXNCeVRhZ3NbdGFnXVxuXG4gIGNvbmZpZ3VyZTogKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAgaWYoY29uZmlndXJhdGlvblsnZmFjdG9yaWVzJ10pXG4gICAgICBmb3IgZmFjdG9yeU5hbWUgb2YgY29uZmlndXJhdGlvblsnZmFjdG9yaWVzJ11cbiAgICAgICAgQHNlcnZpY2VGYWN0b3JpZXNbZmFjdG9yeU5hbWVdID0gY29uZmlndXJhdGlvblsnZmFjdG9yaWVzJ11bZmFjdG9yeU5hbWVdXG5cbiAgICAgICAgIyBzdXBwb3J0IGZvciB0YWdzLlxuICAgICAgICBpZiBjb25maWd1cmF0aW9uWydmYWN0b3JpZXMnXVtmYWN0b3J5TmFtZV1bJ3RhZyddXG4gICAgICAgICAgdGFncyA9IGNvbmZpZ3VyYXRpb25bJ2ZhY3RvcmllcyddW2ZhY3RvcnlOYW1lXVsndGFnJ11cbiAgICAgICAgICB0YWdzID0gW3RhZ3NdIGlmIHR5cGVvZiB0YWdzID09IFwic3RyaW5nXCJcbiAgICAgICAgICBmb3IgdGFnIGluIHRhZ3NcbiAgICAgICAgICAgIEBzZXJ2aWNlc0J5VGFnc1t0YWddID0ge30gaWYgIUBzZXJ2aWNlc0J5VGFnc1t0YWddXG4gICAgICAgICAgICBAc2VydmljZXNCeVRhZ3NbdGFnXVtmYWN0b3J5TmFtZV0gPSBmYWN0b3J5TmFtZVxuXG4gICAgICAgICMgc3VwcG9ydCBmb3IgXCJuaWNlclwiIGdldHRlcnMuXG4gICAgICAgIEBbJ2dldCcgKyAoKGYpID0+IEBfdWNmaXJzdChmKSkoZmFjdG9yeU5hbWUpXSA9ICgoZikgPT4gPT4gQGdldChmKSgpKShmYWN0b3J5TmFtZSlcbiAgICBAIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzc1xuICBjb25zdHJ1Y3RvcjogKEBkaSktPlxuXG4gIGRpc3BhdGNoOihjb250cm9sbGVyLCBhY3Rpb24pIC0+XG4gICAgQGRpc3BhdGNoUm91dGVcbiAgICAgIGFjdGlvbjogYWN0aW9uXG4gICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyXG5cbiAgZGlzcGF0Y2hSb3V0ZTogKHJvdXRlKSAtPlxuICAgIHRyeVxuICAgICAgQGRpLmdldCgnY29udHJvbGxlcicgKyByb3V0ZS5jb250cm9sbGVyKSgpLmRpc3BhdGNoIHJvdXRlXG4gICAgY2F0Y2ggZVxuICAgICAgY29uc29sZS5sb2cgZS5tc2cgaWYgZS5tc2dcbiAgICAgIGNvbnNvbGUubG9nIGUubWVzc2FnZSBpZiBlLm1lc3NhZ2VcbiAgICAgIGNvbnNvbGUubG9nIGVcbiAgICAgIHRocm93IFwiQ29udHJvbGxlciBcIiArIHJvdXRlLmNvbnRyb2xsZXIgKyBcIiBkb2VzbnQgZXhpc3RzP1wiXG4iLCJfZGkgPSByZXF1aXJlICcuL2xpYi9kaS5jb2ZmZWUnXG5fZGlzcGF0Y2hlciA9IHJlcXVpcmUgJy4vbGliL2Rpc3BhdGNoZXIuY29mZmVlJ1xuX2NvbnRyb2xsZXJMZWZ0ID0gcmVxdWlyZSAnLi9jb250cm9sbGVyL2xlZnQuY29mZmVlJ1xuX2NvbnRyb2xsZXJDb250ZW50ID0gcmVxdWlyZSAnLi9jb250cm9sbGVyL2NvbnRlbnQuY29mZmVlJ1xuX2NvbnRyb2xsZXJGb290ZXIgPSByZXF1aXJlICcuL2NvbnRyb2xsZXIvZm9vdGVyLmNvZmZlZSdcbl9zZXJ2aWNlR3JlZXRlciA9IHJlcXVpcmUgJy4vc2VydmljZS9ncmVldGVyLmNvZmZlZSdcblxuY2xhc3MgbWFpblxuICBkaTogbnVsbFxuXG4gIGdldENvbnRhaW5lcjogLT5cbiAgICByZXR1cm4gQGRpIGlmIEBkaVxuICAgIEBkaSA9IG5ldyBfZGlcbiAgICBAZGkuY29uZmlndXJlXG4gICAgICBmYWN0b3JpZXM6XG4gICAgICAgIGRpc3BhdGNoZXI6IChkaSktPlxuICAgICAgICAgIG5ldyBfZGlzcGF0Y2hlciBkaVxuICAgICAgICBjb250cm9sbGVyTGVmdDogKGRpKSAtPlxuICAgICAgICAgIG5ldyBfY29udHJvbGxlckxlZnQgZGkuZ2V0KCdzZXJ2aWNlR3JlZXRlcicpXG4gICAgICAgIGNvbnRyb2xsZXJDb250ZW50OiAoZGkpIC0+XG4gICAgICAgICAgbmV3IF9jb250cm9sbGVyQ29udGVudFxuICAgICAgICBjb250cm9sbGVyRm9vdGVyOiAoZGkpIC0+XG4gICAgICAgICAgbmV3IF9jb250cm9sbGVyRm9vdGVyXG4gICAgICAgIHNlcnZpY2VHcmVldGVyOiAtPlxuICAgICAgICAgIG5ldyBfc2VydmljZUdyZWV0ZXJcbiAgICBAZGlcblxuICBoYW5kbGU6IChyZXF1ZXN0KSAtPlxuICAgIEBnZXRDb250YWluZXIoKS5nZXQoJ2Rpc3BhdGNoZXInKSgpLmRpc3BhdGNoUm91dGUgcmVxdWVzdFxuXG5hcHAgPSBuZXcgbWFpblxuJCgnZG9jdW1lbnQnKS5yZWFkeSAtPlxuICAkKCcuYXBwX2NvbnRyb2xsZXInKS5lYWNoIChpLCBlbCkgLT5cbiAgICBhcHAuaGFuZGxlXG4gICAgICBjb250cm9sbGVyOiAkKGVsKS5kYXRhKCdjb250cm9sbGVyJylcbiAgICAgIGRvbTogJChlbClcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3NcblxuICBncmVldDogKG5hbWUpIC0+XG4gICAgJ2hlbGxvISEgJyArIG5hbWUiXX0=
;