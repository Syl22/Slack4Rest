const helpers = require('./helpers');

/**
 * Build an API request
 *
 * @param cmd user command descriptor
 * @param args user command arguments
 * @returns request options
 */
const buildRequest = function (cmd, args) {
    let options = {
        method: cmd.request.method,
        uri: cmd.request.uri,
        json: true,
    };

    if (cmd.request.query_params !== undefined && cmd.request.query_params !== {}) {
        options.qs = helpers.mapObj(cmd.request.query_params, (e) => helpers.rArray(e, args));
        options.qsStringifyOptions = {allowDots: true};
    }

    if (cmd.request.body !== undefined && cmd.request.body !== {}) {
        options.body = cmd.request.body;
    }

    return options;
};

exports.build = buildRequest;