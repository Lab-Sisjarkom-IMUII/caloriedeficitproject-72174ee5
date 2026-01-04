// ============================================
// SUPABASE-ONLY LOGIN SYSTEM - FIXED VERSION
// Handle RLS and session issues properly
// ============================================

console.log('🔐 Loading Supabase-only login system (FIXED)...');

/**
 * Login dengan Supabase
 */
window.handleSupabaseLogin = async function() {
    console.log('🔐 Supabase Login: Starting...');
    
    const email = document.getElementById('loginEmail')?.value?.trim();
    const password = document.getElementById('loginPassword')?.value;
    const errorEl = document.getElementById('loginError');
    
    // Validation
    if (!email || !password) {
        if (errorEl) {
            errorEl.textContent = '⚠️ Email dan password harus diisi';
            errorEl.style.display = 'block';
        }
        return;
    }
    
    // Show loading
    if (errorEl) {
        errorEl.textContent = '⏳ Logging in...';
        errorEl.style.display = 'block';
    }
    
    try {
        // Check if supabaseClient exists
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        console.log('📡 Authenticating with Supabase...');
        
        // 1. Login to Supabase Auth
        const { data: authData, error: authError } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (authError) {
            console.error('❌ Auth error:', authError);
            if (errorEl) {
                errorEl.textContent = '❌ ' + authError.message;
                errorEl.style.display = 'block';
            }
            return;
        }
        
        if (!authData.user) {
            if (errorEl) {
                errorEl.textContent = '❌ Login gagal';
                errorEl.style.display = 'block';
            }
            return;
        }
        
        console.log('✅ Auth successful:', authData.user.email);
        
        // 2. Get user profile from Supabase
        console.log('📊 Fetching user profile...');
        const { data: profile, error: profileError } = await window.supabaseClient
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();
        
        if (profileError) {
            console.warn('⚠️ Profile fetch error:', profileError);
            // Profile might not exist yet
        }
        
        console.log('📊 Profile data:', profile);
        
        // 3. Create currentUser object
        const currentUser = {
            id: authData.user.id,
            email: authData.user.email,
            name: profile?.nama_lengkap || profile?.name || authData.user.email,
            picture: profile?.picture || null,
            namaLengkap: profile?.nama_lengkap || null,
            jenisKelamin: profile?.jenis_kelamin || null,
            tempatLahir: profile?.tempat_lahir || null,
            tanggalLahir: profile?.tanggal_lahir || null,
            golonganDarah: profile?.golongan_darah || null,
            tinggiBadan: profile?.tinggi_badan || null,
            beratBadan: profile?.berat_badan || null,
            beratBadanAwal: profile?.berat_badan_awal || profile?.berat_badan || null,
            beratBadanTarget: profile?.berat_badan_target || null,
            nomorWA: profile?.nomor_wa || null,
            goal: profile?.goal || null,
            hasCompletedData: profile?.has_completed_data || false,
            isGoogleUser: profile?.is_google_user || false
        };
        
        console.log('✅ Current user:', currentUser);
        console.log('📊 Has completed data:', currentUser.hasCompletedData);
        
        // 4. Save to global & localStorage
        window.currentUser = currentUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('supabaseSession', JSON.stringify(authData.session));
        
        // Hide error
        if (errorEl) {
            errorEl.style.display = 'none';
        }
        
        // 5. Redirect based on data completion
        if (currentUser.hasCompletedData === true) {
            console.log('✅ User has complete data → Going to Dashboard');
            if (typeof goToDashboard === 'function') {
                goToDashboard();
            } else {
                console.error('❌ goToDashboard function not found');
            }
        } else {
            console.log('⚠️ User data incomplete → Going to Complete Profile');
            if (currentUser.isGoogleUser && typeof goToCompleteProfile === 'function') {
                goToCompleteProfile();
            } else if (typeof goToInputData === 'function') {
                goToInputData();
            } else {
                console.error('❌ Navigation function not found');
            }
        }
        
    } catch (error) {
        console.error('❌ Login error:', error);
        if (errorEl) {
            errorEl.textContent = '❌ ' + error.message;
            errorEl.style.display = 'block';
        }
    }
};

/**
 * Register dengan Supabase - FIXED VERSION
 * Handle RLS by using service role or proper session
 */
window.handleSupabaseRegister = async function(event) {
    if (event) event.preventDefault();
    
    console.log('🔐 Supabase Register: Starting...');
    
    // Get form data
    const email = document.getElementById('regEmail')?.value?.trim();
    const password = document.getElementById('regPassword')?.value;
    const passwordConfirm = document.getElementById('regPasswordConfirm')?.value;
    const namaLengkap = document.getElementById('regNamaLengkap')?.value?.trim();
    const jenisKelamin = document.querySelector('input[name="jenisKelamin"]:checked')?.value;
    const tempatLahir = document.getElementById('regTempatLahir')?.value?.trim();
    const tanggalLahir = document.getElementById('regTanggalLahir')?.value;
    const golonganDarah = document.getElementById('regGolonganDarah')?.value;
    const nomorWA = document.getElementById('regNomorWA')?.value?.trim();
    const tinggiBadan = parseInt(document.getElementById('regTinggiBadan')?.value);
    const beratBadan = parseFloat(document.getElementById('regBeratBadanAwal')?.value);
    const beratBadanTarget = parseFloat(document.getElementById('regBeratBadanTarget')?.value) || null;
    const goal = document.querySelector('input[name="goal"]:checked')?.value;
    
    const errorEl = document.getElementById('registerError');
    
    // Validation
    const errors = [];
    if (!email) errors.push('Email');
    if (!password) errors.push('Password');
    if (password !== passwordConfirm) errors.push('Password tidak cocok');
    if (!namaLengkap) errors.push('Nama Lengkap');
    if (!jenisKelamin) errors.push('Jenis Kelamin');
    if (!tempatLahir) errors.push('Tempat Lahir');
    if (!tanggalLahir) errors.push('Tanggal Lahir');
    if (!golonganDarah) errors.push('Golongan Darah');
    if (!nomorWA) errors.push('Nomor WhatsApp');
    if (!tinggiBadan) errors.push('Tinggi Badan');
    if (!beratBadan) errors.push('Berat Badan');
    if (!goal) errors.push('Tujuan');
    
    if (errors.length > 0) {
        if (errorEl) {
            errorEl.textContent = '⚠️ Harap lengkapi: ' + errors.join(', ');
            errorEl.style.display = 'block';
        }
        alert('⚠️ Harap lengkapi:\n- ' + errors.join('\n- '));
        return;
    }
    
    // Show loading
    if (errorEl) {
        errorEl.textContent = '⏳ Creating account...';
        errorEl.style.display = 'block';
    }
    
    try {
        // Check if supabaseClient exists
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        console.log('📡 Creating Supabase account...');
        
        // 1. Create auth user
        const { data: authData, error: authError } = await window.supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: namaLengkap,
                    full_name: namaLengkap
                }
            }
        });
        
        if (authError) {
            console.error('❌ Auth error:', authError);
            if (errorEl) {
                errorEl.textContent = '❌ ' + authError.message;
                errorEl.style.display = 'block';
            }
            return;
        }
        
        if (!authData.user) {
            throw new Error('Failed to create user');
        }
        
        console.log('✅ Auth user created:', authData.user.id);
        console.log('📧 Email confirmation required:', !authData.session);
        
        // 2. Prepare profile data
        // ⭐ Match with Supabase 'users' table structure
        // Using berat_badan only (no berat_badan_awal)
        const profileData = {
            id: authData.user.id,
            email: email,
            nama_lengkap: namaLengkap,
            jenis_kelamin: jenisKelamin,
            tempat_lahir: tempatLahir,
            tanggal_lahir: tanggalLahir,
            golongan_darah: golonganDarah,
            nomor_wa: nomorWA,
            tinggi_badan: tinggiBadan,
            berat_badan: beratBadan,
            berat_badan_target: beratBadanTarget,
            goal: goal,
            has_completed_data: true,
            is_google_user: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // 3. Try to save profile to Supabase
        // ⭐ IMPORTANT: This might fail due to RLS if email not confirmed
        console.log('📊 Saving profile to Supabase...');
        
        let profileSaved = false;
        
        // Method 1: Try insert (works if RLS allows or email auto-confirmed)
        if (authData.session) {
            // Session exists = email auto-confirmed or confirmation disabled
            console.log('✅ Session exists - saving profile directly...');
            
            const { data: profile, error: profileError } = await window.supabaseClient
                .from('users')
                .insert([profileData])
                .select()
                .single();
            
            if (profileError) {
                console.error('❌ Profile save error:', profileError);
                console.log('⚠️ Will save to localStorage and retry later');
            } else {
                console.log('✅ Profile saved to Supabase:', profile);
                profileSaved = true;
            }
        } else {
            // No session = email confirmation required
            console.log('⚠️ No session (email confirmation required)');
            console.log('📦 Profile will be saved to localStorage');
            console.log('ℹ️ Profile will sync to Supabase after email confirmation');
        }
        
        // 4. Create currentUser object
        const currentUser = {
            id: authData.user.id,
            email: email,
            name: namaLengkap,
            namaLengkap: namaLengkap,
            jenisKelamin: jenisKelamin,
            tempatLahir: tempatLahir,
            tanggalLahir: tanggalLahir,
            golonganDarah: golonganDarah,
            tinggiBadan: tinggiBadan,
            beratBadan: beratBadan,
            beratBadanAwal: beratBadan,
            beratBadanTarget: beratBadanTarget,
            nomorWA: nomorWA,
            goal: goal,
            hasCompletedData: true,
            isGoogleUser: false,
            profileSavedToSupabase: profileSaved,
            pendingProfileSync: !profileSaved
        };
        
        // 5. Save to global & localStorage
        window.currentUser = currentUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Also save pending profile data for later sync
        if (!profileSaved) {
            localStorage.setItem('pendingProfileData', JSON.stringify(profileData));
            console.log('💾 Pending profile data saved to localStorage');
        }
        
        if (authData.session) {
            localStorage.setItem('supabaseSession', JSON.stringify(authData.session));
        }
        
        console.log('✅ Registration complete!');
        
        // Hide error
        if (errorEl) {
            errorEl.style.display = 'none';
        }
        
        // 6. Check if email confirmation is required
        if (!authData.session) {
            // Email confirmation required
            alert('✅ Akun berhasil dibuat!\n\n📧 Silakan cek email Anda untuk verifikasi.\n\nSetelah verifikasi, Anda bisa login dengan email dan password.');
            
            // Go back to login
            if (typeof toggleForm === 'function') {
                toggleForm();
            }
            return;
        }
        
        // 7. Go to dashboard (if no email confirmation required)
        console.log('✅ Going to Dashboard...');
        if (typeof goToDashboard === 'function') {
            goToDashboard();
        } else {
            console.error('❌ goToDashboard function not found');
        }
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        if (errorEl) {
            errorEl.textContent = '❌ ' + error.message;
            errorEl.style.display = 'block';
        }
    }
};

/**
 * Sync pending profile data to Supabase
 * Call this after user logs in (email confirmed)
 */
window.syncPendingProfileToSupabase = async function() {
    const pendingData = localStorage.getItem('pendingProfileData');
    
    if (!pendingData) {
        console.log('ℹ️ No pending profile data to sync');
        return;
    }
    
    if (!window.supabaseClient) {
        console.warn('⚠️ Supabase client not available');
        return;
    }
    
    try {
        const profileData = JSON.parse(pendingData);
        console.log('📤 Syncing pending profile to Supabase:', profileData.email);
        
        // Try upsert (insert or update)
        const { data, error } = await window.supabaseClient
            .from('users')
            .upsert([profileData], { onConflict: 'id' })
            .select()
            .single();
        
        if (error) {
            console.error('❌ Profile sync error:', error);
            return;
        }
        
        console.log('✅ Profile synced successfully!');
        
        // Clear pending data
        localStorage.removeItem('pendingProfileData');
        
        // Update currentUser
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.profileSavedToSupabase = true;
        currentUser.pendingProfileSync = false;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.currentUser = currentUser;
        
    } catch (err) {
        console.error('❌ Sync exception:', err);
    }
};

/**
 * Auto-login jika ada Supabase session
 */
window.checkSupabaseSession = async function() {
    console.log('🔐 Checking Supabase session...');
    
    try {
        if (!window.supabaseClient) {
            console.log('⚠️ Supabase client not initialized');
            return false;
        }
        
        const { data: { session }, error } = await window.supabaseClient.auth.getSession();
        
        if (error || !session) {
            console.log('❌ No active session');
            return false;
        }
        
        console.log('✅ Found active session:', session.user.email);
        
        // ⭐ Sync pending profile if exists
        await syncPendingProfileToSupabase();
        
        // Get user profile
        const { data: profile, error: profileError } = await window.supabaseClient
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
        
        if (profileError) {
            console.warn('⚠️ Profile not found');
        }
        
        // Create currentUser
        const currentUser = {
            id: session.user.id,
            email: session.user.email,
            name: profile?.nama_lengkap || session.user.email,
            namaLengkap: profile?.nama_lengkap || null,
            hasCompletedData: profile?.has_completed_data || false,
            // ... other fields
        };
        
        window.currentUser = currentUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirect if has data
        if (currentUser.hasCompletedData) {
            console.log('✅ Auto-login → Dashboard');
            if (typeof goToDashboard === 'function') {
                setTimeout(() => goToDashboard(), 100);
            }
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('❌ Session check error:', error);
        return false;
    }
};

/**
 * Logout from Supabase
 */
window.handleSupabaseLogout = async function() {
    console.log('👋 Logging out from Supabase...');
    
    try {
        if (window.supabaseClient) {
            await window.supabaseClient.auth.signOut();
        }
        
        // Clear storage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('supabaseSession');
        localStorage.removeItem('pendingProfileData');
        window.currentUser = null;
        
        console.log('✅ Logged out successfully');
        
        // Go to landing
        if (typeof goToLanding === 'function') {
            goToLanding();
        }
        
    } catch (error) {
        console.error('❌ Logout error:', error);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Supabase login system...');
    
    // Check for existing session
    setTimeout(() => {
        checkSupabaseSession();
    }, 500);
});

console.log('✅ Supabase-only login system loaded (FIXED VERSION)!');
console.log('📋 Improvements:');
console.log('   ✓ Handle RLS when email not confirmed');
console.log('   ✓ Save profile to localStorage if Supabase fails');
console.log('   ✓ Auto-sync profile after email confirmation');
console.log('   ✓ Better error messages');