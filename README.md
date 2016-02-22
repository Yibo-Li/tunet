# TUNET

TUNET is a nodejs tool for logging Tsinghua University Network.

To use this do as below:

```javascript
// do login
var tunet = require('tunet');
var options = {
    name: 'user_name',
    pwd: 'user_password'
}
tunet.login(options.name, options.pwd);
// Login is successful.

// do logout
tunet.logout();
// Logout is successful.
```
