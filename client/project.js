import state from './state'

const project = { ...state.project };

delete state.project;

Object.freeze(project);

export default project;