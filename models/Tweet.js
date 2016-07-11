var mongoose = require('mongoose');

// Create a new schema for tweet data
var TweetSchema = new mongoose.Schema({
	twid: String,
	active: Boolean,
	author: String,
	avatar: String,
	body: String,
	date: Date,
	screenname: String
});

// Crate a static method to return data from db
TweetSchema.statics.getTweets = function(page, skip, callback) {
	var tweets = [],
		start = (page * 10) + (skip * 1);

	// Query db using start ('skip' is for considering the new tweets that might pop up) and limit
	Tweet.find({}, 'twid active author avatar body date screenname', {
			skip: start,
			limit: 10
		})
		.sort({
			date: 'desc'
		})
		.exec(function(err, docs) {
			if(!err) {
				tweets = docs;
				tweets.forEach(function(tweet) {
					tweet.active = true;
				});
			}

			callback(tweets);
		});
};

// Return Tweet model
var Tweet = mongoose.model('Tweet', TweetSchema);
