---
name: test-writer-fixer
description: Escribe tests efectivos y corrige bugs sistem├íticamente. Usa este skill para unit tests, integration tests, E2E tests, test coverage, debugging, y an├ílisis de root cause de errores.
---

# Test Writer & Bug Fixer

Especialista en escribir tests que capturan bugs reales y en diagnosticar problemas sistem├íticamente. Se activa autom├íticamente despu├⌐s de implementar features o modificar c├│digo.

## Cu├índo Usar Este Skill

- Escribir tests para c├│digo nuevo
- Aumentar coverage de tests existentes
- Debuggear issues reportados
- Hacer root cause analysis
- Implementar E2E tests
- Refactorizar con confianza

## Responsabilidades Principales

### 1. Unit Testing
- Escribe tests focalizados y r├ípidos
- Testea edge cases y error conditions
- Usa mocking apropiadamente
- Mantiene tests independientes
- Asegura tests determin├¡sticos

### 2. Integration Testing
- Testea interacciones entre componentes
- Verifica contratos de APIs
- Testea flujos de datos
- Valida configuraci├│n de ambiente
- Maneja setup/teardown correctamente

### 3. E2E Testing
- Automatiza user journeys cr├¡ticos
- Testea en browsers reales
- Maneja flakiness
- Optimiza tiempos de ejecuci├│n
- Integra con CI/CD

### 4. Bug Fixing
- Reproduce issues sistem├íticamente
- Hace root cause analysis
- Escribe regression tests
- Documenta fixes
- Previene recurrencia

## Tech Stack

| ├ürea | Tecnolog├¡as |
|------|-------------|
| Unit/Integration | Jest, Vitest, pytest, Go testing |
| E2E | Playwright, Cypress, Selenium |
| API Testing | Supertest, httpx, REST Assured |
| Mocking | MSW, nock, unittest.mock |
| Coverage | Istanbul, c8, coverage.py |
| Visual | Percy, Chromatic, Applitools |

## Estructura de Tests

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = { email: 'test@example.com', name: 'Test' };
      
      // Act
      const user = await userService.createUser(userData);
      
      // Assert
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
    });

    it('should throw on duplicate email', async () => {
      // Arrange
      const userData = { email: 'existing@example.com', name: 'Test' };
      await userService.createUser(userData);
      
      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects.toThrow('Email already exists');
    });

    it('should validate email format', async () => {
      const invalidData = { email: 'not-an-email', name: 'Test' };
      
      await expect(userService.createUser(invalidData))
        .rejects.toThrow('Invalid email');
    });
  });
});
```

## Testing Patterns

### Arrange-Act-Assert
```typescript
it('should calculate total with discount', () => {
  // Arrange
  const cart = new Cart();
  cart.addItem({ price: 100, quantity: 2 });
  cart.applyDiscount('10PERCENT');
  
  // Act
  const total = cart.calculateTotal();
  
  // Assert
  expect(total).toBe(180);
});
```

### Test Doubles
```typescript
// Mock - verifica interacciones
const emailService = { send: vi.fn() };
await userService.register(userData);
expect(emailService.send).toHaveBeenCalledWith(userData.email, expect.any(String));

// Stub - retorna valores predefinidos
const priceService = { getPrice: vi.fn().mockReturnValue(99.99) };

// Spy - observa sin modificar
const consoleSpy = vi.spyOn(console, 'log');
```

### MSW para API Mocking
```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Test User' });
  }),
  
  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '123', ...body }, { status: 201 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## E2E Testing con Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('[name="email"]', 'newuser@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/register');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error')).toContainText('Email is required');
  });
});
```

## Debugging Methodology

```
1. REPRODUCE
   - Obtener pasos exactos para reproducir
   - Verificar en ambiente limpio
   - Documentar condiciones

2. ISOLATE
   - Reducir a caso m├¡nimo
   - Eliminar variables
   - Identificar componente afectado

3. IDENTIFY
   - Revisar logs y stack traces
   - Usar debugger/breakpoints
   - Agregar logging temporal

4. FIX
   - Implementar fix m├¡nimo
   - Escribir regression test ANTES del fix
   - Verificar que test falla, aplicar fix, test pasa

5. VERIFY
   - Correr suite completa de tests
   - Test en ambiente staging
   - Code review del fix

6. DOCUMENT
   - Actualizar documentaci├│n si es necesario
   - Agregar comentario explicando el fix
   - Compartir learnings con equipo
```

## Coverage Strategy

```
Prioridad de Coverage:
1. Business logic cr├¡tico (100%)
2. API endpoints (>90%)
3. UI components (>80%)
4. Utilities (>70%)

No obsesionarse con 100% total - enfocarse en:
- Paths cr├¡ticos
- Edge cases peligrosos
- C├│digo complejo
- Regresiones pasadas
```

## Checklist de Testing

```
Unit Tests:
- [ ] Happy path cubierto
- [ ] Error cases cubiertos
- [ ] Edge cases (null, empty, limits)
- [ ] Async behavior testeado
- [ ] Mocks verifican interacciones

Integration Tests:
- [ ] APIs responden correctamente
- [ ] Database operations funcionan
- [ ] External services mockeados
- [ ] Error handling verificado

E2E Tests:
- [ ] User journeys cr├¡ticos
- [ ] Cross-browser testing
- [ ] Mobile responsive
- [ ] Performance acceptable
```

## Mejores Pr├ícticas

1. **Test behavior, not implementation** - Tests sobreviven refactors
2. **One assertion concept per test** - F├ícil de diagnosticar
3. **Fast tests** - Si son lentos, no se corren
4. **Deterministic** - Sin flakiness
5. **Independent** - Orden no importa
6. **Write failing test first** - Para bugs, escribir test que falle antes de fixear

## Filosof├¡a

> "The goal isn't 100% coverage, it's confidence to ship. Write tests that catch real bugs, not tests that satisfy metrics."

El objetivo es tener confianza para deployar en cualquier momento, sabiendo que los tests capturan problemas reales.
