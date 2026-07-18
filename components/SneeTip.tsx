import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function SneeTip({ tip }: { tip: string }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/companions/snee")}
    >
      <View
        style={{
          backgroundColor: "#081A36",
          borderRadius: 20,
          padding: 16,
          marginTop: 12,
          borderWidth: 1,
          borderColor: "#2563EB",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/images/companions/snee.png")}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              marginRight: 12,
            }}
          />

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#60A5FA",
                fontSize: 18,
                fontWeight: "900",
              }}
            >
              🐶 Snee Says
            </Text>

            <Text
              style={{
                color: "#DBEAFE",
                marginTop: 4,
                fontSize: 14,
              }}
            >
              Companion Keeper
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: "white",
            marginTop: 12,
            lineHeight: 24,
            fontSize: 15,
          }}
        >
          {tip}
        </Text>

        <Text
          style={{
            color: "#93C5FD",
            marginTop: 10,
            fontSize: 12,
          }}
        >
          Tap Snee to learn more →
        </Text>
      </View>
    </Pressable>
  );
}