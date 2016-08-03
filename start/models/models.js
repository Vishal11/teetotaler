var mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
	username:String,
	password:String,
	email:String,
	created_at:{type:Date,default:Date.now}
});

var barSchema=new mongoose.Schema({
	id:String,
	name:String,
	address:String,
	stateId:String,
	contactNumber:String,
	cuisines:String,
	type:String,
	description1:String,
	description2:String,
	description3:String,
	barImg: { data: Buffer, contentType: String }
});

var barReviews=new mongoose.Schema({
	barId:String,
	review:String,
	rating:String,
	userId:String,
	created_at:{type:Date,default:Date.now}
});


var statSchema=new mongoose.Schema({
	name:String
});

var postSchema=new mongoose.Schema({
	text:String,
	username:String,
	created_at:{type:Date,default:Date.now}
});

mongoose.model("User",userSchema);
mongoose.model("Bar",barSchema);
mongoose.model("Reviews",barReviews);
mongoose.model("States",statSchema);
mongoose.model("Post",postSchema);