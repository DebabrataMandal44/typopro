
# TypoPro Capabilities Bus

The application uses a typed, centralized bus (`TypedBus`) to handle cross-plugin communication without direct coupling.

## Event Map
Check `bus/events.ts` for the full list of events. Notable events:
- `session/started`: Fired on first keystroke.
- `session/progress`: Throttled to 200ms.
- `session/ended`: Fired when session is complete.
- `network/status`: Fired when online/offline state changes.

## Using the Bus in Plugins
Plugins receive the bus in their `onRegister(ctx)` lifecycle.

```typescript
export const myPlugin: TypoProPlugin = {
  id: 'my-plugin',
  onRegister: (ctx) => {
    // Subscribe
    const unsubscribe = ctx.bus.on('session/ended', (data) => {
       ctx.logger.info("Session finished!", data.stats);
    });
    
    // Emit
    ctx.bus.emit('my-custom-event', { foo: 'bar' });
  }
}
```

## UI Components
React components should subscribe to the bus using `useEffect`:

```typescript
useEffect(() => {
  return bus.on('network/status', (data) => {
    setIsOnline(data.online);
  });
}, []);
```

## Performance
`TypedBus` uses `Set` lookups for handlers. `emit` is O(N) where N is the number of handlers for a specific event. For high-frequency events like typing progress, always use the throttled emission pattern established in `ModeHost.tsx`.
