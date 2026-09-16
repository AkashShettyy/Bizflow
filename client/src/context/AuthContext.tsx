import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api.js";
import type {
  LoginResponse,
  Role,
  Tenant,
  User,
} from "../types/auth.js";

interface AuthContextValue {
  user: User | null;
  tenant: Tenant | null;
  role: Role | null;
  accessToken: string | null;
  loading: boolean;
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
    localStorage.getItem("accessToken"),
  );
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<{
          success: boolean;
          data: {
            user: User;
            tenantId: string;
            role: Role;
          };
        }>("/auth/me");

        const data = response.data.data;

        setUser(data.user);
        setRole(data.role);

        setTenant({
          id: data.tenantId,
          name: "",
          slug: "",
        });
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setAccessToken(null);
        setUser(null);
        setTenant(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        role,
        accessToken,
        loading,
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