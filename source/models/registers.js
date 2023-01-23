// Create Document ka structure
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { response } = require('express');

//  Create Schema :- Document ka Structure

const employeeSchema = new mongoose.Schema({
    firstname:{
           type:String,
           required:true,
           minLength:1
    },
    lastname:{
        type:String,
        required:true,
        minLength:1
    },
    email:{
        type:String,
        require:true,
        unique:true,
        // custome validation
        validater(value){
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email"); 
            } 
        } 
    },
    gender:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
        minLength:10,
        maxLength:10
    },
    age:{
        type:Number,
        required:true  
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    confirmpassword:{
        type:String,
        required:true,
        minLength:8
    },
    tokens:[{ //array of an object
            //  create one more object
            token:{
                type:String,
                required:true
            }
    }]
});

// 1 generating Tokens here..
employeeSchema.methods.generateToken = async function(){
    try {
        const token = await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        console.log(token);
        //  user ka data ma he after conform password ys token wali field copy ho gya
        //  document ka token ma ka token add ho gya
        this.tokens = this.tokens.concat({token:token});
        //  save be to karna padaga ush document ma ish token ko
        await this.save();
        console.log(token);
        return token;
    } catch (error) {
        response.send(error);
       console.log(error);           
    }
}

// 2 converting password in hash

// Schema jsha he create hota ha to ish ka pass ek method aa jata ha

// pre :-> like it will check every thing before paper
// post :-> like all work complete

//  document ka data mil jya to check kr lana 
                          // password ko hash kr danga
employeeSchema.pre("save", async function(next){
    //  agar hama udate karna hua ya fir kuch or karna hua to

    //  jab password modified hoga tabhi hum password ko hash karanga varna nhi karanga
    if (this.isModified("password")) {
            //  this.password = use ka password jo dal raha ha
            this.password = await bcrypt.hash(this.password,10);
            this.confirmpassword = await bcrypt.hash(this.password,10);
    }
    // Save method call kr do
    next(); // middleware ma next ko call karna he padaga fir ish ko save be to karna ha ish liya 
});


//  Create a collection using model
    // CLASS
const Register = new mongoose.model("Register",employeeSchema);

module.exports = Register;
