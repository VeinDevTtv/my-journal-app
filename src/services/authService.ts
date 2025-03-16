// src/services/authService.ts
export class AuthService {
    static login(email: string, password: string): boolean {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
      return false;
    }
  
    static logout(): void {
      localStorage.removeItem('currentUser');
    }
  
    static register(email: string, password: string): boolean {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const exists = users.some((u: any) => u.email === email);
      if (exists) return false;
  
      const newUser = { email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
  
    static getCurrentUser(): any {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
  
    static isAuthenticated(): boolean {
      return !!localStorage.getItem('currentUser');
    }
  
    static resetPassword(email: string, newPassword: string): boolean {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const index = users.findIndex((u: any) => u.email === email);
      if (index !== -1) {
        users[index].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        return true;
      }
      return false;
    }
  }
  