import state from './state';

const settings = { ...state.settings };
delete state.settings;

Object.freeze(settings);

export default settings;