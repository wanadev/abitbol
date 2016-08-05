"use strict";

function cleanJs(js) {
    // remove function fn(param) {
    // or fn(param) {
    // or (param) => {
    var c;
    var p = 0;
    for (var i = 0 ; i < js.length ; i++) {
        c = js[i];
        if (c == "(") {
            ++p;
        } else if (c == ")") {
            --p;
        } else if (c == "{" && p === 0) {
            js = js.slice(i + 1);
            break;
        }
    }

    // remove comments (not super safe but should work in most cases)
    js = js.replace(/\/\*(.|\r|\n)*?\*\//g, "");
    js = js.replace(/\/\/.*?\r?\n/g, "\n");

    // remove indentation and CR/LF
    js = js.replace(/\s*\r?\n\s*/g, "");

    return js;
}

function extractStrings(js) {
    var strings = [];

    var instr = false;
    var inesc = false;
    var quote;
    var buff;
    var c;

    for (var i = 0 ; i < js.length ; i++) {
        c = js[i];

        if (!instr) {
            // New string
            if (c == "\"" || c == "'") {
                instr = true;
                inesc = false;
                quote = c;
                buff = "";
            // Char we don't care about
            } else if ([" ", " ", "\n", "\r", ";"].indexOf(c) > -1) {  // jshint ignore:line
                continue;
            // Other expression -> job finished!
            } else {
                break;
            }
        } else {
            if (!inesc) {
                // Escaped char
                if (c == "\\") {
                    inesc = true;
                // End of string
                } else if (c == quote) {
                    strings.push(buff);
                    instr = false;
                // Any char
                } else {
                    buff += c;
                }
            } else {
                if (c == "\\") {
                    buff += "\\";
                } else if (c == "n") {
                    buff += "\n";
                } else if (c == "r") {
                    buff += "\r";
                } else if (c == "t") {
                    buff += "\t";
                } else if (c == quote) {
                    buff += quote;
                // We don't care...
                } else {
                    buff += "\\" + c;
                }
                inesc = false;
            }
        }
    }

    return strings;
}

function autoCast(value) {
    if (value == "true") {
        return true;
    } else if (value == "false") {
        return false;
    } else if (value == "null") {
        return null;
    } else if (value == "undefined") {
        return undefined;
    } else if (value.match(/^([0-9]+\.?|[0-9]*\.[0-9]+)$/)) {
        return parseFloat(value);
    } else {
        return value;
    }
}

function extractAnnotations(func) {
    var js = cleanJs(func.toString());
    var strings = extractStrings(js);

    var annotations = {};
    var string;
    var key;
    var value;

    for (var i = 0 ; i < strings.length ; i++) {
        string = strings[i].trim();

        if (string.indexOf("@") !== 0) {
            continue;
        }

        key = string.slice(1, (string.indexOf(" ") > -1) ? string.indexOf(" ") : string.length);
        value = true;
        if (string.indexOf(" ") > -1) {
            value = string.slice(string.indexOf(" ") + 1, string.length);
            value = value.trim();
            value = autoCast(value);
        }

        annotations[key] = value;
    }

    return annotations;
}

module.exports = extractAnnotations;
