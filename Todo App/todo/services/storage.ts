import AsyncStorage from "@react-native-async-storage/async-storage";

const TASK_KEY = "TASKFLOW_TASKS";

export const saveTasks = async (tasks: any) => {
  try {
    await AsyncStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.log(e);
  }
};

export const getTasks = async () => {
  try {
    const data = await AsyncStorage.getItem(TASK_KEY);

    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log(e);
    return [];
  }
};