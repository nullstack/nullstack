import deserialize from '../shared/deserialize';

const state = deserialize(decodeURIComponent(document.querySelector(`[name=nullstack]`).content));

export default state;