import R from 'ramda';
import constants from '../constants';

export const configureExpectedInputHandler = R.curry((checkAndSetName, checkAndSelectRace,
    checkAndSelectStarterWeapon, checkAndValidateConfirmation, checkAndMovePlayer,
    checkAndPerformBattleAction, expectedAnythingDispatchable, dispatch, messageGen, expectedInput) => {

    switch (expectedInput) {
        case constants.DISABLED:
            throw new Error("Attempted to send input when input was disabled.");
        case constants.EXPECTING_NAME:
            return (dispatch)=> {
                dispatch(checkAndSetName(messageGen));
            };
        case constants.EXPECTING_RACE:
            return (dispatch)=> {
                dispatch(checkAndSelectRace(messageGen));
            };
        case constants.EXPECTING_WEAPON:
            return (dispatch)=> {
                dispatch(checkAndSelectStarterWeapon(messageGen));
            };
        case constants.EXPECTING_ANYTHING: // Making fun of the player at the end of the Wizard's intro
            return expectedAnythingDispatchable(messageGen);

        case constants.EXPECTING_CONF:
            return (dispatch)=> {
                dispatch(checkAndValidateConfirmation(messageGen));
            };
        case constants.EXPECTING_MOVEMENT:
            return (dispatch)=> {
                dispatch(checkAndMovePlayer(messageGen));
            };
        case constants.EXPECTING_BATTLE:
            return (dispatch)=> {
                dispatch(checkAndPerformBattleAction(messageGen));
            };
        default:
            throw new Error("Missing input case for " + expectedInput);
    }

});
