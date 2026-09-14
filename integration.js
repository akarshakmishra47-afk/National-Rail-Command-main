(function() {
    console.log("[RailVerse] Initializing SSE Telemetry Connection...");
    
    let eventSource = null;
    let reconnectTimeout = null;
    let reconnectAttempts = 0;
    
    function connectSSE() {
        if (eventSource) {
            eventSource.close();
        }
        
        eventSource = new EventSource('/api/events?demo=true');
        
        eventSource.onopen = () => {
            console.log("[RailVerse] SSE Connection Established.");
            reconnectAttempts = 0;
            const netStatus = document.getElementById('net-status-text');
            if (netStatus) {
                netStatus.innerText = "LIVE - TELEMETRY ACTIVE";
                netStatus.style.color = "#00E5FF";
            }
        };
        
        eventSource.addEventListener('initial_state', (e) => {
            try {
                const data = JSON.parse(e.data);
                console.log("Initial state received from backend:", Object.keys(data.trains).length, "trains");
                // Here we could update STATIONS and TRAIN_DATA if we wanted full data binding.
            } catch (err) {}
        });
        
        eventSource.addEventListener('telemetry_update', (e) => {
            try {
                const data = JSON.parse(e.data);
                // Hook into UI telemetry update if train matches
                const tObj = window.TRAIN_DATA ? window.TRAIN_DATA.find(t => String(t.num) === String(data.trainId)) : null;
                if (tObj && window.showTrainTelemetry) {
                    // Update global data quietly so that if the popup is open it reads the new data
                    tObj.speed = data.speed;
                    tObj.telemetry = tObj.telemetry || {};
                    tObj.telemetry.temp = data.telemetry?.temp || tObj.telemetry.temp;
                    tObj.telemetry.vibration = data.telemetry?.vibration || tObj.telemetry.vibration;
                    tObj.telemetry.voltage = data.telemetry?.voltage || tObj.telemetry.voltage;
                }
            } catch (err) {}
        });
        
        eventSource.addEventListener('precog_update', (e) => {
            try {
                const predictions = JSON.parse(e.data);
                // Update UI elements based on PRECOG data if necessary
                const precogCounter = document.getElementById('ai-active-count');
                if (precogCounter) precogCounter.innerText = predictions.length || 0;
            } catch (err) {}
        });

        eventSource.addEventListener('decision_update', (e) => {
            try {
                const data = JSON.parse(e.data);
                console.log("[RailVerse] Decision update:", data);
            } catch (err) {}
        });
        
        eventSource.onerror = (err) => {
            console.error("[RailVerse] SSE Connection Error", err);
            eventSource.close();
            
            const netStatus = document.getElementById('net-status-text');
            if (netStatus) {
                netStatus.innerText = "CONNECTION LOST - RECONNECTING...";
                netStatus.style.color = "#FF3B60";
            }
            
            reconnectAttempts++;
            const backoffTime = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            console.log(`[RailVerse] Retrying SSE connection in ${backoffTime}ms...`);
            
            clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(connectSSE, backoffTime);
        };
    }
    
    // Start connection
    connectSSE();
})();
