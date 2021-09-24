module.exports = {
	name: 'update_roulette_lb',
	description: 'automatically updates scores on the roulette leaderboard',
	execute(message, args) {

		var lb_channel = message.client.channels.cache.find(channel => channel.id === ("825918595904438342"));
		
		// finds user from fake mention
        var start = message.content.indexOf('@');
        var end = message.content.indexOf(' ', start);
        var winner_name = message.content.substring(start+1, end);
        var winner = message.client.users.cache.find(user => user.username === winner_name);
        var points = message.content.match(/\d+\b/)[1] ?? 0;

        var lb_msg;
        var count_index;
        var roulette_lb_text;

        lb_channel.messages.fetch("") //send lb msg and get id
            .then(msg => {
                lb_msg = msg;

                roulette_lb_text = lb_msg.content.split(' ');
                
				if (winner === undefined) {
					message.reply("Only valid members of this discord (referred to by their discord tags) can have their score tracked.");
				}
				
                // if user already has score
                else if (lb_msg.content.includes(winner.id.toString())) {
                    // find user score in lb
                    count_index = 1 + roulette_lb_text.findIndex((element) => element.toString().includes(winner.id.toString()));

                    // add points to score
                    roulette_lb_text[count_index] = (parseInt(roulette_lb_text[count_index]) + points).toString();

                    // check for change in order
                    while (count_index > 4 && roulette_lb_text[count_index]>roulette_lb_text[count_index-2]) {
                        let temp_user = roulette_lb_text[count_index-3];
                        let temp_score = roulette_lb_text[count_index-2];
                        roulette_lb_text[count_index-3] = roulette_lb_text[count_index-1];
                        roulette_lb_text[count_index-2] = roulette_lb_text[count_index];
                        roulette_lb_text[count_index-1] = temp_user;
                        roulette_lb_text[count_index] = temp_score;
                        count_index -= 2;
                    }

                    // edit leaderboard
                    lb_msg.edit(roulette_lb_text.join(' '));

                } else {
                    // add user and score to end of lb_msg
                    lb_msg.edit(lb_msg.content + ' \n<@' + winner.id.toString() + '> ' + points.toString());
                }

            })
            .catch(console.error);

	},
};
