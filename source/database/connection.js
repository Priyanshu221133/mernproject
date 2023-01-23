const mongoose = require('mongoose');

// strictQuery ko false kr do
mongoose.set('strictQuery',false);

mongoose.connect("mongodb://127.0.0.1:27017/RegistrationForm",{
// mongoose.connect(process.env.databasename,{      
      useNewUrlParser:true,
      useUnifiedTopology:true
}).then(() => console.log("DB is connected"))
  .catch(error => console.log(error));