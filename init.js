import projectData from './projects.json' with {type: 'json' };
let projects = projectData.projects;

localStorage.projects = JSON.stringify(projects);