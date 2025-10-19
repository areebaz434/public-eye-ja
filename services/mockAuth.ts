export interface MockUser {
  id: string;
  email: string;
  displayName: string;
  role: 'citizen' | 'admin';
}

let currentUser: MockUser | null = null;

export const MockAuth = {
  async login(email: string, password: string): Promise<MockUser> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email && password) {
      currentUser = {
        id: 'mock-user-123',
        email: email,
        displayName: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'citizen'
      };
      return currentUser;
    }
    throw new Error('Invalid credentials');
  },

  async signup(email: string, password: string): Promise<MockUser> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    currentUser = {
      id: 'mock-user-' + Date.now(),
      email: email,
      displayName: email.split('@')[0],
      role: 'citizen'
    };
    return currentUser;
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    currentUser = null;
  },

  getCurrentUser(): MockUser | null {
    return currentUser;
  },

  isAuthenticated(): boolean {
    return currentUser !== null;
  }
};