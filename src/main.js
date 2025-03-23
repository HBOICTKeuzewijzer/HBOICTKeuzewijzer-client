document.getElementById("login").addEventListener("click", () => {
  // Redirect to backend to trigger SAML login
  window.location.href = "https://localhost:8081/api/auth/login?returnUrl=https://localhost:8081/api/auth/me";
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("https://localhost:8081/api/auth/success", {
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();
      document.getElementById("status").textContent = `Logged in as ${data.user}`;
    } else {
      document.getElementById("status").textContent = "Not logged in";
    }
  } catch (err) {
    console.error("Auth status check failed", err);
    document.getElementById("status").textContent = "Not logged in";
  }
});
