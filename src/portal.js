import TurndownService from 'turndown';
import showdown from 'showdown';

const kityContainer = document.createElement('div');
kityContainer.style.position = "absolute";
kityContainer.style.top = "-99999px";
kityContainer.style.visibility = "hidden";
document.documentElement.appendChild(kityContainer);
let kfe;

const factory = window.kf.EditorFactory.create( kityContainer, {
    render: {
        fontsize: 24
    },
    resource: {
        path: "http://static.xiao5market.com//kityformula/resource/"
    }
} );

factory.ready( function () {

    kfe = window.kfe = this;

} );

const turndownService = new TurndownService({
    codeBlockStyle: 'fenced',
    blankReplacement: function(content, node) {
        if(node.tagName === 'U') {
            return node.outerHTML;
        }

        return node.isBlock ? '\n\n' : '';
    }
});

const Mapping_role = {
    "emphasize": "E",
    "wave": "W"
};

const Mapping_role_reversed = {};

const Mapping_class = {
    "top_question": "C_TQ",
    "small_question": "C_SMQ",
    "sub_question": "C_SUQ",
    "material_title": "C_MT",
    "material_options": "C_MO",
    "top-sequence": "C_TS",
    "outer-question-area": "C_OQA",
    "question-score": "C_QS"
};

const Mapping_class_reversed = {};

const render_class = {
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
let ossDomain = "static.xiao5market.com";
let imgPlaceHolder = "https://pyds.oss-cn-beijing.aliyuncs.com/uploads/question_img/2019-07-10/ca6752a2-3db8-4211-9d88-f53bc6070eef.png";

export function portalConfig(domain = "http://static.xiao5market.com", placeHolder = "https://pyds.oss-cn-beijing.aliyuncs.com/uploads/question_img/2019-07-10/ca6752a2-3db8-4211-9d88-f53bc6070eef.png") {
    domain.replace(/(https?:\/\/)(.+)/, function($, $1,$2) {
        ossPortal = $1;
        ossDomain = $2;
    });
    imgPlaceHolder = placeHolder?placeHolder:imgPlaceHolder;
}

portalConfig(window.Laravel.prefix || "");

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
/**
 * Process Markdown `<pre><code>` blocks.
 */
showdown.subParser('codeBlocks', function (text) {
    return text;
});
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

const inlineRegExp      = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})?x([*\d]+[A-Za-z%]{0,4})?)?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)({:[^}]*})?/g,
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

/**
 * config turndownService
 */

turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement: function (content) {
        return '~~' + content + '~~'
    }
});

turndownService.addRule('sub', {
    filter: ['sub'],
    replacement: function (content) {
        return '<sub>' + content + '</sub>'
    }
});

turndownService.addRule('u', {
    filter: ['u'],
    replacement: function (content) {
        return '<u>' + content + '</u>'
    }
});

turndownService.addRule('sup', {
    filter: ['sup'],
    replacement: function (content) {
        return '<sup>' + content + '</sup>'
    }
});

turndownService.addRule('table', {
    filter: ['table'],
    replacement: function (content, node) {
        return node.outerHTML;
    }
});

turndownService.addRule('dataRole', {
    filter: ['span', 'p'],
    replacement: function (content, el) {
        const key = getKey(el.getAttribute('data-role'));
        const cln = el.className;
        const classKeys = Object.keys(Mapping_class);
        const cll = Array.prototype.slice.call(el.classList).filter(element => classKeys.includes(element));
        const latex = el.getAttribute('data-latex');
        const style = el.style;
        const lineHeight = style.lineHeight;

        if(cln.indexOf('mathquill-rendered-math') > -1 && latex) {
            return toLatex(latex);
            //return el.outerHTML;
        } else if(cll.length > 0){
            const classKey = getClassKey(cll[0]);
            return `%${classKey}%${content}%${classKey}%`;
        } else if(key) {
            return `%${key}%${content}%${key}%`;
        } else if(lineHeight) {
            return `%lh(${lineHeight})%${content}%lh%`;
        } else if(el.tagName === 'P') {
            return '\n\n' + content + '\n\n';
        } else {
            return content;
        }

    }
});

turndownService.addRule('image', {
    filter: ['img'],
    replacement: function (content, node) {
        const title = node.getAttribute('title');
        const latex = node.getAttribute('data-latex');
        const style = node.style;
        const parentStyle = node.parentNode.style;
        const float = style.float || parentStyle.float || "";

        if(title === '点击并拖拽以移动') {
            return content;
        } else {
            const alt = node.alt || '';
            let src = node.getAttribute('src') || '';
            const titlePart = title ? ' "' + title + '"' : '';
            const width = node.width || "";
            const height = node.height || "";
            let attrs = '';

            src = src.replace(/(https?:\/\/([^/]+))\/(.+)/, function(m, $1, $2, $3) {
                //本站图片
                if($2 === ossDomain) {
                    return `/${$3}`;
                } else {
                    //外站图片
                    return imgPlaceHolder;
                }
            });

            if(float) {
                attrs += ` style="float: ${float};"`;
            }

            if(latex) {
                attrs += ` data-latex=${encodeURIComponent(latex)}`;
            }

            return src ? ('![' + alt + ']' + '(' + src + ( (width || height)?` =${width}x${height}`:'') + titlePart + ')' + (attrs?`{:${attrs}}`:'')) : '';
        }
    }
});

function toLatex(content) {
    return `$$${encodeURIComponent(content)}$$`;
}

const converter = new showdown.Converter({ extensions: ['dataRole', 'images'] });

export function toHtml(markdown) {
    return converter.makeHtml(markdown);
}

export function toMarkdown(html) {
    html = html.replace(/^_+/mg, function(content) {return '<u>' + content + '</u>';});
    return turndownService.turndown(html);
}

function latexToImage(md, callback) {
    const match = md.match(/\$\$\n?(.*?)\n?\$\$/);
    if(match) {
        try {
            kfe.execCommand( "render", decodeURIComponent(match[1]));
            try{
                kfe.execCommand( "focus" );
            } catch (e) {
                //TODO log errors;
            }
            kfe.execCommand("get.image.data", function(data) {
                latexToImage(md.replace(/\$\$\n?(.*?)\n?\$\$/, `<img class="kfformula" src="${data.img}" data-latex="${decodeURIComponent(match[1])}" />`), callback);
            });

        } catch (e) {
            callback(md);
        }

    } else {
        callback(md);
    }
}

export function editorToMarkdown(value, callback) {

    factory.ready(() => {
        // 如果原值为html，先转化为markdown
        if(value.match(/<p>/) || value.match(/<span>/)) {
            value = toMarkdown(value);
        }

        //将含有latex表达式的图片转化为base64
        latexToImage(value, callback)
    });

}

export function markdownToServer(md) {
    return imageTolatex(md);
}

export function log(markdown, html) {
    //console.log(markdown, html);
}