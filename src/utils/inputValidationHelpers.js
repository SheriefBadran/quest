import R from 'ramda';

const refineInput = (input) => {
	return input
        .split(' ')
        .slice(1, input.length)
        .reduce((acc, word, i, words) => {
            if (words.length === 1) {
                acc += words.shift();
            }
            else {
                acc += !acc ? word : ' ' + word;
            }
            return acc;
        }, '');
};

const getItem = R.curry((list, itemName) => {
	const foundItem = list.find(item => item.name.toUpperCase() === itemName.toUpperCase());
    return foundItem ? foundItem : {name: itemName};
});

const dispatchable = R.curry((actions, messageGen, item) => {
    if (item) {
        return item.equippable ? (dispatch) => {
            dispatch(actions.equipItem(item));
            dispatch(actions.showMessage(messageGen.getEquipMessage(item), 0));
        } : (dispatch) => {
            dispatch(actions.showMessage(messageGen.getCannotBeEquippedMessage(item), 0));
        };
    }

    if (Object.keys(item) === 1 && item.hasOwnProperty) {
        return (dispatch) => {
            dispatch(actions.showMessage(messageGen.getNoSuchItemMessage(item.name), 0));
        };
    }
});

export const readInputAndGetRequestedItemFrom = (list, actions, messageGen) => {
    return R.compose(
        dispatchable(actions, messageGen),
        getItem(list),
        refineInput
    );
};
