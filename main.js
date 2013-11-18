// Generated by CoffeeScript 1.6.3
(function() {
  var editor;

  editor = (function() {
    editor.prototype.uuid = null;

    editor.prototype.editorLeft = null;

    editor.prototype.editorRight = null;

    editor.prototype.editorRightLanguage = null;

    function editor(dom) {
      this.dom = dom;
    }

    editor.prototype.getUuid = function() {
      return this.uuid || (this.uuid = '_' + parseInt(Math.random() * 100000000));
    };

    editor.prototype.getUuidRight = function() {
      return this.getUuid() + '_right';
    };

    editor.prototype.getUuidLeft = function() {
      return this.getUuid() + '_left';
    };

    editor.prototype.getWindowRight = function() {
      return this.dom.find('.window.right');
    };

    editor.prototype.getWindowLeft = function() {
      return this.dom.find('.window.left');
    };

    editor.prototype.setOutEditorLeft = function(out) {
      if (typeof out === "undefined") {
        out = "undefined";
      }
      return this.getWindowLeft().find('.res').html(this.editorRightLanguage + ': ' + out.toString());
    };

    editor.prototype.getEditorLeft = function() {
      var _this = this;
      if (this.editorLeft !== null) {
        return this.editorLeft;
      }
      this.editorLeft = ace.edit(this.getUuidLeft());
      this.editorLeft.setTheme("ace/theme/monokai");
      this.editorLeft.on('change', function(e) {
        return _this.evalEditor();
      });
      return this.editorLeft;
    };

    editor.prototype.evalEditor = function() {
      var a, code, coffeecompile, e, evaluatedCode, jscompile;
      this.editorRightLanguage = '';
      try {
        code = CoffeeScript.compile(this.getEditorLeft().getValue(), {
          bare: true
        });
        console.log('compiled coffee!');
        this.getEditorRight().setValue(code);
        this.getWindowRight().show();
        this.editorLeft.getSession().setMode("ace/mode/coffee");
        this.editorRightLanguage = 'c';
        try {
          this.setOutEditorLeft(eval(code));
          console.log('eval coffee!');
        } catch (_error) {
          coffeecompile = _error;
          this.setOutEditorLeft(JSON.stringify(coffeecompile, null, '&nbsp;').replace(/\n/g, '<br/>'));
          return;
        }
        return a = 0;
      } catch (_error) {
        e = _error;
        this.getWindowRight().hide();
        code = this.getEditorLeft().getValue();
        try {
          evaluatedCode = eval(code);
          console.log('eval js!');
          this.editorRightLanguage = 'js';
          this.editorLeft.getSession().setMode("ace/mode/javascript");
          this.setOutEditorLeft(evaluatedCode);
        } catch (_error) {
          jscompile = _error;
          console.log(jscompile);
          console.log(code);
          this.setOutEditorLeft(JSON.stringify(jscompile, null, '&nbsp;').replace(/\n/g, '<br/>'));
          return;
          return this.setOutEditorLeft(JSON.stringify(e, null, '&nbsp;').replace(/\n/g, '<br/>'));
        }
      }
    };

    editor.prototype.getEditorRight = function() {
      if (this.editorRight !== null) {
        return this.editorRight;
      }
      this.editorRight = ace.edit(this.getUuidRight());
      this.editorRight.setTheme("ace/theme/monokai");
      this.editorRight.getSession().setMode("ace/mode/" + this.getWindowRight().data('lang'));
      return this.editorRight;
    };

    editor.prototype.run = function() {
      this.getWindowRight().find('.code').attr('id', this.getUuidRight());
      this.getWindowLeft().find('.code').attr('id', this.getUuidLeft());
      this.getEditorRight();
      this.getEditorLeft();
      return this.evalEditor();
    };

    return editor;

  })();

  $(document).ready(function() {
    return $('.editor').each(function(i, el) {
      $(el).find('.code').height($(window).height() - 100);
      return (new editor($(el))).run();
    });
  });

}).call(this);

/*
//@ sourceMappingURL=main.map
*/
