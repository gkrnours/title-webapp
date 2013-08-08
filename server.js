/**
 * Module dependencies.
 */

var express = require("express")
var template= require("consolidate")
var rsStore = require("connect-redis")(express)
var routes  = require("./routes.js")
var http = require("http")

var app = express()
var views_dir = __dirname+"/data/views"
var nv = process.env

app.configure(function(){
	require("swig").init({cache: false, root: views_dir})
	app.engine("html", template.swig)
	app.set("view engine", "html")
	app.set("views", views_dir)
	app.set("port", nv["OPENSHIFT_NODEJS_PORT"] || 3000)

	app.use("/css", express.static(__dirname+"/data/css"))
	app.use("/img", express.static(__dirname+"/data/img"))
	app.use("/js",  express.static(__dirname+"/data/js"))
	app.use(express.favicon("data/img/favicon.ico"));

	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser("cherry pie"));
	app.use(express.session({secret:"cherry pie", cookie: {maxAge: 180*1000}}));
	app.use(app.router);
//	app.use(routes.err.gotcha) // check if the error is known
//	app.use(routes.err.generic)// throw pretty error at the user
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

routes.setup(app)

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
