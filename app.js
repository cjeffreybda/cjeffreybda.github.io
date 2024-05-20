createProjectCards();

function showProject(i) {
  // document.getElementById(i).style.visibility='visible';
  // document.getElementById(i).style.opacity=1;
  alert('hi from ' + i + '!');
};

function createProjectCards() {

  let selected = document.querySelector('.selected').id;

  let projects = JSON.parse(localStorage.projects);
  let projectsHTML = '';

  projects.forEach((project) => {
    let skills = project.skills;
    let tag = project.tag;

    if (selected != 'sort-all' && ('sort-' + tag) != selected) {
      return;
    }

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

  document.getElementById('project-grid').innerHTML = projectsHTML;
};

function changeSort(i) {
  ['sort-all', 'sort-mech', 'sort-sftw'].forEach((id) => {
    if (i == id) {
      document.getElementById(id).className = 'button sort selected';
    }
    else {
      document.getElementById(id).className = 'button sort';
    }
  });
  createProjectCards();
};

function closeProject() {
  
};