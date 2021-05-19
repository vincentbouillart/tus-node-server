'use strict';

const assert = require('assert');
const should = require('should');
const http = require('http');
const OptionsHandler = require('../lib/handlers/OptionsHandler');
const DataStore = require('../lib/stores/DataStore');

const ALLOWED_METHODS = require('../lib/constants').ALLOWED_METHODS;
const ALLOWED_HEADERS = require('../lib/constants').ALLOWED_HEADERS;
const EXPOSED_HEADERS = require('../lib/constants').EXPOSED_HEADERS;
const MAX_AGE = require('../lib/constants').MAX_AGE;

var hasHeader = (res, header) => {
    var key = Object.keys(header)[0];
    return res._header.indexOf(`${key}: ${header[key]}`) > -1;
}

describe('OptionsHandler', () => {
    var res = null;
    var store = new DataStore({ path: '/files' });
    var handler = new OptionsHandler(store);
    var req = { headers: {} };

    beforeEach((done) => {
        const METHOD = 'OPTIONS';
        res = new http.ServerResponse({ method: METHOD });
        done();
    });

    it('send() should set headers and 204', (done) => {
        var headers = {
            'Access-Control-Allow-Methods': ALLOWED_METHODS,
            'Access-Control-Allow-Headers': ALLOWED_HEADERS,
            'Access-Control-Expose-Headers': EXPOSED_HEADERS,
            'Access-Control-Max-Age': MAX_AGE,
        };
        handler.send(req, res);
        assert.equal(hasHeader(res, headers), true)
        assert.equal(res.statusCode, 204)
        done();
    });

    it('send() should set extensions header if they exist', (done) => {
        var headers = {
            'Tus-Extension': 'creation,expiration',
        };
        store.extensions = ['creation', 'expiration'];
        var handler = new OptionsHandler(store);
        handler.send(req, res);
        assert.equal(hasHeader(res, headers), true)
        done();
    });
});
