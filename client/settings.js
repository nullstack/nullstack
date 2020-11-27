const settings = {...window.settings};
delete window.settings;

Object.freeze(settings);

export default settings;