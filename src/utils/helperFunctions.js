import R from 'ramda';

export const firstWordOf = (string) => R.compose(R.head, R.split(' '))(string);
export const firstElementIsEmpty = R.compose(R.isEmpty, R.head);
