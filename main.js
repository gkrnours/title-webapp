var redis = require("redis")

this.base = function(req, res){
	tpl_val = {'nv': process.env}
	console.log(tpl_val)
	res.render("index", tpl_val)
}

this.log = {
}
