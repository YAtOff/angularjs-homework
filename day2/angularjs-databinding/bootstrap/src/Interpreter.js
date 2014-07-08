var evaluate = (function() {
    var lex = function (input) {
        var isOperator = function (c) { return /[+\-*\/\^%=(),.|!]/.test(c); },
            isDigit = function (c) { return /[0-9]/.test(c); },
            isWhiteSpace = function (c) { return /\s/.test(c); },
            isIdentifier = function (c) { return typeof c === "string" && !isOperator(c) && !isDigit(c) && !isWhiteSpace(c); };

        var tokens = [], c, i = 0;
        var advance = function () { return c = input[++i]; };
        var addToken = function (type, value) {
            tokens.push({
                type: type,
                value: value
            });
        };
        while (i < input.length) {
            c = input[i];
            if (isWhiteSpace(c)) advance();
            else if (isOperator(c)) {
                addToken(c);
                advance();
            }
            else if (isDigit(c)) {
                var num = c;
                while (isDigit(advance())) num += c;
                if (c === ".") {
                    do num += c; while (isDigit(advance()));
                }
                num = parseFloat(num);
                if (!isFinite(num)) throw "Number is too large or too small for a 64-bit double.";
                addToken("number", num);
            }
            else if (isIdentifier(c)) {
                var idn = c;
                while (isIdentifier(advance())) idn += c;
                addToken("identifier", idn);
            }
            else throw "Unrecognized token.";
        }
        addToken("(end)");
        return tokens;
    };

    var parse = function (tokens) {
        var symbols = {},
        symbol = function (id, nud, lbp, led) {
            var sym = symbols[id] || {};
            symbols[id] = {
                lbp: sym.lbp || lbp,
                nud: sym.nud || nud,
                led: sym.lef || led
            };
        };

        var interpretToken = function (token) {
            var sym = Object.create(symbols[token.type]);
            sym.type = token.type;
            sym.value = token.value;
            return sym;
        };

        var i = 0, token = function () { return interpretToken(tokens[i]); };
        var advance = function () { i++; return token(); };

        var expression = function (rbp) {
            var left, t = token();
            advance();
            if (!t.nud) throw "Unexpected token: " + t.type;
            left = t.nud(t);
            while (rbp < token().lbp) {
                t = token();
                advance();
                if (!t.led) throw "Unexpected token: " + t.type;
                left = t.led(left);
            }
            return left;
        };

        var infix = function (id, lbp, rbp, led) {
            rbp = rbp || lbp;
            symbol(id, null, lbp, led || function (left) {
                return {
                    type: id,
                    left: left,
                    right: expression(rbp)
                };
            });
        },
        prefix = function (id, rbp) {
            symbol(id, function () {
                return {
                    type: id,
                    right: expression(rbp)
                };
            });
        };


        symbol(",");
        symbol(")");
        symbol("(end)");

        symbol("number", function (number) {
            return number;
        });
        symbol("identifier", function (name) {
            if (token().type === "(") {
                var args = [];
                if (tokens[i + 1].type === ")") advance();
                else {
                    do {
                        advance();
                        args.push(expression(2));
                    } while (token().type === ",");
                    if (token().type !== ")") throw "Expected closing parenthesis ')'";
                }
                advance();
                return {
                    type: "call",
                    args: args,
                    name: name.value
                };
            }
            return name;
        });

        symbol("(", function () {
            value = expression(2);
            if (token().type !== ")") throw "Expected closing parenthesis ')'";
            advance();
            return value;
        });

        infix(".", 9);
        infix("|", 8);
        prefix("!", 7);
        prefix("-", 7);
        infix("^", 6, 5);
        infix("*", 4);
        infix("/", 4);
        infix("%", 4);
        infix("+", 3);
        infix("-", 3);

        infix("=", 1, 2, function (left) {
            if (left.type === "identifier") {
                return {
                    type: "assign",
                    name: left.value,
                    value: expression(2)
                };
            }
            else throw "Invalid lvalue";
        });

        return expression(0);
    };

    var evaluate = function (parseTree, context) {

        var operators = {
            "+": function (a, b) { return a + b; },
            "-": function (a, b) {
                if (typeof b === "undefined") return -a;
                return a - b;
            },
            "*": function (a, b) { return a * b; },
            "/": function (a, b) { return a / b; },
            "%": function (a, b) { return a % b; },
            "!": function (a, b) { return !a; }
        };

        var args = {
        };

        var parseNode = function (node) {
            if (node.type === "number") return node.value;
            else if (node.type === ".") {
                return parseNode(node.left)[node.right.value];
            } else if (node.type === "|") {
                var filter = Provider.get(node.right.value + Provider.FILTER_SUFFIX);
                return filter(parseNode(node.left));
            } else if (operators[node.type]) {
                if (node.left) return operators[node.type](parseNode(node.left), parseNode(node.right));
                return operators[node.type](parseNode(node.right));
            }
            else if (node.type === "identifier") {
                var value = args.hasOwnProperty(node.value) ? args[node.value] : context[node.value];
                if (typeof value === "undefined") throw node.value + " is undefined";
                return value;
            }
            else if (node.type === "assign") {
                context[node.name] = parseNode(node.value);
            }
            else if (node.type === "call") {
                for (var i = 0; i < node.args.length; i++) node.args[i] = parseNode(node.args[i]);
                return context[node.name].apply(null, node.args);
            }
        };

        return parseNode(parseTree);
    };

    return function (exp, ctx) {
        return evaluate(parse(lex(exp)), ctx);
    };
})();
