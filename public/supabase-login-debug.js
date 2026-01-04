// ============================================
// SUPABASE LOGIN DEBUG & FIX
// Diagnose dan perbaiki masalah login
// ============================================

console.log('🔍 Loading Supabase Login Debug...');

/**
 * Enhanced login dengan error handling yang lebih detail
 */
window.handleSupabaseLoginDebug = async function() {
    console.log('🔐 Supabase Login Debug: Starting...');
    
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
        errorEl.textContent = '⏳ Mencoba login...';
        errorEl.style.display = 'block';
        errorEl.style.color = '#667eea';
    }
    
    try {
        // Check if supabaseClient exists
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        console.log('📡 Authenticating with Supabase...');
        console.log('Email:', email);
        
        // 1. Try to login
        const { data: authData, error: authError } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (authError) {
            console.error('❌ Auth error:', authError);
            console.log('Error details:', JSON.stringify(authError, null, 2));
            
            // Provide user-friendly error messages
            let errorMessage = '';
            
            if (authError.message.includes('Invalid login credentials')) {
                errorMessage = '❌ Email atau password salah.\n\n';
                errorMessage += 'Kemungkinan penyebab:\n';
                errorMessage += '1. Password yang dimasukkan salah\n';
                errorMessage += '2. Email belum terverifikasi (cek inbox/spam)\n';
                errorMessage += '3. Akun dibuat dengan Google Sign-In (gunakan tombol Google)\n\n';
                errorMessage += 'Solusi:\n';
                errorMessage += '• Coba gunakan Google Sign-In jika akun dibuat dengan Google\n';
                errorMessage += '• Cek email untuk verifikasi akun\n';
                errorMessage += '• Gunakan "Lupa Password" untuk reset';
            } else if (authError.message.includes('Email not confirmed')) {
                errorMessage = '⚠️ Email belum diverifikasi.\n\n';
                errorMessage += 'Silakan cek inbox email Anda dan klik link verifikasi.';
            } else {
                errorMessage = '❌ ' + authError.message;
            }
            
            if (errorEl) {
                errorEl.style.color = '#dc2626';
                errorEl.innerHTML = errorMessage.replace(/\n/g, '<br>');
                errorEl.style.display = 'block';
            }
            
            alert(errorMessage);
            return;
        }
        
        if (!authData.user) {
            if (errorEl) {
                errorEl.textContent = '❌ Login gagal - user tidak ditemukan';
                errorEl.style.display = 'block';
            }
            return;
        }
        
        console.log('✅ Auth successful:', authData.user.email);
        console.log('User ID:', authData.user.id);
        console.log('Email verified:', authData.user.email_confirmed_at ? 'Yes' : 'No');
        
        // 2. Get user profile from Supabase
        console.log('📊 Fetching user profile...');
        const { data: profile, error: profileError } = await window.supabaseClient
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();
        
        if (profileError) {
            console.warn('⚠️ Profile fetch error:', profileError);
            // Profile might not exist yet - that's okay
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
        
        // Success message
        alert('✅ Login berhasil! Selamat datang, ' + currentUser.name);
        
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
            errorEl.style.color = '#dc2626';
            errorEl.textContent = '❌ Error: ' + error.message;
            errorEl.style.display = 'block';
        }
        alert('❌ Error: ' + error.message);
    }
};

/**
 * Check if email exists in database
 */
window.checkEmailExists = async function(email) {
    try {
        if (!window.supabaseClient) {
            console.error('❌ Supabase not initialized');
            return false;
        }
        
        console.log('🔍 Checking if email exists:', email);
        
        const { data, error } = await window.supabaseClient
            .from('users')
            .select('email, is_google_user')
            .eq('email', email)
            .single();
        
        if (error) {
            console.log('⚠️ Email not found in database');
            return { exists: false };
        }
        
        console.log('✅ Email found:', data);
        return { 
            exists: true, 
            isGoogleUser: data.is_google_user 
        };
        
    } catch (error) {
        console.error('❌ Error checking email:', error);
        return { exists: false };
    }
};

/**
 * Send password reset email
 */
window.sendPasswordReset = async function(email) {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        console.log('📧 Sending password reset email to:', email);
        
        const { data, error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password'
        });
        
        if (error) {
            console.error('❌ Error:', error);
            alert('❌ Error: ' + error.message);
            return false;
        }
        
        console.log('✅ Password reset email sent');
        alert('✅ Email reset password telah dikirim!\n\nSilakan cek inbox atau folder spam Anda.');
        return true;
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error: ' + error.message);
        return false;
    }
};

/**
 * Resend verification email
 */
window.resendVerificationEmail = async function(email) {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        console.log('📧 Resending verification email to:', email);
        
        const { data, error } = await window.supabaseClient.auth.resend({
            type: 'signup',
            email: email
        });
        
        if (error) {
            console.error('❌ Error:', error);
            alert('❌ Error: ' + error.message);
            return false;
        }
        
        console.log('✅ Verification email sent');
        alert('✅ Email verifikasi telah dikirim ulang!\n\nSilakan cek inbox atau folder spam Anda.');
        return true;
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error: ' + error.message);
        return false;
    }
};

/**
 * Debug: Show all users in database (for testing only)
 */
window.debugShowAllUsers = async function() {
    try {
        if (!window.supabaseClient) {
            console.error('❌ Supabase not initialized');
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('users')
            .select('email, nama_lengkap, is_google_user, has_completed_data, created_at');
        
        if (error) {
            console.error('❌ Error:', error);
            return;
        }
        
        console.log('👥 All users in database:');
        console.table(data);
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

// Replace original login function
console.log('🔄 Replacing handleSupabaseLogin with debug version...');
window.handleSupabaseLogin = window.handleSupabaseLoginDebug;

// Add helper button to HTML (if in dev mode)
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Add "Lupa Password?" link
        const forgotPasswordLink = document.createElement('a');
        forgotPasswordLink.href = '#';
        forgotPasswordLink.textContent = 'Lupa Password?';
        forgotPasswordLink.style.cssText = 'display: block; text-align: right; margin-top: 10px; color: #667eea; font-size: 14px;';
        forgotPasswordLink.onclick = function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail')?.value?.trim();
            if (!email) {
                alert('⚠️ Masukkan email Anda terlebih dahulu');
                return;
            }
            if (confirm('Kirim email reset password ke:\n' + email + '?')) {
                window.sendPasswordReset(email);
            }
        };
        
        const loginButton = loginForm.querySelector('button[type="button"]');
        if (loginButton && loginButton.parentElement) {
            loginButton.parentElement.insertBefore(forgotPasswordLink, loginButton.nextSibling);
        }
    }
});

console.log('✅ Supabase Login Debug loaded!');
console.log('📝 Tips:');
console.log('  • Jika login gagal, coba gunakan Google Sign-In');
console.log('  • Pastikan email sudah diverifikasi');
console.log('  • Gunakan "Lupa Password" jika lupa password');
console.log('  • Debug: window.checkEmailExists("email@example.com")');
console.log('  • Debug: window.debugShowAllUsers()');