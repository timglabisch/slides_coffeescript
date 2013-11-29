class editor

  uuid: null
  editorLeft: null
  editorRight: null
  editorRightLanguage: null

  constructor: (@dom) ->

  getUuid: ->
    @uuid || @uuid = '_' + parseInt(Math.random() * 100000000)

  getUuidRight: ->
    @getUuid() + '_right'

  getUuidLeft: ->
    @getUuid() + '_left'

  getWindowRight: ->
    @dom.find '.window.right'

  getWindowLeft: ->
    @dom.find '.window.left'

  destroy: ->
    @getEditorLeft().destroy()
    @getEditorRight().destroy()

  setOutEditorLeft: (out) ->
    out = "undefined" if typeof out == "undefined"
    @getWindowLeft().find('.res').html @editorRightLanguage + ': ' + out.toString()

  getEditorLeft: ->
    return @editorLeft if @editorLeft != null
    @editorLeft = ace.edit @getUuidLeft()
    @editorLeft.setTheme "ace/theme/monokai"
    #@editorLeft.getSession().setMode("ace/mode/" + @getWindowLeft().data('lang'))
    @editorLeft.on 'change', (e) => @evalEditor()
    @editorLeft

  evalEditor: ->
      @editorRightLanguage = ''
      try
        code = CoffeeScript.compile @getEditorLeft().getValue(), bare: on
        console.log 'compiled coffee!'
        @getEditorRight().setValue code
        @getWindowRight().show()
        @editorLeft.getSession().setMode("ace/mode/coffee")
        # we have coffeescript !
        @editorRightLanguage = 'c'
        try
          @setOutEditorLeft eval code
          console.log 'eval coffee!', code
        catch coffeecompile
          @setOutEditorLeft JSON.stringify(coffeecompile, null, '&nbsp;').replace(/\n/g, '<br/>')
          return
        a = 0
      catch e
        @getWindowRight().hide()
        code = @getEditorLeft().getValue()
        try
          evaluatedCode = eval code
          console.log 'eval js!'
          # yay, it's js :)
          @editorRightLanguage = 'js'
          @editorLeft.getSession().setMode("ace/mode/javascript")
          @setOutEditorLeft evaluatedCode
          return;
        catch jscompile
          console.log jscompile
          console.log code
          @setOutEditorLeft JSON.stringify(jscompile, null, '&nbsp;').replace(/\n/g, '<br/>')
          return;

          @setOutEditorLeft JSON.stringify(e, null, '&nbsp;').replace(/\n/g, '<br/>')

  getEditorRight: ->
    return @editorRight if @editorRight != null
    @editorRight = ace.edit @getUuidRight()
    @editorRight.setTheme "ace/theme/monokai"
    @editorRight.getSession().setMode("ace/mode/" + @getWindowRight().data('lang'))
    @editorRight

  run: ->
    @getWindowRight().find('.code').attr 'id', @getUuidRight()
    @getWindowLeft().find('.code').attr 'id', @getUuidLeft()

    @getEditorRight()
    @getEditorLeft()
    @evalEditor()


Reveal.addEventListener 'slidechanged',  ->

  try document.editor.destroy()

  $(arguments[0].currentSlide).find('.editor').each (i, el) ->
    $(el).find('.code').height $(window).height() - 100
    document.editor = new editor $(el)
    document.editor.run()



