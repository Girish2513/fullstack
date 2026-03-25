document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const statusMsg = document.getElementById("status-msg");

  document.getElementById("load-user-btn").addEventListener("click", () => {
    statusMsg.textContent = "Loading...";
    fetch("/users/1")
      .then(res => {
        if (!res.ok) throw new Error("Got " + res.status);
        return res.json();
      })
      .then(data => {
        output.textContent = "GET /users/1\n" + JSON.stringify(data, null, 2);
        statusMsg.textContent = "Done";
      })
      .catch(err => { statusMsg.textContent = err.message; statusMsg.className = "error"; });
  });

  document.getElementById("load-unknown-btn").addEventListener("click", () => {
    statusMsg.textContent = "Loading...";
    fetch("/users/999")
      .then(res => res.json())
      .then(data => {
        output.textContent = "GET /users/999 (404)\n" + JSON.stringify(data, null, 2);
        statusMsg.textContent = "Got 404 as expected";
      })
      .catch(err => { statusMsg.textContent = err.message; });
  });

  document.getElementById("echo-btn").addEventListener("click", () => {
    const payload = { message: "hello", ts: new Date().toISOString() };
    statusMsg.textContent = "Sending...";
    fetch("/echo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        output.textContent = "POST /echo\nSent: " + JSON.stringify(payload) + "\nGot back: " + JSON.stringify(data, null, 2);
        statusMsg.textContent = "Done";
      })
      .catch(err => { statusMsg.textContent = err.message; });
  });

  document.getElementById("cookie-btn").addEventListener("click", () => {
    fetch("/set-theme-cookie")
      .then(res => res.json())
      .then(data => {
        output.textContent = JSON.stringify(data, null, 2);
        statusMsg.textContent = "Cookie set — check Application tab";
      });
  });
});
