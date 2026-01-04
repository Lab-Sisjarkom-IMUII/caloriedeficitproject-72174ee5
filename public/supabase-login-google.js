// ====================================
// SUPABASE LOGIN GOOGLE
// File: supabase-login-google.js
// Version: 1.0.0
// ====================================
// Khusus untuk user yang login via Google
// Memastikan data tersimpan ke Supabase
// ====================================

console.log('🔵 Loading Supabase Login Google v1.0...');

// ====================================
// CONFIGURATION (Unique names to avoid conflicts)
// ====================================

const GOOGLE_SUPABASE_URL = 'https://ypyxrfsvxubnngghroqc.supabase.co';
const GOOGLE_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweXhyZnN2eHVibm5nZ2hyb3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3ODQ3NzIsImV4cCI6MjA3NzM2MDc3Mn0.iyDb8saqfbooAU7teO5M97na00ESe7EWt0nkbs1tYmk';

// ====================================
// HELPER: Safe Date to ISO String (FIX Invalid Date Error)
// ====================================

function safeToISOString(dateInput) {
    try {
        if (!dateInput) {
            return new Date().toISOString();
        }
        if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
            return dateInput.toISOString();
        }
        if (typeof dateInput === 'string' || typeof dateInput === 'number') {
            const parsed = new Date(dateInput);
            if (!isNaN(parsed.getTime())) {
                return parsed.toISOString();
            }
        }
        console.warn('⚠️ Invalid date, using current:', dateInput);
        return new Date().toISOString();
    } catch (err) {
        console.warn('⚠️ Date error, using current:', err);
        return new Date().toISOString();
    }
}

// ====================================
// HELPER: Get Supabase Client
// ====================================

function getSupabaseClient() {
    if (window.supabaseClient && typeof window.supabaseClient.from === 'function') {
        return window.supabaseClient;
    }
    
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        const client = window.supabase.createClient(GOOGLE_SUPABASE_URL, GOOGLE_SUPABASE_KEY);
        window.supabaseClient = client;
        console.log('✅ Created Supabase client for Google login');
        return client;
    }
    
    console.error('❌ Supabase library not loaded');
    return null;
}

// ====================================
// HELPER: Get Current User
// ====================================

function getCurrentGoogleUser() {
    // Priority: window.currentUser > localStorage
    if (window.currentUser && window.currentUser.id) {
        return window.currentUser;
    }
    
    const stored = localStorage.getItem('currentUser');
    if (stored) {
        try {
            const user = JSON.parse(stored);
            if (user && user.id) {
                window.currentUser = user;
                return user;
            }
        } catch (e) {
            console.error('Error parsing currentUser:', e);
        }
    }
    
    return null;
}

// ====================================
// CHECK IF USER IS GOOGLE USER
// ====================================

function isGoogleUser() {
    const user = getCurrentGoogleUser();
    return user && user.isGoogleUser === true;
}

// ====================================
// SAVE/UPDATE GOOGLE USER TO SUPABASE
// ====================================

async function saveGoogleUserToSupabase(userData) {
    const client = getSupabaseClient();
    if (!client) {
        console.error('❌ No Supabase client');
        return { success: false, error: 'No client' };
    }
    
    try {
        console.log('📤 Saving Google user to Supabase:', userData.email);
        
        // Check if user exists
        const { data: existingUser, error: fetchError } = await client
            .from('users')
            .select('*')
            .eq('email', userData.email)
            .single();
        
        if (existingUser && !fetchError) {
            // Update existing user
            console.log('📝 Updating existing Google user');
            
            const updateData = {
                name: userData.name || existingUser.name,
                google_id: userData.googleId || existingUser.google_id,
                picture: userData.picture || existingUser.picture,
                is_google_user: true,
                updated_at: new Date().toISOString()
            };
            
            // Only update profile fields if provided
            if (userData.namaLengkap) updateData.nama_lengkap = userData.namaLengkap;
            if (userData.jenisKelamin) updateData.jenis_kelamin = userData.jenisKelamin;
            if (userData.tempatLahir) updateData.tempat_lahir = userData.tempatLahir;
            if (userData.tanggalLahir) updateData.tanggal_lahir = userData.tanggalLahir;
            if (userData.golonganDarah) updateData.golongan_darah = userData.golonganDarah;
            if (userData.nomorWA) updateData.nomor_wa = userData.nomorWA;
            if (userData.tinggiBadan) updateData.tinggi_badan = parseInt(userData.tinggiBadan);
            if (userData.beratBadan) updateData.berat_badan = parseFloat(userData.beratBadan);
            if (userData.beratBadanTarget) updateData.berat_badan_target = parseFloat(userData.beratBadanTarget);
            if (userData.goal) updateData.goal = userData.goal;
            if (userData.hasCompletedData !== undefined) updateData.has_completed_data = userData.hasCompletedData;
            
            const { data, error } = await client
                .from('users')
                .update(updateData)
                .eq('id', existingUser.id)
                .select()
                .single();
            
            if (error) {
                console.error('❌ Update error:', error);
                return { success: false, error: error.message };
            }
            
            console.log('✅ Google user updated:', data.email);
            return { success: true, user: data, isNew: false };
            
        } else {
            // Create new user
            console.log('📝 Creating new Google user');
            
            const newUser = {
                id: userData.id || userData.googleId, // Use Google ID as user ID
                email: userData.email,
                name: userData.name,
                google_id: userData.googleId,
                picture: userData.picture,
                is_google_user: true,
                has_completed_data: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            const { data, error } = await client
                .from('users')
                .insert(newUser)
                .select()
                .single();
            
            if (error) {
                console.error('❌ Insert error:', error);
                return { success: false, error: error.message };
            }
            
            console.log('✅ Google user created:', data.email);
            return { success: true, user: data, isNew: true };
        }
        
    } catch (err) {
        console.error('❌ Exception:', err);
        return { success: false, error: err.message };
    }
}

// ====================================
// COMPLETE GOOGLE USER PROFILE
// ====================================

async function completeGoogleUserProfile(profileData) {
    const client = getSupabaseClient();
    const user = getCurrentGoogleUser();
    
    if (!client || !user) {
        console.error('❌ No client or user');
        return { success: false };
    }
    
    try {
        console.log('📤 Completing Google user profile:', user.email);
        
        const updateData = {
            nama_lengkap: profileData.namaLengkap,
            jenis_kelamin: profileData.jenisKelamin,
            tempat_lahir: profileData.tempatLahir,
            tanggal_lahir: profileData.tanggalLahir,
            golongan_darah: profileData.golonganDarah,
            nomor_wa: profileData.nomorWA,
            tinggi_badan: parseInt(profileData.tinggiBadan),
            berat_badan: parseFloat(profileData.beratBadan),
            berat_badan_target: profileData.beratBadanTarget ? parseFloat(profileData.beratBadanTarget) : null,
            goal: profileData.goal,
            has_completed_data: true,
            updated_at: new Date().toISOString()
        };
        
        const { data, error } = await client
            .from('users')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single();
        
        if (error) {
            console.error('❌ Profile update error:', error);
            return { success: false, error: error.message };
        }
        
        // Update local storage
        const updatedUser = {
            ...user,
            ...profileData,
            hasCompletedData: true
        };
        
        window.currentUser = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        console.log('✅ Google user profile completed');
        return { success: true, user: data };
        
    } catch (err) {
        console.error('❌ Exception:', err);
        return { success: false, error: err.message };
    }
}

// ====================================
// ACTIVITY SYNC FOR GOOGLE USERS
// ====================================

// Steps
async function saveGoogleUserSteps(stepsData) {
    const client = getSupabaseClient();
    const user = getCurrentGoogleUser();
    
    if (!client || !user) {
        console.log('⚠️ [Google Steps] No client or user');
        return { success: false };
    }
    
    try {
        const dataToSave = {
            user_id: user.id,
            steps: parseInt(stepsData.value || stepsData.steps),
            date: safeToISOString(stepsData.date),
            created_at: new Date().toISOString()
        };
        
        console.log('📤 [Google] Saving steps:', dataToSave);
        
        const { data, error } = await client
            .from('steps_activity')
            .insert(dataToSave)
            .select();
        
        if (error) {
            console.error('❌ [Google Steps] Error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ [Google] Steps saved:', dataToSave.steps);
        return { success: true, data };
        
    } catch (err) {
        console.error('❌ [Google Steps] Exception:', err);
        return { success: false };
    }
}

// Water
async function saveGoogleUserWater(waterData) {
    const client = getSupabaseClient();
    const user = getCurrentGoogleUser();
    
    if (!client || !user) {
        console.log('⚠️ [Google Water] No client or user');
        return { success: false };
    }
    
    try {
        const dataToSave = {
            user_id: user.id,
            amount: parseFloat(waterData.value || waterData.amount),
            date: safeToISOString(waterData.date),
            created_at: new Date().toISOString()
        };
        
        console.log('📤 [Google] Saving water:', dataToSave);
        
        const { data, error } = await client
            .from('water_consumption')
            .insert(dataToSave)
            .select();
        
        if (error) {
            console.error('❌ [Google Water] Error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ [Google] Water saved:', dataToSave.amount, 'ml');
        return { success: true, data };
        
    } catch (err) {
        console.error('❌ [Google Water] Exception:', err);
        return { success: false };
    }
}

// Gym Sessions
async function saveGoogleUserGym(gymData) {
    const client = getSupabaseClient();
    const user = getCurrentGoogleUser();
    
    if (!client || !user) {
        console.log('⚠️ [Google Gym] No client or user');
        return { success: false };
    }
    
    try {
        const dataToSave = {
            user_id: user.id,
            category: gymData.category || 'general',
            exercise_type: gymData.exerciseType || gymData.type || 'workout',
            duration: parseInt(gymData.duration),
            date: safeToISOString(gymData.date),
            created_at: new Date().toISOString()
        };
        
        console.log('📤 [Google] Saving gym session:', dataToSave);
        
        const { data, error } = await client
            .from('gym_sessions')
            .insert(dataToSave)
            .select();
        
        if (error) {
            console.error('❌ [Google Gym] Error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ [Google] Gym saved:', dataToSave.duration, 'minutes');
        return { success: true, data };
        
    } catch (err) {
        console.error('❌ [Google Gym] Exception:', err);
        return { success: false };
    }
}

// Sleep
async function saveGoogleUserSleep(sleepData) {
    const client = getSupabaseClient();
    const user = getCurrentGoogleUser();
    
    if (!client || !user) {
        console.log('⚠️ [Google Sleep] No client or user');
        return { success: false };
    }
    
    try {
        const dataToSave = {
            user_id: user.id,
            hours: parseFloat(sleepData.hours || sleepData.value),
            date: safeToISOString(sleepData.date),
            created_at: new Date().toISOString()
        };
        
        console.log('📤 [Google] Saving sleep:', dataToSave);
        
        const { data, error } = await client
            .from('sleep_records')
            .insert(dataToSave)
            .select();
        
        if (error) {
            console.error('❌ [Google Sleep] Error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ [Google] Sleep saved:', dataToSave.hours, 'hours');
        return { success: true, data };
        
    } catch (err) {
        console.error('❌ [Google Sleep] Exception:', err);
        return { success: false };
    }
}

// Running
async function saveGoogleUserRunning(runningData) {
    const client = getSupabaseClient();
    const user = getCurrentGoogleUser();
    
    if (!client || !user) {
        console.log('⚠️ [Google Running] No client or user');
        return { success: false };
    }
    
    try {
        const dataToSave = {
            user_id: user.id,
            distance: parseFloat(runningData.distance || runningData.value),
            date: safeToISOString(runningData.date),
            created_at: new Date().toISOString()
        };
        
        console.log('📤 [Google] Saving running:', dataToSave);
        
        const { data, error } = await client
            .from('running_activity')
            .insert(dataToSave)
            .select();
        
        if (error) {
            console.error('❌ [Google Running] Error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ [Google] Running saved:', dataToSave.distance, 'km');
        return { success: true, data };
        
    } catch (err) {
        console.error('❌ [Google Running] Exception:', err);
        return { success: false };
    }
}

// Weight
async function saveGoogleUserWeight(weightData) {
    const client = getSupabaseClient();
    const user = getCurrentGoogleUser();
    
    if (!client || !user) {
        console.log('⚠️ [Google Weight] No client or user');
        return { success: false };
    }
    
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const dataToSave = {
            user_id: user.id,
            weight: parseFloat(weightData.weight || weightData.value),
            date: weightData.date || today,
            note: weightData.note || null,
            created_at: new Date().toISOString()
        };
        
        console.log('📤 [Google] Saving weight:', dataToSave);
        
        // Upsert - update if exists for same date
        const { data, error } = await client
            .from('weight_tracking')
            .upsert(dataToSave, {
                onConflict: 'user_id,date'
            })
            .select();
        
        if (error) {
            console.error('❌ [Google Weight] Error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ [Google] Weight saved:', dataToSave.weight, 'kg');
        return { success: true, data };
        
    } catch (err) {
        console.error('❌ [Google Weight] Exception:', err);
        return { success: false };
    }
}

// Food
async function saveGoogleUserFood(foodData) {
    const client = getSupabaseClient();
    const user = getCurrentGoogleUser();
    
    if (!client || !user) {
        console.log('⚠️ [Google Food] No client or user');
        return { success: false };
    }
    
    try {
        const dataToSave = {
            user_id: user.id,
            food_name: foodData.foodName || foodData.name,
            calories: parseInt(foodData.calories) || 0,
            carbs: parseFloat(foodData.carbs) || 0,
            protein: parseFloat(foodData.protein) || 0,
            fat: parseFloat(foodData.fat) || 0,
            date: safeToISOString(foodData.date),
            created_at: new Date().toISOString()
        };
        
        console.log('📤 [Google] Saving food:', dataToSave);
        
        const { data, error } = await client
            .from('food_intake')
            .insert(dataToSave)
            .select();
        
        if (error) {
            console.error('❌ [Google Food] Error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ [Google] Food saved:', dataToSave.food_name);
        return { success: true, data };
        
    } catch (err) {
        console.error('❌ [Google Food] Exception:', err);
        return { success: false };
    }
}

// ====================================
// PATCH EXISTING ACTIVITY FUNCTIONS
// ====================================

function patchActivityFunctions() {
    console.log('🔧 Patching activity functions for Google users...');
    
    // Patch saveStepsToSupabase
    if (typeof window.saveStepsToSupabase === 'function') {
        const originalSaveSteps = window.saveStepsToSupabase;
        window.saveStepsToSupabase = async function(stepsEntry) {
            if (isGoogleUser()) {
                console.log('🔵 [Google User] Redirecting to Google steps save');
                return await saveGoogleUserSteps(stepsEntry);
            }
            return await originalSaveSteps(stepsEntry);
        };
        console.log('✅ Patched saveStepsToSupabase');
    }
    
    // Patch saveWaterToSupabase
    if (typeof window.saveWaterToSupabase === 'function') {
        const originalSaveWater = window.saveWaterToSupabase;
        window.saveWaterToSupabase = async function(waterEntry) {
            if (isGoogleUser()) {
                console.log('🔵 [Google User] Redirecting to Google water save');
                return await saveGoogleUserWater(waterEntry);
            }
            return await originalSaveWater(waterEntry);
        };
        console.log('✅ Patched saveWaterToSupabase');
    }
    
    // Patch saveGymToSupabase
    if (typeof window.saveGymToSupabase === 'function') {
        const originalSaveGym = window.saveGymToSupabase;
        window.saveGymToSupabase = async function(gymEntry) {
            if (isGoogleUser()) {
                console.log('🔵 [Google User] Redirecting to Google gym save');
                return await saveGoogleUserGym(gymEntry);
            }
            return await originalSaveGym(gymEntry);
        };
        console.log('✅ Patched saveGymToSupabase');
    }
    
    // Patch saveSleepToSupabase
    if (typeof window.saveSleepToSupabase === 'function') {
        const originalSaveSleep = window.saveSleepToSupabase;
        window.saveSleepToSupabase = async function(sleepEntry) {
            if (isGoogleUser()) {
                console.log('🔵 [Google User] Redirecting to Google sleep save');
                return await saveGoogleUserSleep(sleepEntry);
            }
            return await originalSaveSleep(sleepEntry);
        };
        console.log('✅ Patched saveSleepToSupabase');
    }
    
    // Patch saveRunningToSupabase
    if (typeof window.saveRunningToSupabase === 'function') {
        const originalSaveRunning = window.saveRunningToSupabase;
        window.saveRunningToSupabase = async function(runningEntry) {
            if (isGoogleUser()) {
                console.log('🔵 [Google User] Redirecting to Google running save');
                return await saveGoogleUserRunning(runningEntry);
            }
            return await originalSaveRunning(runningEntry);
        };
        console.log('✅ Patched saveRunningToSupabase');
    }
    
    // Patch saveWeightToSupabase
    if (typeof window.saveWeightToSupabase === 'function') {
        const originalSaveWeight = window.saveWeightToSupabase;
        window.saveWeightToSupabase = async function(weightEntry) {
            if (isGoogleUser()) {
                console.log('🔵 [Google User] Redirecting to Google weight save');
                return await saveGoogleUserWeight(weightEntry);
            }
            return await originalSaveWeight(weightEntry);
        };
        console.log('✅ Patched saveWeightToSupabase');
    }
    
    // Patch saveFoodToSupabase
    if (typeof window.saveFoodToSupabase === 'function') {
        const originalSaveFood = window.saveFoodToSupabase;
        window.saveFoodToSupabase = async function(foodEntry) {
            if (isGoogleUser()) {
                console.log('🔵 [Google User] Redirecting to Google food save');
                return await saveGoogleUserFood(foodEntry);
            }
            return await originalSaveFood(foodEntry);
        };
        console.log('✅ Patched saveFoodToSupabase');
    }
    
    console.log('✅ All activity functions patched for Google users!');
}

// ====================================
// INIT
// ====================================

function initGoogleUserSync() {
    console.log('🚀 Initializing Google User Sync...');
    
    // Wait for Supabase to be ready
    const checkAndPatch = () => {
        if (getSupabaseClient()) {
            // Delay patching to ensure other scripts are loaded
            setTimeout(patchActivityFunctions, 1000);
        } else {
            console.log('⏳ Waiting for Supabase...');
            setTimeout(checkAndPatch, 500);
        }
    };
    
    checkAndPatch();
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGoogleUserSync);
} else {
    initGoogleUserSync();
}

// ====================================
// EXPOSE GLOBALLY
// ====================================

window.GoogleUserSync = {
    isGoogleUser,
    getCurrentGoogleUser,
    saveGoogleUserToSupabase,
    completeGoogleUserProfile,
    saveSteps: saveGoogleUserSteps,
    saveWater: saveGoogleUserWater,
    saveGym: saveGoogleUserGym,
    saveSleep: saveGoogleUserSleep,
    saveRunning: saveGoogleUserRunning,
    saveWeight: saveGoogleUserWeight,
    saveFood: saveGoogleUserFood
};

console.log('✅ Supabase Login Google v1.0 loaded!');
console.log('📌 Usage:');
console.log('  - GoogleUserSync.isGoogleUser() → Check if current user is Google user');
console.log('  - GoogleUserSync.saveSteps({value: 5000, date: new Date()}) → Save steps');
console.log('  - GoogleUserSync.saveWater({value: 500, date: new Date()}) → Save water');
console.log('  - All activity functions are auto-patched for Google users');