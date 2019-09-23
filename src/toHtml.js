
var Mapping_role = {
    "emphasize": "E",
    "wave": "W"
};

var Mapping_role_reversed = {};

var Mapping_class = {
    "top_question": "C_TQ",
    "small_question": "C_SMQ",
    "sub_question": "C_SUQ",
    "material_title": "C_MT",
    "material_options": "C_MO",
    "top-sequence": "C_TS",
    "outer-question-area": "C_OQA",
    "question-score": "C_QS"
};

var Mapping_class_reversed = {};

var render_class = {
    C_TQ: renderClassSpan,
    C_SMQ: renderClassSpan,
    C_SUQ: renderClassSpan,
    C_TS: renderClassSpan,
    C_OQA: renderClassSpan,
    C_QS: renderClassSpan,
    C_MT: renderClassP,
    C_MO: renderClassP
};

function renderClassSpan(key, content) {
    return `<span class="${getClass(key)}">${content}</span>`;
}

function renderClassP(key, content) {
    return `<p class="${getClass(key)}">${content}</p>`;
}

let ossPortal = "http://";
let ossDomain = "pyds.oss-cn-beijing.aliyuncs.com";
let imgPlaceHolder = "https://pyds.oss-cn-beijing.aliyuncs.com/uploads/question_img/2019-07-10/ca6752a2-3db8-4211-9d88-f53bc6070eef.png";

Object.keys(Mapping_role).forEach(role => {
    Mapping_role_reversed[Mapping_role[role]] = role;
});

Object.keys(Mapping_class).forEach(role => {
    Mapping_class_reversed[Mapping_class[role]] = role;
});

function getRole(key) {
    return Mapping_role_reversed[key] || "";
}

function getKey(role) {
    return Mapping_role[role] || "";
}

function getClass(key) {
    return Mapping_class_reversed[key] || "";
}

function getClassKey(role) {
    return Mapping_class[role] || "";
}

/**
 * config showndown instance
 */
showdown.setFlavor('github');
showdown.extension('dataRole', function() {
    'use strict';

    return {
        type: 'lang', //or output
        filter: function (text) {

            text = text.replace(/%lh\(([0-9.]+?(%|pt|px)?)\)%/g, '<span style="line-height:$1;">');
            text = text.replace(/%lh%/g, '</span>');

            while(text.match(/%(C_[A-Z]+?)%([\s\S]+?)%\1%/)) {
                text = text.replace(/%(C_[A-Z]+?)%([\s\S]+?)%(\1)%/, function(match, $1, $2) {
                    if(Mapping_class_reversed[$1]) {
                        return render_class[$1]($1, $2);
                    } else {
                        return match;
                    }
                });
            }

            while(text.match(/%([A-Z])%([\s\S]+)%\1%/)) {
                text = text.replace(/%([A-Z])%([\s\S]+)%(\1)%/, function(match, $1, $2) {
                    return `<span data-role="${getRole($1)}">${$2}</span>`;
                });
            }
            return text;
        }
    };
});

var inlineRegExp      = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})?x([*\d]+[A-Za-z%]{0,4})?)?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)({:[^}]*})?/g,
    crazyRegExp       = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})?x([*\d]+[A-Za-z%]{0,4})?)?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)({:[^}]*})?/g,
    base64RegExp      = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)({:[^}]*})?/g,
    referenceRegExp   = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()({:[^}]*})?/g,
    refShortcutRegExp = /!\[([^[\]]+)]()()()()()({:[^}]*})?/g;

showdown.extension('images', function() {
    'use strict';

    return {
        type: 'lang', //or output
        filter: function(text) {

            function writeImageTagBase64 (wholeMatch, altText, linkId, url, width, height, m5, title, attrs) {
                url = url.replace(/\s/g, '');
                return writeImageTag (wholeMatch, altText, linkId, url, width, height, m5, title, attrs);
            }

            function writeImageTag (wholeMatch, altText, linkId, url, width, height, m5, title, attrs) {

                if (!title) {
                    title = '';
                }
                // Special case for explicit empty url
                if (wholeMatch.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1) {
                    url = '';
                }

                altText = altText
                    .replace(/"/g, '&quot;')
                    //altText = showdown.helper.escapeCharacters(altText, '*_', false);
                    .replace(showdown.helper.regexes.asteriskDashAndColon, showdown.helper.escapeCharactersCallback);
                //url = showdown.helper.escapeCharacters(url, '*_', false);
                url = url.replace(showdown.helper.regexes.asteriskDashAndColon, showdown.helper.escapeCharactersCallback);
                if(url[0] === '/') {
                    url = `${ossPortal}${ossDomain}${url}`;
                }
                var result = '<img src="' + url + '" alt="' + altText + '"';

                if (title && showdown.helper.isString(title)) {
                    title = title
                        .replace(/"/g, '&quot;')
                        //title = showdown.helper.escapeCharacters(title, '*_', false);
                        .replace(showdown.helper.regexes.asteriskDashAndColon, showdown.helper.escapeCharactersCallback);
                    result += ' title="' + title + '"';
                }

                if (width) {
                    width  = (width === '*') ? 'auto' : width;

                    result += ' width="' + width + '"';
                }

                if (height) {
                    height = (height === '*') ? 'auto' : height;

                    result += ' height="' + height + '"';
                }

                if(attrs) {
                    result += attrs.replace(/({:)|}/g, '').replace(/data-latex=(\S+)/, function(match, $1) {
                        return `data-latex="${decodeURIComponent($1)}" class="kfformula"`;
                    });
                }

                result += ' />';

                return result;
            }

            // First, handle reference-style labeled images: ![alt text][id]
            text = text.replace(referenceRegExp, writeImageTag);

            // Next, handle inline images:  ![alt text](url =<width>x<height> "optional title")

            // base64 encoded images
            text = text.replace(base64RegExp, writeImageTagBase64);

            // cases with crazy urls like ./image/cat1).png
            text = text.replace(crazyRegExp, writeImageTag);

            // normal cases
            text = text.replace(inlineRegExp, writeImageTag);

            // handle reference-style shortcuts: ![img text]
            text = text.replace(refShortcutRegExp, writeImageTag);


            return text;
        }
    };
});

function imageTolatex (text) {


    function writeImageTagBase64 (wholeMatch, altText, linkId, url, width, height, m5, title, attrs) {
        url = url.replace(/\s/g, '');
        return writeImageTag (wholeMatch, altText, linkId, url, width, height, m5, title, attrs);
    }

    function writeImageTag (wholeMatch, altText, linkId, url, width, height, m5, title, attrs) {

        let result = wholeMatch;

        attrs && attrs.replace(/data-latex=([^}]+)/, function(w, latex) {
           result = toLatex(decodeURIComponent(latex));
        });

        return result;
    }

    // First, handle reference-style labeled images: ![alt text][id]
    text = text.replace(referenceRegExp, writeImageTag);

    // Next, handle inline images:  ![alt text](url =<width>x<height> "optional title")

    // base64 encoded images
    text = text.replace(base64RegExp, writeImageTagBase64);

    // cases with crazy urls like ./image/cat1).png
    text = text.replace(crazyRegExp, writeImageTag);

    // normal cases
    text = text.replace(inlineRegExp, writeImageTag);

    // handle reference-style shortcuts: ![img text]
    text = text.replace(refShortcutRegExp, writeImageTag);


    return text;
}

var converter = new showdown.Converter({ extensions: ['dataRole', 'images'] });

if(!window.pyUtils) {
    window.pyUtils = {};
}

function toHtml(markdown) {
    return converter.makeHtml(markdown);
}

window.pyUtils.toHtml = toHtml;