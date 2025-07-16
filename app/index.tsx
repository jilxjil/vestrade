import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import "../global.css";
 
export default function Index() {
  return (
    <ThemedView className="flex-1 p-10 justify-center ">
      <ThemedText className="text-xl font-bold">
        Clarity 
      </ThemedText>
        <ThemedText className="text-xl font-bold"
        >Before</ThemedText> 
        <ThemedText className="text-xl font-bold"
        >Every Trade</ThemedText>
      
    </ThemedView>
  );
}