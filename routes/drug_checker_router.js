
function drugCheckRouter(app) {
    var controller = require('./controller/drug_check_ctrl.js');
    var router = app.Router();
    router.route('/check')
        .get(controller.check())
    router.route('/admin')
    return router;
}

module.exports = drugCheckRouter;