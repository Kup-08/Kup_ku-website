(function () {
  const content = window.siteContent;

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string") el.textContent = text;
    return el;
  }

  function getThemePreference() {
    const saved = localStorage.getItem("site-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const button = qs("#themeToggle");
    if (button) {
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      button.textContent = theme === "dark" ? "Light" : "Dark";
    }
  }

  function initThemeToggle() {
    applyTheme(getThemePreference());
    const button = qs("#themeToggle");
    if (!button) return;

    button.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem("site-theme", next);
      applyTheme(next);
    });
  }

  function initMobileMenu() {
    const toggle = qs("#menuToggle");
    const menu = qs("#navMenu");
    const navWrap = qs(".nav-wrap");
    if (!toggle || !menu || !navWrap) return;

    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      navWrap.classList.toggle("is-open");
    });
  }

  function renderNav() {
    const navList = qs("#navMenu");
    if (!navList || !content.nav) return;

    const currentPage = document.body.getAttribute("data-page");
    navList.innerHTML = "";

    content.nav.forEach(function (item) {
      const li = createEl("li", "nav-item");
      const a = createEl("a", "nav-link", item.label);
      a.href = item.path;
      if (currentPage === item.path) {
        a.setAttribute("aria-current", "page");
      }
      li.appendChild(a);
      navList.appendChild(li);
    });
  }

  function renderFooter() {
    const footerName = qs("#footerName");
    const footerEmail = qs("#footerEmail");
    const footerYear = qs("#footerYear");
    if (footerName) footerName.textContent = content.profile.name;
    if (footerEmail) {
      footerEmail.textContent = content.contact.email;
      footerEmail.href = "mailto:" + content.contact.email;
    }
    if (footerYear) footerYear.textContent = String(new Date().getFullYear());
  }

  function renderSocialList(targetSelector, filterCategory) {
    const container = qs(targetSelector);
    if (!container) return;

    const socials = content.socials.filter(function (s) {
      if (!filterCategory) return true;
      return s.category === filterCategory;
    });

    container.innerHTML = "";

    socials.forEach(function (social) {
      const item = createEl("li", "social-item");
      const link = createEl("a", "social-link");
      link.target = "_blank";
      link.rel = "noreferrer noopener";

      if (social.url) {
        link.href = social.url;
        link.textContent = social.platform + " @" + social.username;
      } else {
        link.href = "#";
        link.textContent = social.platform + " @" + social.username + " (add URL)";
        link.setAttribute("aria-disabled", "true");
      }

      item.appendChild(link);
      container.appendChild(item);
    });
  }

  function renderHome() {
    if (document.body.getAttribute("data-page") !== "index.html") return;

    qs("#heroName").textContent = content.profile.name;
    qs("#heroHeadline").textContent = content.profile.headline;
    qs("#heroPronouns").textContent = content.profile.pronouns;
    qs("#heroIntro").textContent = content.profile.shortIntro;
    qs("#homeSummary").textContent = content.home.summary;

    const highlights = qs("#highlights");
    highlights.innerHTML = "";
    content.home.highlights.forEach(function (h) {
      const card = createEl("article", "highlight-card reveal");
      const title = createEl("h3", "", h.title);
      const detail = createEl("p", "", h.detail);
      card.appendChild(title);
      card.appendChild(detail);
      highlights.appendChild(card);
    });
  }

  function renderAbout() {
    if (document.body.getAttribute("data-page") !== "about.html") return;

    const bioList = qs("#aboutBio");
    bioList.innerHTML = "";
    content.about.bio.forEach(function (paragraph) {
      const p = createEl("p", "reveal", paragraph);
      bioList.appendChild(p);
    });

    const approach = qs("#approachList");
    approach.innerHTML = "";
    content.about.approach.forEach(function (item) {
      const li = createEl("li", "", item);
      approach.appendChild(li);
    });

    qs("#recruiterSummary").textContent = content.about.recruiterSummary;
  }

  function renderProjects() {
    if (document.body.getAttribute("data-page") !== "projects.html") return;

    const grid = qs("#projectsGrid");
    grid.innerHTML = "";

    content.projects.forEach(function (project) {
      const card = createEl("article", "project-card reveal");
      const title = createEl("h3", "", project.title);
      const desc = createEl("p", "", project.description);
      const role = createEl("p", "meta-line", "Role: " + project.role);
      const tools = createEl("p", "meta-line", "Tools: " + project.tools.join(", "));

      const links = createEl("div", "project-links");
      const github = createEl("a", "btn btn-small", "GitHub");
      github.href = project.githubUrl || "#";
      github.target = "_blank";
      github.rel = "noreferrer noopener";
      if (!project.githubUrl || project.githubUrl === "#") {
        github.setAttribute("aria-disabled", "true");
      }
      links.appendChild(github);

      const demo = createEl("span", "tag", project.demoUrl ? "Demo linked" : "Demo placeholder");
      const download = createEl("span", "tag", project.downloadUrl ? "Download linked" : "Download placeholder");
      const shot = createEl("span", "tag", project.screenshot ? "Screenshot added" : "Screenshot placeholder");

      const placeholders = createEl("div", "placeholder-tags");
      placeholders.appendChild(demo);
      placeholders.appendChild(download);
      placeholders.appendChild(shot);

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(role);
      card.appendChild(tools);
      card.appendChild(links);
      card.appendChild(placeholders);
      grid.appendChild(card);
    });
  }

  function renderExperience() {
    if (document.body.getAttribute("data-page") !== "experience.html") return;

    const certs = qs("#certList");
    certs.innerHTML = "";
    content.experience.certifications.forEach(function (cert) {
      const li = createEl("li", "", cert);
      certs.appendChild(li);
    });

    const skillGroups = qs("#skillGroups");
    skillGroups.innerHTML = "";

    Object.keys(content.experience.skills).forEach(function (groupName) {
      const panel = createEl("article", "skill-panel reveal");
      const h3 = createEl("h3", "", groupName);
      const ul = createEl("ul", "skill-list");

      content.experience.skills[groupName].forEach(function (skill) {
        ul.appendChild(createEl("li", "", skill));
      });

      panel.appendChild(h3);
      panel.appendChild(ul);
      skillGroups.appendChild(panel);
    });

    qs("#futureAchievements").textContent = content.experience.futureSlots.achievements;
    qs("#futureEducation").textContent = content.experience.futureSlots.education;
    qs("#futureWork").textContent = content.experience.futureSlots.workHistory;
  }

  function renderService() {
    if (document.body.getAttribute("data-page") !== "service.html") return;

    qs("#serviceIntro").textContent = content.service.intro;
    qs("#serviceRate").textContent = content.service.rate;
    qs("#serviceYears").textContent = content.service.years;
    qs("#serviceNote").textContent = content.service.note;
  }

  function renderCommunity() {
    if (document.body.getAttribute("data-page") !== "community.html") return;

    qs("#communityIntro").textContent = content.community.intro;
    qs("#communityTone").textContent = content.community.tone;
    renderSocialList("#communitySocials", "community");
  }

  function renderContact() {
    if (document.body.getAttribute("data-page") !== "contact.html") return;

    const emailLink = qs("#contactEmail");
    emailLink.textContent = content.contact.email;
    emailLink.href = "mailto:" + content.contact.email;

    const goals = qs("#contactGoals");
    goals.innerHTML = "";
    content.contact.opportunities.forEach(function (goal) {
      goals.appendChild(createEl("li", "chip", goal));
    });

    const resume = qs("#resumeDownload");
    resume.href = content.contact.resumeUrl;

    renderSocialList("#allSocials", null);
  }

  function initReveals() {
    const elements = qsa(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function init() {
    renderNav();
    renderFooter();
    initThemeToggle();
    initMobileMenu();
    renderHome();
    renderAbout();
    renderProjects();
    renderExperience();
    renderService();
    renderCommunity();
    renderContact();
    initReveals();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
