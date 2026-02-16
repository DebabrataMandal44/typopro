
import { AppEventMap } from './events';

type Handler<T> = (data: T) => void;

export class TypedBus {
  // Fix: Internal storage uses Set<any> to avoid generic variance issues with AppEventMap[K] in strict mode.
  // The public methods (on, off, once, emit) maintain full type safety for callers.
  private handlers: Partial<Record<keyof AppEventMap, Set<any>>> = {};

  on<K extends keyof AppEventMap>(event: K, handler: Handler<AppEventMap[K]>): () => void {
    if (!this.handlers[event]) {
      this.handlers[event] = new Set();
    }
    // Type safety is maintained by the generic K and Handler<AppEventMap[K]> in the method signature.
    this.handlers[event]!.add(handler);
    return () => this.off(event, handler);
  }

  off<K extends keyof AppEventMap>(event: K, handler: Handler<AppEventMap[K]>): void {
    this.handlers[event]?.delete(handler);
  }

  once<K extends keyof AppEventMap>(event: K, handler: Handler<AppEventMap[K]>): void {
    const wrapper = (data: AppEventMap[K]) => {
      handler(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  emit<K extends keyof AppEventMap>(event: K, data: AppEventMap[K]): void {
    this.handlers[event]?.forEach(handler => {
      try {
        // The handler is guaranteed to be compatible with AppEventMap[K]
        // due to the type enforcement in the 'on' method.
        handler(data);
      } catch (e) {
        console.error(`Bus error [${event}]:`, e);
      }
    });
  }

  clear(): void {
    this.handlers = {};
  }
}

export const bus = new TypedBus();
