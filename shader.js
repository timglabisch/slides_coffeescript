
var saveButton, forkButton, parentButton, diffButton;
var effect_owner=false;
var original_code='';
var original_version='';

function initialize_compressor(){
    return null;
}

function initialize_helper() {
    window.onhashchange = function() { load_url_code(); };

    if (typeof localStorage !== 'undefined') {
        if ( !localStorage.getItem('glslsandbox_user') ) {
            localStorage.setItem('glslsandbox_user', generate_user_id());
        }
    } else {
        // This fallback shouldn't be used by any browsers that are able to commit code.
        localStorage = { getItem: function(x) { return 'invalid_user'; } };
    }
}

function generate_user_id() {
    return (Math.random()*0x10000000|0).toString(16);
}

function get_user_id() {
    return localStorage.getItem('glslsandbox_user');
}

function am_i_owner() {
    return (effect_owner && effect_owner==get_user_id());
}

function load_url_code() {
    if ( window.location.hash!='') {

        load_code(window.location.hash.substr(1));

    } else {

        code.setValue(document.getElementById( 'example' ).text);
        original_code = document.getElementById( 'example' ).text;

    }
}

function add_server_buttons() {
    saveButton = document.createElement( 'button' );
    saveButton.style.visibility = 'hidden';
    saveButton.textContent = 'save';
    saveButton.addEventListener( 'click', save, false );
    toolbar.appendChild( saveButton );

    parentButton = document.createElement( 'a' );
    parentButton.style.visibility = 'hidden';
    parentButton.textContent = 'parent';
    parentButton.href = original_version;
    toolbar.appendChild( parentButton );

    diffButton = document.createElement( 'a' );
    diffButton.style.visibility = 'hidden';
    diffButton.textContent = 'diff';
    diffButton.href = '/';
    toolbar.appendChild( diffButton );

    set_parent_button('visible');
}

function set_save_button(visibility) {
    if(original_code==code.getValue())
        saveButton.style.visibility = 'hidden';
    else
        saveButton.style.visibility = visibility;
}

function set_parent_button(visibility) {
    if(original_version=='') {
        parentButton.style.visibility = 'hidden';
        diffButton.style.visibility = 'hidden';
    } else {
        parentButton.style.visibility = visibility;
        diffButton.style.visibility = visibility;
    }
}


function get_img( width, height ) {
    canvas.width = width;
    canvas.height = height;
    parameters.screenWidth = width;
    parameters.screenHeight = height;

    gl.viewport( 0, 0, width, height );
    createRenderTargets();
    resetSurface();

    render();

    img=canvas.toDataURL('image/png');

    onWindowResize();

    return img;
}

function save() {
    img=get_img(200, 100);

    data={
        "code": code.getValue(),
        "image": img,
        "user": get_user_id()
    }

    loc='/e';

    if(am_i_owner())
        data["code_id"]=window.location.hash.substr(1);
    else {
        data["parent"]=window.location.hash.substr(1);
    }

    $.post(loc,
        JSON.stringify(data),
        function(result) {
            window.location.replace('/e#'+result);
            load_url_code();
        }, "text");
}

function load_code(hash) {
    if (gl) {
        compileButton.title = '';
        compileButton.style.color = '#ffff00';
        compileButton.textContent = 'Loading...';
    }
    set_save_button('hidden');
    set_parent_button('hidden');

    $.getJSON('/item/'+hash, function(result) {
        compileOnChangeCode = false;  // Prevent compile timer start
        code.setValue(result['code']);
        original_code=code.getValue();

        if(result['parent']) {
            original_version=result['parent'];
            parentButton.href = original_version;
            diffButton.href = 'diff#' + original_version.substring(3) + '-vs-' + hash;
            set_parent_button('visible');
        } else {
            original_version='';
            parentButton.href = '/';
            diffButton.href = '/';
            set_parent_button('hidden');
        }

        effect_owner=result['user'];

        if(am_i_owner())
            saveButton.textContent = 'save';
        else
            saveButton.textContent = 'fork';

        resetSurface();
        compile();
        compileOnChangeCode = true;
    });
}

// dummy functions

function setURL(fragment) {
}



CodeMirror.defineMode("glsl", function(config, parserConfig) {
    var indentUnit = config.indentUnit,
        keywords = parserConfig.keywords || {},
        builtins = parserConfig.builtins || {},
        blockKeywords = parserConfig.blockKeywords || {},
        atoms = parserConfig.atoms || {},
        hooks = parserConfig.hooks || {},
        multiLineStrings = parserConfig.multiLineStrings;
    var isOperatorChar = /[+\-*&%=<>!?|\/]/;

    var curPunc;

    function tokenBase(stream, state) {
        var ch = stream.next();
        if (hooks[ch]) {
            var result = hooks[ch](stream, state);
            if (result !== false) return result;
        }
        if (ch == '"' || ch == "'") {
            state.tokenize = tokenString(ch);
            return state.tokenize(stream, state);
        }
        if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
            curPunc = ch;
            return "bracket";
        }
        if (/\d/.test(ch)) {
            stream.eatWhile(/[\w\.]/);
            return "number";
        }
        if (ch == "/") {
            if (stream.eat("*")) {
                state.tokenize = tokenComment;
                return tokenComment(stream, state);
            }
            if (stream.eat("/")) {
                stream.skipToEnd();
                return "comment";
            }
        }
        if (isOperatorChar.test(ch)) {
            stream.eatWhile(isOperatorChar);
            return "operator";
        }
        stream.eatWhile(/[\w\$_]/);
        var cur = stream.current();
        if (keywords.propertyIsEnumerable(cur)) {
            if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
            return "keyword";
        }
        if (builtins.propertyIsEnumerable(cur)) {
            return "builtin";
        }
        if (atoms.propertyIsEnumerable(cur)) return "atom";
        return "word";
    }

    function tokenString(quote) {
        return function(stream, state) {
            var escaped = false, next, end = false;
            while ((next = stream.next()) != null) {
                if (next == quote && !escaped) {end = true; break;}
                escaped = !escaped && next == "\\";
            }
            if (end || !(escaped || multiLineStrings))
                state.tokenize = tokenBase;
            return "string";
        };
    }

    function tokenComment(stream, state) {
        var maybeEnd = false, ch;
        while (ch = stream.next()) {
            if (ch == "/" && maybeEnd) {
                state.tokenize = tokenBase;
                break;
            }
            maybeEnd = (ch == "*");
        }
        return "comment";
    }

    function Context(indented, column, type, align, prev) {
        this.indented = indented;
        this.column = column;
        this.type = type;
        this.align = align;
        this.prev = prev;
    }
    function pushContext(state, col, type) {
        return state.context = new Context(state.indented, col, type, null, state.context);
    }
    function popContext(state) {
        var t = state.context.type;
        if (t == ")" || t == "]" || t == "}")
            state.indented = state.context.indented;
        return state.context = state.context.prev;
    }

    // Interface

    return {
        startState: function(basecolumn) {
            return {
                tokenize: null,
                context: new Context((basecolumn || 0) - indentUnit, 0, "top", false),
                indented: 0,
                startOfLine: true
            };
        },

        token: function(stream, state) {
            var ctx = state.context;
            if (stream.sol()) {
                if (ctx.align == null) ctx.align = false;
                state.indented = stream.indentation();
                state.startOfLine = true;
            }
            if (stream.eatSpace()) return null;
            curPunc = null;
            var style = (state.tokenize || tokenBase)(stream, state);
            if (style == "comment" || style == "meta") return style;
            if (ctx.align == null) ctx.align = true;

            if ((curPunc == ";" || curPunc == ":") && ctx.type == "statement") popContext(state);
            else if (curPunc == "{") pushContext(state, stream.column(), "}");
            else if (curPunc == "[") pushContext(state, stream.column(), "]");
            else if (curPunc == "(") pushContext(state, stream.column(), ")");
            else if (curPunc == "}") {
                while (ctx.type == "statement") ctx = popContext(state);
                if (ctx.type == "}") ctx = popContext(state);
                while (ctx.type == "statement") ctx = popContext(state);
            }
            else if (curPunc == ctx.type) popContext(state);
            else if (ctx.type == "}" || ctx.type == "top" || (ctx.type == "statement" && curPunc == "newstatement"))
                pushContext(state, stream.column(), "statement");
            state.startOfLine = false;
            return style;
        },

        indent: function(state, textAfter) {
            if (state.tokenize != tokenBase && state.tokenize != null) return 0;
            var firstChar = textAfter && textAfter.charAt(0), ctx = state.context, closing = firstChar == ctx.type;
            if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : indentUnit);
            else if (ctx.align) return ctx.column + (closing ? 0 : 1);
            else return ctx.indented + (closing ? 0 : indentUnit);
        },

        electricChars: "{}"
    };
});

(function() {
    function words(str) {
        var obj = {}, words = str.split(" ");
        for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
        return obj;
    }
    var glslKeywords = "attribute const uniform varying break continue " +
        "do for while if else in out inout float int void bool true false " +
        "lowp mediump highp precision invariant discard return mat2 mat3 " +
        "mat4 vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 sampler2D " +
        "samplerCube struct gl_FragCoord gl_FragColor";
    var glslBuiltins = "radians degrees sin cos tan asin acos atan pow " +
        "exp log exp2 log2 sqrt inversesqrt abs sign floor ceil fract mod " +
        "min max clamp mix step smoothstep length distance dot cross " +
        "normalize faceforward reflect refract matrixCompMult lessThan " +
        "lessThanEqual greaterThan greaterThanEqual equal notEqual any all " +
        "not dFdx dFdy fwidth texture2D texture2DProj texture2DLod " +
        "texture2DProjLod textureCube textureCubeLod";

    function cppHook(stream, state) {
        if (!state.startOfLine) return false;
        stream.skipToEnd();
        return "meta";
    }

    // C#-style strings where "" escapes a quote.
    function tokenAtString(stream, state) {
        var next;
        while ((next = stream.next()) != null) {
            if (next == '"' && !stream.eat('"')) {
                state.tokenize = null;
                break;
            }
        }
        return "string";
    }

    CodeMirror.defineMIME("text/x-glsl", {
        name: "glsl",
        keywords: words(glslKeywords),
        builtins: words(glslBuiltins),
        blockKeywords: words("case do else for if switch while struct"),
        atoms: words("null"),
        hooks: {"#": cppHook}
    });
}());
