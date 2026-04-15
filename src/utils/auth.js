const API_URL = "http://localhost:5000/api/auth";

export async function register(formData) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Registreren mislukt.",
      };
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: "Kan geen verbinding maken met de server.",
    };
  }
}

export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Inloggen mislukt.",
      };
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: "Kan geen verbinding maken met de server.",
    };
  }
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      logout();
      return null;
    }

    const user = await response.json();
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  } catch (error) {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  }
}

export async function updateCurrentUser(formData) {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      success: false,
      error: "Niet ingelogd.",
    };
  }

  try {
    const response = await fetch(`${API_URL}/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Opslaan mislukt.",
      };
    }

    localStorage.setItem("currentUser", JSON.stringify(data.user));

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: "Kan profiel niet opslaan.",
    };
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
}