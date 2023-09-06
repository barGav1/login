import 'dotenv/config'  
import express from "express";
import bodyParser from "body-parser";
import encrypt from "mongoose-encryption";
import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/usersDB');
const app = express();

console.log(process.env.API_KEY)

const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
  })

userSchema.plugin(encrypt, {secret:process.env.SECRET,encryptedFields:["password"]});
const User = mongoose.model('User', userSchema);

app.get("/",async (req, res) => {
    res.render("home.ejs")
  });
  app.get("/login",async (req, res) => {
    res.render("login.ejs")
  });
  app.get("/register",async (req, res) => {
    res.render("register.ejs")
  });

  app.post("/register",async (req, res) => {
    const newUser = new User({
        email :req.body.username,
        password :req.body.password
    })   
    newUser.save()
    res.render("secrets.ejs")
  });


  app.post("/login",async (req, res) => { 
    const email =req.body.username
    const password =req.body.password
    const foundUser = await User.findOne({ email: email})
    console.log(foundUser)
    if (foundUser.password === password) {
      res.render("secrets.ejs")
    }
      else{
        res.render("register.ejs")
      }
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
