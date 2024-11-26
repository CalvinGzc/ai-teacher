import { encryptPassword } from './crypto';

interface User {
  id: string;
  username: string;
  password: string;
  folders: any[];
}

// 从 localStorage 获取所有用户数据
const getStoredUsers = (): { [key: string]: User } => {
  try {
    const storedUsers = localStorage.getItem('users');
    console.log('Raw stored users:', storedUsers);
    
    if (!storedUsers) {
      console.log('No stored users found, initializing empty object');
      return {};
    }
    
    const users = JSON.parse(storedUsers);
    console.log('Successfully parsed users:', users);
    return users;
  } catch (error) {
    console.error('Error getting stored users:', error);
    return {};
  }
};

// 保存所有用户数据到 localStorage
const storeUsers = (users: { [key: string]: User }) => {
  try {
    console.log('Attempting to store users:', users);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Users stored successfully');
  } catch (error) {
    console.error('Error storing users:', error);
    throw error;
  }
};

// 初始化用户数据
let users = getStoredUsers();

// 从 localStorage 获取当前用户数据
const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Failed to get stored user:', error);
    return null;
  }
};

// 保存当前用户数据到 localStorage
const storeUser = (user: Partial<User>) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to store current user:', error);
    throw new Error('Failed to save current user data');
  }
};

export async function registerUser(username: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    try {
      console.log('Starting registration for username:', username);
      
      // 获取最新的用户数据
      users = getStoredUsers();
      
      // 检查用户名是否已存在
      const userExists = Object.values(users).some(u => u.username === username);
      console.log('User exists check:', userExists);

      if (userExists) {
        console.log('Username already exists:', username);
        reject(new Error('用户名已存在'));
        return;
      }

      const encryptedPassword = encryptPassword(password);
      console.log('Password encrypted successfully');

      const newUser: User = {
        id: `user${Date.now()}`,
        username,
        password: encryptedPassword,
        folders: []
      };
      console.log('Created new user object:', { ...newUser, password: '[HIDDEN]' });

      // 保存用户数据
      users[newUser.id] = newUser;
      storeUsers(users);
      console.log('User saved to storage');

      // 返回不包含密码的用户数据
      const userForStorage = { ...newUser };
      delete userForStorage.password;
      storeUser(userForStorage);
      console.log('User data prepared for return');

      resolve(userForStorage);
    } catch (error) {
      console.error('Registration error:', error);
      reject(new Error('注册失败，请稍后重试'));
    }
  });
}

export async function loginUser(username: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    try {
      console.log('Starting login for username:', username);
      
      // 获取最新的用户数据
      users = getStoredUsers();
      console.log('Retrieved users from storage');
      
      const encryptedPassword = encryptPassword(password);
      console.log('Password encrypted for comparison');

      // 查找用户
      const user = Object.values(users).find(u => {
        console.log('Checking user:', u.username);
        console.log('Comparing passwords:', {
          stored: u.password,
          input: encryptedPassword,
          matches: u.password === encryptedPassword
        });
        return u.username === username && u.password === encryptedPassword;
      });

      if (user) {
        console.log('User found and password matches');
        const userForStorage = { ...user };
        delete userForStorage.password;
        storeUser(userForStorage);
        console.log('User data stored for session');
        resolve(userForStorage);
      } else {
        console.log('Login failed - no matching user or password');
        reject(new Error('用户名或密码错误'));
      }
    } catch (error) {
      console.error('Login error:', error);
      reject(new Error('登录失败，请稍后重试'));
    }
  });
}

export async function logoutUser() {
  localStorage.removeItem('currentUser');
}

export async function saveUserFolders(userId: string, folders: any[]) {
  users = getStoredUsers();  // 获取最新的用户数据
  if (users[userId]) {
    users[userId].folders = folders;
    storeUsers(users);  // 保存所有用户数据
    
    const userForStorage = { ...users[userId] };
    delete userForStorage.password;
    storeUser(userForStorage);
  }
}

export function getCurrentUser(): User | null {
  return getStoredUser();
}

export const exportUserData = (userId: string): string => {
  users = getStoredUsers();  // 获取最新的用户数据
  const user = users[userId];
  if (!user) return '';
  
  const exportData = { ...user };
  delete exportData.password;  // 不导出密码
  return JSON.stringify(exportData);
};

export const importUserData = async (userId: string, file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        users = getStoredUsers();  // 获取最新的用户数据
        const data = JSON.parse(e.target?.result as string);
        if (users[userId]) {
          users[userId] = { 
            ...users[userId], 
            ...data,
            password: users[userId].password  // 保留原密码
          };
          storeUsers(users);
          storeUser({ ...users[userId], password: undefined });
          resolve();
        } else {
          reject(new Error('User not found'));
        }
      } catch (error) {
        reject(new Error('Invalid data format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}; 