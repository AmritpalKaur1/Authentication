var express= require("express");
 var mongoose=require("mongoose");
 var passport=require("passport");
 var bodyParser=require("body-parser");
 var User=require("./models/user");
 var localStrategy=require("passport-local");
 var passportLocalMongoose=require("passport-local-mongoose");


 mongoose.connect("mongodb://localhost/auth_dem_app");
 var app=express();
 app.set("view engine","ejs");  
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(require("express-session")({
 	secret:"Cute Baby",
 	resave:false,
 	saveUninitialized:false
 }));
 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Routes




 app.get("/",function(req,res){
 	res.render("home");
 });

app.get("/secret",isLoggedIn,function(req,res){
	res.render("secret");
});
//Auth route
app.get("/register",function(req,res){
	res.render("register");
});

//handle user sign up
app.post("/register",function(req,res){
  req.body.username
  req.body.password
  User.register(new User({username:req.body.username}),req.body.password,function(err,user){
  	if(err){
  		console.log(err);
  		return res.render("register");
  	}
  	passport.authenticate("local")(req,res,function(){
  		res.redirect("/secret"); 
  	})
  })
});
//login route
app.get("/login",function(req,res){
   res.render("login");
});

app.post("/login",passport.authenticate("local",{
  
  successRedirect: "/secret",
  failureRedirect: "/login"
}),function(req,res){  
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();

	}
	res.redirect("/login");
}

 app.listen(3000,process.env.IP,function(){
 	console.log("Server Started at port no 3000");
 })