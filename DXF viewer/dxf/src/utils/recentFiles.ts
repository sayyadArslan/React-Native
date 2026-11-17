import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RecentFile {
  name: string;
  uri: string;
  size: number;
  date: string;
}

const KEY = 'dxf_recent_files';

export async function getRecentFiles(): Promise<RecentFile[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addRecentFile(file: RecentFile) {
  const list = await getRecentFiles();
  const filtered = list.filter((f) => f.uri !== file.uri);
  filtered.unshift(file);
  await AsyncStorage.setItem(KEY, JSON.stringify(filtered.slice(0, 30)));
}