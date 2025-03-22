document.getElementById("login").addEventListener("click", () => {
  window.location.href = "/auth/start";
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/auth/status", {
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();
      document.getElementById("status").textContent = `Logged in as ${data.username}`;
    } else {
      document.getElementById("status").textContent = "Not logged in";
    }
  } catch (err) {
    console.error("Auth status check failed", err);
    document.getElementById("status").textContent = "Not logged in";
  }
});
