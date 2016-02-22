var tunet = require('../lib/tunet');
var options = {
    name: 'user_name',
    pwd: 'user_password'
};

tunet.login(options.name, options.pwd);
