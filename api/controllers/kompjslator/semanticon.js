let symbols_table = []
let error

function testType(value) {
    let type;
    Number(value) === value && value % 1 === 0 ?
        type = 'integer' : Number(value) === value && value % 1 !== 0 ?
            type = 'float' : value === 'TRUE' ? type = 'boolean' : value === 'FALSE' ?
                type = 'boolean' : type = 'invalido';
    return type
}

function is_valid_var(token, exits) {
    let entry = symbols_table.find(x => x.name === token.value)
    if (entry) {
        return entry
    } else {
        error = true
        return exits.compiler_error(JSON.parse(`{"ERROR_26": "Undeclared variable found in line ${tokens[index].line}"}`))
    }
}

function dv_verify_entry_symbols_table(token, type, exits) {
    let entry = {
        'name': token.value,
        'type': type,
        'value': false
    }
    if (symbols_table.find(x => x.name === entry.name)) {
        error = true
        return exits.compiler_error(JSON.parse(`{"ERROR_23": "Double variable declaration found in line ${token.line}"}`))
    } else {
        symbols_table.push(entry)
    }
}

function atrib_entry_symbols_table(token, value, exits) {
    let entry = symbols_table.find(x => x.name === token.value)

    if (!entry) {
        error = true
        return exits.compiler_error(JSON.parse(`{"ERROR_24": "Atribution to an undeclared variable found in line ${token.line}"}`))
    } else {

        if (entry.type == testType(value)) {
            entry.value = true
        } else {
            error = true
            return exits.compiler_error(JSON.parse(`{"ERROR_25": "Atribution of an variable ${entry.type} with a value ${testType(value)} is not possible"}`))
        }
    }
}

function dv(tokens, index, type, exits) {
    while (tokens[index].type != "semicolon") {
        if (tokens[index].type == "recebe") {
            atrib_entry_symbols_table(tokens[index - 1], tokens[index + 1].value, exits)
            index++
        } else if (tokens[index].type == "nome_var") {
            dv_verify_entry_symbols_table(tokens[index], type, exits)
            index++
        } else {
            index++
        }
    }
    return index
}

function ver_sign_lo(tokens, index, exits) {
    if (tokens[index].value == '!') {
        if (tokens[index + 1].type == 'nome_var') {
            let variable1 = is_valid_var(tokens[index + 1], exits)
            if (!error && (variable1.type != 'boolean' || !variable1.value)) {
                error = true
                return exits.compiler_error(JSON.parse(`{"ERROR_28": "Cannot negate a empty or ${variable1.type}, found this in ${tokens[index + 1].line}"}`))
            }
        } else if (tokens[index + 1].type != 't_boolean') {
            if (!error) {
                error = true
                return exits.compiler_error(JSON.parse(`{"ERROR_29": "Cannot negate a non boolean values, found ${tokens[index + 1].type} in ${tokens[index + 1].line}"}`))
            }
        }
        return index += 2
    }

    if (tokens[index].value == '&&') {
        if (tokens[index - 1].type == 'nome_var') {
            let variable1 = is_valid_var(tokens[index - 1], exits)
            if (!error && (variable1.type != 'boolean' || !variable1.value)) {
                error = true
                return exits.compiler_error(JSON.parse(`{"ERROR_30": "Cannot use AND operator on an empty or ${variable1.type} variable, found this in ${tokens[index - 1].line}"}`))
            }
        } else if (!error && tokens[index - 1].type != 't_boolean') {
            error = true
            return exits.compiler_error(JSON.parse(`{"ERROR_30": "Cannot use AND operator on ${tokens[index - 1].type}, found this in ${tokens[index - 1].line}"}`))
        }
        if (tokens[index + 1].type == 'nome_var') {
            let variable2 = is_valid_var(tokens[index + 1], exits)
            if (!error && (variable2.type != 'boolean' || !variable2.value)) {
                error = true
                return exits.compiler_error(JSON.parse(`{"ERROR_30": "Cannot use AND operator on an empty or ${variable2.type} variable, found this in ${tokens[index + 1].line}"}`))
            }
        } else if (!error && tokens[index + 1].type != 't_boolean') {
            error = true
            return exits.compiler_error(JSON.parse(`{"ERROR_30": "Cannot use AND operator on ${tokens[index + 1].type}, found this in ${tokens[index + 1].line}"}`))
        }
        return index += 2
    }

    if (tokens[index].value == '||') {

        if (tokens[index - 1].type == 'nome_var') {
            let variable1 = is_valid_var(tokens[index - 1], exits)
            if (!error && (variable1.type != 'boolean' || !variable1.value)) {
                error = true
                return exits.compiler_error(JSON.parse(`{"ERROR_31": "Cannot use OR operator on an empty or ${variable1.type} variable, found this in ${tokens[index - 1].line}"}`))
            }
        } else if (!error && tokens[index - 1].type != 't_boolean') {
            error = true
            return exits.compiler_error(JSON.parse(`{"ERROR_31": "Cannot use OR operator on ${tokens[index - 1].type}, found this in ${tokens[index - 1].line}"}`))
        }
        if (tokens[index + 1].type == 'nome_var') {
            let variable2 = is_valid_var(tokens[index + 1], exits)
            if (!error && (variable2.type != 'boolean' || !variable2.value)) {
                error = true
                return exits.compiler_error(JSON.parse(`{"ERROR_31": "Cannot use OR operator on an empty or ${variable2.type} variable, found this in ${tokens[index + 1].line}"}`))
            }
        } else if (!error && tokens[index + 1].type != 't_boolean') {
            error = true
            return exits.compiler_error(JSON.parse(`{"ERROR_31": "Cannot use OR operator on ${tokens[index + 1].type}, found this in ${tokens[index + 1].line}"}`))
        }
        return index += 2

    }
}

function ver_sign_rel(tokens, index, exits) {
    if (tokens[index].value == '==') {
        if (tokens[index - 1].type == 'nome_var') {
            is_valid_var(tokens[index - 1], exits)
        } else if (!error && tokens[index - 1].type != 't_boolean' && tokens[index - 1].type != 't_float' && tokens[index - 1].type != 't_integer') {
            error = true
            return exits.compiler_error(JSON.parse(`{"ERROR_32": "Cannot compare with ${tokens[index].value} diferent types, found this in ${tokens[index - 1].line}"}`))
        }
        if (tokens[index + 1].type == 'nome_var') {
            is_valid_var(tokens[index + 1], exits)
        } else if (!error && tokens[index + 1].type != 't_boolean' && tokens[index + 1].type != 't_float' && tokens[index + 1].type != 't_integer') {
            error = true
            return exits.compiler_error(JSON.parse(`{"ERROR_32": "Cannot compare with ${tokens[index].value} diferent types, found this in ${tokens[index + 1].line}"}`))
        }
        return index += 2
    }

    if (tokens[index].value == '>=' || tokens[index].value == '<=' || tokens[index].value == '>' || tokens[index].value == '<') {
        if (tokens[index - 1].type == 'nome_var') {
            is_valid_var(tokens[index - 1], exits)
        } else if (!error && tokens[index - 1].type != 't_float' && tokens[index - 1].type != 't_integer') {
            error = true
            return exits.compiler_error(JSON.parse(`{"ERROR_32": "Cannot compare with ${tokens[index].value} diferent types, found this in ${tokens[index - 1].line}"}`))
        }
        if (tokens[index + 1].type == 'nome_var') {
            is_valid_var(tokens[index + 1], exits)
        } else if (!error && tokens[index + 1].type != 't_float' && tokens[index + 1].type != 't_integer') {
            error = true
            return exits.compiler_error(JSON.parse(`{"ERROR_32": "Cannot compare with ${tokens[index].value} diferent types, found this in ${tokens[index + 1].line}"}`))
        }
        return index += 2
    }
}

function ver_recebe(tokens, index, exits) {
    if (tokens[index - 1].type == 'nome_var' && !error) {
        let var1 = is_valid_var(tokens[index - 1], exits)
        if (!error) {
            index++
            if (tokens[index + 1].type == "semicolon") {
                if (tokens[index].type == "nome_var") is_valid_var(tokens[index])
                if (tokens[index].type.replace("t_", "") != var1.type) {
                    error = true
                    return exits.compiler_error(JSON.parse(`{"ERROR_34": "Invalid value attribution, type are diffrent, found this in ${tokens[index].line}"}`))
                }
                return index++
            }
            while (tokens[index].type != "semicolon") {
                if (tokens[index].type == "nome_var") {
                    let var2 = is_valid_var(tokens[index])
                    if (var2.type != var1.type) {
                        error = true
                        return exits.compiler_error(JSON.parse(`{"ERROR_34": "Invalid value attribution, type are diffrent, found this in ${tokens[index].line}"}`))
                    }
                }
                if (tokens[index + 2].type == "nome_var") {
                    let var2 = is_valid_var(tokens[index + 2])
                    if (var2.type != var1.type) {
                        error = true
                        return exits.compiler_error(JSON.parse(`{"ERROR_34": "Invalid value attribution, type are diffrent, found this in ${tokens[index + 2].line}"}`))
                    }
                }
                if (tokens[index].type == "t_integer" || tokens[index].type == "t_float") {
                    if (tokens[index].type.replace("t_", "") != var1.type) {
                        error = true
                        return exits.compiler_error(JSON.parse(`{"ERROR_34": "Invalid value attribution, type are diffrent, found this in ${tokens[index].line}"}`))
                    }
                }

                if (tokens[index + 2].type == "t_integer" || tokens[index + 2].type == "t_float") {
                    if (tokens[index + 2].type.replace("t_", "") != var1.type) {
                        error = true
                        return exits.compiler_error(JSON.parse(`{"ERROR_34": "Invalid value attribution, type are diffrent, found this in ${tokens[index + 2].line}"}`))
                    }
                }
                if (tokens[index + 1].value != '+' && tokens[index + 1].value != '-' && tokens[index + 1].value != '*' && tokens[index + 1].value != '/') {
                    error = true
                    return exits.compiler_error(JSON.parse(`{"ERROR_35": "Invalid arithmetic operator, found this in ${tokens[index + 1].line}"}`))
                }
                if (tokens[index + 3].type == 'semicolon') {
                    index += 2
                    break
                } else {
                    index += 2
                }
            }
            return index + 1
        }
    } else {
        error = true
        return exits.compiler_error(JSON.parse(`{"ERROR_33": "Cannot atribute values to non variable"}`))
    }
}

module.exports = {
    do_semanticon: function (tokens, exits) {
        error = false
        symbols_table = []
        for (index = 0; index < tokens.length; index++) {
            if (tokens[index].type == 'integer' || tokens[index].type == 'float' || tokens[index].type == 'boolean') {
                index = dv(tokens, index + 1, tokens[index].type, exits)
            } else if (tokens[index].type == 'sign_lo') {
                index = ver_sign_lo(tokens, index, exits)
            } else if (tokens[index].type == 'sign_rel') {
                index = ver_sign_rel(tokens, index, exits)
            } else if (tokens[index].type == 'recebe') {
                index = ver_recebe(tokens, index, exits)
            } else if (tokens[index].type == 'nome_var') {
                is_valid_var(tokens[index], exits)
            }
        }
        console.log(symbols_table)
        if (!error) {
            return exits.loaded({
                message: "Parsed Successfully!"
            })
        }
    }
}