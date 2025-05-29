const sheetId = "1jr2Ll7yrCW0QUlzyc17TV17DJvlvRxtYBn20ginRlQ4";
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = "Projects";
const query = encodeURIComponent("Select *");
const url = `${base}&sheet=${sheetName}&tq=${query}`;

let triggers = new Map();

let projects;

const OBSERVER = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    let components = entry.target.getAttribute("id").split("_t");
    let target = components[0];
    let trigger = components[1];

    if (document.getElementById(target) == null) {return;}

    if (trigger == "") { // permanent
      if (entry.isIntersecting) {
        document.getElementById(target).classList.add("triggered");
      }
      return;
    }

    // triggered when all visible, untriggered when none visible
    if (triggers.get(target) == null) {triggers.set(target, []);}

    triggers.get(target)[trigger] = entry.isIntersecting ? 1 : 0;

    let trigs = triggers.get(target);
    let enable = true;
    let disable = true;

    trigs.forEach(el => {
      if (el == 1) { disable = false; }
      else if (el == 0) { enable = false; }
    });

    if (enable) { document.getElementById(target).classList.add("triggered"); }
    if (disable) { document.getElementById(target).classList.remove("triggered"); }
  });
});

async function init() {
  document.querySelector('#content').classList.add('show');
  await makeProjectCards();
  document.querySelectorAll(".trigger").forEach(el => {
    OBSERVER.observe(el);
  });
  setCardDelays();
}
document.addEventListener("DOMContentLoaded", init);

function changePage(href) {
  document.querySelector('#content').classList.remove('show');

  document.querySelectorAll('.button.nav').forEach((el) => {
    el.classList.remove('selected');
    if (el.getAttribute('href') == href) {
      el.classList.add('selected');
    }
  });

  setTimeout(function() { 
      window.location.href = href;
  }, 500)
}
document.querySelectorAll('.nav').forEach((el) => {
  el.addEventListener('click', (event) => {changePage(el.getAttribute('href'));});
});

function setCardDelays() {
  // let cardTexts = Array.from(document.querySelectorAll(".card-text").values());
  // for (let i = 0; i < cardTexts.length; i ++) {
  //   let delay = (i + 1) * 0.2;
  //   cardTexts[i].setAttribute("style", "transition-delay: " + delay + "s;");
  // }

  let projectCards = Array.from(document.querySelectorAll(".project-card").values());
  for (let i = 0; i < projectCards.length; i ++) {
    let delay = i * 0.2;
    projectCards[i].setAttribute("style", "transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, opacity 0.6s ease-in-out " + delay + "s, filter 0.6s ease-in-out " + delay + "s;");
  }
}

async function makeProjectCards() {
  if (document.getElementById('projects-container') == null) { return; }

  await fetch(url).then(res => res.text()).then(rep => {
    projects = JSON.parse(rep.substring(47).slice(0,-2)).table.rows;
  });

  let html = '';
  for (let i = projects.length - 1; i >= 0; i --) { // i=0 is header
    let name = projects[i].c[0].v;

    let extensions = projects[i].c[7].v.split(', ');

    let imgsrc = projects[i].c[7].v == "none" ? './media/test.png' : './media/projects/' + projects[i].c[6].v + '/' + projects[i].c[6].v + '-' + (projects[i].c[9].v + 1) + '.' + extensions[projects[i].c[9].v];

    document.getElementById('project-triggers').innerHTML += '<div class="trigger" id="project' + i + '_t"></div>';

    html += '<div class="project-card ' + projects[i].c[2].v.toLowerCase() + '" id="project' + i + '">';
    html += '<div class="project-cover">';
    html += '<img src="' + imgsrc + '">';
    html += '<div class="skills-container">';
    
    projects[i].c[3].v.split(', ').forEach((el) => {
      html += '<p class="skill">' + el + '</p>';
    });
    
    html += '</div>';
    html += '</div>'
    html += '<div class="project-inner">';
    html += '<div class="project-heading">';
    html += '<h2 class="project-title">' + name + '</h2>';
    html += '<p class="project-date">' + projects[i].c[1].v + '</p>';
    html += '</div>';
    html += '<p class="project-blurb">' + projects[i].c[4].v + '</p>';
    html += '</div>';
    html += '</div>';
  }

  document.getElementById('projects-container').innerHTML = html;
  document.querySelectorAll('.project-card').forEach((el) => {
    el.addEventListener('click', event => {openProject(el.getAttribute('id'));})
  });
}

function filterProjects(id) {
  let cards = document.querySelectorAll('.project-card');
  let filter = id.substring(5);

  cards.forEach((el) => {
    el.style.display = '';
    if (filter != 'all' && !el.classList.contains(filter)) {
      el.style.display = 'none';
    }
  });

  let buttons = document.querySelectorAll('.button.sort');

  buttons.forEach((el) => {
    el.classList.remove('selected');
    if (el.getAttribute("id") == id) {
      el.classList.add('selected');
    }
  });
}
document.querySelectorAll('.button.sort').forEach((el) => {
  el.addEventListener('click', event => {filterProjects(el.getAttribute("id"));});
});

function makeSmallCaps(str) {
  let style = "font-family: \'Vollkorn SC\'"
  
  let acronyms = ['AUV', 'ROV'];
  for (let ac of acronyms) {
    console.log(ac);
    let idx = str.indexOf(ac);
    if (idx < 0) { continue; }
    let len = ac.length;
    str = str.substring(0, idx) + '<span style="' + style + '">' + str.substring(idx, idx + len).toLowerCase() + '</span>' + str.substring(idx + len);
    console.log(str);
  }

  return str;
}

function openProject(id) {
  console.log(id);
  let projectPage = document.getElementById('project-page');

  let proj = projects[id.substring(7)];

  let projName = makeSmallCaps(proj.c[0].v);

  let html = '<button class="button close"><i class="fa-solid fa-chevron-down"></i></button>';
  html += '<div class="project-header">';
  html += '<h2>' + projName + '</h2>';
  html += '<p>' + proj.c[1].v + '</p>';
  html += '</div>';
  html += '<div class="project-content">';
  html += '<div><p>' + proj.c[5].v + '</p></div>';
  
  let images = proj.c[7].v.split(', ');
  if (images != "none") {
    html += '<div class="gallery">';
    let captions = proj.c[8].v.split('</>');

    for (let i = 0; i < images.length; i ++) {
      html += '<div class="gallery-photo">';
      html += '<img src="./media/projects/' + proj.c[6].v + '/' + proj.c[6].v + '-' + (i + 1) + '.' + images[i] + '">';
      html += '<p>' + captions[i] + '</p>';
      html += '</div>';
    }

    if (images.length % 2 == 1) {
      html += '<div class="gallery-photo blank"></div>'
    }
  }

  html += '</div>';

  projectPage.innerHTML = html;

  projectPage.classList.add('show');
  projectPage.scrollTo(0, 0);
  document.querySelector('body').classList.add('noscroll');
  document.querySelector('.nav-bar').classList.add('hide');
  document.querySelector('.button.close').addEventListener('click', closeProject);
}

function closeProject() {
  document.querySelector('body').classList.remove('noscroll');
  document.querySelector('.nav-bar').classList.remove('hide');
  document.getElementById('project-page').classList.remove('show');
}

window.addEventListener('keydown', event => {
  if (event.key == 'Escape') {
    closeProject();
  }
});

// function openPicture(obj) {
//   obj.classList.add('selected');
// }
// document.querySelectorAll('.gallery-photo').forEach((el) => {
//   el.addEventListener('click', event => {openPicture(el);})
// });