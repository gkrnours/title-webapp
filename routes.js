
/*
 * GET home page.
 */

var main = require("./main.js")
//var map  = require("./map.js")
//this.err = require("./error.js")

this.setup = function setup(app){
	app.get("/", main.base)
	app.post("/log", function(){})
}


