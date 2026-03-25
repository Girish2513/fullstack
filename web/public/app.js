document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/ping")
    .then(res => res.json())
    .then(data => {
      document.getElementById("time").textContent = data.time;
    });
});
