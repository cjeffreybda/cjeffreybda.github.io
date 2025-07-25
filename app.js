const SHEET_ID = '1jr2Ll7yrCW0QUlzyc17TV17DJvlvRxtYBn20ginRlQ4';
const BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?`;
const PROJECTS_SHEET = 'Projects';
const FIGURES_SHEET = 'Figures';
const CATEGORIES_SHEET = 'Categories';
const ROLLS_SHEET = 'Rolls';
const GALLERY_SHEET = 'Gallery';
const QUERY = encodeURIComponent('Select *');
const PROJECTS_URL = `${BASE}&sheet=${PROJECTS_SHEET}&tq=${QUERY}`;
const FIGURES_URL = `${BASE}&sheet=${FIGURES_SHEET}&tq=${QUERY}`;
const CATEGORIES_URL = `${BASE}&sheet=${CATEGORIES_SHEET}&tq=${QUERY}`;
const ROLLS_URL = `${BASE}&sheet=${ROLLS_SHEET}&tq=${QUERY}`;
const GALLERY_URL = `${BASE}&sheet=${GALLERY_SHEET}&tq=${QUERY}`;

const PROJECTS_COLS = {
  "name": 0,
  "dates": 1,
  "category": 2,
  "skills": 3,
  "blurb": 4,
  "description": 5,
  "cover": 6,
  "show": 7
}

const FIGURES_COLS = {
  "project": 0,
  "image": 1,
  "caption": 2,
  "show": 3
}

const CATEGORIES_COLS = {
  "name": 0,
  "icon": 1,
  "show": 2
}

const ROLLS_COLS = {
  "id": 0,
  "dates": 1,
  "film": 2,
  "camera": 3,
  "show": 4
}

const GALLERY_COLS = {
  "id": 0,
  "image": 1,
  "caption": 2,
  "show": 3
}

let triggers = new Map();

let projects;
let figures;
let categories;
let rolls;
let gallery;

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
  if (document.getElementById('projects') != null) {
    await Promise.all([getProjects(), getFigures(), getCategories()]);
    makeCategories();
    makeProjectCards();
  }
  else if (document.getElementById('gallery') != null) {
    await Promise.all([getRolls(), getGallery()]);
    makeGallery();
  }

  document.querySelectorAll(".trigger").forEach(el => {
    OBSERVER.observe(el);
  });
  setTriggerDelays();
}
document.addEventListener("DOMContentLoaded", init);

async function getProjects() {
  await fetch(PROJECTS_URL).then(res => res.text()).then(rep => { projects = JSON.parse(rep.substring(47).slice(0,-2)).table.rows; });
}

async function getFigures() {
  await fetch(FIGURES_URL).then(res => res.text()).then(rep => { figures = JSON.parse(rep.substring(47).slice(0,-2)).table.rows; });
}

async function getCategories() {
  await fetch(CATEGORIES_URL).then(res => res.text()).then(rep => { categories = JSON.parse(rep.substring(47).slice(0,-2)).table.rows; });
}

async function getRolls() {
  await fetch(ROLLS_URL).then(res => res.text()).then(rep => { rolls = JSON.parse(rep.substring(47).slice(0,-2)).table.rows; });
}

async function getGallery() {
  await fetch(GALLERY_URL).then(res => res.text()).then(rep => { gallery = JSON.parse(rep.substring(47).slice(0,-2)).table.rows; });
}

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

function setTriggerDelays() {
  // let cardTexts = Array.from(document.querySelectorAll(".card-text").values());
  // for (let i = 0; i < cardTexts.length; i ++) {
  //   let delay = (i + 1) * 0.2;
  //   cardTexts[i].setAttribute("style", "transition-delay: " + delay + "s;");
  // }

  let projectCards = Array.from(document.querySelectorAll(".project-card").values());
  for (let i = 0; i < projectCards.length; i ++) {
    let delay = i * 0.2;
    projectCards[i].style = `transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, opacity 0.6s ease-in-out ${delay}s, filter 0.6s ease-in-out ${delay}s;`;
  }

  let galleryImages = Array.from(document.querySelectorAll('#gallery figure').values());
  for (let i = 0; i < galleryImages.length; i ++) {
    let delay = Math.random() * 0.4 + 0.5;
    galleryImages[i].style = `transition: transform 0.6s ease-in-out ${delay}s, opacity 0.6s ease-in-out ${delay}s, filter 0.6s ease-in-out ${delay}s;`;
  }
}

function driveUrlToThumb(url) {
  return 'https://drive.google.com/thumbnail?id=' + url.substring(url.indexOf('/d/') + 3, url.indexOf('/view')) + '&sz=w1080';
}

// PROJECTS

function makeCategories() {
  let html = '';

  for (let i = 0; i < categories.length; i ++) {
    if (categories[i].c[CATEGORIES_COLS.name] == null || categories[i].c[CATEGORIES_COLS.icon] == null || categories[i].c[CATEGORIES_COLS.show].v == false) { continue; }
    html += `<li><button class="button sort${(i == 0) ? ' selected' : ''}" id="sort-${categories[i].c[CATEGORIES_COLS.name].v.toLowerCase().replaceAll(' ', '-')}"><i class="fa-solid fa-${categories[i].c[CATEGORIES_COLS.icon].v}"></i></button></li>`;
  }
  
  document.getElementById('categories').innerHTML = html;
  document.querySelectorAll('.button.sort').forEach((el) => {
    el.addEventListener('click', event => { filterProjects(el.getAttribute('id')); });
  });
}

function makeProjectCards() {
  let html = '';
  for (let i = projects.length - 1; i >= 0; i --) {
    if (projects[i].c[PROJECTS_COLS.name] == null || projects[i].c[PROJECTS_COLS.dates] == null || projects[i].c[PROJECTS_COLS.blurb] == null || projects[i].c[PROJECTS_COLS.description] == null || projects[i].c[PROJECTS_COLS.cover] == null || projects[i].c[PROJECTS_COLS.show].v == false) { continue; }
    let name = projects[i].c[PROJECTS_COLS.name].v;

    let imgSrc = driveUrlToThumb(projects[i].c[PROJECTS_COLS.cover].v);

    document.getElementById('project-triggers').innerHTML += '<div class="trigger" id="project-' + i + '_t"></div>';
    let category = (projects[i].c[PROJECTS_COLS.category] != null) ? projects[i].c[PROJECTS_COLS.category].v : categories[0].c[CATEGORIES_COLS.name].v; // default to top category, should be 'All'

    html += '<li class="project-card ' + category.toLowerCase().replaceAll(' ', '-') + '" id="project-' + i + '">';
    html += '<div class="project-cover">';
    html += '<img src="' + imgSrc + '">';
    
    if (projects[i].c[PROJECTS_COLS.skills] != null)
    {
      html += '<ul class="skills">';
      projects[i].c[PROJECTS_COLS.skills].v.split(', ').forEach((el) => {
        html += '<li>' + el + '</li>';
      });
      html += '</ul>';
    }    
    
    html += '</div>'
    html += '<div class="project-inner">';
    html += '<div class="project-heading">';
    html += '<h2 class="project-title">' + name + '</h2>';
    html += '<p class="project-date">' + projects[i].c[PROJECTS_COLS.dates].v + '</p>';
    html += '</div>';
    html += '<p class="project-blurb">' + projects[i].c[PROJECTS_COLS.blurb].v + '</p>';
    html += '</div>';
    html += '</li>';
  }

  document.getElementById('projects').innerHTML = html;
  document.querySelectorAll('.project-card').forEach((el) => {
    el.addEventListener('click', event => {openProject(el.getAttribute('id'));})
  });
}

function filterProjects(id) {
  let cards = document.querySelectorAll('.project-card');
  let filter = id.substring(id.indexOf('-') + 1);
  let all = categories[0].c[CATEGORIES_COLS.name].v.toLowerCase().replaceAll(' ', '-');

  cards.forEach((el) => {
    el.style.display = '';
    if (filter != all && !el.classList.contains(filter)) {
      el.style.display = 'none';
    }
  });

  let buttons = document.querySelectorAll('.button.sort');

  buttons.forEach((el) => {
    el.classList.remove('selected');
    if (el.getAttribute('id') == id) {
      el.classList.add('selected');
    }
  });
}

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
  let projectPage = document.getElementById('project-page');

  let proj = projects[id.substring(id.indexOf('-') + 1)];
  let projName = makeSmallCaps(proj.c[PROJECTS_COLS.name].v);

  let html = '<button class="button close"><i class="fa-solid fa-chevron-down"></i></button>';
  html += '<div class="project-header">';
  html += '<h2>' + projName + '</h2>';
  html += '<p>' + proj.c[PROJECTS_COLS.dates].v + '</p>';
  html += '</div>';
  html += '<div class="project-content">';
  html += '<div><p>' + proj.c[PROJECTS_COLS.description].v + '</p></div>';

  let firstFigure = true;
  let hasFigures = false;
  for (let i = 0; i < figures.length; i ++) {
    if (figures[i].c[FIGURES_COLS.project] == null || figures[i].c[FIGURES_COLS.project].v != proj.c[PROJECTS_COLS.name].v || figures[i].c[FIGURES_COLS.image] == null || figures[i].c[FIGURES_COLS.show].v == false) { continue; }

    if (firstFigure == true) {
      firstFigure = false;
      hasFigures = true;
      html += '<ul class="gallery">';
    }

    let imgSrc = driveUrlToThumb(figures[i].c[FIGURES_COLS.image].v);

    html += '<li><figure>';
    html += `<img src="${imgSrc}">`;
    if (figures[i].c[FIGURES_COLS.caption] != null) {
      html += `<figcaption>${figures[i].c[FIGURES_COLS.caption].v}</figcaption>`;
    }
    html += '</figure></li>';
  }

  if (hasFigures == true) {
    html += '</ul>';
  }

  projectPage.innerHTML = html;

  projectPage.style.display = 'flex';

  setTimeout(function() {
    projectPage.classList.add('show');
    projectPage.scrollTo(0, 0);
    document.querySelector('body').classList.add('noscroll');
    document.querySelector('.nav-bar').classList.add('hide');
    document.querySelector('.button.close').addEventListener('click', closeProject);
  }, 1);
}

function closeProject() {
  document.querySelector('body').classList.remove('noscroll');
  document.querySelector('.nav-bar').classList.remove('hide');
  document.getElementById('project-page').classList.remove('show');
  setTimeout(function() {
    document.getElementById('project-page').style.display = 'none';
  }, 401);
}

window.addEventListener('keydown', event => {
  if (event.key == 'Escape') {
    closeProject();
  }
});

// PHOTOGRAPHY

function makeGallery() {
  let html = '';
  console.log(rolls);

  for (let i = rolls.length - 1; i >= 0; i --) {
    if (rolls[i].c[ROLLS_COLS.id] == null || rolls[i].c[ROLLS_COLS.film] == null || rolls[i].c[ROLLS_COLS.camera] == null || rolls[i].c[ROLLS_COLS.dates] == null || rolls[i].c[ROLLS_COLS.show].v == false) { continue; }

    document.getElementById('gallery-triggers').innerHTML += `<div class="trigger" id="header-${i}_t"></div>`;

    html += `<li><ul class="gallery-header" id="header-${i}">`;
    html += `<li><i class="fa-solid fa-film"></i>${rolls[i].c[ROLLS_COLS.film].v}</li>`;
    html += `<li><i class="fa-solid fa-camera"></i>${rolls[i].c[ROLLS_COLS.camera].v}</li>`;
    html += `<li><i class="fa-solid fa-calendar"></i>${rolls[i].c[ROLLS_COLS.dates].v}</li>`;
    html += '</ul><ul class="gallery">';

    for (let j = 0; j < gallery.length; j ++) {
      if (gallery[j].c[GALLERY_COLS.id] == null || gallery[j].c[GALLERY_COLS.id].v != rolls[i].c[ROLLS_COLS.id].v || gallery[j].c[GALLERY_COLS.image] == null || gallery[j].c[GALLERY_COLS.show].v == false) { continue; }

      let imgSrc = driveUrlToThumb(gallery[j].c[GALLERY_COLS.image].v);

      document.getElementById('gallery-triggers').innerHTML += `<div class="trigger" id="photo-${j}_t"></div>`;

      html += `<li><figure class="gallery-photo" id="photo-${j}">`;
      html += `<img src="${imgSrc}">`;
      if (gallery[j].c[GALLERY_COLS.caption] != null) {
        html += `<figcaption>${gallery[j].c[GALLERY_COLS.caption].v}</figcaption>`;
      }
      html += '</figure></li>';
    }
    html += '</ul></li>';
  }

  document.getElementById('gallery').innerHTML = html;
}