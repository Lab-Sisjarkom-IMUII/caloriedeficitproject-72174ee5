// ====================================
// INPUT HARIAN HANDLER
// File: input-harian-handler.js
// Version: 1.0.0
// ====================================
// Handle save data dari halaman Input Harian
// Terintegrasi dengan Supabase untuk Google & Non-Google users
// ====================================

console.log('📝 Loading Input Harian Handler v1.0...');

// ====================================
// HELPER FUNCTIONS
// ====================================

function getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.id || null;
}

function isGoogleUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.isGoogleUser === true;
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `harian-notification ${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                     type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                     'linear-gradient(135deg, #3b82f6, #2563eb)'};
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ====================================
// SAVE HARIAN STEPS
// ====================================

window.saveHarianSteps = async function() {
    const input = document.getElementById('harianSteps');
    const value = parseInt(input?.value);
    
    if (!value || value <= 0) {
        showNotification('❌ Masukkan jumlah langkah yang valid', 'error');
        return;
    }
    
    const userId = getCurrentUserId();
    if (!userId) {
        showNotification('❌ Silakan login terlebih dahulu', 'error');
        return;
    }
    
    console.log('📤 [Harian] Saving steps:', value);
    
    try {
        // Try to use the patched/global save function
        if (typeof window.saveStepsToSupabase === 'function') {
            const result = await window.saveStepsToSupabase({
                value: value,
                date: new Date().toISOString()
            });
            
            if (result && result.success) {
                showNotification(`✅ ${value.toLocaleString()} langkah tersimpan!`);
                input.value = '';
                updateHarianSummary();
                return;
            }
        }
        
        // Fallback: Direct save for Google users
        if (isGoogleUser() && window.GoogleUserSync) {
            const result = await window.GoogleUserSync.saveSteps({
                value: value,
                date: new Date()
            });
            
            if (result && result.success) {
                showNotification(`✅ ${value.toLocaleString()} langkah tersimpan!`);
                input.value = '';
                updateHarianSummary();
                return;
            }
        }
        
        // Save to localStorage as backup
        saveToLocalStorage('steps', value);
        showNotification(`✅ ${value.toLocaleString()} langkah tersimpan (lokal)`);
        input.value = '';
        updateHarianSummary();
        
    } catch (err) {
        console.error('❌ Error saving steps:', err);
        showNotification('❌ Gagal menyimpan langkah', 'error');
    }
};

// ====================================
// SAVE HARIAN RUNNING
// ====================================

window.saveHarianRun = async function() {
    const input = document.getElementById('harianRun');
    const value = parseFloat(input?.value);
    
    if (!value || value <= 0) {
        showNotification('❌ Masukkan jarak lari yang valid', 'error');
        return;
    }
    
    const userId = getCurrentUserId();
    if (!userId) {
        showNotification('❌ Silakan login terlebih dahulu', 'error');
        return;
    }
    
    console.log('📤 [Harian] Saving running:', value, 'km');
    
    try {
        if (typeof window.saveRunningToSupabase === 'function') {
            const result = await window.saveRunningToSupabase({
                distance: value,
                value: value,
                date: new Date().toISOString()
            });
            
            if (result && result.success) {
                showNotification(`✅ ${value} km tersimpan!`);
                input.value = '';
                updateHarianSummary();
                return;
            }
        }
        
        if (isGoogleUser() && window.GoogleUserSync) {
            const result = await window.GoogleUserSync.saveRunning({
                distance: value,
                date: new Date()
            });
            
            if (result && result.success) {
                showNotification(`✅ ${value} km tersimpan!`);
                input.value = '';
                updateHarianSummary();
                return;
            }
        }
        
        saveToLocalStorage('running', value);
        showNotification(`✅ ${value} km tersimpan (lokal)`);
        input.value = '';
        updateHarianSummary();
        
    } catch (err) {
        console.error('❌ Error saving running:', err);
        showNotification('❌ Gagal menyimpan jarak lari', 'error');
    }
};

// ====================================
// SAVE HARIAN WATER
// ====================================

window.saveHarianWater = async function() {
    const input = document.getElementById('harianWater');
    const value = parseFloat(input?.value);
    
    if (!value || value <= 0) {
        showNotification('❌ Masukkan jumlah air yang valid', 'error');
        return;
    }
    
    // Convert liter to ml for storage
    const valueInMl = value * 1000;
    
    const userId = getCurrentUserId();
    if (!userId) {
        showNotification('❌ Silakan login terlebih dahulu', 'error');
        return;
    }
    
    console.log('📤 [Harian] Saving water:', value, 'L (', valueInMl, 'ml)');
    
    try {
        if (typeof window.saveWaterToSupabase === 'function') {
            const result = await window.saveWaterToSupabase({
                amount: valueInMl,
                value: valueInMl,
                date: new Date().toISOString()
            });
            
            if (result && result.success) {
                showNotification(`✅ ${value} L air tersimpan!`);
                input.value = '';
                updateHarianSummary();
                return;
            }
        }
        
        if (isGoogleUser() && window.GoogleUserSync) {
            const result = await window.GoogleUserSync.saveWater({
                amount: valueInMl,
                value: valueInMl,
                date: new Date()
            });
            
            if (result && result.success) {
                showNotification(`✅ ${value} L air tersimpan!`);
                input.value = '';
                updateHarianSummary();
                return;
            }
        }
        
        saveToLocalStorage('water', valueInMl);
        showNotification(`✅ ${value} L air tersimpan (lokal)`);
        input.value = '';
        updateHarianSummary();
        
    } catch (err) {
        console.error('❌ Error saving water:', err);
        showNotification('❌ Gagal menyimpan konsumsi air', 'error');
    }
};

// ====================================
// SAVE HARIAN SLEEP
// ====================================

window.saveHarianSleep = async function() {
    const input = document.getElementById('harianSleep');
    const value = parseFloat(input?.value);
    
    if (!value || value <= 0) {
        showNotification('❌ Masukkan jam tidur yang valid', 'error');
        return;
    }
    
    const userId = getCurrentUserId();
    if (!userId) {
        showNotification('❌ Silakan login terlebih dahulu', 'error');
        return;
    }
    
    console.log('📤 [Harian] Saving sleep:', value, 'hours');
    
    try {
        if (typeof window.saveSleepToSupabase === 'function') {
            const result = await window.saveSleepToSupabase({
                hours: value,
                value: value,
                date: new Date().toISOString()
            });
            
            if (result && result.success) {
                showNotification(`✅ ${value} jam tidur tersimpan!`);
                input.value = '';
                updateHarianSummary();
                return;
            }
        }
        
        if (isGoogleUser() && window.GoogleUserSync) {
            const result = await window.GoogleUserSync.saveSleep({
                hours: value,
                date: new Date()
            });
            
            if (result && result.success) {
                showNotification(`✅ ${value} jam tidur tersimpan!`);
                input.value = '';
                updateHarianSummary();
                return;
            }
        }
        
        saveToLocalStorage('sleep', value);
        showNotification(`✅ ${value} jam tidur tersimpan (lokal)`);
        input.value = '';
        updateHarianSummary();
        
    } catch (err) {
        console.error('❌ Error saving sleep:', err);
        showNotification('❌ Gagal menyimpan jam tidur', 'error');
    }
};

// ====================================
// SAVE HARIAN GYM
// ====================================

window.saveHarianGym = async function() {
    const input = document.getElementById('harianGym');
    const value = parseInt(input?.value);
    
    if (!value || value <= 0) {
        showNotification('❌ Masukkan durasi gym yang valid', 'error');
        return;
    }
    
    const userId = getCurrentUserId();
    if (!userId) {
        showNotification('❌ Silakan login terlebih dahulu', 'error');
        return;
    }
    
    console.log('📤 [Harian] Saving gym:', value, 'minutes');
    
    try {
        if (typeof window.saveGymToSupabase === 'function') {
            const result = await window.saveGymToSupabase({
                duration: value,
                category: 'general',
                exerciseType: 'workout',
                date: new Date().toISOString()
            });
            
            if (result && result.success) {
                showNotification(`✅ ${value} menit gym tersimpan!`);
                input.value = '';
                updateHarianSummary();
                return;
            }
        }
        
        if (isGoogleUser() && window.GoogleUserSync) {
            const result = await window.GoogleUserSync.saveGym({
                duration: value,
                category: 'general',
                exerciseType: 'workout',
                date: new Date()
            });
            
            if (result && result.success) {
                showNotification(`✅ ${value} menit gym tersimpan!`);
                input.value = '';
                updateHarianSummary();
                return;
            }
        }
        
        saveToLocalStorage('gym', value);
        showNotification(`✅ ${value} menit gym tersimpan (lokal)`);
        input.value = '';
        updateHarianSummary();
        
    } catch (err) {
        console.error('❌ Error saving gym:', err);
        showNotification('❌ Gagal menyimpan durasi gym', 'error');
    }
};

// ====================================
// LOCALSTORAGE BACKUP
// ====================================

function saveToLocalStorage(type, value) {
    const today = new Date().toISOString().split('T')[0];
    const key = `harian_${type}_${today}`;
    
    // Get existing data for today
    let existing = parseFloat(localStorage.getItem(key) || '0');
    existing += value;
    
    localStorage.setItem(key, existing.toString());
    console.log(`💾 [LocalStorage] Saved ${type}: ${value} (total: ${existing})`);
}

// ====================================
// UPDATE HARIAN SUMMARY
// ====================================

async function updateHarianSummary() {
    console.log('📊 Updating Harian Summary...');
    
    const today = new Date().toISOString().split('T')[0];
    
    // Default values from localStorage
    let steps = parseFloat(localStorage.getItem(`harian_steps_${today}`) || '0');
    let running = parseFloat(localStorage.getItem(`harian_running_${today}`) || '0');
    let water = parseFloat(localStorage.getItem(`harian_water_${today}`) || '0');
    let sleep = parseFloat(localStorage.getItem(`harian_sleep_${today}`) || '0');
    let gym = parseFloat(localStorage.getItem(`harian_gym_${today}`) || '0');
    
    // Try to load from Supabase
    try {
        if (window.SupabaseActivitySync) {
            const stepsData = await window.SupabaseActivitySync.loadSteps();
            const runningData = await window.SupabaseActivitySync.loadRunning();
            const waterData = await window.SupabaseActivitySync.loadWater();
            const sleepData = await window.SupabaseActivitySync.loadSleep();
            const gymData = await window.SupabaseActivitySync.loadGym();
            
            // Sum today's data
            if (stepsData && stepsData.length > 0) {
                const todaySteps = stepsData.filter(s => s.date?.startsWith(today));
                steps = todaySteps.reduce((sum, s) => sum + (s.steps || 0), 0);
            }
            
            if (runningData && runningData.length > 0) {
                const todayRunning = runningData.filter(r => r.date?.startsWith(today));
                running = todayRunning.reduce((sum, r) => sum + (r.distance || 0), 0);
            }
            
            if (waterData && waterData.length > 0) {
                const todayWater = waterData.filter(w => w.date?.startsWith(today));
                water = todayWater.reduce((sum, w) => sum + (w.amount || 0), 0);
            }
            
            if (sleepData && sleepData.length > 0) {
                const todaySleep = sleepData.filter(s => s.date?.startsWith(today));
                sleep = todaySleep.reduce((sum, s) => sum + (s.hours || 0), 0);
            }
            
            if (gymData && gymData.length > 0) {
                const todayGym = gymData.filter(g => g.date?.startsWith(today));
                gym = todayGym.reduce((sum, g) => sum + (g.duration || 0), 0);
            }
        }
    } catch (err) {
        console.log('⚠️ Could not load from Supabase, using localStorage');
    }
    
    // Update UI
    const summarySteps = document.getElementById('summarySteps');
    const summaryRun = document.getElementById('summaryRun');
    const summaryWater = document.getElementById('summaryWater');
    const summarySleep = document.getElementById('summarySleep');
    const summaryGym = document.getElementById('summaryGym');
    
    if (summarySteps) summarySteps.textContent = `${steps.toLocaleString()} langkah`;
    if (summaryRun) summaryRun.textContent = `${running.toFixed(1)} km`;
    if (summaryWater) summaryWater.textContent = `${(water / 1000).toFixed(1)} L`;
    if (summarySleep) summarySleep.textContent = `${sleep} jam`;
    if (summaryGym) summaryGym.textContent = `${gym} menit`;
    
    console.log('✅ Summary updated:', { steps, running, water, sleep, gym });
}

// ====================================
// INIT
// ====================================

function initInputHarian() {
    console.log('🚀 Initializing Input Harian Handler...');
    
    // Update summary on page load
    setTimeout(updateHarianSummary, 1000);
    
    // Also update when showing harian page
    const originalShowHarian = window.showHarian;
    if (typeof originalShowHarian === 'function') {
        window.showHarian = function() {
            originalShowHarian();
            setTimeout(updateHarianSummary, 500);
        };
    }
    
    console.log('✅ Input Harian Handler initialized!');
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInputHarian);
} else {
    initInputHarian();
}

// Add CSS for notifications
const harianNotificationStyle = document.createElement('style');
harianNotificationStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(harianNotificationStyle);

console.log('✅ Input Harian Handler v1.0 loaded!');