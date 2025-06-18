const express = require('express');
const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res)=>{
    
    // Encrypting Password
    let password = req.body.password;
    const salt = bcrypt.genSaltSync(process.env.SALT);
    const hashPass = bcrypt.hashSync(password, salt);

    try {
        const newUser = {
            name : req.body.name,
            username : req.body.username,
            email : req.body.email,
            password : hashPass,
        }
        await User.create(newUser).then(res.json({sucess : true}));
    } catch (error) {
        console.log(error)
        res.json({success: false, error : error});
    }
});

router.post('/login', async(req, res) =>{
    let {username, password} = req.body;

    try{
        let userData = await User.findOne({email : username});
        if(!userData){
            userData = await User.findOne({username});
            if(!userData){
                return res.status(400).json({error : "User does not exist"});
            }
        }

        const isValidPass = await bcrypt.compare(password, userData.password);
        if(!isValidPass){
            res.status(400).json({error : "Invalid Password"});
        }

        const authToken = jwt.sign({id : userData._id}, process.env.JWTSECRET);
        return res.json({ success: true, authToken: authToken});

    } catch (error){
        console.log(error);
        res.json({ success: false, error : error });
    }
})

module.exports = router;

