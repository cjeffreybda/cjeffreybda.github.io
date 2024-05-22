function createProjectCards() {

  let selected = document.querySelector('.selected').id;

  let projects = JSON.parse(localStorage.projects);
  let projectsHTML = '';

  projects.forEach((project) => {
    let skills = project.skills;
    let tag = project.tag;
    let images = project.images;

    if (selected != 'sort-all' && ('sort-' + tag) != selected) {
      return;
    }

    projectsHTML += `
      <div class="project-card" onclick="showProject('${project.id}')">
        <img class="project-image" src="./media/projects/${project.id}/${project.id}-${images[project.coveridx].src}">
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
}

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
}

function showProject(i) {
  let projects = JSON.parse(localStorage.projects);
  let projectHTML = '';
  

  projects.forEach((project) => {
    if (project.id == i) {
      projectHTML += `
        <div class="project-page" id="${project.id}">
          <div class=project-page-text>
            <p class="project-title">${project.name}</p>
            <p class="project-date">${project.date}</p>
            <p class="project-body">${project.body}</p>
          </div>
          <div class="project-images">`

      let images = project.images;
      images.forEach((image) => {
        projectHTML += `
          <img class="project-image" src="./media/projects/${project.id}/${project.id}-${image.src}">
          <p class="caption">${image.caption}</p>`
      });
      projectHTML += `</div></div>`;
    }
  });

  document.querySelector('.project-container').innerHTML = projectHTML;

  localStorage.fromTop = document.documentElement.scrollTop;
  document.body.style.position = 'fixed';
  document.body.style.overflowY = 'scroll';
  document.body.style.top = -localStorage.fromTop + "px";

  document.getElementById(i).style.visibility = 'visible';
  document.getElementById(i).style.opacity = 1;
  document.getElementById(i).style.transform = 'scale(1)';
  document.querySelector('.project-background').style.visibility = 'visible';
  document.querySelector('.project-background').style.opacity = 1;
}

function closeProject() {
  document.body.style.position = 'static';
  document.body.style.overflowY = 'auto';
  window.scrollTo(0, localStorage.fromTop);

  document.querySelector('.project-page').style.opacity = 0;
  document.querySelector('.project-page').style.transform = 'scale(0.8)';
  document.querySelector('.project-background').style.opacity = 0;

  document.querySelector('.project-background').style.visibility = 'hidden';
  
  setTimeout(() => {
    document.querySelector('.project-container').innerHTML = ``;
  }, 150);
}