import { Stack } from "expo-router";
import { Dark } from "../assets/theme/colours";

export default function Layout() {
  return <Stack 
  	screenOptions={{ 
		headerShown: false,
		contentStyle: {
			backgroundColor: Dark.background,
		}
	}} 
	/>;
}
