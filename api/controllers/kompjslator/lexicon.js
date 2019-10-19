const fs = require("fs");
const Tokenizr = require("tokenizr");

module.exports = {
    do_lexicon: function (inputs) {
        let lexer = new Tokenizr();

        // Palavras Reservadas
        lexer.rule(/MAIN/, (ctx, match) => {
            ctx.accept("main");
        });
        lexer.rule(/INT/, (ctx, match) => {
            ctx.accept("integer");
        });
        lexer.rule(/FLOAT/, (ctx, match) => {
            ctx.accept("float");
        });
        lexer.rule(/BOOLEAN/, (ctx, match) => {
            ctx.accept("boolean");
        });
        lexer.rule(/ELSE/, (ctx, match) => {
            ctx.accept("else");
        });
        lexer.rule(/WHILE/, (ctx, match) => {
            ctx.accept("while");
        });
        lexer.rule(/DO/, (ctx, match) => {
            ctx.accept("do");
        });
        lexer.rule(/IF/, (ctx, match) => {
            ctx.accept("if");
        });
        lexer.rule(/READ/, (ctx, match) => {
            ctx.accept("read");
        });
        lexer.rule(/WRITE/, (ctx, match) => {
            ctx.accept("write");
        });

        // Tipos
        lexer.rule(/[+-]?[0-9]+\.[0-9]+/, (ctx, match) => {
            ctx.accept("t_float", parseFloat(match[0]));
        });
        lexer.rule(/[+-]?[0-9]+/, (ctx, match) => {
            ctx.accept("t_integer", parseInt(match[0]));
        });
        lexer.rule(/TRUE|FALSE/, (ctx, match) => {
            ctx.accept("t_boolean");
        });

        // Id
        lexer.rule(/[a-z_]+[a-z0-9_]*/, (ctx, match) => {
            ctx.accept("nome_var");
        });

        // Operadores
        lexer.rule(/\=\=|\>\=|\<\=|\>|\</, (ctx, match) => {
            ctx.accept("sign_rel");
        });
        lexer.rule(/\|\||\&\&|\!/, (ctx, match) => {
            ctx.accept("sign_lo");
        });
        lexer.rule(/\+/, (ctx, match) => {
            ctx.accept("+");
        });
        lexer.rule(/\-/, (ctx, match) => {
            ctx.accept("-");
        });
        lexer.rule(/\*/, (ctx, match) => {
            ctx.accept("*");
        });
        lexer.rule(/\//, (ctx, match) => {
            ctx.accept("/");
        });


        // Simbolos
        lexer.rule(/\(/, (ctx, match) => {
            ctx.accept("par_esq");
        });
        lexer.rule(/\)/, (ctx, match) => {
            ctx.accept("par_dir");
        });
        lexer.rule(/{/, (ctx, match) => {
            ctx.accept("chave_esq");
        });
        lexer.rule(/}/, (ctx, match) => {
            ctx.accept("chave_dir");
        });
        lexer.rule(/;/, (ctx, match) => {
            ctx.accept("semicolon");
        });
        lexer.rule(/,/, (ctx, match) => {
            ctx.accept("comma");
        });

        // Atribuição
        lexer.rule(/=/, (ctx, match) => {
            ctx.accept("recebe");
        });

        // Dump
        lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx, match) => {
            ctx.ignore();
        });
        lexer.rule(/[ \t\r\n]+/, (ctx, match) => {
            ctx.ignore();
        });

        // Error
        lexer.rule(/.+?/, (ctx, match) => {
            ctx.accept("LEXICAL_ERROR");
        });

        let source_file = fs.readFileSync(inputs.file_path, "utf8");

        lexer.input(source_file);
        lexer.debug(false);

        return lexer.tokens();

    }
}