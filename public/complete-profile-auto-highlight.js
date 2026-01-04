// ========================================
// COMPLETE PROFILE - PROGRESS & VALIDATION
// FIXED: Completion-based (bukan scroll-based)
// Logic:
// - UNGU (active) = Step pertama yang BELUM LENGKAP
// - CENTANG (completed) = Step yang sudah LENGKAP
// ========================================

console.log('🔵 Loading Complete Profile Progress & Validation...');

// Flag to prevent multiple initializations
let highlightInitialized = false;

function initCompleteProfileHighlight() {
    // Prevent double init
    if (highlightInitialized) {
        console.log('⚠️ Already initialized, skipping...');
        return;
    }
    
    const completeProfilePage = document.getElementById('completeProfilePage');
    const completeProfileForm = document.getElementById('completeProfileForm');
    
    if (!completeProfilePage || !completeProfileForm) {
        console.log('⚠️ Complete Profile page/form not found, retrying in 500ms...');
        setTimeout(initCompleteProfileHighlight, 500);
        return;
    }
    
    // ⭐ CHECK: Only run if page is VISIBLE
    const isVisible = completeProfilePage.style.display !== 'none' && 
                      !completeProfilePage.hidden &&
                      completeProfilePage.offsetParent !== null;
    
    if (!isVisible) {
        console.log('ℹ️ Complete Profile page exists but is HIDDEN, skipping...');
        // Retry later in case page becomes visible
        setTimeout(initCompleteProfileHighlight, 1000);
        return;
    }
    
    // Get steps and sections
    const progressStepsContainer = completeProfilePage.querySelector('.progress-steps');
    if (!progressStepsContainer) {
        console.log('⚠️ Progress steps container not found, retrying in 500ms...');
        setTimeout(initCompleteProfileHighlight, 500);
        return;
    }
    
    const steps = progressStepsContainer.querySelectorAll('.step');
    const sections = completeProfileForm.querySelectorAll('.form-section');
    
    if (steps.length === 0 || sections.length === 0) {
        console.log('⚠️ No steps or sections found, retrying in 500ms...');
        setTimeout(initCompleteProfileHighlight, 500);
        return;
    }
    
    highlightInitialized = true;
    console.log('✅ Found:', steps.length, 'steps and', sections.length, 'sections');
    
    // ========================================
    // CHECK SECTION COMPLETION
    // ========================================
    
    function isSection1Complete() {
        // Section 1: Data Pribadi
        const namaLengkap = document.getElementById('googleNamaLengkap')?.value?.trim();
        const jenisKelamin = document.querySelector('input[name="googleJenisKelamin"]:checked');
        const tempatLahir = document.getElementById('googleTempatLahir')?.value?.trim();
        const tanggalLahir = document.getElementById('googleTanggalLahir')?.value;
        const golonganDarah = document.getElementById('googleGolonganDarah')?.value;
        const nomorWA = document.getElementById('googleNomorWA')?.value?.trim();
        const password = document.getElementById('googlePassword')?.value;
        const passwordConfirm = document.getElementById('googlePasswordConfirm')?.value;
        
        // Validations
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        const nomorWAValid = nomorWA && phoneRegex.test(nomorWA);
        const passwordValid = password && password.length >= 6 && password === passwordConfirm;
        
        // ⭐ DEBUG: Log setiap field
        console.log('📋 Section 1 Debug:');
        console.log('   Nama:', namaLengkap ? '✅' : '❌', `"${namaLengkap || ''}"`);
        console.log('   Jenis Kelamin:', jenisKelamin ? '✅' : '❌', jenisKelamin?.value || '(none)');
        console.log('   Tempat Lahir:', tempatLahir ? '✅' : '❌', `"${tempatLahir || ''}"`);
        console.log('   Tanggal Lahir:', tanggalLahir ? '✅' : '❌', tanggalLahir || '(none)');
        console.log('   Golongan Darah:', golonganDarah ? '✅' : '❌', golonganDarah || '(none)');
        console.log('   Nomor WA:', nomorWAValid ? '✅' : '❌', `"${nomorWA || ''}" (valid: ${nomorWAValid})`);
        console.log('   Password:', passwordValid ? '✅' : '❌', `(${password?.length || 0} chars, match: ${password === passwordConfirm})`);
        
        return !!(namaLengkap && jenisKelamin && tempatLahir && tanggalLahir && golonganDarah && nomorWAValid && passwordValid);
    }
    
    function isSection2Complete() {
        // Section 2: Data Fisik
        const tinggiBadan = document.getElementById('googleTinggiBadan')?.value?.trim();
        const beratBadanAwal = document.getElementById('googleBeratBadanAwal')?.value?.trim();
        
        return !!(tinggiBadan && beratBadanAwal);
    }
    
    function isSection3Complete() {
        // Section 3: Target
        const goal = document.querySelector('input[name="googleGoal"]:checked');
        if (!goal) return false;
        
        // If maintain, no target needed
        if (goal.value === 'maintain') return true;
        
        // Otherwise need target weight
        const beratTarget = document.getElementById('googleBeratBadanTarget')?.value?.trim();
        return !!beratTarget;
    }
    
    // ========================================
    // UPDATE PROGRESS STEPS (COMPLETION-BASED)
    // Logic:
    // - Centang hijau = Section yang SUDAH LENGKAP (tidak peduli urutan)
    // - Ungu = Section pertama yang BELUM LENGKAP
    // ========================================
    
    function updateActiveStep() {
        // Check completion status untuk setiap section
        const section1Done = isSection1Complete();
        const section2Done = isSection2Complete();
        const section3Done = isSection3Complete();
        
        console.log('📊 Completion Status:');
        console.log('   Section 1 (Data Pribadi):', section1Done ? '✅' : '❌');
        console.log('   Section 2 (Data Fisik):', section2Done ? '✅' : '❌');
        console.log('   Section 3 (Target):', section3Done ? '✅' : '❌');
        
        // Find first incomplete step (untuk ungu)
        let firstIncomplete = -1;
        if (!section1Done) firstIncomplete = 0;
        else if (!section2Done) firstIncomplete = 1;
        else if (!section3Done) firstIncomplete = 2;
        // Jika semua lengkap, firstIncomplete = -1
        
        // Array completion status
        const completionStatus = [section1Done, section2Done, section3Done];
        
        // Update each step
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (completionStatus[index]) {
                // Section ini SUDAH LENGKAP → centang hijau
                step.classList.add('completed');
                console.log(`✅ Step ${index + 1} → COMPLETED (green)`);
            } else if (index === firstIncomplete) {
                // Section ini adalah yang PERTAMA BELUM LENGKAP → ungu
                step.classList.add('active');
                console.log(`🟣 Step ${index + 1} → ACTIVE (purple)`);
            } else {
                // Section belum lengkap tapi bukan yang pertama → abu-abu
                console.log(`⚪ Step ${index + 1} → INACTIVE (gray)`);
            }
        });
        
        // Log summary
        const completedCount = completionStatus.filter(s => s).length;
        console.log(`📊 Summary: ${completedCount}/3 completed, First incomplete: ${firstIncomplete + 1 || 'ALL DONE!'}`);
    }
    
    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    // Click to scroll
    steps.forEach((step, index) => {
        step.style.cursor = 'pointer';
        
        step.addEventListener('click', function() {
            console.log('🖱️ Step', index + 1, 'clicked');
            
            if (sections[index]) {
                sections[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('✅ Click handlers attached to', steps.length, 'steps');
    
    // Input change listeners
    const allInputs = completeProfileForm.querySelectorAll('input, select');

    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            updateActiveStep();
            // Also trigger preview update if exists
            if (typeof updateGooglePreview === 'function') {
                updateGooglePreview();
            }
        });
        
        input.addEventListener('change', function() {
            updateActiveStep();
            if (typeof updateGooglePreview === 'function') {
                updateGooglePreview();
            }
        });
    });
    
    console.log('✅ Input listeners attached to', allInputs.length, 'inputs');
    
    // ========================================
    // INITIAL + DELAYED CHECKS
    // ========================================
    
    console.log('🔄 Running initial validation...');
    updateActiveStep();
    
    // Delayed validations for autofill
    setTimeout(updateActiveStep, 500);
    setTimeout(updateActiveStep, 1500);
    setTimeout(updateActiveStep, 3000);
    
    console.log('✅✅✅ Complete Profile highlight fully initialized! ✅✅✅');
}

// ========================================
// FORM VALIDATION BEFORE SUBMIT
// ========================================

function initFormValidation() {
    const completeProfileForm = document.getElementById('completeProfileForm');
    
    if (!completeProfileForm) {
        setTimeout(initFormValidation, 500);
        return;
    }
    
    completeProfileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        console.log('📋 Form submit - validating...');
        
        const namaLengkap = document.getElementById('googleNamaLengkap')?.value;
        const jenisKelamin = document.querySelector('input[name="googleJenisKelamin"]:checked');
        const tempatLahir = document.getElementById('googleTempatLahir')?.value;
        const tanggalLahir = document.getElementById('googleTanggalLahir')?.value;
        const golonganDarah = document.getElementById('googleGolonganDarah')?.value;
        const nomorWA = document.getElementById('googleNomorWA')?.value;
        const tinggiBadan = document.getElementById('googleTinggiBadan')?.value;
        const beratBadanAwal = document.getElementById('googleBeratBadanAwal')?.value;
        const goal = document.querySelector('input[name="googleGoal"]:checked');
        const beratBadanTarget = document.getElementById('googleBeratBadanTarget')?.value;
        
        const errors = [];
        
        if (!namaLengkap) errors.push('Nama Lengkap');
        if (!jenisKelamin) errors.push('Jenis Kelamin');
        if (!tempatLahir) errors.push('Tempat Lahir');
        if (!tanggalLahir) errors.push('Tanggal Lahir');
        if (!golonganDarah) errors.push('Golongan Darah');
        if (!nomorWA) errors.push('Nomor WhatsApp');
        if (!tinggiBadan) errors.push('Tinggi Badan');
        if (!beratBadanAwal) errors.push('Berat Badan Awal');
        if (!goal) errors.push('Tujuan (Goal)');
        
        if (goal && goal.value !== 'maintain' && !beratBadanTarget) {
            errors.push('Berat Badan Target');
        }
        
        if (errors.length > 0) {
            const errorElement = document.getElementById('completeProfileError');
            if (errorElement) {
                errorElement.textContent = '❌ Harap lengkapi: ' + errors.join(', ');
                errorElement.style.display = 'block';
            }
            
            console.log('❌ Validation failed:', errors);
            return false;
        }
        
        console.log('✅ All fields valid - calling handleGoogleProfileComplete()');
        
        const errorElement = document.getElementById('completeProfileError');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        if (typeof handleGoogleProfileComplete === 'function') {
            handleGoogleProfileComplete(event);
        } else {
            console.error('❌ handleGoogleProfileComplete not found!');
        }
    });
    
    console.log('✅ Form validation initialized');
}

// ========================================
// INITIALIZATION
// ========================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initCompleteProfileHighlight();
        initFormValidation();
    });
} else {
    initCompleteProfileHighlight();
    initFormValidation();
}

// Re-init when page visibility changes (for SPA)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && document.getElementById('completeProfilePage')) {
        highlightInitialized = false;
        setTimeout(initCompleteProfileHighlight, 100);
    }
});

console.log('✅ Complete Profile Auto-highlight Script Loaded');