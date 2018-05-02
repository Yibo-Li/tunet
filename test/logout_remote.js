var tunet = require('../lib/tunet');
var options = {
    name: 'user_name',
    ip: '192.168.1.1'
};

tunet.logout(options.name, options.ip);
