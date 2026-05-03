import { loginUser, logoutUser, registerUser } from "@/src/api/Auth";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useEffect, useState } from "react";

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  fullName?: string;
  role?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  restoreToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Save tokens to secure storage
  const saveTokens = useCallback(
    async (accessToken: string, refreshToken: string) => {
      try {
        await Promise.all([
          SecureStore.setItemAsync("accessToken", accessToken),
          SecureStore.setItemAsync("refreshToken", refreshToken),
        ]);
        setTokens({ accessToken, refreshToken });
      } catch (error) {
        console.error("Error saving tokens:", error);
        throw error;
      }
    },
    [],
  );

  // Save user info to secure storage
  const saveUserInfo = useCallback(async (userData: User) => {
    try {
      await SecureStore.setItemAsync("userInfo", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error saving user info:", error);
      throw error;
    }
  }, []);

  // Clear all auth data
  const clearAuthData = useCallback(async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync("accessToken"),
        SecureStore.deleteItemAsync("refreshToken"),
        SecureStore.deleteItemAsync("userInfo"),
      ]);
      setUser(null);
      setTokens(null);
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  }, []);

  // Restore token from secure storage on app launch
  const restoreToken = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const userInfoStr = await SecureStore.getItemAsync("userInfo");

      if (accessToken && refreshToken && userInfoStr) {
        const userData = JSON.parse(userInfoStr);
        setTokens({ accessToken, refreshToken });
        setUser(userData);
      }
    } catch (error) {
      console.error("Error restoring token:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  // Login function
  const login = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await loginUser({ username, password });

        if (response?.statusCode === 200 && response?.data) {
          const { user: userData, accessToken, refreshToken } = response.data;

          // Save tokens and user info
          await saveTokens(accessToken, refreshToken);
          await saveUserInfo(userData);
        } else {
          throw new Error(response?.message || "Login failed");
        }
      } catch (error) {
        await clearAuthData();
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [saveTokens, saveUserInfo, clearAuthData],
  );

  // Register function
  const register = useCallback(
    async (username: string, email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await registerUser({ username, email, password });

        if (response?.statusCode === 201 && response?.data) {
          const { user: userData, accessToken, refreshToken } = response.data;

          // Save tokens and user info
          await saveTokens(accessToken, refreshToken);
          await saveUserInfo(userData);
        } else {
          throw new Error(response?.message || "Registration failed");
        }
      } catch (error) {
        await clearAuthData();
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [saveTokens, saveUserInfo, clearAuthData],
  );

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (tokens?.accessToken) {
        // Call logout API
        await logoutUser(tokens.accessToken);
      }
    } catch (error) {
      console.error("Error during logout API call:", error);
    } finally {
      // Clear local auth data regardless of API response
      await clearAuthData();
      setIsLoading(false);
    }
  }, [tokens, clearAuthData]);

  // Check auth status (simple token validation)
  const checkAuthStatus = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      return !!accessToken;
    } catch (error) {
      console.error("Error checking auth status:", error);
      return false;
    }
  }, []);

  const value: AuthContextType = {
    user,
    tokens,
    isLoading,
    isSignedIn: !!user && !!tokens,
    login,
    register,
    logout,
    checkAuthStatus,
    restoreToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
