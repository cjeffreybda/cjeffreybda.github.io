import projectData from './projects.json' with {type: 'json' };
let projects = projectData.projects;

let projectsHTML = '';

projects.forEach((project) => {
  let skills = project.skills;
  projectsHTML += `
    <div class="project-card" onclick="showProject('${project.id}')">
      <img class="project-image" src="./media/projects/${project.id}/${project.image}">
      <div class="skills-flex">`;
  
    skills.forEach((skill) => {
      projectsHTML += `
      <p class="skill">${skill}</p>`;
    })
        
    projectsHTML += `</div>
      <div class="project-info">
        <p class="project-title">${project.name}</p>
        <p class="project-date">${project.date}</p>
        <p class="project-blurb">${project.blurb}</p>
      </div>
    </div>`;
});

console.log(projectsHTML);

document.getElementById('project-grid').innerHTML = projectsHTML;