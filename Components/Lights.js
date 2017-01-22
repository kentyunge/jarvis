const rp = require("request-promise");
const q = require("q");
const _ = require("lodash");
const settings = require('../Settings');

const base_url = settings.lightUrl;

const scenes = [
    {
        "name": "relax",
        "id": "vcKUWD9HlhqQVoe"
    },
    {
        "name": "read",
        "id": "IJ2J8nh3FxovyD7"
    },
    {
        "name": "concentrate",
        "id": "7OBEUPi0ED6h0dc"
    },
    {
        "name": "energize",
        "id": "TmC0ESsluFt77OK"
    }
];

let _body = {};

const Lights = {
    on: (_room) => {
        _body = {
            "on": true
        };
        _huesSetProxy(_room, _body);
    },
    off: (_room) => {
        _body = {
            "on": false
        };
        _huesSetProxy(_room, _body);
    },
    brighten: (_room) => {
        _huesGetProxy(_room).then((_result) => {
            const _current = JSON.parse(_result);
            const _bri = (_current.action.bri < 200) ? _current.action.bri + 50 : 254;

            _body = {
                "bri": _bri
            }
            _huesSetProxy(_room, _body);
        });
    },
    dim: (_room) => {
         _huesGetProxy(_room).then((_result) => {
            const _current = JSON.parse(_result);
            const _bri = (_current.action.bri > 50) ? _current.action.bri - 50 : 0;

            _body = {
                "bri": _bri
            }
            _huesSetProxy(_room, _body);
        });       
    },
    scene: (_room, _scene) => {
        const found = _.find(scenes, (item) => {
            return item.name === _.trim(_scene);
        });

        _body = {
            "scene": found.id
        };

        _huesSetProxy(_room, _body);
    }
}


/* PRIVATE UTILITY FUNCTIONS */

function _huesGetProxy(_room) {
    const deferred = q.defer();
    const options = {
        url: base_url + '/groups/' + _room,
        method: 'GET'
    };

    rp(options).then((_body) => {
        deferred.resolve(_body);
    });

    return deferred.promise;
}

function _huesSetProxy(_room, _data) {
    console.log('room---->' + _room);
    console.log('params-->' + JSON.stringify(_data));

    const options = {
        url: base_url + '/groups/' + _room + '/action',
        method: 'PUT',
        body: _data,
        json: true
    }

    rp(options).then((_body) => {
        console.log(_body);
    }).catch((err) => {
        constole.log(err);
    });
}

module.exports = Lights;
