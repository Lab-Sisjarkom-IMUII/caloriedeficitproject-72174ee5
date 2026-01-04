/* ========================================
   REGISTRATION HANDLER - COMPLETE VERSION
   With Full Harris-Benedict Formula
   ======================================== */

// ====================================
// HELPER FUNCTIONS - KALORI CALCULATOR
// Full Implementation from Old File
// ====================================

/**
 * Hitung umur dari tanggal lahir
 * @param {string} tanggalLahir - Format YYYY-MM-DD
 * @returns {number} Umur dalam tahun
 */
function hitungUmur(tanggalLahir) {
    const today = new Date();
    const birthDate = new Date(tanggalLahir);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

/**
 * Hitung BMR menggunakan Harris-Benedict Formula
 * @param {string} jenisKelamin - "laki-laki" atau "perempuan"
 * @param {number} beratBadan - Berat badan dalam kg
 * @param {number} tinggiBadan - Tinggi badan dalam cm
 * @param {number} umur - Umur dalam tahun
 * @returns {number} BMR dalam kalori
 */
function hitungBMR(jenisKelamin, beratBadan, tinggiBadan, umur) {
    let bmr;
    
    if (jenisKelamin === 'laki-laki') {
        // Pria: BMR = 88.362 + (13.397 × BB) + (4.799 × TB) - (5.677 × Umur)
        bmr = 88.362 + (13.397 * beratBadan) + (4.799 * tinggiBadan) - (5.677 * umur);
    } else {
        // Wanita: BMR = 447.593 + (9.247 × BB) + (3.098 × TB) - (4.330 × Umur)
        bmr = 447.593 + (9.247 * beratBadan) + (3.098 * tinggiBadan) - (4.330 * umur);
    }
    
    return Math.round(bmr);
}

/**
 * Hitung TDEE (Total Daily Energy Expenditure)
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - Level aktivitas (default: "light")
 * @returns {number} TDEE dalam kalori
 */
function hitungTDEE(bmr, activityLevel = 'light') {
    const activityMultipliers = {
        sedentary: 1.2,    // Tidak olahraga
        light: 1.375,      // Olahraga ringan 1-3x/minggu
        moderate: 1.55,    // Olahraga sedang 3-5x/minggu
        active: 1.725,     // Olahraga berat 6-7x/minggu
        veryActive: 1.9    // Atlet / pekerjaan fisik berat
    };
    
    const multiplier = activityMultipliers[activityLevel] || activityMultipliers.light;
    return Math.round(bmr * multiplier);
}

/**
 * Hitung target kalori harian berdasarkan goal
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} goal - "turun", "naik", atau "maintain"
 * @param {string} jenisKelamin - "laki-laki" atau "perempuan"
 * @returns {object} { targetKalori, defisitSurplus }
 */
function hitungTargetKalori(tdee, goal, jenisKelamin) {
    let targetKalori;
    let defisitSurplus = 0;
    
    if (goal === 'turun') {
        // Defisit 500-1000 kalori untuk turun 0.5-1 kg/minggu
        defisitSurplus = -500; // Default 500 kalori defisit
        targetKalori = tdee + defisitSurplus;
        
        // Validasi minimal kalori
        const minKalori = jenisKelamin === 'laki-laki' ? 1500 : 1100;
        if (targetKalori < minKalori) {
            targetKalori = minKalori;
            defisitSurplus = targetKalori - tdee;
        }
        
    } else if (goal === 'naik') {
        // Surplus 300-500 kalori untuk naik bertahap
        defisitSurplus = 400; // Default 400 kalori surplus
        targetKalori = tdee + defisitSurplus;
        
    } else { // maintain
        targetKalori = tdee;
        defisitSurplus = 0;
    }
    
    return {
        targetKalori: Math.round(targetKalori),
        defisitSurplus: Math.round(defisitSurplus)
    };
}

/**
 * Estimasi waktu mencapai target (dalam minggu)
 * @param {number} beratAwal - BB awal
 * @param {number} beratTarget - BB target
 * @param {string} goal - "turun" atau "naik"
 * @returns {object} { minggu, bulan }
 */
function estimasiWaktu(beratAwal, beratTarget, goal) {
    const selisih = Math.abs(beratTarget - beratAwal);
    
    // Asumsi: turun/naik 0.5 kg per minggu (aman)
    const mingguPerKg = 2; // 2 minggu untuk 1 kg
    const totalMinggu = Math.ceil(selisih * mingguPerKg);
    const totalBulan = Math.ceil(totalMinggu / 4);
    
    return {
        minggu: totalMinggu,
        bulan: totalBulan
    };
}

// ====================================
// GOOGLE GOAL INFO UPDATE
// ====================================

function updateGoogleGoalInfo() {
    const goal = document.querySelector('input[name="googleGoal"]:checked')?.value;
    const targetWeightGroup = document.getElementById('googleTargetWeightGroup');
    
    if (!goal) return;
    
    if (goal === 'maintain') {
        if (targetWeightGroup) {
            targetWeightGroup.style.display = 'none';
            const targetInput = document.getElementById('googleBeratBadanTarget');
            if (targetInput) targetInput.required = false;
        }
    } else {
        if (targetWeightGroup) {
            targetWeightGroup.style.display = 'block';
            const targetInput = document.getElementById('googleBeratBadanTarget');
            if (targetInput) targetInput.required = true;
        }
    }
    
    updateGooglePreview();
}

// ====================================
// GOOGLE PREVIEW UPDATE
// ====================================

function updateGooglePreview() {
    const jenisKelamin = document.querySelector('input[name="googleJenisKelamin"]:checked')?.value;
    const tanggalLahir = document.getElementById('googleTanggalLahir')?.value;
    const tinggiBadan = parseFloat(document.getElementById('googleTinggiBadan')?.value);
    const beratBadanAwal = parseFloat(document.getElementById('googleBeratBadanAwal')?.value);
    const beratBadanTarget = parseFloat(document.getElementById('googleBeratBadanTarget')?.value);
    const goal = document.querySelector('input[name="googleGoal"]:checked')?.value;
    
    const goalPreview = document.getElementById('googleGoalPreview');
    
    if (!goalPreview) return;
    
    if (!jenisKelamin || !tanggalLahir || !tinggiBadan || !beratBadanAwal || !goal) {
        goalPreview.style.display = 'none';
        return;
    }
    
    let targetBB;
    if (goal === 'maintain') {
        targetBB = beratBadanAwal;
    } else {
        targetBB = beratBadanTarget || beratBadanAwal;
    }
    
    // Hitung menggunakan rumus lengkap
    const umur = hitungUmur(tanggalLahir);
    const bmr = hitungBMR(jenisKelamin, beratBadanAwal, tinggiBadan, umur);
    const tdee = hitungTDEE(bmr, 'light');
    const { targetKalori, defisitSurplus } = hitungTargetKalori(tdee, goal, jenisKelamin);
    
    const previewBBAwal = document.getElementById('googlePreviewBBAwal');
    const previewBBTarget = document.getElementById('googlePreviewBBTarget');
    const previewSelisih = document.getElementById('googlePreviewSelisih');
    const previewKalori = document.getElementById('googlePreviewKalori');
    const previewNote = document.getElementById('googlePreviewNote');
    
    if (previewBBAwal) previewBBAwal.textContent = `${beratBadanAwal} kg`;
    if (previewBBTarget) previewBBTarget.textContent = `${targetBB} kg`;
    
    const selisih = targetBB - beratBadanAwal;
    const selisihAbs = Math.abs(selisih);
    
    let selisihText = '';
    if (goal === 'turun') {
        selisihText = `Turun ${selisihAbs} kg`;
    } else if (goal === 'naik') {
        selisihText = `Naik ${selisihAbs} kg`;
    } else {
        selisihText = 'Pertahankan BB';
    }
    
    if (previewSelisih) {
        previewSelisih.textContent = selisihText;
        previewSelisih.className = 'preview-value highlight';
        if (goal === 'turun') previewSelisih.style.color = '#dc2626';
        else if (goal === 'naik') previewSelisih.style.color = '#059669';
        else previewSelisih.style.color = '#667eea';
    }
    
    if (previewKalori) {
        previewKalori.textContent = `${targetKalori} kkal/hari`;
    }
    
    if (previewNote) {
        let noteText = '';
        if (goal === 'turun') {
            const absDefisit = Math.abs(defisitSurplus);
            noteText = `Defisit ${absDefisit} kalori/hari untuk turun berat badan`;
        } else if (goal === 'naik') {
            noteText = `Surplus ${defisitSurplus} kalori/hari untuk naik berat badan`;
        } else {
            noteText = 'Pertahankan kalori harian untuk menjaga berat badan ideal';
        }
        previewNote.textContent = noteText;
    }
    
    goalPreview.style.display = 'block';
}

// ====================================
// REGULAR REGISTRATION - GOAL INFO
// ====================================

function updateGoalInfo() {
    const goal = document.querySelector('input[name="goal"]:checked')?.value;
    const targetWeightGroup = document.getElementById('targetWeightGroup');
    
    if (!goal) return;
    
    if (goal === 'maintain') {
        if (targetWeightGroup) {
            targetWeightGroup.style.display = 'none';
            const targetInput = document.getElementById('regBeratBadanTarget');
            if (targetInput) targetInput.required = false;
        }
    } else {
        if (targetWeightGroup) {
            targetWeightGroup.style.display = 'block';
            const targetInput = document.getElementById('regBeratBadanTarget');
            if (targetInput) targetInput.required = true;
        }
    }
    
    // ⭐ CALL updatePreview to show Ringkasan Target
    updatePreview();
}

// ====================================
// ⭐ REGULAR REGISTRATION - PREVIEW UPDATE (FIXED!)
// ====================================

function updatePreview() {
    console.log('🔄 updatePreview called');
    
    // Get form values from REGULAR registration form
    const jenisKelamin = document.querySelector('input[name="jenisKelamin"]:checked')?.value;
    const tanggalLahir = document.getElementById('regTanggalLahir')?.value;
    const tinggiBadan = parseFloat(document.getElementById('regTinggiBadan')?.value);
    const beratBadanAwal = parseFloat(document.getElementById('regBeratBadanAwal')?.value);
    const beratBadanTarget = parseFloat(document.getElementById('regBeratBadanTarget')?.value);
    const goal = document.querySelector('input[name="goal"]:checked')?.value;
    
    // Get preview element (regular registration form)
    const goalPreview = document.getElementById('goalPreview');
    
    if (!goalPreview) {
        console.log('❌ goalPreview element not found');
        return;
    }
    
    // Check if we have enough data to show preview
    if (!jenisKelamin || !tanggalLahir || !tinggiBadan || !beratBadanAwal || !goal) {
        console.log('⚠️ Missing data for preview:', {
            jenisKelamin: jenisKelamin ? '✅' : '❌',
            tanggalLahir: tanggalLahir ? '✅' : '❌',
            tinggiBadan: tinggiBadan ? '✅' : '❌',
            beratBadanAwal: beratBadanAwal ? '✅' : '❌',
            goal: goal ? '✅' : '❌'
        });
        goalPreview.style.display = 'none';
        return;
    }
    
    // Determine target weight
    let targetBB;
    if (goal === 'maintain') {
        targetBB = beratBadanAwal;
    } else {
        targetBB = beratBadanTarget || beratBadanAwal;
    }
    
    // Calculate using Harris-Benedict formula
    const umur = hitungUmur(tanggalLahir);
    const bmr = hitungBMR(jenisKelamin, beratBadanAwal, tinggiBadan, umur);
    const tdee = hitungTDEE(bmr, 'light');
    const { targetKalori, defisitSurplus } = hitungTargetKalori(tdee, goal, jenisKelamin);
    
    console.log('📊 Calculation results:', {
        umur,
        bmr,
        tdee,
        targetKalori,
        defisitSurplus,
        goal
    });
    
    // Get preview elements
    const previewBBAwal = document.getElementById('previewBBAwal');
    const previewBBTarget = document.getElementById('previewBBTarget');
    const previewSelisih = document.getElementById('previewSelisih');
    const previewKalori = document.getElementById('previewKalori');
    const previewNote = document.getElementById('previewNote');
    
    // Update preview values
    if (previewBBAwal) previewBBAwal.textContent = `${beratBadanAwal} kg`;
    if (previewBBTarget) previewBBTarget.textContent = `${targetBB} kg`;
    
    // Calculate and display selisih
    const selisih = targetBB - beratBadanAwal;
    const selisihAbs = Math.abs(selisih);
    
    let selisihText = '';
    if (goal === 'turun') {
        selisihText = `Turun ${selisihAbs} kg`;
    } else if (goal === 'naik') {
        selisihText = `Naik ${selisihAbs} kg`;
    } else {
        selisihText = 'Pertahankan BB';
    }
    
    if (previewSelisih) {
        previewSelisih.textContent = selisihText;
        previewSelisih.className = 'preview-value highlight';
        if (goal === 'turun') previewSelisih.style.color = '#dc2626';
        else if (goal === 'naik') previewSelisih.style.color = '#059669';
        else previewSelisih.style.color = '#667eea';
    }
    
    // Update kalori
    if (previewKalori) {
        previewKalori.textContent = `${targetKalori} kkal/hari`;
    }
    
    // Update note
    if (previewNote) {
        let noteText = '';
        if (goal === 'turun') {
            const absDefisit = Math.abs(defisitSurplus);
            noteText = `Defisit ${absDefisit} kalori/hari untuk turun berat badan`;
        } else if (goal === 'naik') {
            noteText = `Surplus ${defisitSurplus} kalori/hari untuk naik berat badan`;
        } else {
            noteText = 'Pertahankan kalori harian untuk menjaga berat badan ideal';
        }
        previewNote.textContent = noteText;
    }
    
    // Show preview
    goalPreview.style.display = 'block';
    console.log('✅ Preview displayed!');
}

// ====================================
// ⭐ AUTO-ATTACH PREVIEW LISTENERS
// ====================================

function initPreviewListeners() {
    console.log('🔄 Initializing preview listeners...');
    
    // Fields that affect preview calculation
    const fieldIds = [
        'regTanggalLahir',
        'regTinggiBadan', 
        'regBeratBadanAwal',
        'regBeratBadanTarget'
    ];
    
    // Attach listeners to text/number inputs
    fieldIds.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updatePreview);
            field.addEventListener('change', updatePreview);
            console.log(`✅ Listener attached to ${fieldId}`);
        }
    });
    
    // Attach listeners to gender radio buttons
    const genderRadios = document.querySelectorAll('input[name="jenisKelamin"]');
    genderRadios.forEach(radio => {
        radio.addEventListener('change', updatePreview);
    });
    if (genderRadios.length > 0) {
        console.log('✅ Listener attached to jenisKelamin radios');
    }
    
    // Attach listeners to goal radio buttons
    const goalRadios = document.querySelectorAll('input[name="goal"]');
    goalRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateGoalInfo();
            updatePreview();
        });
    });
    if (goalRadios.length > 0) {
        console.log('✅ Listener attached to goal radios');
    }
    
    console.log('✅ Preview listeners initialized!');
}

// ====================================
// HANDLE GOOGLE PROFILE COMPLETE
// ⭐ WITH COMPLETE CALCULATION
// ====================================

async function handleGoogleProfileComplete(event) {
    event.preventDefault();
    
    console.log('📝 handleGoogleProfileComplete called');
    
    try {
        let tempGoogleUser = JSON.parse(sessionStorage.getItem('tempGoogleUser') || '{}');
        
        if (!tempGoogleUser.email) {
            const localTempUser = JSON.parse(localStorage.getItem('tempGoogleUser') || '{}');
            if (localTempUser.email) tempGoogleUser = localTempUser;
        }
        
        if (!tempGoogleUser.email) {
            const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (currentUserData.email && currentUserData.isGoogleUser) tempGoogleUser = currentUserData;
        }
        
        if (!tempGoogleUser.email && window.currentUser && window.currentUser.isGoogleUser) {
            tempGoogleUser = window.currentUser;
        }
        
        if (!tempGoogleUser.email) {
            alert('❌ Sesi Google Sign-Up habis. Silakan login ulang dengan Google.');
            if (typeof showPage === 'function') showPage('landingPage');
            return;
        }
        
        console.log('📧 Processing Google user:', tempGoogleUser.email);
        
        const namaLengkap = document.getElementById('googleNamaLengkap')?.value.trim();
        const jenisKelamin = document.querySelector('input[name="googleJenisKelamin"]:checked')?.value;
        const tempatLahir = document.getElementById('googleTempatLahir')?.value.trim();
        const tanggalLahir = document.getElementById('googleTanggalLahir')?.value;
        const golonganDarah = document.getElementById('googleGolonganDarah')?.value;
        const nomorWA = document.getElementById('googleNomorWA')?.value.trim();
        const password = document.getElementById('googlePassword')?.value;
        const passwordConfirm = document.getElementById('googlePasswordConfirm')?.value;
        const tinggiBadan = parseFloat(document.getElementById('googleTinggiBadan')?.value);
        const beratBadanAwal = parseFloat(document.getElementById('googleBeratBadanAwal')?.value);
        const goal = document.querySelector('input[name="googleGoal"]:checked')?.value;
        let beratBadanTarget = parseFloat(document.getElementById('googleBeratBadanTarget')?.value);
        
        if (goal === 'maintain') {
            beratBadanTarget = beratBadanAwal;
        }
        
        const errorDiv = document.getElementById('completeProfileError');
        if (errorDiv) errorDiv.textContent = '';
        
        // Validate password
        if (password && password.length < 6) {
            if (errorDiv) errorDiv.textContent = '❌ Password minimal 6 karakter';
            return;
        }
        
        if (password && password !== passwordConfirm) {
            if (errorDiv) errorDiv.textContent = '❌ Password tidak cocok';
            return;
        }
        
        // Validate required fields
        const requiredFields = [
            { value: namaLengkap, name: 'Nama Lengkap' },
            { value: jenisKelamin, name: 'Jenis Kelamin' },
            { value: tempatLahir, name: 'Tempat Lahir' },
            { value: tanggalLahir, name: 'Tanggal Lahir' },
            { value: golonganDarah, name: 'Golongan Darah' },
            { value: nomorWA, name: 'Nomor WhatsApp' },
            { value: tinggiBadan, name: 'Tinggi Badan' },
            { value: beratBadanAwal, name: 'Berat Badan' },
            { value: goal, name: 'Goal' }
        ];
        
        for (const field of requiredFields) {
            if (!field.value) {
                if (errorDiv) errorDiv.textContent = `❌ ${field.name} harus diisi`;
                return;
            }
        }
        
        if (goal !== 'maintain' && !beratBadanTarget) {
            if (errorDiv) errorDiv.textContent = '❌ Berat Badan Target harus diisi';
            return;
        }
        
        // Calculate calorie target
        const umur = hitungUmur(tanggalLahir);
        const bmr = hitungBMR(jenisKelamin, beratBadanAwal, tinggiBadan, umur);
        const tdee = hitungTDEE(bmr, 'light');
        const { targetKalori } = hitungTargetKalori(tdee, goal, jenisKelamin);
        
        console.log('📊 Calculated:', { umur, bmr, tdee, targetKalori });
        
        // Create complete user object
        const completeUser = {
            id: tempGoogleUser.id || `google_${Date.now()}`,
            email: tempGoogleUser.email,
            namaLengkap: namaLengkap,
            jenisKelamin: jenisKelamin,
            tempatLahir: tempatLahir,
            tanggalLahir: tanggalLahir,
            golonganDarah: golonganDarah,
            nomorWA: nomorWA,
            tinggiBadan: tinggiBadan,
            beratBadan: beratBadanAwal,
            beratBadanTarget: beratBadanTarget,
            goal: goal,
            targetKaloriHarian: targetKalori,
            bmr: bmr,
            tdee: tdee,
            isGoogleUser: true,
            hasCompletedData: true,
            picture: tempGoogleUser.picture || null,
            createdAt: tempGoogleUser.createdAt || new Date().toISOString(),
            completedDataAt: new Date().toISOString()
        };
        
        // Save to localStorage
        let users = JSON.parse(localStorage.getItem('usersDatabase') || '[]');
        const existingUserIndex = users.findIndex(u => u.email === completeUser.email);
        
        if (existingUserIndex >= 0) {
            users[existingUserIndex] = completeUser;
        } else {
            users.push(completeUser);
        }
        
        localStorage.setItem('usersDatabase', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(completeUser));
        window.currentUser = completeUser;
        
        // ⭐ UPDATE PASSWORD FOR GOOGLE USER
        if (window.supabaseClient && password) {
            console.log('🔐 Updating password for Google user:', completeUser.email);
            
            try {
                const { data: signUpData, error: signUpError } = 
                    await window.supabaseClient.auth.signUp({
                        email: tempGoogleUser.email,
                        password: password,
                        options: {
                            data: {
                                name: namaLengkap,
                                full_name: namaLengkap,
                                is_google_user: true
                            }
                        }
                    });
                
                if (signUpError) {
                    if (signUpError.message && signUpError.message.includes('already registered')) {
                        console.log('ℹ️ User already registered, trying to sign in...');
                        
                        const { data: signInData, error: signInError } = 
                            await window.supabaseClient.auth.signInWithPassword({
                                email: tempGoogleUser.email,
                                password: password
                            });
                        
                        if (signInError) {
                            console.warn('⚠️ Sign-in failed (password might be different):', signInError);
                        } else {
                            console.log('✅ Signed in successfully!');
                        }
                    } else {
                        console.error('❌ SignUp error:', signUpError);
                    }
                } else {
                    console.log('✅ Auth account created with password!');
                }
            } catch (pwErr) {
                console.error('❌ Password update exception:', pwErr);
            }
        }
        
        // ⭐ UPDATE PROFILE IN SUPABASE
        if (window.supabaseClient) {
            console.log('💾 Updating profile in Supabase:', completeUser.email);
            
            try {
                const profileData = {
                    id: completeUser.id,
                    email: completeUser.email,
                    nama_lengkap: completeUser.namaLengkap,
                    jenis_kelamin: completeUser.jenisKelamin,
                    tempat_lahir: completeUser.tempatLahir,
                    tanggal_lahir: completeUser.tanggalLahir,
                    golongan_darah: completeUser.golonganDarah,
                    nomor_wa: completeUser.nomorWA,
                    tinggi_badan: completeUser.tinggiBadan,
                    berat_badan: completeUser.beratBadan,
                    berat_badan_target: completeUser.beratBadanTarget,
                    goal: completeUser.goal,
                    has_completed_data: true,
                    is_google_user: true,
                    picture: completeUser.picture || null,
                    updated_at: new Date().toISOString()
                };
                
                const { data, error } = await window.supabaseClient
                    .from('users')
                    .update(profileData)
                    .eq('email', completeUser.email)
                    .select();
                
                if (!error && (!data || data.length === 0)) {
                    const { data: insertData, error: insertError } = await window.supabaseClient
                        .from('users')
                        .insert([profileData])
                        .select();
                    
                    if (insertError) {
                        console.error('❌ Insert error:', insertError);
                    } else {
                        console.log('✅ New user record created!');
                    }
                }
                
                if (error) {
                    console.error('❌ Supabase error:', error);
                } else {
                    console.log('✅ Saved to Supabase successfully!');
                }
            } catch (err) {
                console.error('❌ Supabase save exception:', err);
            }
        }
        
        // Clear temp data
        sessionStorage.removeItem('tempGoogleUser');
        localStorage.removeItem('tempGoogleUser');
        
        console.log('✅ Google profile completed');
        
        // Redirect to dashboard
        if (typeof goToDashboard === 'function') {
            goToDashboard();
        } else {
            window.location.href = '#dashboard';
            location.reload();
        }
        
    } catch (error) {
        console.error('❌ Complete profile error:', error);
        const errorDiv = document.getElementById('completeProfileError');
        if (errorDiv) errorDiv.textContent = '❌ Terjadi kesalahan. Coba lagi.';
    }
}

// ====================================
// EVENT LISTENERS
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    const completeProfileForm = document.getElementById('completeProfileForm');
    if (completeProfileForm) {
        completeProfileForm.addEventListener('submit', handleGoogleProfileComplete);
        console.log('✅ handleGoogleProfileComplete attached');
    }
    
    // ⭐ Initialize preview listeners for regular registration
    initPreviewListeners();
});

// Also try after a delay (for late-loaded elements)
setTimeout(function() {
    initPreviewListeners();
}, 1000);

setTimeout(function() {
    initPreviewListeners();
}, 2000);

// ====================================
// EXPOSE GLOBALLY
// ====================================

window.updateGoogleGoalInfo = updateGoogleGoalInfo;
window.updateGooglePreview = updateGooglePreview;
window.updateGoalInfo = updateGoalInfo;
window.updatePreview = updatePreview;
window.handleGoogleProfileComplete = handleGoogleProfileComplete;
window.initPreviewListeners = initPreviewListeners;

// Expose calculation functions for external use
window.hitungUmur = hitungUmur;
window.hitungBMR = hitungBMR;
window.hitungTDEE = hitungTDEE;
window.hitungTargetKalori = hitungTargetKalori;
window.estimasiWaktu = estimasiWaktu;

console.log('✅ Registration handler with COMPLETE FORMULA loaded!');
console.log('✅ updatePreview() function is now FULLY IMPLEMENTED!');