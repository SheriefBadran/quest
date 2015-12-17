export default { //TODO: Improve all algorithms
	// The stats passed as arguments should be a combination of base stats and weapon/armour
	// stats in the player's case
	// Relevant stats are: str, dex, def for the most part
	// dex corresponds to evasion
	// Returning < 0 means a miss
	calculatePhysicalDamage(attackerStats, defenderStats) {
		// Check attacker dex vs defender dex with some randomness to see if it will hit
		let chance = attackerStats.dex / defenderStats.dex;

		let rand = Math.random();
		if (rand > chance) {
			// It's a miss!
			return -1;
		}

		// Use fancy algorithm to calculate damage based on str and def
		let damage = attackerStats.str - defenderStats.def;
		return (damage >= 0) ? damage : 0;
	},
	// The stats passed as arguments should be a combination of base stats and weapon/armour
	// stats in the player's case
	// Relevant stats are: mag and def for the most part
	calculateMagicDamage(attackerStats, defenderStats) {

	},
	// Should calculate experience reward based on base exp reward defined in npc json file
	// scaled based on some algorithm using the level of the npc
	calculateExperienceReward(baseExp, level) {

	},
	// Algorithm that will return the amount of exp required to reach the next level
	calculateExerienceToNextLevel(level) {
		
	},
	// Algorithm that will calculate how stats should increase based on scaling factors
	// in class json file when levelling up. Should probably return the increase but could
	// potentially return the new stats instead
	calculateStatsIncrease(characterClass, level) {
	
	}
};