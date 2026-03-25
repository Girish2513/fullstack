document.addEventListener("DOMContentLoaded", () => {
  const loadBtn = document.getElementById("load-user-btn");
  const clearBtn = document.getElementById("clear-btn");
  const card = document.getElementById("user-card");
  const statusMsg = document.getElementById("status-msg");
  const debugHeader = document.getElementById("debug-header");

  loadBtn.addEventListener("click", () => {
    statusMsg.textContent = "Loading...";
    card.textContent = "";

    fetch("/api/user")
      .then(res => {
        const trace = res.headers.get("X-Debug-Trace");
        if (trace) debugHeader.textContent = "Trace: " + trace;

        if (!res.ok) throw new Error("Server error: " + res.status);
        return res.json();
      })
      .then(data => {
        card.innerHTML = "<strong>" + data.name + "</strong><br>" + data.email;
        statusMsg.textContent = "Loaded";
        localStorage.setItem("last_user_fetch", new Date().toISOString());
      })
      .catch(err => {
        statusMsg.textContent = err.message;
        statusMsg.className = "error";
      });
  });

  clearBtn.addEventListener("click", () => {
    card.textContent = "";
    statusMsg.textContent = "";
    debugHeader.textContent = "";
    localStorage.removeItem("last_user_fetch");
  });
});
