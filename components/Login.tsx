import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await onLogin(username, password);
    } catch (err) {
      setError('登录失败，请检查用户名和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-apple">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-chat-text">欢迎使用 AI 助手</h2>
          <p className="mt-2 text-chat-label">请登录您的账号</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="text-chat-text text-sm font-medium">
                用户名
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-chat-border rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-chat-accent focus:border-transparent
                         transition-all"
                placeholder="请输入用户名"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="text-chat-text text-sm font-medium">
                密码
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-chat-border rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-chat-accent focus:border-transparent
                         transition-all"
                placeholder="请输入密码"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium
                     transition-all ${
                       isLoading
                         ? 'bg-gray-400 cursor-not-allowed'
                         : 'bg-chat-accent hover:bg-chat-hover'
                     }`}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-chat-accent hover:text-chat-hover text-sm"
            >
              还没有账号？点击注册
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 