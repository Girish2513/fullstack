const toggle = document.getElementById("theme-toggle");
const html = document.documentElement;

const saved = localStorage.getItem("theme");
if (saved) html.dataset.theme = saved;

toggle.addEventListener("click", () => {
  const next = html.dataset.theme === "dark" ? "" : "dark";
  html.dataset.theme = next;
  localStorage.setItem("theme", next);
});

const hamburger = document.getElementById("hamburger-btn");
const sidebar = document.getElementById("sidebar-nav");
const backdrop = document.getElementById("sidebar-backdrop");

function closeSidebar() {
  sidebar.classList.remove("open");
  backdrop.classList.remove("open");
}

hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  backdrop.classList.toggle("open");
});
backdrop.addEventListener("click", closeSidebar);

sidebar.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeSidebar);
});

const slider = document.getElementById("weight-slider");
const weightValue = document.getElementById("weight-value");
const weightDemo = document.getElementById("weight-demo");

slider.addEventListener("input", () => {
  weightValue.textContent = slider.value;
  weightDemo.style.fontWeight = slider.value;
});
