const fs = require("fs");
const Tokenizr = require("tokenizr");
const lexicon = require("./lexicon");
const sintaticon = require("./sintaticon");

module.exports = {
    friendlyName: 'KOMPjsLator',
    description: 'Compila um codigo escrito em Unbending',
    sideEffects: 'cacheable',
    sync: true,
    inputs: {
        file_path: {
            type: 'string',
            required: true,
        }
    },
    exits: {
        loaded: {
            statusCode: 200,
            outputExample: { level: 'INFO', message: 'Analise lexica pika porra' },
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
        compiler_error: {
            statusCode: 406,
            description: 'Erro na compilacao',
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
            sintaticon.do_sintaticon(lexicon.do_lexicon(inputs),exits)
            return exits.loaded({
                teste: "ok"
            })

            // return exits.loaded({
            //     level: 'INFO',
            //     source_file: inputs.file_path,
            //     num_tokens: tokens.length,
            //     tokens: tokens.map(token => {
            //         if (token.type !== "<ERROR>") {
            //             return ({
            //                 "type": token.type,
            //                 "value": token.value,
            //                 "text": token.text,
            //                 "pos": token.pos,
            //                 "line": token.line,
            //                 "column": token.column
            //             });
            //         }
            //     }),
            //     ERROR: tokens.map(token => {
            //         if (token.type === "<ERROR>") {
            //             return ({
            //                 "type": token.type,
            //                 "value": token.value,
            //                 "text": token.text,
            //                 "pos": token.pos,
            //                 "line": token.line,
            //                 "column": token.column
            //             });
            //         }
            //     })
            // });
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
