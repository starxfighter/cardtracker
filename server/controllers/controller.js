var mongoose = require('mongoose');
var User = mongoose.model('User');
var validator = require('validator');
var bcrypt = require('bcrypt');
var axios = require('axios');


module.exports = {

    all: function(req, res){
        console.log("session all", req.session.uid);
        User.find({_id: req.session.uid}, function(err, users){
            if(err) {
                console.log('No user found')
                for(var key in err.errors){
                    req.flash('players', err.errors[key].message);
                    }
                res.json({error: err})
            } else {
                console.log('User Found')
                res.json({users:users})
            }
        })
    },

    display: function(req, res){
        console.log("session display", req.session.uid);
        console.log('passes id', req.params.id);
        User.findOne({_id: req.session.uid}, function(err, user){
            if(err){
                console.log("User not found")
                for(var key in err.errors){
                    req.flash('user', err.errors[key].message);
                    }
                res.json({error: err})   
            } else {
                console.log('user found')
                contact = user.contacts.id(req.params.id)
                 console.log('Contact found');
                res.json({contact:contact})
            }       
        })
    },

    new: function(req, res){
        console.log("session new", req.session.uid);
        console.log("incoming data", req.body)
        form = req.body;
        if (!form.mrfname.length > 0 && !form.msfname.length > 0){
            res.json({message: 'Either a mister or misses name must be entered'})
            return res.json;
        }
        if (form.lastname.length < 2){
            res.json({message: 'Last Name must be longer than 2 characters'})
            return res.json;
        }
        var usvariations = ['usa', 'united states', 'america']
        var tempcountry = form.country.toLowerCase()
        var status = 'Unverified'
        if (usvariations.indexOf(tempcountry) > -1) {
            console.log('us entry')
            var tempstreet = form.streetaddr.replace(/\s+/g, "%20");
            var url = 'https://us-street.api.smartystreets.com/street-address?auth-id=55ea844c-0e0c-1db3-8642-115d9b517646&auth-token=QYQNH3HjAX4m3dczAcdu&street=' + tempstreet + '&city=' + form.city + '&state=' + form.state + '&zipcode=' + form.postalcode + '&';
            axios.get(url)
                .then(response => {
                    if (response.data.length > 0){
                        console.log('us pos')
                        form.streetaddr = response.data[0].delivery_line_1
                        form.city = response.data[0]['components'].city_name
                        form.state = response.data[0]['components'].state_abbreviation
                        form.postalcode = response.data[0]['components'].zipcode + response.data[0]['components'].plus4_code
                        status = 'Verified'
                        console.log('status before db entry')
                        User.find({_id: req.session.uid}, function(err, user){
                            if (form.mrfname.length < 1 && form.msfname.length > 1){
                                tname = form.msfname + " " + form.lastname
                            }else if(form.mrfname.length > 1 && form.msfname.length < 1){
                                tname = form.mrfname + " " + form.lastname
                            }else {
                                tname = form.mrfname + ' & ' + form.msfname + " " + form.lastname
                            }
                            user[0].contacts.push({
                                cname: tname,
                                cstreet_addr: form.streetaddr,
                                city_locality: form.city,   
                                cstate: form.state,
                                cp_code: form.postalcode,
                                cc_code: form.country,
                                mister_dob: form.mrdob,
                                misses_dob: form.msdob,
                                anni_date: form.anidate,   
                                validation: status,        
                            })
                            user[0].save(function(err){
                                if(err){
                                    console.log('add failed')
                                    for(var key in err.errors){
                                        req.flash('user', err.errors[key].message);
                                        }
                                    res.json({error: err})
                                }else{
                                    console.log('Successfully added user')
                                    res.json({success: "Contact successfully added"})
                                    return res.json;
                                }    
                            })
                        })
                    } else {
                        console.log('us neg')
                        status = 'Unverified'
                        console.log('status before db entry')
                        User.find({_id: req.session.uid}, function(err, user){
                            if (form.mrfname.length < 1 && form.msfname.length > 1){
                                tname = form.msfname + " " + form.lastname
                            }else if(form.mrfname.length > 1 && form.msfname.length < 1){
                                tname = form.mrfname + " " + form.lastname
                            }else {
                                tname = form.mrfname + ' & ' + form.msfname + " " + form.lastname
                            }
                            user[0].contacts.push({
                                cname: tname,
                                cstreet_addr: form.streetaddr,
                                city_locality: form.city,   
                                cstate: form.state,
                                cp_code: form.postalcode,
                                cc_code: form.country,
                                mister_dob: form.mrdob,
                                misses_dob: form.msdob,
                                anni_date: form.anidate,   
                                validation: status,        
                            })
                            user[0].save(function(err){
                                if(err){
                                    console.log('add failed')
                                    for(var key in err.errors){
                                        req.flash('user', err.errors[key].message);
                                        }
                                    res.json({error: err})
                                }else{
                                    console.log('Successfully added user')
                                    res.json({success: "Contact successfully added"})
                                    return res.json;
                                }    
                            })
                        })
                    }
                })
                .catch(error => {
                    console.log('axios error', error)
                    res.json({message: "Failed"})
                });
        } else {
            console.log('not us')
            var tempstreet = form.streetaddr.replace(/\s+/g, "%20");
            // https://international-street.api.smartystreets.com/verify?auth-id=55ea844c-0e0c-1db3-8642-115d9b517646&auth-token=QYQNH3HjAX4m3dczAcdu&country=Hungary&address1=virag%20ut%204&locality=ramocsahaza&administrative_area=&postal_code=4536&
            var url = 'https://international-street.api.smartystreets.com/verify?auth-id=55ea844c-0e0c-1db3-8642-115d9b517646&auth-token=QYQNH3HjAX4m3dczAcdu&country=' + form.country + '&address1=' + tempstreet + '&locality=' + form.city + '&administrative_area=&postal_code=' + form.postalcode + '&';
            axios.get(url)
                .then(response => {
                    if (response){
                        console.log('non us pos')
                        form.streetaddr = response.data[0].address2
                        form.city = response.data[0]['components'].locality
                        form.postalcode = response.data[0]['components'].postal_code
                        status = response.data[0]['analysis'].verification_status
                        console.log('status before db entry')
                        User.find({_id: req.session.uid}, function(err, user){
                            if (form.mrfname.length < 1 && form.msfname.length > 1){
                                tname = form.msfname + " " + form.lastname
                            }else if(form.mrfname.length > 1 && form.msfname.length < 1){
                                tname = form.mrfname + " " + form.lastname
                            }else {
                                tname = form.mrfname + ' & ' + form.msfname + " " + form.lastname
                            }
                            user[0].contacts.push({
                                cname: tname,
                                cstreet_addr: form.streetaddr,
                                city_locality: form.city,   
                                cstate: form.state,
                                cp_code: form.postalcode,
                                cc_code: form.country,
                                mister_dob: form.mrdob,
                                misses_dob: form.msdob,
                                anni_date: form.anidate,   
                                validation: status,        
                            })
                            user[0].save(function(err){
                                if(err){
                                    console.log('add failed')
                                    for(var key in err.errors){
                                        req.flash('user', err.errors[key].message);
                                        }
                                    res.json({error: err})
                                }else{
                                    console.log('Successfully added user')
                                    res.json({success: "Contact successfully added"})
                                    return res.json;
                                }    
                            })
                        })
                    } else {
                        console.log('non us neg')
                        status = 'Unverified'
                        console.log('status before db entry')
                        User.find({_id: req.session.uid}, function(err, user){
                            if (form.mrfname.length < 1 && form.msfname.length > 1){
                                tname = form.msfname + " " + form.lastname
                            }else if(form.mrfname.length > 1 && form.msfname.length < 1){
                                tname = form.mrfname + " " + form.lastname
                            }else {
                                tname = form.mrfname + ' & ' + form.msfname + " " + form.lastname
                            }
                            user[0].contacts.push({
                                cname: tname,
                                cstreet_addr: form.streetaddr,
                                city_locality: form.city,   
                                cstate: form.state,
                                cp_code: form.postalcode,
                                cc_code: form.country,
                                mister_dob: form.mrdob,
                                misses_dob: form.msdob,
                                anni_date: form.anidate,   
                                validation: status,        
                            })
                            user[0].save(function(err){
                                if(err){
                                    console.log('add failed')
                                    for(var key in err.errors){
                                        req.flash('user', err.errors[key].message);
                                        }
                                    res.json({error: err})
                                }else{
                                    console.log('Successfully added user')
                                    res.json({success: "Contact successfully added"})
                                    return res.json;
                                }    
                            })
                        })
                    }
                })
                .catch(error => {
                    console.log('axios error', error)
                    res.json({message: "Failed"})
                });
        }
    },

    update: function(req, res){
        console.log("incoming data", req.body)
        form = req.body;
        if (form.name.length < 5){
            res.json({message: 'Name must be longer than 5 characters'})
            return res.json;
        }
        console.log("session update", req.session.uid);
        var usvariations = ['usa', 'united states', 'america']
        var tempcountry = form.country.toLowerCase()
        var status = 'Unverified'
        if (usvariations.indexOf(tempcountry) > -1) {
            console.log('us entry')
            var tempstreet = form.streetaddr.replace(/\s+/g, "%20");
            var url = 'https://us-street.api.smartystreets.com/street-address?auth-id=55ea844c-0e0c-1db3-8642-115d9b517646&auth-token=QYQNH3HjAX4m3dczAcdu&street=' + tempstreet + '&city=' + form.city + '&state=' + form.state + '&zipcode=' + form.postalcode + '&';
            axios.get(url)
                .then(response => {
                    if (response.data.length > 0){
                        console.log('us pos')
                        // form.streetaddr = response.data[0].delivery_line_1
                        // form.city = response.data[0]['components'].city_name
                        // form.state = response.data[0]['components'].state_abbreviation
                        // form.postalcode = response.data[0]['components'].zipcode + response.data[0]['components'].plus4_code
                        status = 'Verified'
                        console.log('status before db entry')
                        User.findOne({_id: req.session.uid}, function(err, user){
                            if(err){
                                console.log("User not found")
                                for(var key in err.errors){
                                    req.flash('user', err.errors[key].message);
                                    }
                                res.json({error: err})   
                            } else {
                                console.log('user found')
                                console.log('passes id', req.params.id)
                                contact = user.contacts.id(req.params.id)
                                contact.cname = form.name
                                contact.cstreet_addr = form.streetaddr
                                contact.city_locality = form.city
                                contact.cstate = form.state
                                contact.cp_code = form.postalcode
                                contact.cc_code = form.country
                                contact.mister_dob = form.mrdob
                                contact.misses_dob = form.msdob
                                contact.anni_date = form.anidate
                                contact.validation = status
                                user.save(function(err){
                                    if(err){
                                        console.log('update failed')
                                        for(var key in err.errors){
                                            req.flash('user', err.errors[key].message);
                                            }
                                        res.json({error: err})
                                    } else {
                                        console.log('Successfully updated contact')
                                        res.json({message: "Success"})
                                    }
                                })
                            }
                        })
                    } else {
                        console.log('us neg')
                        status = 'Unverified'
                        console.log('status before db entry')
                        User.findOne({_id: req.session.uid}, function(err, user){
                            if(err){
                                console.log("User not found")
                                for(var key in err.errors){
                                    req.flash('user', err.errors[key].message);
                                    }
                                res.json({error: err})   
                            } else {
                                console.log('user found')
                                console.log('passes id', req.params.id)
                                contact = user.contacts.id(req.params.id)
                                contact.cname = form.name
                                contact.cstreet_addr = form.streetaddr
                                contact.city_locality = form.city
                                contact.cstate = form.state
                                contact.cp_code = form.postalcode
                                contact.cc_code = form.country
                                contact.mister_dob = form.mrdob
                                contact.misses_dob = form.msdob
                                contact.anni_date = form.anidate
                                contact.validation = status
                                user.save(function(err){
                                    if(err){
                                        console.log('update failed')
                                        for(var key in err.errors){
                                            req.flash('user', err.errors[key].message);
                                            }
                                        res.json({error: err})
                                    } else {
                                        console.log('Successfully updated contact')
                                        res.json({message: "Success"})
                                    }
                                })
                            }
                        })
                    }
                })
                .catch(error => {
                    console.log('axios error', error)
                    res.json({message: "Failed"})
                });
        } else {
            console.log('not us')
            var tempstreet = form.streetaddr.replace(/\s+/g, "%20");
            // https://international-street.api.smartystreets.com/verify?auth-id=55ea844c-0e0c-1db3-8642-115d9b517646&auth-token=QYQNH3HjAX4m3dczAcdu&country=Hungary&address1=virag%20ut%204&locality=ramocsahaza&administrative_area=&postal_code=4536&
             var url = 'https://international-street.api.smartystreets.com/verify?auth-id=55ea844c-0e0c-1db3-8642-115d9b517646&auth-token=QYQNH3HjAX4m3dczAcdu&country=' + form.country + '&address1=' + tempstreet + '&locality=' + form.city + '&administrative_area=&postal_code=' + form.postalcode + '&';
            console.log('non us url', url);
            axios.get(url)
                .then(response => {
                    if (response){
                        console.log('non us pos')
                        // form.streetaddr = response.data[0].address2
                        // form.city = response.data[0]['components'].locality
                        // form.postalcode = response.data[0]['components'].postal_code
                        status = response.data[0]['analysis'].verification_status
                        console.log('status before db entry')
                        User.findOne({_id: req.session.uid}, function(err, user){
                            if(err){
                                console.log("User not found")
                                for(var key in err.errors){
                                    req.flash('user', err.errors[key].message);
                                    }
                                res.json({error: err})   
                            } else {
                                console.log('user found')
                                console.log('passes id', req.params.id)
                                contact = user.contacts.id(req.params.id)
                                contact.cname = form.name
                                contact.cstreet_addr = form.streetaddr
                                contact.city_locality = form.city
                                contact.cstate = form.state
                                contact.cp_code = form.postalcode
                                contact.cc_code = form.country
                                contact.mister_dob = form.mrdob
                                contact.misses_dob = form.msdob
                                contact.anni_date = form.anidate
                                contact.validation = status
                                user.save(function(err){
                                    if(err){
                                        console.log('update failed')
                                        for(var key in err.errors){
                                            req.flash('user', err.errors[key].message);
                                            }
                                        res.json({error: err})
                                    } else {
                                        console.log('Successfully updated contact')
                                        res.json({message: "Success"})
                                    }
                                })
                            }
                        })
                    } else {
                        console.log('non us neg')
                        status = 'Unverified'
                        console.log('status before db entry')
                        User.findOne({_id: req.session.uid}, function(err, user){
                            if(err){
                                console.log("User not found")
                                for(var key in err.errors){
                                    req.flash('user', err.errors[key].message);
                                    }
                                res.json({error: err})   
                            } else {
                                console.log('user found')
                                console.log('passes id', req.params.id)
                                contact = user.contacts.id(req.params.id)
                                contact.cname = form.name
                                contact.cstreet_addr = form.streetaddr
                                contact.city_locality = form.city
                                contact.cstate = form.state
                                contact.cp_code = form.postalcode
                                contact.cc_code = form.country
                                contact.mister_dob = form.mrdob
                                contact.misses_dob = form.msdob
                                contact.anni_date = form.anidate
                                contact.validation = status
                                user.save(function(err){
                                    if(err){
                                        console.log('update failed')
                                        for(var key in err.errors){
                                            req.flash('user', err.errors[key].message);
                                            }
                                        res.json({error: err})
                                    } else {
                                        console.log('Successfully updated contact')
                                        res.json({message: "Success"})
                                    }
                                })
                            }
                        })
                    }
                })
                .catch(error => {
                    console.log('axios error', error)
                    res.json({message: "Failed"})
                });
        }
    },

    delete: function(req, res){
        console.log("update data", req.body)
        console.log("session delete", req.session.uid);
        form = req.body;
        User.findOne({_id:req.session.uid}, function(err, user){
            if(err){
                console.log("User not found")
                for(var key in err.errors){
                    req.flash('user', err.errors[key].message);
                    }
                res.json({error: err}) 
            } else {
                console.log('passes id', req.params.id)
                contact = user.contacts.id(req.params.id)
                contact.remove(function(err){
                    if(err){
                        console.log('delete failed')
                        for(var key in err.errors){
                            req.flash('user', err.errors[key].message);
                            }
                        res.json({error: err})
                    }else{
                        user.save(function(err){
                            if(err){
                                console.log('update failed')
                                for(var key in err.errors){
                                    req.flash('user', err.errors[key].message);
                                    }
                                res.json({error: err})
                            } else {
                                console.log('Successfully updated contact')
                                res.json({message: "Success"})
                            }
                        })
                    }
                })
            }   
        })
    },
    
    register: function(req, res){
        form = req.body;
        console.log('reg form', req.body)
        if(form.name.length < 5){
            res.json({message: 'Name must be longer than 5 characters'})
            return res.json;
        }
        if(form.street_addr.length < 5){
            res.json({message: 'Street Address must be longer than 5 characters'})
            return res.json;
        }
        if(form.city.length < 5){
            res.json({messagee: 'City must be longer than 5 characters'})
            return res.json;
        }
        if(form.state.length > 2){
            res.json({message: 'State can only be two characters'})
            return res.json;
        }
        if(form.postal_code.length < 5){
            res.json({message: 'Postal Code must be more than 5 characters'})
            return res.json;
        }
        if(form.email < 5){
            res.json({message: 'An email must be more than 5 charcaters'})
            return res.json;
        }else if(validator.isEmail(form.email) == false){
            res.json({message: 'This is not a valid e-mail'})
            return res.json;
        }
        if(form.password.length < 8){
            res.json({message: "The password must be longer than 8 charactrs long"})
            return res.json;
        }else if(form.password != form.pass_conf){
            res.json({message: 'Your passwords do not match. Please re-enter'})
            return res.json;
        }
        bcrypt.hash(form.password, 10)
            .then(hashed_password => {
                console.log('password hashed')
                User.findOne({email:form.email, password:hashed_password}, function(err, user){
                    if(err){
                        console.log("error on findone search")
                        for(var key in err.errors){
                            req.flash('user', err.errors[key].message);
                            res.json({error: err})
                        }    
                        return res.json; 
                    }else{
                        if(user){
                            res.json({message: 'This combination of e-mail and password is already in use'})
                            return res.json;
                        }else{
                            console.log('creating user')
                            var user = new User({
                                name: form.name,
                                street_addr: form.street_addr,
                                city: form.city,
                                state: form.state,
                                postal_code: form.postal_code,
                                country: form.country,
                                email: form.email,
                                password: hashed_password 
                            })
                            user.save(function(err){
                                if(err){
                                    console.log('creation failed')
                                    for(var key in err.errors){
                                        req.flash('players', err.errors[key].message);
                                        res.json({error: err}) 
                                    }
                                    return res.json;
                                }else{
                                    console.log('Successfully added the user')
                                    res.json({success: 'Successfully add the user'})
                                    return res.json;
                                }
                            })
                        }
                    }
                })
            })
    },

    login: function(req, res){
        form = req.body
        if(form.email < 5){
            res.json({message: 'An email must be more than 5 charcaters'})
            return res.json;
        }else if(validator.isEmail(form.email) == false){
            res.json({message: 'This is not a valid e-mail'})
            return res.json;
        }
        if(form.password.length < 8){
            res.json({message: "The password must be longer than 8 charactrs long"})
            return res.json;
        }
        User.findOne({email: form.email}, function(err, user){
            if(err){
                console.log('error on findone')
                for(var key in err.errors){
                    req.flash('user', err.errors[key].message);
                    res.json({error: err})
                } 
                return res.json; 
            }else{
                bcrypt.compare(form.password, user.password)
                    .then(result => {
                        console.log('result', result)
                        if(result){
                            req.session.uid = user._id;
                            res.json({message:'User found and logged in'})
                            return res.json;
                        }else{
                            res.json({message:'The passwords did not match'})
                            return res.json;
                        }  
                    })
                    .catch(error => {
                        res.json({message:"Error on the password check"})
                        return res.json;
                    })
            }
        })
    },

    addBday: function(req, res){
        console.log("incoming data", req.body)
        form = req.body;
        if (form.status.length < 1){
            res.json({message: 'A status must be selected'})
            return res.json;
        }
        if (form.trkdate.length < 1){
            res.json({message: 'A tracking date must be selected'})
            return res.json;
        }
        console.log("session update", req.session.uid);
        User.findOne({_id: req.session.uid}, function(err, user){
            if(err){
                console.log("User not found")
                for(var key in err.errors){
                    req.flash('user', err.errors[key].message);
                    }
                res.json({error: err})   
            } else {
                console.log('user found')
                console.log('passes id', req.params.id)
                contact = user.contacts.id(req.params.id)
                console.log("contact info to update", contact)
                contact.bday_track.push({
                    bdstatus: form.status,
                    bd_date: form.trkdate
                })
                user.save(function(err){
                    if(err){
                        console.log('bd update failed')
                        for(var key in err.errors){
                            req.flash('user', err.errors[key].message);
                            }
                        res.json({error: err})
                    } else {
                        console.log('Successfully updated bd track')
                        res.json({message: "Success"})
                    }
                })
            }
        })
    },

    addAnnv: function(req, res){
        console.log("incoming data", req.body)
        form = req.body;
        if (form.status.length < 1){
            res.json({message: 'A status must be selected'})
            return res.json;
        }
        if (form.trkdate.length < 1){
            res.json({message: 'A tracking date must be selected'})
            return res.json;
        }
        console.log("session update", req.session.uid);
        User.findOne({_id: req.session.uid}, function(err, user){
            if(err){
                console.log("User not found")
                for(var key in err.errors){
                    req.flash('user', err.errors[key].message);
                    }
                res.json({error: err})   
            } else {
                console.log('user found')
                console.log('passes id', req.params.id)
                contact = user.contacts.id(req.params.id)
                console.log("contact info to update", contact)
                contact.anniversary_track.push({
                    anstatus: form.status,
                    an_date: form.trkdate
                })
                user.save(function(err){
                    if(err){
                        console.log('an update failed')
                        for(var key in err.errors){
                            req.flash('user', err.errors[key].message);
                            }
                        res.json({error: err})
                    } else {
                        console.log('Successfully updated an track')
                        res.json({message: "Success"})
                    }
                })
            }
        })
    },

    addXmas: function(req, res){
        console.log("add xmas incoming data", req.body)
        form = req.body;
        if (form.status.length < 1){
            res.json({message: 'A status must be selected'})
            return res.json;
        }
        if (form.trkdate.length < 1){
            res.json({message: 'A tracking date must be selected'})
            return res.json;
        }
        console.log("xmas session update", req.session.uid);
        User.findOne({_id: req.session.uid}, function(err, user){
            if(err){
                console.log("User not found")
                for(var key in err.errors){
                    req.flash('user', err.errors[key].message);
                    }
                res.json({error: err})   
            } else {
                console.log('xmas user found')
                console.log('xmas passes id', req.params.id)
                contact = user.contacts.id(req.params.id)
                console.log("xmas contact info to update", contact)
                contact.xmas_track.push({
                    xmasstatus: form.status,
                    xmas_date: form.trkdate
                })
                user.save(function(err){
                    if(err){
                        console.log('xmas update failed')
                        for(var key in err.errors){
                            req.flash('user', err.errors[key].message);
                            }
                        res.json({error: err})
                    } else {
                        console.log('Successfully updated xmas track')
                        res.json({message: "Success"})
                    }
                })
            }
        })
    },

    label: function(req, res){
        console.log('label incoming', req.body)
        User.findOne({_id: req.session.uid}, function(err, user){
            if(err){
                console.log("User not found")
                for(var key in err.errors){
                    req.flash('user', err.errors[key].message);
                    }
                res.json({error: err})   
            } else {
                console.log('user found')
                contact = user.contacts.id(req.params.id)
                 console.log('Contact found');
                res.json({contact:contact, user:user})
            }       
        })
        // User.findOne({_id:req.session.uid}, function(err, user){
        //     if(err){
        //         console.log("User not found")
        //         for(var key in err.errors){
        //             req.flash('user', err.errors[key].message);
        //             }
        //         res.json({error: err})   
        //     } else {
        //         console.log('user found') 
        //         console.log('passes id', req.params.id)
        //         contact = user.contacts.id(req.params.id)
        //         var url = 'https://api.shipengine.com/v1/labels -X POST \
        //         -H "Content-type: application/json" \
        //         -H "api-key: A1zfGsTEyGLJq67/8KtpxM0ZnzxutBoU1HiuGaznqY4" \
        //         -d ' + '{"shipment": {"service_code": "usps_priority_mail","ship_to": {"name": "' + contact.cname + '","phone": " ","company_name": " ","address_line1": "' + contact.cstreet_addr + '","city_locality": "' + contact.city_locality + '","state_province": "' + contact.cstate + '","postal_code": "' + contact.cp_code + '","country_code": "US","address_residential_indicator": "No"},"ship_from": {"name": "' + user.name + '","phone": " ","company_name": " ","address_line1": "' + user.street_addr + '","city_locality": "' + user.city + '","state_province": "' + user.state + '","postal_code": "' + user.postal_code + '","country_code": "US","address_residential_indicator": "No"},"packages": [{"weight": {"value": 1.0,"unit": "ounce"}}]},"test_label": true,"is_return_label": false}'
        //         console.log('url', url)
        //         axios.get(url)
        //             .then(response => {
        //                 console.log('label response', response)
        //             })
        //             .catch(error => {
        //                 console.log('axios error', error)
        //                 res.json({message: "Failed"})
        //             });
        //     }
        // })
    },
    // end of exports
}