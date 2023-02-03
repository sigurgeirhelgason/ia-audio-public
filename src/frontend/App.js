import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from './src/constants/styles';
import IconButton from './src/components/ui/IconButton';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import BookScreen from './src/screens/BookScreen';
import AudioBookScreen from './src/screens/AudioBookScreen';
import AuthContextProvider, { AuthContext } from './src/store/auth-context';
import BookContextProvider from './src/store/book-context';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <BookContextProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary500 },
          headerTintColor: 'white',
          contentStyle: { backgroundColor: Colors.primary100 },
        }}
      >
        <Stack.Screen
          name="Mínar bækur"
          component={WelcomeScreen}
          options={{
            headerRight: ({ tintColor }) => (
              <IconButton icon="exit" color={tintColor} size={24} onPress={authCtx.logout} />
            ),
          }}
        />
        <Stack.Screen name="Book" component={BookScreen} options={({ route }) => ({ title: route.params.book.title })} />
        <Stack.Screen name="AudioBookScreen" component={AudioBookScreen} options={{headerShown:false}} />
      </Stack.Navigator>
    </BookContextProvider>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContextProvider>
          <Navigation />
        </AuthContextProvider>
      </GestureHandlerRootView>
    </>
  );
}
