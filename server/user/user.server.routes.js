const passport  = require('passport');
const user  = require('./user.server.controller');

module.exports = (app) => {
    // API Server Endpoints

    /* ==============
      Register Route
    ============== */

    app.post('/api/user/register', user.saveUser);


    /* ============================================================
        Route to check if user's username is available for registration
    ============================================================ */
    app.get('/api/user/checkUsername/:username', user.checkUsername);

    app.put('/api/user/update/:userId', user.updateUser)

    // Authenticate
    app.post('/api/user/authenticate', user.authenticate);

}
