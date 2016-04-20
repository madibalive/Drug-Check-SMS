
function viewCtrl() {

    function initReport() {
        var Report = new Parse.Object.extend('Reports');
        var Drugs = new Parse.Object.extend('Drugs');

        var drugQuery = new Parse.Query(Report);

        var totalQuery = new Parse.Query(Report);
        var successQuery = new Parse.Query(Report);
        var failedQuery = new Parse.Query(Report);

        successQuery.equalTo('statusBoolean', true)
        failedQuery.equalTo('statusBoolean', false)

        return Parse.Promse.when([totalQuery.count(), successQuery.count(), failedQuery.count(), drugQuery.count()])

    }
    function getReport() {
        var Report = new Parse.Object.extend('Reports');

        var totalQuery = new Parse.Query(Report);
        var successQuery = new Parse.Query(Report);
        var failedQuery = new Parse.Query(Report);

        successQuery.equalTo('statusBoolean', true)
        failedQuery.equalTo('statusBoolean', false)

        return Parse.Promse.when([totalQuery.find(), successQuery.find(), failedQuery.find()])

    }

    function renderIdex(req, res) {

        initReport().then(function (total, sucess, failed) {
            var data = {
                'reporttotal': total || null,
                'reportsuccess': success || null,
                'reportfailed': failed || null,
                'drugs': drug || null,
                'tittle': 'Drug Check'
            };
            res.render('index', data)
        }, function (error) {
            res.render('errorpage');
        })

    }
    function renderReport(req, res) {
        getReport().then(function (total, success, fails) {
            var data = {
                'total': total || null,
                'success': success || null,
                'fails': fails || null
            };
        })
        res.render('report', data);
    }

    function addNew(req, res) {
        payload = req.body;
        if (payload.body.name && payload.uniqueId) { // if payload exists 
            var Drugs = new Parse.Object.extend('Drugs');
            var drug = new Drugs();

            drug.set('name', payload.name);
            drug.set('uniqueId', payload.uniqueId);

            drug.save().then(function (success) { // save to database
                res.redirect('/');  // redirect to index 

            }, function (error) {
                res.send('something went wrong ,try again later')
            })

        }
    }
    return {
        renderIdex: renderIdex,
        renderReport: renderReport,
        addNew: addNew
    }
}



module.exports = viewCtrl