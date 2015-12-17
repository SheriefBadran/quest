import constants from "./constants";
import React from "react";

export default ()=> { // Returns a function so it can't be modified accidentally
	return {
		input: {
			// Currently expected input
			awaiting: constants.EXPECTING_NAME,
			// The input that was being expected before (we need this for confirmations so we know what's being confirmed)
			previous: constants.EXPECTING_NAME,
			// The currently expected input at time of a reset request - so we know what to go back to if they cancel the reset
			beforeReset: constants.EXPECTING_NAME,
			// If the above was a confirmation, we also need to store the input type expected before that (for the same reason as with previous)
			beforeResetIfConf: constants.EXPECTING_NAME
		},
		log: {
			queue: [ ],
			messages: [
				{ speaker: constants.WIZARD, line: [ { className: constants.WIZARD, text: "Hey you there... yes you! The one with the funny... well everything! You're finally awake? Can you speak? Tell me your name." } ] },
			]
		},
		player: {
			name: "???",
			displayStats: false,
			stats: {
			},
			itemQueue: [],
			inventory: [],
			displayInventory: false,
			weapon: null,
			armour: null
		},
		world: {
			version: "0.1.3.69",
			displayMap: false,
			map: [[]],
			playerPos: {
				x: 0,
				y: 0
			}
		}
	}
};