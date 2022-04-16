import deserialize from '../shared/deserialize';

const state = deserialize(decodeURI(document.querySelector(`[name=nullstack]`).content));

export default state;