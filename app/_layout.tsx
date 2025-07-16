import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  console.log(colorScheme);


  return <Stack />;
}
