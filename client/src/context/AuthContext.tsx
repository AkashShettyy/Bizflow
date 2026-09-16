import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api.js";
import type { LoginResponse, User, Tenant, Role } from "../types/auth.js";

interface AuthContextValue {
  user: User | null;
  tenant: Tenant | null;
  role: Role | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    null,
  );

  const login = async (
    email: string,
    password: string,
  ): Promise<void> => {
    const response = await api.post<{
      success: boolean;
      data: LoginResponse;
    }>("/auth/login", {
      email,
      password,
    });

    const data = response.data.data;

    setUser(data.user);
    setTenant(data.tenant);
    setRole(data.role);
    setAccessToken(data.accessToken);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  };

  const logout = (): void => {
    setUser(null);
    setTenant(null);
    setRole(null);
    setAccessToken(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        role,
        accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
};