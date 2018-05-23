var mongoose = require('mongoose');
var User = mongoose.model('User');
var validator = require('validator');
var bcrypt = require('bcrypt');


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
        console.log('passed id', req.params.id)
        User.find({_id: req.params.id}, function(err, user){
            if(err){
                console.log("User not found")
                for(var key in err.errors){
                    req.flash('user', err.errors[key].message);
                    }
                res.json({error: err})   
            } else {
                console.log('User found')
                res.json({users:user})       
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
        if (form.streetaddr.length < 5){
            res.json({message: 'Street Address must be longer than 5 characters'})
            return res.json;
        }
        if (form.city < 5){
            res.json({message: 'City must be longer than 5 characters'})
            return res.json;
        }
        if (form.state > 2){
            res.json({message: 'State must not be longer than 2 characters'})
            return res.json;
        }
        if (form.postalcode < 5){
            res.json({message: 'Postal Code must be at least 5 characters long'})
            return res.json;
        }
        User.find({_id: req.session.uid}, function(err, user){
            if (form.mrfname.length < 0 && form.msfname > 0){
                tname = form.msfname + " " + form.lastname
            }else if(form.mrfname > 0 && form.msfname < 0){
                tname = form.mrfname + " " + form.lastname
            }else {
                tname = form.mrfname + '&' + form.msfname + " " + form.lastname
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
    },

    update: function(req, res){
        console.log("incoming data", req.body)
        form = req.body;
        if (form.misterfname.length < 5){
            req.flash('user', 'Mister First Name must be longer than 5 characters')
            res.json({error: err})
        }else if(validator.isAlpha(form.misterfname) == false){
            req.flash('user', "The first name nust contain only alphabetic characters")
            res.json({error: err})
        }
        if (form.missesfname.length < 5){
            req.flash('user', 'Misses First Name must be longer than 5 characters')
            res.json({error: err})
        }else if(validator.isAlpha(form.misssesfname) == false){
            req.flash('user', "The first name nust contain only alphabetic characters")
            res.json({error: err})
        }
        if (form.street_addr.length < 5){
            req.flash('user', 'Street Address must be longer than 5 characters')
            res.json({error: err})
        }
        if (form.state > 5){
            req.flash('user', 'Street Address must not be longer than 2 characters')
            res.json({error: err})
        }
        if (form.postal_code < 5){
            req.flash('user', 'Postal Code must be at least 5 characters long')
            res.json({error: err})
        }
        User.find({_id: req.params.id}, function(err, user){
            if (form.misterfname.length < 0 && form.missesfname > 0){
                tname = form.missesfname + " " + form.lastname
            }else if(form.misterfname > 0 && form.missesfname < 0){
                tname = form.misterfname + " " + form.lastname
            }else {
                tname = form.misterfname + '&' + form.missesfname + " " + form.lastname
            }
            user[0].contacts.push({
                cname: tname,
                cstreet_addr: form.street_addr,
                city_locality: form.city,
                cstate: form.state,
                cp_code: form.postal_code,
                cc_code: form.country,
                mister_dob: form.misterdob,
                misses_dob: form.missesdob,
                anni_date: form.annidate,           
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
                    req.flash('user', 'Contact successfully added');
                    res.json({message: "Success"})
                }    
            })
        })
    },

    delete: function(req, res){
        console.log("update data", req.body)
        form = req.body;
        User.find({_id:req.params.id}, function(err, user){
        user[0].remove(function(err){
            if(err){
                console.log('delete failed')
                for(var key in err.errors){
                    req.flash('user', err.errors[key].message);
                    }
                res.json({error: err})
            }else{
                console.log('Successfully deleted user')
                req.flash('user', 'Successfully deleted contact');
                res.json({message: "Success"})
            }
        })
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
    }
    // end of exports
}