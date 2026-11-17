import * as Notifications from "expo-notifications";

export async function scheduleNotification(
  title: string,
  body: string,
  seconds: number
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },

    trigger: {
      seconds,
    },
  });
}