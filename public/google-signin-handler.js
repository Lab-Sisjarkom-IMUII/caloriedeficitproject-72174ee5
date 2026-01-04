// ====================================
// GOOGLE SIGN-IN WITH SUPABASE CHECK
// Auto redirect ke dashboard jika user sudah ada
// ====================================

async function handleGoogleSignIn(response) {
    try {
        console.log('🔵 Google Sign-In: Starting...');
        
        // Decode JWT token
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        console.log('✅ Google Sign-In successful:', payload.email);
        
        // ⭐ CHECK SUPABASE FIRST!
        if (window.supabaseClient) {
            console.log('🔍 Checking if user exists in Supabase...');
            
            try {
                // Check if user exists by email
                const { data: existingUser, error: fetchError } = await window.supabaseClient
                    .from('users')
                    .select('*')
                    .eq('email', payload.email)
                    .single();
                
                if (existingUser && !fetchError) {
                    console.log('✅ User found in Supabase:', existingUser.email);
                    console.log('📊 has_completed_data:', existingUser.has_completed_data);
                    
                    // Create currentUser object
                    const currentUser = {
                        id: existingUser.id,
                        email: existingUser.email,
                        name: existingUser.nama_lengkap || payload.name,
                        picture: payload.picture,
                        googleId: payload.sub,
                        namaLengkap: existingUser.nama_lengkap,
                        jenisKelamin: existingUser.jenis_kelamin,
                        tempatLahir: existingUser.tempat_lahir,
                        tanggalLahir: existingUser.tanggal_lahir,
                        golonganDarah: existingUser.golongan_darah,
                        nomorWA: existingUser.nomor_wa,
                        tinggiBadan: existingUser.tinggi_badan,
                        beratBadan: existingUser.berat_badan,
                        beratBadanAwal: existingUser.berat_badan_awal,
                        beratBadanTarget: existingUser.berat_badan_target,
                        goal: existingUser.goal,
                        hasCompletedData: existingUser.has_completed_data,
                        isGoogleUser: true
                    };
                    
                    // Save to global & localStorage
                    window.currentUser = currentUser;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // ⭐ REDIRECT BASED ON DATA COMPLETION
                    if (existingUser.has_completed_data === true) {
                        console.log('✅ User has complete data → Going to Dashboard');
                        if (typeof goToDashboard === 'function') {
                            goToDashboard();
                        }
                        return; // Exit early
                    } else {
                        console.log('⚠️ User data incomplete → Going to Complete Profile');
                        // Continue to save tempGoogleUser below
                    }
                } else {
                    console.log('ℹ️ User not found in Supabase → New user');
                }
            } catch (err) {
                console.warn('⚠️ Error checking Supabase:', err);
            }
        }
        
        // ⭐ NEW USER OR INCOMPLETE DATA → Save temp data
        const tempGoogleUser = {
            id: payload.sub, // Use Google ID as user ID
            name: payload.name,
            email: payload.email,
            googleId: payload.sub,
            picture: payload.picture,
            hasCompletedData: false,
            isGoogleUser: true
        };
        
        // Save to temp storage
        sessionStorage.setItem('tempGoogleUser', JSON.stringify(tempGoogleUser));
        localStorage.setItem('tempGoogleUser', JSON.stringify(tempGoogleUser));
        window.currentUser = tempGoogleUser;
        
        console.log('💾 Saved temp Google user');
        
        // Go to Complete Profile
        console.log('→ Going to Complete Profile page');
        if (typeof goToCompleteProfile === 'function') {
            goToCompleteProfile();
        }
        
    } catch (error) {
        console.error('❌ Google Sign-In error:', error);
        alert('Error saat login dengan Google. Silakan coba lagi.');
    }
}

// Expose globally
window.handleGoogleSignIn = handleGoogleSignIn;

console.log('✅ Google Sign-In handler (with Supabase check) loaded!');