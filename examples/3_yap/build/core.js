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
    return response.addContent("YAYYYY!!");
  };

  return _Class;

})(abstractController);


},{"./abstract.coffee":1}],3:[function(require,module,exports){
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


},{}],4:[function(require,module,exports){
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


},{}],5:[function(require,module,exports){
var app, main, _controllerContent, _di, _dispatcher;

response.addContent("Content-type: text/html\r\n\r\n");

_di = require('./lib/di.coffee');

_dispatcher = require('./lib/dispatcher.coffee');

_controllerContent = require('./controller/content.coffee');

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
        controllerContent: function(di) {
          return new _controllerContent;
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

app.handle({
  controller: 'Content'
});


},{"./controller/content.coffee":2,"./lib/di.coffee":3,"./lib/dispatcher.coffee":4}]},{},[1,2,3,4,5])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9kZXYvcHJvai9zbGlkZXNfY29mZmVlc2NyaXB0L2V4YW1wbGVzLzNfeWFwL3NyYy9jb250cm9sbGVyL2Fic3RyYWN0LmNvZmZlZSIsIi9ob21lL2Rldi9wcm9qL3NsaWRlc19jb2ZmZWVzY3JpcHQvZXhhbXBsZXMvM195YXAvc3JjL2NvbnRyb2xsZXIvY29udGVudC5jb2ZmZWUiLCIvaG9tZS9kZXYvcHJvai9zbGlkZXNfY29mZmVlc2NyaXB0L2V4YW1wbGVzLzNfeWFwL3NyYy9saWIvZGkuY29mZmVlIiwiL2hvbWUvZGV2L3Byb2ovc2xpZGVzX2NvZmZlZXNjcmlwdC9leGFtcGxlcy8zX3lhcC9zcmMvbGliL2Rpc3BhdGNoZXIuY29mZmVlIiwiL2hvbWUvZGV2L3Byb2ovc2xpZGVzX2NvZmZlZXNjcmlwdC9leGFtcGxlcy8zX3lhcC9zcmMvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLENBQU8sS0FBRCxDQUFOO0NBQ0U7O0NBQUEsRUFBUSxHQUFSLEdBQVE7Q0FBSSxHQUFBLE9BQUQ7Q0FBWCxFQUFROztDQUFSLEVBRVUsS0FBVixDQUFXOztDQUNMLEVBQUQsR0FBSDtNQUFBO0FBQzZELENBQTdELEVBQXVFLENBQXZFLENBQXVGLENBQTFCLElBQUEsQ0FBN0Q7Q0FBQSxXQUFNO0NBQUEsQ0FBUSxDQUFOLEtBQUEsb0JBQUY7Q0FBQSxDQUErQyxDQUEvQyxJQUFzQyxDQUFBO0NBQTVDLE9BQUE7TUFEQTtBQUUrSCxDQUEvSCxFQUFvSSxDQUFwSSxFQUFpSSxFQUFBO0NBQWpJLFdBQU07Q0FBQSxDQUFRLENBQU4sR0FBTSxFQUFOLENBQU0sQ0FBQSxRQUFBO0NBQVIsQ0FBZ0gsQ0FBaEgsSUFBdUcsQ0FBQTtDQUE3RyxPQUFBO01BRkE7Q0FBQSxDQUFBLENBR0EsQ0FBQTtDQUVFLEVBQUcsQ0FBSCxFQUFBLEVBQUEsR0FBRjtDQVJGLEVBRVU7O0NBRlY7O0NBREY7Ozs7QUNB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O0NBREEsQ0FFRyxFQUFILEtBQUE7Q0FDRSxDQUNFLElBREYsR0FBQTtDQUNFLENBQVksQ0FBQSxLQUFaLENBQWEsQ0FBYjtDQUNrQixDQUFaLEVBQUEsT0FBQSxNQUFBO0NBRE4sUUFBWTtDQUFaLENBRW1CLENBQUEsS0FBbkIsQ0FBb0IsUUFBcEI7QUFDRSxDQUFBLEVBQUEsY0FBQTtDQUhGLFFBRW1CO1FBSHJCO0NBSEYsS0FFQTtDQU1DLEdBQUEsT0FBRDtDQVhGLEVBRWM7O0NBRmQsRUFhUSxHQUFSLENBQVEsRUFBQztDQUNOLEVBQUQsQ0FBQyxHQUFELElBQUEsQ0FBQSxDQUFBO0NBZEYsRUFhUTs7Q0FiUjs7Q0FSRjs7QUF3QkEsQ0F4QkEsRUF3QkEsQ0F4QkE7O0FBeUJBLENBekJBLEVBeUJHLEdBQUg7Q0FDRSxDQUFBLE9BQUEsQ0FBQTtDQTFCRixDQXlCQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gY2xhc3NcbiAgZ2V0RG9tOiAtPiBAZG9tXG5cbiAgZGlzcGF0Y2g6IChyZXEpIC0+XG4gICAgcmVxLmFjdGlvbiA/PSAnaW5kZXgnXG4gICAgdGhyb3cgeyBtc2cgOiAncmVxdWVzdCBuZWVkcyBhIGNvbnRyb2xsZXInLCByZXF1ZXN0OiByZXF9IGlmIHR5cGVvZihyZXEuY29udHJvbGxlcikgPT0gXCJ1bmRlZmluZWRcIlxuICAgIHRocm93IHsgbXNnIDogJ2FjdGlvbiAnICsgcmVxLmFjdGlvbiArICdBY3Rpb24nICsgJyBmb3IgY29udHJvbGxlciAnICsgIHJlcS5jb250cm9sbGVyICsgJyBkb2VzblxcJ3QgZXhpc3RzJywgcmVxdWVzdDogcmVxfSBpZiAhQFtyZXEuYWN0aW9uICsgJ0FjdGlvbiddXG4gICAgQGRvbSA9IHJlcS5kb20gfHwge31cblxuICAgIEBbcmVxLmFjdGlvbiArICdBY3Rpb24nXShyZXEpIiwiYWJzdHJhY3RDb250cm9sbGVyID0gcmVxdWlyZSAnLi9hYnN0cmFjdC5jb2ZmZWUnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgZXh0ZW5kcyBhYnN0cmFjdENvbnRyb2xsZXJcblxuICBpbmRleEFjdGlvbjogKHJlcSkgLT5cbiAgICByZXNwb25zZS5hZGRDb250ZW50IFwiWUFZWVlZISFcIlxuIiwiIyBAbGljZW5zZSAgICBOZXcgQlNEIExpY2Vuc2UsIGZlZWwgZnJlZSB0byBtaW5pZnkgdGhpc1xuIyBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKGMpIDIwMTMgdGltIGdsYWJpc2NoXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3NcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHNlcnZpY2VGYWN0b3JpZXMgPSB7fVxuICAgIEBzZXJ2aWNlc0J5VGFncyA9IHt9XG4gICAgQHNlcnZpY2VzID0ge31cblxuICBzZXQ6IChzZXJ2aWNlbmFtZSwgaW5zdGFuY2UpIC0+XG4gICAgQHNlcnZpY2VzW3NlcnZpY2VuYW1lXSA9IGluc3RhbmNlXG4gICAgQFsnZ2V0JyArIEBfdWNmaXJzdChzZXJ2aWNlbmFtZSldID0gPT4gQGdldChzZXJ2aWNlbmFtZSkoKVxuICAgIEBcblxuICBnZXQ6IChzZXJ2aWNlTmFtZSkgLT5cbiAgICByZXR1cm4gKD0+IEBzZXJ2aWNlc1tzZXJ2aWNlTmFtZV0pIGlmIHR5cGVvZihAc2VydmljZXNbc2VydmljZU5hbWVdKSAhPSBcInVuZGVmaW5lZFwiXG5cbiAgICBpZiB0eXBlb2YgQHNlcnZpY2VGYWN0b3JpZXNbc2VydmljZU5hbWVdID09IFwiZnVuY3Rpb25cIlxuICAgICAgcmV0dXJuICg9PiBAc2VydmljZXNbc2VydmljZU5hbWVdID0gQHNlcnZpY2VGYWN0b3JpZXNbc2VydmljZU5hbWVdKEApKVxuXG4gICAgaWYgdHlwZW9mIEBzZXJ2aWNlRmFjdG9yaWVzW3NlcnZpY2VOYW1lXSA9PSBcIm9iamVjdFwiXG4gICAgICB0aHJvdyB7bXNnOiAnc2VydmljZSAnICsgc2VydmljZU5hbWUgKyAnIG5lZWRzIGEgZmFjdG9yeSBjb25maWd1cmF0aW9uLicsIHNlcnZpY2VOYW1lOiBzZXJ2aWNlTmFtZX0gaWYgdHlwZW9mIEBzZXJ2aWNlRmFjdG9yaWVzW3NlcnZpY2VOYW1lXVsnZmFjdG9yeSddICE9IFwiZnVuY3Rpb25cIlxuICAgICAgcmV0dXJuICg9PiBAc2VydmljZUZhY3Rvcmllc1tzZXJ2aWNlTmFtZV1bJ2ZhY3RvcnknXShAKSkgaWYgIUBzZXJ2aWNlRmFjdG9yaWVzW3NlcnZpY2VOYW1lXVsnc2hhcmVkJ11cbiAgICAgIHJldHVybiAoPT4gQHNlcnZpY2VzW3NlcnZpY2VOYW1lXSA9IEBzZXJ2aWNlRmFjdG9yaWVzW3NlcnZpY2VOYW1lXShAKSlcblxuICAgIHRocm93IHttc2c6ICdzZXJ2aWNlICcgKyBzZXJ2aWNlTmFtZSArICcgZG9lc250IGV4aXN0cy4nLCBzZXJ2aWNlTmFtZTogc2VydmljZU5hbWV9XG5cbiAgX3VjZmlyc3Q6IChzKSAtPlxuICAgIHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzLnNsaWNlKDEpO1xuXG4gIGdldEJ5VGFnOiAodGFnKSAtPlxuICAgIHJldHVybiBbXSBpZiAhQHNlcnZpY2VzQnlUYWdzW3RhZ11cbiAgICBAZ2V0KHQpIGZvciB0IG9mIEBzZXJ2aWNlc0J5VGFnc1t0YWddXG5cbiAgY29uZmlndXJlOiAoY29uZmlndXJhdGlvbikgLT5cbiAgICBpZihjb25maWd1cmF0aW9uWydmYWN0b3JpZXMnXSlcbiAgICAgIGZvciBmYWN0b3J5TmFtZSBvZiBjb25maWd1cmF0aW9uWydmYWN0b3JpZXMnXVxuICAgICAgICBAc2VydmljZUZhY3Rvcmllc1tmYWN0b3J5TmFtZV0gPSBjb25maWd1cmF0aW9uWydmYWN0b3JpZXMnXVtmYWN0b3J5TmFtZV1cblxuICAgICAgICAjIHN1cHBvcnQgZm9yIHRhZ3MuXG4gICAgICAgIGlmIGNvbmZpZ3VyYXRpb25bJ2ZhY3RvcmllcyddW2ZhY3RvcnlOYW1lXVsndGFnJ11cbiAgICAgICAgICB0YWdzID0gY29uZmlndXJhdGlvblsnZmFjdG9yaWVzJ11bZmFjdG9yeU5hbWVdWyd0YWcnXVxuICAgICAgICAgIHRhZ3MgPSBbdGFnc10gaWYgdHlwZW9mIHRhZ3MgPT0gXCJzdHJpbmdcIlxuICAgICAgICAgIGZvciB0YWcgaW4gdGFnc1xuICAgICAgICAgICAgQHNlcnZpY2VzQnlUYWdzW3RhZ10gPSB7fSBpZiAhQHNlcnZpY2VzQnlUYWdzW3RhZ11cbiAgICAgICAgICAgIEBzZXJ2aWNlc0J5VGFnc1t0YWddW2ZhY3RvcnlOYW1lXSA9IGZhY3RvcnlOYW1lXG5cbiAgICAgICAgIyBzdXBwb3J0IGZvciBcIm5pY2VyXCIgZ2V0dGVycy5cbiAgICAgICAgQFsnZ2V0JyArICgoZikgPT4gQF91Y2ZpcnN0KGYpKShmYWN0b3J5TmFtZSldID0gKChmKSA9PiA9PiBAZ2V0KGYpKCkpKGZhY3RvcnlOYW1lKVxuICAgIEAiLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzXG4gIGNvbnN0cnVjdG9yOiAoQGRpKS0+XG5cbiAgZGlzcGF0Y2g6KGNvbnRyb2xsZXIsIGFjdGlvbikgLT5cbiAgICBAZGlzcGF0Y2hSb3V0ZVxuICAgICAgYWN0aW9uOiBhY3Rpb25cbiAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXJcblxuICBkaXNwYXRjaFJvdXRlOiAocm91dGUpIC0+XG4gICAgdHJ5XG4gICAgICBAZGkuZ2V0KCdjb250cm9sbGVyJyArIHJvdXRlLmNvbnRyb2xsZXIpKCkuZGlzcGF0Y2ggcm91dGVcbiAgICBjYXRjaCBlXG4gICAgICBjb25zb2xlLmxvZyBlLm1zZyBpZiBlLm1zZ1xuICAgICAgY29uc29sZS5sb2cgZS5tZXNzYWdlIGlmIGUubWVzc2FnZVxuICAgICAgY29uc29sZS5sb2cgZVxuICAgICAgdGhyb3cgXCJDb250cm9sbGVyIFwiICsgcm91dGUuY29udHJvbGxlciArIFwiIGRvZXNudCBleGlzdHM/XCJcbiIsInJlc3BvbnNlLmFkZENvbnRlbnQgXCJDb250ZW50LXR5cGU6IHRleHQvaHRtbFxcclxcblxcclxcblwiXG5cblxuX2RpID0gcmVxdWlyZSAnLi9saWIvZGkuY29mZmVlJ1xuX2Rpc3BhdGNoZXIgPSByZXF1aXJlICcuL2xpYi9kaXNwYXRjaGVyLmNvZmZlZSdcbl9jb250cm9sbGVyQ29udGVudCA9IHJlcXVpcmUgJy4vY29udHJvbGxlci9jb250ZW50LmNvZmZlZSdcblxuY2xhc3MgbWFpblxuICBkaTogbnVsbFxuXG4gIGdldENvbnRhaW5lcjogLT5cbiAgICByZXR1cm4gQGRpIGlmIEBkaVxuICAgIEBkaSA9IG5ldyBfZGlcbiAgICBAZGkuY29uZmlndXJlXG4gICAgICBmYWN0b3JpZXM6XG4gICAgICAgIGRpc3BhdGNoZXI6IChkaSktPlxuICAgICAgICAgIG5ldyBfZGlzcGF0Y2hlciBkaVxuICAgICAgICBjb250cm9sbGVyQ29udGVudDogKGRpKSAtPlxuICAgICAgICAgIG5ldyBfY29udHJvbGxlckNvbnRlbnRcbiAgICBAZGlcblxuICBoYW5kbGU6IChyZXF1ZXN0KSAtPlxuICAgIEBnZXRDb250YWluZXIoKS5nZXQoJ2Rpc3BhdGNoZXInKSgpLmRpc3BhdGNoUm91dGUgcmVxdWVzdFxuXG5hcHAgPSBuZXcgbWFpblxuYXBwLmhhbmRsZVxuICBjb250cm9sbGVyOiAnQ29udGVudCdcbiJdfQ==
;