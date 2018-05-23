var mongoose = require('mongoose');
var User = mongoose.model('User');
var path = require('path');

var controller = require('./../controllers/controller.js');

module.exports = function(app) {

    // get all user records
    app.get('/all', controller.all)

    app.get('/:id', controller.display)

    app.post('/new', controller.new)

    app.put('/update/:id', controller.update)

    app.delete('/delete/:id', controller.delete)

    // app.put('/addbd/:id', controller.updatebd)

    // app.put('/addanv/:id', controller.updatean)

    // app.put('/addxams/:id', controller.updatexm)

    app.post('/reg', controller.register)

    app.post('/login', controller.login)

    app.all('*', (req, res, next) => {
        res.sendFile(path.resolve("./public/dist/public/index.html"))
    })
}