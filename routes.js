var JSX = require('node-jsx').install(),
	React = require('react'),
	TweetsApp = require('./components/TweetsApp.react'),
	Tweet = require('./models/Tweet');

module.exports = {

	index: function(req, res) {
		// Call static model method to get tweets in the db
		Tweet.getTweets(0, 0, function(tweets) {

			// Render React to a string, passing in the fetched tweets
			var markup = React.renderComponentToString(
				TweetsApp({
					tweets: tweets
				})
			);

			//Render the 'home' template
			res.render('home', {
				markup: markup, //Pass rendered react markup
				state: JSON.stringify(tweets) //Pass curernt state to client side
			});

		});
	},

	page: function(req, res) {
		// Fetch tweets by page via param
		Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {
			res.send(tweets);
		});
	}
};
