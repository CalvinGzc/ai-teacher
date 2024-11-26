import React, { useState } from 'react';

interface SettingsProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  onExportData: () => void;
  onImportData: (data: File) => void;
}

const Settings: React.FC<SettingsProps> = ({
  theme,
  onThemeChange,
  onExportData,
  onImportData
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-apple-hover p-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-chat-text mb-2">主题设置</h3>
            <select
              value={theme}
              onChange={(e) => onThemeChange(e.target.value)}
              className="w-full px-3 py-2 border border-chat-border rounded-lg"
            >
              <option value="light">浅色主题</option>
              <option value="dark">深色主题</option>
              <option value="system">跟随系统</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-chat-text mb-2">数据管理</h3>
            <div className="space-y-2">
              <button
                onClick={onExportData}
                className="w-full px-4 py-2 text-sm bg-chat-accent text-white rounded-lg hover:bg-chat-hover transition-colors"
              >
                导出数据
              </button>
              <label className="block">
                <span className="w-full px-4 py-2 text-sm bg-chat-accent text-white rounded-lg hover:bg-chat-hover transition-colors cursor-pointer block text-center">
                  导入数据
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 