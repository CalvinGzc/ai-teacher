import React, { useState } from 'react';

interface RegisterProps {
  onRegister: (username: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setIsLoading(true);
    try {
      await onRegister(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-apple">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-chat-text">创建账号</h2>
          <p className="mt-2 text-chat-label">注册新的 AI 助手账号</p>
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

            <div>
              <label htmlFor="confirmPassword" className="text-chat-text text-sm font-medium">
                确认密码
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-chat-border rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-chat-accent focus:border-transparent
                         transition-all"
                placeholder="请再次输入密码"
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
            {isLoading ? '注册中...' : '注册'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-chat-accent hover:text-chat-hover text-sm"
            >
              已有账号？点击登录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 