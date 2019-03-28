const fs = require("fs");
const Tokenizr = require("tokenizr");

module.exports = {
    friendlyName: 'Lexical analyzer',
    description: 'Realiza a analise lexica de um codigo escrito em Unbending',
    sideEffects: 'cacheable',
    sync: true,
    inputs: {
        file_path: {
            type: 'string',
            required: false,
        }
    },
    exits: {
        loaded: {
            statusCode: 200,
            outputExample: {level: 'INFO', message: 'Analise lexica pika porra'},
            outputFriendlyName: 'Carregado com sucesso com sucesso',
            outputDescription: 'Retorna uma mensagem de sucesso',
        },
        badRequest: {
            statusCode: 400,
            description: 'Requisição mal formada',
            outputExample: {
                level: 'ERROR',
                message: 'Requisição mal formada',
                error: 'Parâmetros mal formados'
            }
        },
        internalError: {
            statusCode: 500,
            description: 'Erro imprevisto, contate um adminstrador do sistema',
            outputExample: {
                level: 'ERROR',
                message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
                error: 'err DO CATCH AQUI'
            }
        }
    },

    fn: function (inputs, exits) {
        try {

            let lexer = new Tokenizr();

            // Palavras Reservadas
            lexer.rule(/MAIN/, (ctx, match) => {
                ctx.accept("<main>");
            });
            lexer.rule(/INT/, (ctx, match) => {
                ctx.accept("<int>");
            });
            lexer.rule(/FLOAT/, (ctx, match) => {
                ctx.accept("<float>");
            });
            lexer.rule(/BOOLEAN/, (ctx, match) => {
                ctx.accept("<boolean>");
            });
            lexer.rule(/ELSE/, (ctx, match) => {
                ctx.accept("<else>");
            });
            lexer.rule(/WHILE/, (ctx, match) => {
                ctx.accept("<while>");
            });
            lexer.rule(/DO/, (ctx, match) => {
                ctx.accept("<do>");
            });
            lexer.rule(/IF/, (ctx, match) => {
                ctx.accept("<if>");
            });
            lexer.rule(/READ/, (ctx, match) => {
                ctx.accept("<read>");
            });
            lexer.rule(/WRITE/, (ctx, match) => {
                ctx.accept("<write>");
            });
            // lexer.rule(/TRUE/, (ctx, match) => {
            //     ctx.accept("<true>")
            // });
            // lexer.rule(/FALSE/, (ctx, match) => {
            //     ctx.accept("<false>")
            // });

            //testar isso aqui somente o tipo boleano

            // Operadores
            lexer.rule(/==|>|<|>=|<=/, (ctx, match) => {
                ctx.accept("<sign_rel>");
            });
            lexer.rule(/\|\||&&|!/, (ctx, match) => {
                ctx.accept("<sign_lo>");
            });
            lexer.rule(/\+|\-|\*|\//, (ctx, match) => {
                ctx.accept("<sign_ar>");
            });

            // Tipos
            lexer.rule(/[0-9]+\.[0-9]+/, (ctx, match) => {
                ctx.accept("<float>");
            });
            lexer.rule(/[0-9]+/, (ctx, match) => {
                console.log(ctx)
                ctx.accept("<inteiro>");
            });
            lexer.rule(/TRUE|FALSE/, (ctx, match) => {
                ctx.accept("<bolean>");
            });

            // Simbolos
            lexer.rule(/\(/, (ctx, match) => {
                ctx.accept("<par_esq>");
            });
            lexer.rule(/\)/, (ctx, match) => {
                ctx.accept("<par_dir>");
            });
            lexer.rule(/{/, (ctx, match) => {
                ctx.accept("<chave_esq>");
            });
            lexer.rule(/}/, (ctx, match) => {
                ctx.accept("<chave_dir>");
            });
            lexer.rule(/;/, (ctx, match) => {
                ctx.accept("<semicolon>");
            });
            lexer.rule(/,/, (ctx, match) => {
                ctx.accept("<comma>");
            });

            // Atribuição
            lexer.rule(/=/, (ctx, match) => {
                ctx.accept("<recebe>");
            });

            // Id
            lexer.rule(/[a-zA-Z_]+[a-zA-Z0-9_]*/, (ctx, match) => {
                ctx.accept("<nome_var>");
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
                ctx.accept("<ERROR>");
            });


            let source_file = fs.readFileSync(inputs.file_path, "utf8");

            lexer.input(source_file);
            lexer.debug(false);

            let tokens = lexer.tokens();

            return exits.loaded({
                level: 'INFO',
                source_file: inputs.file_path,
                num_tokens: tokens.length,
                tokens: tokens.map(token => {
                    if (token.type !== "<ERROR>") {
                        return ({
                            "type": token.type,
                            "value": token.value,
                            "text": token.text,
                            "pos": token.pos,
                            "line": token.line,
                            "column": token.column
                        });
                    }
                }),
                ERROR: tokens.map(token => {
                    if (token.type === "<ERROR>") {
                        return ({
                            "type": token.type,
                            "value": token.value,
                            "text": token.text,
                            "pos": token.pos,
                            "line": token.line,
                            "column": token.column
                        });
                    }
                })
            });
        } catch
            (err) {
            return exits.internalError({
                level: 'ERROR',
                message: 'Erro imprevisto, contate um adminstrador do sistema e informe',
                error: err
            });
        }
    }
};
