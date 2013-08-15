/**
 * Module dependencies.
 */

var express = require("express")
var template= require("consolidate")
var rsStore = require("connect-redis")(express)
var http = require("http")
var mod  = require("mod")
var db   = require("db")

var app = express()
var views_dir = __dirname+"/data/views"
var nv = process.env

app.configure(function(){
	require("swig").init({cache: false, root: views_dir})
	app.engine("html", template.swig)
	app.set("view engine", "html")
	app.set("views", views_dir)
	app.set("port", nv["OPENSHIFT_NODEJS_PORT"] || 3000)
	app.set("ip", nv["OPENSHIFT_NODEJS_IP"] || "127.0.0.1")

	app.use("/css", express.static(__dirname+"/data/css"))
	app.use("/img", express.static(__dirname+"/data/img"))
	app.use("/js",  express.static(__dirname+"/data/js"))
	app.use(express.favicon("data/img/favicon.ico"));

	app.use(express.logger('dev'));
	app.use(express.query());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser("cherry pie"));
	app.use(express.session({secret:"cherry pie", cookie: {maxAge:86400000},
		store: new rsStore({client: db.r}) }) );
	app.use(function(req, res, next){
		app.locals.me = req.session.me
		next()
	})
	app.use(app.router);
});

mod.setup(app)

app.configure('development', function(){
	app.use(express.errorHandler());
});


http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
