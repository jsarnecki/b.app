export interface User {
  id: number;
  email: string;
}

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  // Later: setUser, logout, token
}
