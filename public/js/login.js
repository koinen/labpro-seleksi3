document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return; // in case the script runs on other pages

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent default form submission

    const data = {
        identifier: form.identifier.value.trim(),
        password: form.password.value
    };

    try {
      const res = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Login failed:", err);
        alert(err.message || "Login failed");
        return;
      }

      const result = await res.json();
      console.log("Login successful:", result);
      alert("Login successful!");
      window.location.href = "/courses";
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
