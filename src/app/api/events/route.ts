import { NextResponse } from 'next/server';
import { globalEventBus } from '../../../lib/events';
import { DigitalTwinStore } from '../../../lib/state';
import { MockTelemetryProvider } from '../../../simulation/telemetry';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const startDemo = searchParams.get('demo') === 'true';

    // Server-Sent Events headers
    const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    const stream = new ReadableStream({
        start(controller) {
            // Helper to push data to client
            const sendEvent = (type: string, data: any) => {
                const message = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
                try {
                    controller.enqueue(new TextEncoder().encode(message));
                } catch(e) {
                    // stream closed
                }
            };

            // Send initial state
            sendEvent('initial_state', DigitalTwinStore.getInstance().getState());

            // Listeners
            const onStateUpdate = (state: any) => sendEvent('state_update', state);
            const onTelemetryUpdate = (event: any) => sendEvent('telemetry_update', event);
            const onPrecogUpdate = (predictions: any) => sendEvent('precog_update', predictions);

            globalEventBus.on('state_update', onStateUpdate);
            globalEventBus.on('telemetry_update', onTelemetryUpdate);
            globalEventBus.on('precog_update', onPrecogUpdate);

            // Handle client disconnect
            req.signal.addEventListener('abort', () => {
                globalEventBus.off('state_update', onStateUpdate);
                globalEventBus.off('telemetry_update', onTelemetryUpdate);
                globalEventBus.off('precog_update', onPrecogUpdate);
                controller.close();
            });

            // Start demo stream if requested
            if (startDemo) {
                MockTelemetryProvider.getInstance().startDemoStream();
            }
        }
    });

    return new Response(stream, { headers });
}
