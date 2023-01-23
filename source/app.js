require('dotenv').config();// ish ko hamasa top pr he require kro 
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcrypt');


// Connect database
require('./database/connection');
// require model/collection
const Register = require('./models/registers');
const { error } = require('console');
const { response } = require('express');

const app = express();
const port = process.env.PORT || 8000;


const static_Path = path.join(__dirname,'../public');
const views_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

// 1  we have to tell browse that we are using json format data
// app.use(express.json()); // Ya post man ka liya perfect ha

// 2  we have to tell browse that we are geting data from live :- through clint
app.use(express.json());
app.use(express.urlencoded({extended:false}));//user ka data ko get karna chaunga



//  static website :- it takes path
app.use(express.static(static_Path));

// Dynamic website :- it also take path
app.set("view engine","hbs");
app.set("views",views_path);

hbs.registerPartials(partials_path);


console.log(process.env.SECRET_KEY);

// Home page
app.get("/", (request,response)=>{
    response.render('index');
//    response.send("We are from Home page");        
});

// Login page :- Show karo :- get sa
app.get("/login", (request,response)=>{
    response.render('login');
});
// Login page :- Create karo :- post sa
app.post("/login", async (request,response) => {
   try {
        const userEmail = request.body.email;
        const userPassword = request.body.password;

    //  read all data from database if this match then throw in home page
    const employee = await Register.findOne({email:userEmail});
    
    const isCorrectEmployee = await bcrypt.compare(userPassword,employee.password);

    if (isCorrectEmployee) {

        // middleware
        //  generate token ush function ko wapish ka call karna ha
        const token = await employee.generateToken();

        response.status(201).render('index');
        
    } else {
        response.status(400).send('Invalid login details');
    }
    
   } catch (error) {
    response.status(401).send("Invalid login details");
   }
});

// Registration page :- Show karo :- get sa
app.get("/registration", (request,response)=>{
    response.render('registration');
});
// Registration page :- Create karo :- POST sa
app.post("/registration", async (request,response)=>{
    try {
        const password = request.body.password;
        const confirmpassword = request.body.confirmpassword;

        if (password === confirmpassword) {
            //  get data
            const registerEmployee = new Register({
                firstname:request.body.firstname,
                lastname:request.body.lastname,
                email:request.body.email,
                gender:request.body.gender,
                phone:request.body.phone,
                age:request.body.age,
                password:password,
                confirmpassword:confirmpassword
            });

            // 1 Hash Password
            //  This is a concept of Middleware :- do chigo ka bich ma jo work ho raha ho vo
            // here pre method call in registeration.js ma 

            // 2 generate token
            // This is a concept of (JWT) :- JSONwebtoken :- ke ya vohi user ha kish na register kr chuka
            //  it will return promise
            const token = await registerEmployee.generateToken();
            console.log(token);

            //  save data
            const employee = await registerEmployee.save();
             
            response.status(201).render('login');
        }else{
            response.status(401).send("Passwords are not matching");
        }
    } catch (error) {
        response.status(401).send(error);
        console.log("error occure")
    }   
});



//  we have to listen it
app.listen(port,()=>{
    console.log(`Listening at port number ${port}`);
});  