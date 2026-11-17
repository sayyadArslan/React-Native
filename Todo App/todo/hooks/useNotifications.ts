import * as Notifications from "expo-notifications";

export async function requestNotificationPermission() {
  const { status } =
    await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    alert("Permission not granted");
  }
}