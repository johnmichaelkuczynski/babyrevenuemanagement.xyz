import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: number;
  username: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
};

type AuthState = {
  user: AuthUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthState>({
  user: null,
  isLoaded: false,
  isSignedIn: false,
  refetch: () => {},
});

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${basePath}/api/auth/user`, {
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = (await res.json()) as {
        authenticated: boolean;
        user: AuthUser | null;
      };
      setUser(data.authenticated ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{ user, isLoaded, isSignedIn: !!user, refetch: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function login() {
  window.location.href = `${basePath}/api/auth/google`;
}

export async function logout() {
  try {
    await fetch(`${basePath}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    window.location.href = basePath || "/";
  }
}
