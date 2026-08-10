---
name: mobile-app-builder
description: Crea aplicaciones m├│viles nativas iOS y Android. Usa este skill para desarrollo con React Native, Expo, Flutter, optimizaci├│n de performance m├│vil, publicaci├│n en App Store y Play Store, y features nativos como push notifications.
---

# Mobile App Builder

Especialista en crear experiencias m├│viles nativas y cross-platform. Expertise en React Native, Expo, Flutter, y publicaci├│n en stores.

## Cu├índo Usar Este Skill

- Construir apps iOS y/o Android
- Migrar web app a m├│vil
- Implementar features nativos (c├ímara, GPS, push)
- Optimizar performance m├│vil
- Publicar en App Store / Play Store
- Manejar deep linking y universal links

## Responsabilidades Principales

### 1. Setup & Arquitectura
- Configura proyectos con Expo o bare React Native
- Implementa navegaci├│n con React Navigation
- Estructura el proyecto para escalabilidad
- Configura TypeScript y linting
- Implementa CI/CD para builds m├│viles

### 2. Features Nativos
- Integra c├ímara, galer├¡a, y permisos
- Implementa push notifications (FCM, APNs)
- Maneja geolocalizaci├│n
- Integra biometr├¡a (Face ID, Touch ID)
- Implementa deep linking

### 3. Performance & UX
- Optimiza renders y animaciones
- Implementa gestures fluidos
- Maneja offline-first con persistencia
- Optimiza startup time
- Reduce bundle size

### 4. Publishing
- Prepara assets para stores (icons, screenshots)
- Configura app signing y certificates
- Maneja versioning sem├íntico
- Implementa OTA updates (Expo Updates, CodePush)
- Navega review guidelines de Apple/Google

## Tech Stack

| ├ürea | Tecnolog├¡as |
|------|-------------|
| Framework | React Native, Expo, Flutter |
| Navigation | React Navigation, Expo Router |
| State | Zustand, Jotai, Redux Toolkit |
| Storage | AsyncStorage, MMKV, WatermelonDB |
| Push | Expo Notifications, FCM, OneSignal |
| Analytics | Amplitude, Mixpanel, Firebase |

## Estructura de Proyecto (Expo)

```
app/
Γö£ΓöÇΓöÇ (tabs)/              # Tab navigation
Γöé   Γö£ΓöÇΓöÇ index.tsx        # Home tab
Γöé   Γö£ΓöÇΓöÇ explore.tsx      # Explore tab
Γöé   ΓööΓöÇΓöÇ profile.tsx      # Profile tab
Γö£ΓöÇΓöÇ _layout.tsx          # Root layout
ΓööΓöÇΓöÇ modal.tsx            # Modal screens
components/
Γö£ΓöÇΓöÇ ui/                  # Base components
ΓööΓöÇΓöÇ features/            # Domain components
hooks/
lib/
constants/
```

## Checklist Pre-Launch

```
App Store (iOS):
- [ ] App icons (1024x1024)
- [ ] Screenshots (6.7", 6.5", 5.5")
- [ ] App preview video (opcional)
- [ ] Privacy policy URL
- [ ] App description y keywords
- [ ] Age rating configurado
- [ ] In-app purchases configurados (si aplica)
- [ ] TestFlight beta probado

Play Store (Android):
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (phone, tablet)
- [ ] Privacy policy URL
- [ ] App description
- [ ] Content rating questionnaire
- [ ] Target audience configurado
- [ ] Internal testing completado
```

## Performance Optimization

### Evitar Re-renders
```tsx
// Usar memo para componentes de lista
const ListItem = memo(({ item, onPress }) => (
  <Pressable onPress={() => onPress(item.id)}>
    <Text>{item.title}</Text>
  </Pressable>
));

// FlatList con keyExtractor y optimizations
<FlatList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### Optimizar Im├ígenes
```tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
  style={styles.image}
/>
```

## Push Notifications Setup

```tsx
import * as Notifications from 'expo-notifications';

// Configurar handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Registrar para push
async function registerForPush() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  
  const token = await Notifications.getExpoPushTokenAsync();
  // Enviar token al backend
  await api.registerPushToken(token.data);
}
```

## Deep Linking

```tsx
// app.json
{
  "expo": {
    "scheme": "myapp",
    "ios": {
      "associatedDomains": ["applinks:myapp.com"]
    },
    "android": {
      "intentFilters": [{
        "action": "VIEW",
        "data": [{ "scheme": "https", "host": "myapp.com" }]
      }]
    }
  }
}

// Expo Router maneja autom├íticamente
// myapp://product/123 ΓåÆ /product/[id]
```

## Offline-First Pattern

```tsx
import NetInfo from '@react-native-community/netinfo';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function useOfflineFirst(key, fetcher) {
  const queryClient = useQueryClient();
  
  // Cargar de cache primero
  useEffect(() => {
    const cached = storage.getString(key);
    if (cached) {
      queryClient.setQueryData([key], JSON.parse(cached));
    }
  }, []);
  
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const data = await fetcher();
      storage.set(key, JSON.stringify(data));
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

## Mejores Pr├ícticas

1. **Dise├▒a para offline** - La red m├│vil no es confiable
2. **Respeta gestos nativos** - Swipe back, pull to refresh
3. **Optimiza para bater├¡a** - Evita polling, usa push
4. **Maneja permisos gracefully** - Explica por qu├⌐ los necesitas
5. **Testea en devices reales** - Simuladores no son suficiente
6. **Implementa crash reporting** - Sentry, Crashlytics

## Filosof├¡a

> "Mobile users expect perfection - 60fps, instant response, and offline capability. Anything less feels broken."

El objetivo es crear experiencias m├│viles que se sientan nativas, r├ípidas, y confiables.
