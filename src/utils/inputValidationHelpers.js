import R from 'ramda';

const refineInput = R.curry((attemptType, input) => {
	return input
        .split(' ')
        .slice(attemptType, input.length)
        .reduce((acc, word, i, words) => {
            if (words.length === attemptType) {
                acc += words.shift();
            }
            else {
                acc += !acc ? word : ' ' + word;
            }
            return acc;
        }, '');
});

const findItem = R.curry((list, itemName) => {
	const foundItem = list.find(item => item.name.toUpperCase() === itemName.toUpperCase());
    return foundItem ? foundItem : {name: itemName};
});

// TODO: Rewrite this function somehow. Keep it pure but make it shorter.
const createDispatchable = R.curry((attemptType, attemptTypes, actions, messageGen, item) => {
    if (attemptType === attemptTypes.equip) {
        if (item && item.hasOwnProperty('equippable')) {
            return item.equippable ? (dispatch) => {
                dispatch(actions.equipItem(item));
                dispatch(actions.showMessage(messageGen.getEquipMessage(item), 0));
            } : (dispatch) => {
                dispatch(actions.showMessage(messageGen.getCannotBeEquippedMessage(item), 0));
            };
        } else if (item && item.hasOwnProperty('name') && item.name.length > 0) {
            return (dispatch) => {
                dispatch(actions.showMessage(messageGen.getNoSuchItemMessage(item.name), 0));
            };
        }
    } else if (attemptType === attemptTypes.lookAt) {
        if (item && item.hasOwnProperty('equippable')) {
        	return (dispatch) => {
        		dispatch(actions.showMessage(messageGen.getLookAtItemMessage(item), 0));
        		if (item.equippable) {
        			dispatch(actions.showMessage(messageGen.getItemStatsMessage(item), 0));
        		}
        	};
        } else if (item && item.hasOwnProperty('name') && item.name.length > 0) {
        	return (dispatch) => {
        		dispatch(actions.showMessage(messageGen.getNoSuchItemMessage(item.name), 0));
        	};
        }
    }

    return (dispatch) => {};
});

export const readInputAndCreateDispatchable = (list, attemptTypes, attemptType, actions, messageGen) => {
    return R.compose(
        createDispatchable(attemptType, attemptTypes, actions, messageGen),
        findItem(list),
        refineInput(attemptType)
    );
};

const firstWordOf = (string) => R.compose(R.head, R.split(' '))(string);

// TODO: Make those funcs into one, also taking a predicates object containing the predicates and a collection of dispatchables.
// Also send along an enum with types (e.g. 'equip', 'lookAt') so the function knows who it is and what dispatch to return.
export const observeEquip = (inventory, f, observable) => {
	const filterEquips = string => firstWordOf(string).toUpperCase() === 'EQUIP' && inventory.length > 0;
	const equipFilter = R.filter(filterEquips);
	return equipFilter(observable)
		.map(input => {
			return (dispatch) => {
				dispatch(f(input));
			};
		});
};

export const observeLookAt = (inventory, f, observable) => {
	const filterLookAt = string => string.toUpperCase().includes('LOOK AT') && inventory.length > 0;
	const lookAtFilter = R.filter(filterLookAt);
	return lookAtFilter(observable)
		.map(input => {
			return (dispatch) => {
				dispatch(f(input));
			};
		});
};

export const observeLookAround = (constants, expectedInput, playerPos, map, f, observable) => {
	const filterLookAround = string => string.toUpperCase().includes('LOOK AROUND')
										&& expectedInput === constants.EXPECTING_MOVEMENT;
	const lookAroundFilter = R.filter(filterLookAround);
	return lookAroundFilter(observable)
		.map(_ => {
			return (dispatch)=> {
				dispatch(f(playerPos, map));
			};
		});
};

export const observeReset = (constants, actions, messageGen, observable) => {
	const filterResets = string => firstWordOf(string).toUpperCase() === 'RESET';
	const resetFilter = R.filter(filterResets);
	return resetFilter(observable)
		.map(input => {
			return (dispatch) => {
				dispatch(actions.showMessage(messageGen.getPlayerWantResetMessage(), 0));
				dispatch(actions.showMessage(messageGen.getResetMessage(name), 1000));
				dispatch(actions.setInputExpected(constants.EXPECTING_RESET));
				dispatch(actions.setInputExpected(constants.EXPECTING_CONF));
			};
		});
};
