import { EventEmitter } from 'events';

// Extend standard EventEmitter to ensure consistent typing
class EventBus extends EventEmitter {}

const globalEventBus = new EventBus();

// Increase max listeners for SSE clients
globalEventBus.setMaxListeners(100);

export { globalEventBus };
