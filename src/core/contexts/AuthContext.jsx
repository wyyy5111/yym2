import React, { createContext, useState, useEffect, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// 创建认证上下文
const AuthContext = createContext(null);

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  // 新增：一次性验证码信息（本地模拟，不安全，仅示例）
  const [otpInfo, setOtpInfo] = useState(null);

  // 检查本地存储中的认证状态
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
      
      if (authStatus) {
        // 尝试获取用户信息
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          try {
            setUser(JSON.parse(userInfo));
          } catch (e) {
            console.error('解析用户信息失败', e);
          }
        }
      }
      
      // 若存在未使用的验证码信息，加载到内存（便于校验）
      const storedOtp = localStorage.getItem('otpInfo');
      if (storedOtp) {
        try {
          setOtpInfo(JSON.parse(storedOtp));
        } catch {}
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // 模拟登录API调用（密码登录）
  const login = async (phone, password) => {
    setAuthLoading(true);
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单的登录验证
      if (phone && password) {
        const userData = {
          phone,
          name: '用户' + phone.slice(-4), // 使用手机号后4位作为用户名
          token: 'mock-token-' + Date.now()
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userInfo', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        // 清除重定向路径，确保登录后进入主页面
        localStorage.removeItem('redirectPath');
        return userData;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // 生成本地一次性验证码（6位）
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  // 发送验证码（本地模拟：生成并保存到localStorage）
  const sendOtp = async (phone) => {
    setAuthLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (!phone) throw new Error('请输入手机号');
      const code = generateOtp();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5分钟有效
      const info = { phone, code, expiresAt };
      setOtpInfo(info);
      localStorage.setItem('otpInfo', JSON.stringify(info));
      return { code, expiresInMinutes: 5 };
    } finally {
      setAuthLoading(false);
    }
  };

  // 免密码登录：使用验证码校验（本地模拟）
  const loginWithOtp = async (phone, code) => {
    setAuthLoading(true);
    try {
      const stored = localStorage.getItem('otpInfo');
      const info = stored ? JSON.parse(stored) : otpInfo;
      if (!info || info.phone !== phone) throw new Error('验证码未发送或手机号不匹配');
      if (Date.now() > info.expiresAt) throw new Error('验证码已过期');
      if (info.code !== code) throw new Error('验证码错误');

      const userData = {
        phone,
        name: '用户' + phone.slice(-4),
        token: 'mock-token-' + Date.now()
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      localStorage.removeItem('redirectPath');
      localStorage.removeItem('otpInfo');
      setOtpInfo(null);
      return userData;
    } catch (error) {
      console.error('OTP login error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // 模拟注册API调用
  const register = async (phone, password) => {
    setAuthLoading(true);
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单的注册验证
      if (phone && password && password.length >= 6) {
        return { success: true };
      } else {
        throw new Error('Invalid registration data');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    localStorage.removeItem('otpInfo');
    setIsAuthenticated(false);
    setUser(null);
    setOtpInfo(null);
  };

  // 上下文值
  const value = {
    isAuthenticated,
    user,
    loading,
    authLoading,
    login,
    sendOtp,
    loginWithOtp,
    register,
    logout,
    setUser
  };

  // 加载状态 - 不显示加载页面，直接渲染子组件
  // 这样可以确保用户能立即看到WelcomePage
  if (loading) {
    return null; // 或者返回一个空的占位符
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 认证钩子
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};

// 获取登录后应该重定向的路径
export const getRedirectPath = () => {
  // 登录后总是进入emotion-journal页面作为主页面
  return '/journal';
};

// 受保护的路由组件
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 保存当前位置，但登录后将直接进入主页面
    return <Navigate to="/login" replace />;
  }

  return children;
};
