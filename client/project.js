const project = {...window.project};

delete window.project;

Object.freeze(project);

export default project;