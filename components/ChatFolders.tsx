import React, { useState } from 'react';

interface Folder {
  id: number;
  title: string;
  lastUpdate: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
}

interface ChatFoldersProps {
  folders: Folder[];
  activeFolder: Folder | null;
  onSelectFolder: (folder: Folder) => void;
  onCreateFolder: () => void;
  onDeleteFolder: (id: number) => void;
  onRenameFolder: (id: number, title: string) => void;
}

const ChatFolders: React.FC<ChatFoldersProps> = ({
  folders,
  activeFolder,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  const handleRename = (folder: Folder) => {
    if (newTitle.trim()) {
      onRenameFolder(folder.id, newTitle.trim());
      setEditingId(null);
      setNewTitle('');
    }
  };

  const startEditing = (folder: Folder) => {
    setEditingId(folder.id);
    setNewTitle(folder.title);
  };

  const filteredAndSortedFolders = folders
    .filter(folder => 
      folder.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="w-64 h-full bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">聊天记录</h2>
          <button
            onClick={onCreateFolder}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="搜索文件夹..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4 flex text-sm">
          <button
            onClick={() => setSortBy('date')}
            className={`mr-2 px-2 py-1 rounded ${
              sortBy === 'date' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
          >
            按时间
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-2 py-1 rounded ${
              sortBy === 'name' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
          >
            按名称
          </button>
        </div>

        <div className="space-y-2">
          {filteredAndSortedFolders.map((folder) => (
            <div
              key={folder.id}
              className={`p-3 rounded-lg ${
                activeFolder?.id === folder.id
                  ? 'bg-blue-100'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                {editingId === folder.id ? (
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => handleRename(folder)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRename(folder)}
                    className="flex-1 px-2 py-1 text-sm border rounded"
                    autoFocus
                  />
                ) : (
                  <div
                    className="flex-1 cursor-pointer text-sm font-medium truncate"
                    onClick={() => onSelectFolder(folder)}
                  >
                    {folder.title}
                  </div>
                )}
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => startEditing(folder)}
                    className="p-1 text-gray-500 hover:text-blue-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteFolder(folder.id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(folder.lastUpdate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatFolders; 