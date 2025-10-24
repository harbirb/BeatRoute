import { Text, View, Button, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, signIn, signOut, isLoading } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : user ? (
        <>
          <Text style={{ fontSize: 24 }}>Welcome,</Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>{user.user_metadata.full_name}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </>
      ) : (
        <>
          <Text>Please sign in to see your profile.</Text>
          <Button title="Sign In" onPress={signIn} />
        </>
      )}
    </View>
  );
}
