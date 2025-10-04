import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home'); // fixed path
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/react-logo.png')} style={styles.logo} />
      <Text style={styles.title}>ImpactTrace</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4fc3f7' },
  logo: { width: 150, height: 150, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
});
