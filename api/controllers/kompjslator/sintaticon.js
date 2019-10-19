let error

function emit_error(expected, tokens, code) {
    error = true
    return JSON.parse(`{"ERROR_${code}": "${expected} expected, found ${tokens.type} in line ${tokens.line} column ${tokens.column}"}`)
}

function terminal(tokens, terminal) {
    if (tokens[0].type == terminal) tokens.shift();
}

function unbending(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "main": stack.push("bk"); stack.push("main"); break;
        default: return exits.compiler_error(
            emit_error('main', tokens[0], 1)
        )
    }
}

function bk(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "chave_esq": stack.push("chave_dir"); stack.push("expr"); stack.push("chave_esq"); break;
        default: return exits.compiler_error(
            emit_error('chave_esq', tokens[0], 2)
        )
    }
}

function stmt(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "nome_var": stack.push("stmt_line"); stack.push("nome_var"); break;
        case "t_boolean": stack.push("stmt_line"); stack.push("valor"); break;
        case "t_integer": stack.push("stmt_line"); stack.push("valor"); break;
        case "t_float": stack.push("stmt_line"); stack.push("valor"); break;
        default: return exits.compiler_error(
            emit_error('value or variable', tokens[0], 3)
        )
    }
}

function stmt_line(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "chave_dir": break;
        case "nome_var": break;
        case "sign_rel": stack.push("stmt"); stack.push("sign_rel"); break;
        case "sign_lo": stack.push("stmt"); stack.push("sign_lo"); break;
        case "t_boolean": break;
        case "if": break;
        case "par_dir": break;
        case "while": break;
        case "do": break;
        case "integer": break;
        case "float": break;
        case "boolean": break;
        case "read": break;
        case "write": break;
        default: return exits.compiler_error(
            emit_error('logical or relational symbol', tokens[0], 4)
        )
    }
}

function expr(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "nome_var": stack.push("A"); break;
        case "t_boolean": stack.push("A"); break;
        case "if": stack.push("B"); break;
        case "while": stack.push("C"); break;
        case "do": stack.push("C"); break;
        case "integer": stack.push("A"); break;
        case "float": stack.push("A"); break;
        case "boolean": stack.push("A"); break;
        case "read": stack.push("D"); break;
        case "write": stack.push("D"); break;
        default: return exits.compiler_error(
            emit_error('boolean value or variable or variable declaration or conditional structure or repeating structure or read or write command', tokens[0], 5)
        )
    }
}

function A(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "nome_var": stack.push("DUMMIE"); stack.push("AUX"); stack.push("nome_var"); break;
        case "t_boolean": stack.push("DUMMIE"); stack.push("stmt_line"); stack.push("t_boolean"); break;
        case "integer": stack.push("DUMMIE"); stack.push("ev"); stack.push("nome_var"); stack.push("tipo"); break;
        case "float": stack.push("DUMMIE"); stack.push("ev"); stack.push("nome_var"); stack.push("tipo"); break;
        case "boolean": stack.push("DUMMIE"); stack.push("ev"); stack.push("nome_var"); stack.push("tipo"); break;
        default: return exits.compiler_error(
            emit_error('boolean value or variable or variable declaration', tokens[0], 6)
        )
    }
}

function B(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "if": stack.push("DUMMIE"); stack.push("de_line"); break;
        default: return exits.compiler_error(
            emit_error('if', tokens[0], 7)
        )
    }
}

function C(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "while": stack.push("DUMMIE"); stack.push("er"); break;
        case "do": stack.push("DUMMIE"); stack.push("er"); break;
        default: return exits.compiler_error(
            emit_error('repeating structure', tokens[0], 8)
        )
    }
}

function AUX(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "chave_dir": stack.push("stmt_line"); break;
        case "nome_var": stack.push("stmt_line"); break;
        case "sign_rel": stack.push("stmt_line"); break;
        case "sign_lo": stack.push("stmt_line"); break;
        case "t_boolean": stack.push("stmt_line"); break;
        case "recebe": stack.push("recebe_line"); break;
        case "if": stack.push("stmt_line"); break;
        case "while": stack.push("stmt_line"); break;
        case "do": stack.push("stmt_line"); break;
        case "integer": stack.push("stmt_line"); break;
        case "float": stack.push("stmt_line"); break;
        case "boolean": stack.push("stmt_line"); break;
        case "read": stack.push("stmt_line"); break;
        case "write": stack.push("stmt_line"); break;
        default: return exits.compiler_error(
            emit_error('logical or arithmetic expression or attribution to a variable', tokens[0], 9)
        )
    }
}

function D(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "read": stack.push("DUMMIE"); stack.push("cmd_read"); break;
        case "write": stack.push("DUMMIE"); stack.push("cmd_write"); break;
        default: return exits.compiler_error(
            emit_error('read or write command', tokens[0], 10)
        )
    }
}

function DUMMIE(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "chave_dir": break;
        case "nome_var": stack.push("expr"); break;
        case "t_boolean": stack.push("expr"); break;
        case "if": stack.push("expr"); break;
        case "while": stack.push("expr"); break;
        case "do": stack.push("expr"); break;
        case "integer": stack.push("expr"); break;
        case "float": stack.push("expr"); break;
        case "boolean": stack.push("expr"); break;
        case "read": stack.push("expr"); break;
        case "write": stack.push("expr"); break;
        // case "recebe": stack.push("expr"); break;
        default: return exits.compiler_error(
            emit_error('boolean value or variable or variable declaration or conditional structure or repeating structure or read or write command', tokens[0], 5)
        )
    }
}

function dv(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "integer": stack.push("ev"); stack.push("nome_var"); stack.push("tipo"); break;
        case "float": stack.push("ev"); stack.push("nome_var"); stack.push("tipo"); break;
        case "boolean": stack.push("ev"); stack.push("nome_var"); stack.push("tipo"); break;
        default: return exits.compiler_error(
            emit_error('variable declaration', tokens[0], 11)
        )
    }
}

function ev(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "comma": stack.push("ev"); stack.push("nome_var"); stack.push("comma"); break;
        case "semicolon": stack.push("semicolon"); break;
        case "recebe": stack.push("ev"); stack.push("atribuicao_dv_line"); break;
        default: return exits.compiler_error(
            emit_error(', or ; or =', tokens[0], 12)
        )
    }
}

function atribuicao_dv_line(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "recebe": stack.push("atribuicao_dv"); stack.push("recebe"); break;
        default: return exits.compiler_error(
            emit_error('=', tokens[0], 13)
        )
    }
}

function atribuicao_dv(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "nome_var": stack.push("nome_var"); break;
        case "t_boolean": stack.push("valor"); break;
        case "t_integer": stack.push("valor"); break;
        case "t_float": stack.push("valor"); break;
        default: return exits.compiler_error(
            emit_error('value or variable', tokens[0], 3)
        )
    }
}

function valor(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "t_boolean": stack.push("t_boolean"); break;
        case "t_integer": stack.push("t_integer"); break;
        case "t_float": stack.push("t_float"); break;
        default: return exits.compiler_error(
            emit_error('value', tokens[0], 14)
        )
    }
}

function recebe_line(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "recebe": stack.push("atribuicao"); stack.push("recebe"); break;
        default: return exits.compiler_error(
            emit_error('=', tokens[0], 13)
        )
    }
}

function atribuicao(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "nome_var": stack.push("semicolon"); stack.push("op_ar_line"); break;
        case "t_boolean": stack.push("semicolon"); stack.push("op_ar_line"); break;
        case "t_integer": stack.push("semicolon"); stack.push("op_ar_line"); break;
        case "t_float": stack.push("semicolon"); stack.push("op_ar_line"); break;
        case "par_esq": stack.push("semicolon"); stack.push("op_ar_line"); break;
        default: return exits.compiler_error(
            emit_error('arithmetic operation', tokens[0], 15)
        )
    }
}

function de_line(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "if": stack.push("de"); stack.push("bk"); stack.push("par_dir"); stack.push("stmt"); stack.push("par_esq"); stack.push("if"); break;
        default: return exits.compiler_error(
            emit_error('if', tokens[0], 7)
        )
    }
}

function de(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "chave_dir": break;
        case "nome_var": break;
        case "t_boolean": break;
        case "if": break;
        case "while": break;
        case "do": break;
        case "integer": break;
        case "float": break;
        case "boolean": break;
        case "read": break;
        case "write": break;
        case "else": stack.push("bk"); stack.push("else"); break;
        default: return exits.compiler_error(
            emit_error('else', tokens[0], 16)
        )
    }
}

function er(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "while": stack.push("bk"); stack.push("par_dir"); stack.push("stmt"); stack.push("par_esq"); stack.push("while"); break;
        case "do": stack.push("par_dir"); stack.push("stmt"); stack.push("par_esq"); stack.push("while"); stack.push("bk"); stack.push("do"); break;
        default: return exits.compiler_error(
            emit_error('while or do', tokens[0], 17)
        )
    }
}

function op_ar_line(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "nome_var": stack.push("op_ar"); stack.push("mid_line"); break;
        case "t_boolean": stack.push("op_ar"); stack.push("mid_line"); break;
        case "t_integer": stack.push("op_ar"); stack.push("mid_line"); break;
        case "t_float": stack.push("op_ar"); stack.push("mid_line"); break;
        case "par_esq": stack.push("op_ar"); stack.push("mid_line"); break;
        default: return exits.compiler_error(
            emit_error('arithmetic operation', tokens[0], 15)
        )
    }
}

function op_ar(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "semicolon": break;
        case "par_dir": break;
        case "+": stack.push("op_ar_line"); stack.push("+"); break;
        case "-": stack.push("op_ar_line"); stack.push("-"); break;
        default: return exits.compiler_error(
            emit_error('+ or -', tokens[0], 18)
        )
    }
}

function mid_line(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "nome_var": stack.push("mid"); stack.push("inf"); break;
        case "t_boolean": stack.push("mid"); stack.push("inf"); break;
        case "t_integer": stack.push("mid"); stack.push("inf"); break;
        case "t_float": stack.push("mid"); stack.push("inf"); break;
        case "par_esq": stack.push("mid"); stack.push("inf"); break;
        default: return exits.compiler_error(
            emit_error('arithmetic operation', tokens[0], 15)
        )
    }
}

function mid(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "semicolon": break;
        case "par_dir": break;
        case "+": break;
        case "-": break;
        case "*": stack.push("mid_line"); stack.push("*"); break;
        case "/": stack.push("mid_line"); stack.push("/"); break;
        default: return exits.compiler_error(
            emit_error('* or /', tokens[0], 19)
        )
    }
}

function inf(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "nome_var": stack.push("nome_var"); break;
        case "t_boolean": stack.push("valor"); break;
        case "t_integer": stack.push("valor"); break;
        case "t_float": stack.push("valor"); break;
        case "par_esq": stack.push("par_dir"); stack.push("op_ar"); stack.push("par_esq"); break;
        default: return exits.compiler_error(
            emit_error('value or variable or )', tokens[0], 20)
        )
    }
}

function tipo(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "boolean": stack.push("boolean"); break;
        case "integer": stack.push("integer"); break;
        case "float": stack.push("float"); break;
        default: return exits.compiler_error(
            emit_error('variable declaration', tokens[0], 11)
        )
    }
}

function cmd_read(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "read": stack.push("semicolon"); stack.push("nome_var"); stack.push("read"); break;
        default: return exits.compiler_error(
            emit_error('read command', tokens[0], 21)
        )
    }
}

function cmd_write(tokens, stack, exits) {
    switch (tokens[0].type) {
        case "write": stack.push("semicolon"); stack.push("nome_var"); stack.push("write"); break;
        default: return exits.compiler_error(
            emit_error('write command', tokens[0], 22)
        )
    }
}

module.exports = {
    do_sintaticon: function (tokens, exits) {
        error = false;
        let stack = ["unbending"]

        while (stack.length && !error) {
            switch (stack.pop()) {
                case "unbending": unbending(tokens, stack, exits); break;
                case "bk": bk(tokens, stack, exits); break;
                case "stmt": stmt(tokens, stack, exits); break;
                case "stmt_line": stmt_line(tokens, stack, exits); break;
                case "expr": expr(tokens, stack, exits); break;
                case "A": A(tokens, stack, exits); break;
                case "B": B(tokens, stack, exits); break;
                case "C": C(tokens, stack, exits); break;
                case "D": D(tokens, stack, exits); break;
                case "AUX": AUX(tokens, stack, exits); break;
                case "DUMMIE": DUMMIE(tokens, stack, exits); break;
                case "dv": dv(tokens, stack, exits); break;
                case "ev": ev(tokens, stack, exits); break;
                case "atribuicao_dv_line": atribuicao_dv_line(tokens, stack, exits); break;
                case "atribuicao_dv": atribuicao_dv(tokens, stack, exits); break;
                case "valor": valor(tokens, stack, exits); break;
                case "recebe_line": recebe_line(tokens, stack, exits); break;
                case "atribuicao": atribuicao(tokens, stack, exits); break;
                case "de_line": de_line(tokens, stack, exits); break;
                case "de": de(tokens, stack, exits); break;
                case "er": er(tokens, stack, exits); break;
                case "op_ar_line": op_ar_line(tokens, stack, exits); break;
                case "op_ar": op_ar(tokens, stack, exits); break;
                case "mid_line": mid_line(tokens, stack, exits); break;
                case "mid": mid(tokens, stack, exits); break;
                case "inf": inf(tokens, stack, exits); break;
                case "tipo": tipo(tokens, stack, exits); break;
                case "cmd_read": cmd_read(tokens, stack, exits); break;
                case "cmd_write": cmd_write(tokens, stack, exits); break;
                case "main": terminal(tokens, "main"); break;
                case "chave_esq": terminal(tokens, "chave_esq"); break;
                case "chave_dir": terminal(tokens, "chave_dir"); break;
                case "nome_var": terminal(tokens, "nome_var"); break;
                case "sign_rel": terminal(tokens, "sign_rel"); break;
                case "sign_lo": terminal(tokens, "sign_lo"); break;
                case "comma": terminal(tokens, "comma"); break;
                case "semicolon": terminal(tokens, "semicolon"); break;
                case "recebe": terminal(tokens, "recebe"); break;
                case "t_integer": terminal(tokens, "t_integer"); break;
                case "t_float": terminal(tokens, "t_float"); break;
                case "t_boolean": terminal(tokens, "t_boolean"); break;
                case "if": terminal(tokens, "if"); break;
                case "par_esq": terminal(tokens, "par_esq"); break;
                case "par_dir": terminal(tokens, "par_dir"); break;
                case "else": terminal(tokens, "else"); break;
                case "while": terminal(tokens, "while"); break;
                case "do": terminal(tokens, "do"); break;
                case "+": terminal(tokens, "+"); break;
                case "-": terminal(tokens, "-"); break;
                case "*": terminal(tokens, "*"); break;
                case "/": terminal(tokens, "/"); break;
                case "integer": terminal(tokens, "integer"); break;
                case "float": terminal(tokens, "float"); break;
                case "boolean": terminal(tokens, "boolean"); break;
                case "read": terminal(tokens, "read"); break;
                case "write": terminal(tokens, "write"); break;
                default: return exits.compiler_error(
                    emit_error('A valid TOKEN is', tokens[0], 24)
                )
            }
        }
    }
}