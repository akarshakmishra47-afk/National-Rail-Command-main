import { randomUUID } from 'crypto';
import { DigitalTwinStore } from '../lib/state';

export class MockTelemetryProvider {
    private static instance: MockTelemetryProvider;
    private timer: NodeJS.Timeout | null = null;
    private tickCount = 0;

    // Demo script phases
    private DEMO_SEQUENCE = [
        { tick: 2, delay: 5, crowd: 52 },
        { tick: 4, delay: 11, crowd: 59 },
        { tick: 6, delay: 18, crowd: 66 },
        { tick: 8, delay: 27, crowd: 74 },
        { tick: 10, delay: 39, crowd: 82 },
        { tick: 12, delay: 55, crowd: 91 },
    ];

    private constructor() {}

    public static getInstance(): MockTelemetryProvider {
        if (!MockTelemetryProvider.instance) {
            MockTelemetryProvider.instance = new MockTelemetryProvider();
        }
        return MockTelemetryProvider.instance;
    }

    public startDemoStream() {
        if (this.timer) return;
        this.tickCount = 0;
        
        console.log("MockTelemetryProvider: Starting Demo Stream...");
        this.timer = setInterval(() => this.tick(), 2000); // Fire every 2s
    }

    public stopStream() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log("MockTelemetryProvider: Stream stopped.");
        }
    }

    private tick() {
        this.tickCount++;
        const store = DigitalTwinStore.getInstance();
        
        const phase = this.DEMO_SEQUENCE.find(p => p.tick === this.tickCount);
        
        if (phase) {
            // Push delay event
            store.processTelemetryEvent({
                id: randomUUID(),
                timestamp: Date.now(),
                type: 'train_delay',
                entityId: '22416',
                payload: { delay: phase.delay }
            });

            // Push crowd event
            store.processTelemetryEvent({
                id: randomUUID(),
                timestamp: Date.now(),
                type: 'crowd_change',
                entityId: 'BSB',
                payload: { density: phase.crowd }
            });
        }

        if (this.tickCount > 15) {
            this.stopStream();
        }
    }
    
    // For testing bursts
    public fireBurst(eventsPerSecond: number) {
        const store = DigitalTwinStore.getInstance();
        for(let i = 0; i < eventsPerSecond; i++) {
            store.processTelemetryEvent({
                id: randomUUID(),
                timestamp: Date.now(),
                type: 'train_delay',
                entityId: '15003',
                payload: { delay: Math.floor(Math.random() * 5) }
            });
        }
    }
}
