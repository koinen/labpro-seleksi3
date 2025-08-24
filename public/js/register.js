document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return; // in case the script runs on other pages

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent default form submission

    const data = {
        first_name: form.first_name.value.trim(),
        last_name: form.last_name.value.trim(),
        username: form.username.value.trim(),
        email: form.email.value.trim(),
        password: form.password.value,
        confirm_password: form.confirm_password.value
    };

    console.log(password);
    console.log(confirm_password);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Registration failed:", err);
        alert(err.message || "Registration failed");
        return;
      }

      const result = await res.json();
      console.log("Registration successful:", result);
      alert("Account created successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
