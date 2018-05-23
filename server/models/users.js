var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name: {type: String, required:[true, 'Name needs to be present'], minlength:[5, "Name should be longer than 5  characters"]},
    street_addr: {type: String, required:[true, 'Address needs to be present'], minlength:[5, 'Address should be longer than 5 characters']},
    city: {type: String, required:[true, 'City needs to be present'], minlength:[5, 'City needs to be longer than 5 characters']},
    state: {type: String, required:[true, 'State needs to be present'], maxlength:[2, 'Enter state abbreviation']},
    postal_code: {type: String, required:[true, 'Postal code needs to be present'], minlength:[5, 'Zip code needs to be at least 5 characters long']},
    country: {type: String},
    password: {type: String, required:[true, 'Password must be present'], minlength:[8, 'Password has to be at least 8 chracters long']},
    email: {type: String, required:[true, 'Email must be present']},
    contacts: [
        {cname: {type: String},
        cstreet_addr: {type: String},
        city_locality: {type: String},
        cstate: {type: String},
        cp_code: {type: String},
        cc_code: {type: String},
        mister_dob: {type: Date},
        misses_dob: {type: Date},
        anni_date: {type: Date},
        bday_track: [{
            bdstatus: {type: String},
            bd_date: {type: Date}
        }],
        anniversary_track: [{
            anstatus: {type: String},
            an_date: {type: Date}
        }],
        xmas_track: [{
            xmasstatus: {type: String},
            xmas_date: {type: Date}
        }]
    }]
}, {timestamps: true})
mongoose.model('User', UserSchema);