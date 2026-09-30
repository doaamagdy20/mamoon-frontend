import { request, mockDelay, isMockMode } from "./api";

export const authApi = {
  async login({ email, password, role }) {
    if (isMockMode()) {
      await mockDelay();
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }
      return {
        token: `mock-token-${Date.now()}`,
        user: { email, role: role || "candidate" },
      };
    }
    return request("/auth/login", { method: "POST", body: { email, password } });
  },

  async signup({ fullName, email, password, role }) {
    if (isMockMode()) {
      await mockDelay();
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }
      return {
        token: `mock-token-${Date.now()}`,
        user: { fullName, email, role },
      };
    }
    return request("/auth/signup", { method: "POST", body: { fullName, email, password, role } });
  },

  async logout() {
    if (isMockMode()) {
      await mockDelay(150);
      return { ok: true };
    }
    return request("/auth/logout", { method: "POST" });
  },
};
