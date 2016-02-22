var tunet = require('../lib');
var options = {
    name: 'user_name',
    pwd: 'user_password'
};

tunet.login(options.name, options.pwd);
