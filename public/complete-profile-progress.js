// ============================================
// COMPLETE PROFILE PROGRESS - ULTIMATE FIX
// Logic:
// - UNGU (active) = Step pertama yang BELUM LENGKAP
// - CENTANG (completed) = Step yang sudah LENGKAP
// ============================================

console.log('🟢 Loading Complete Profile Progress (Ultimate Fix)...');

// Flag to prevent multiple initializations
let progressInitialized = false;

function initCompleteProfileProgress() {
    // Prevent double init
    if (progressInitialized) {
        console.log('⚠️ Progress already initialized, skipping...');
        return;
    }
    
    // Only run on Complete Profile Page
    const completeProfilePage = document.getElementById('completeProfilePage');
    if (!completeProfilePage) {
        console.log('ℹ️ Not on Complete Profile page');
        return;
    }
    
    const form = document.getElementById('completeProfileForm');
    if (!form) {
        console.log('⏳ Form not found, retrying...');
        setTimeout(initCompleteProfileProgress, 500);
        return;
    }
    
    const steps = completeProfilePage.querySelectorAll('.progress-steps .step');
    const sections = form.querySelectorAll('.form-section');
    
    if (steps.length === 0) {
        console.log('⏳ Steps not found, retrying...');
        setTimeout(initCompleteProfileProgress, 500);
        return;
    }
    
    progressInitialized = true;
    console.log('✅ Found', steps.length, 'steps and', sections.length, 'sections');
    
    // ====================================
    // CHECK SECTION 1: DATA PRIBADI
    // ====================================
    function isSection1Complete() {
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
        
        // Debug each field
        console.log('📋 Section 1 Check:');
        console.log('   Nama Lengkap:', namaLengkap ? '✅' : '❌', `"${namaLengkap || ''}"`);
        console.log('   Jenis Kelamin:', jenisKelamin ? '✅' : '❌', jenisKelamin?.value || '(none)');
        console.log('   Tempat Lahir:', tempatLahir ? '✅' : '❌', `"${tempatLahir || ''}"`);
        console.log('   Tanggal Lahir:', tanggalLahir ? '✅' : '❌', tanggalLahir || '(none)');
        console.log('   Golongan Darah:', golonganDarah ? '✅' : '❌', golonganDarah || '(none)');
        console.log('   Nomor WA:', nomorWAValid ? '✅' : '❌', `"${nomorWA || ''}" (format: ${nomorWAValid ? 'valid' : 'invalid'})`);
        console.log('   Password:', passwordValid ? '✅' : '❌', `(${password?.length || 0} chars, match: ${password === passwordConfirm})`);
        
        const isComplete = !!(
            namaLengkap &&
            jenisKelamin &&
            tempatLahir &&
            tanggalLahir &&
            golonganDarah &&
            nomorWAValid &&
            passwordValid
        );
        
        console.log('   → Section 1:', isComplete ? '✅ COMPLETE' : '❌ INCOMPLETE');
        return isComplete;
    }
    
    // ====================================
    // CHECK SECTION 2: DATA FISIK
    // ====================================
    function isSection2Complete() {
        const tinggiBadan = document.getElementById('googleTinggiBadan')?.value?.trim();
        const beratBadanAwal = document.getElementById('googleBeratBadanAwal')?.value?.trim();
        
        console.log('📋 Section 2 Check:');
        console.log('   Tinggi Badan:', tinggiBadan ? '✅' : '❌', tinggiBadan || '(empty)');
        console.log('   Berat Badan:', beratBadanAwal ? '✅' : '❌', beratBadanAwal || '(empty)');
        
        const isComplete = !!(tinggiBadan && beratBadanAwal);
        
        console.log('   → Section 2:', isComplete ? '✅ COMPLETE' : '❌ INCOMPLETE');
        return isComplete;
    }
    
    // ====================================
    // CHECK SECTION 3: TARGET
    // ====================================
    function isSection3Complete() {
        const goal = document.querySelector('input[name="googleGoal"]:checked');
        const beratTarget = document.getElementById('googleBeratBadanTarget')?.value?.trim();
        
        console.log('📋 Section 3 Check:');
        console.log('   Goal:', goal ? '✅' : '❌', goal?.value || '(none)');
        
        if (!goal) {
            console.log('   → Section 3: ❌ INCOMPLETE (no goal)');
            return false;
        }
        
        // If maintain, no target needed
        if (goal.value === 'maintain') {
            console.log('   Berat Target: ✅ (not needed for maintain)');
            console.log('   → Section 3: ✅ COMPLETE');
            return true;
        }
        
        console.log('   Berat Target:', beratTarget ? '✅' : '❌', beratTarget || '(empty)');
        
        const isComplete = !!beratTarget;
        console.log('   → Section 3:', isComplete ? '✅ COMPLETE' : '❌ INCOMPLETE');
        return isComplete;
    }
    
    // ====================================
    // UPDATE STEP INDICATORS
    // ====================================
    function updateSteps() {
        console.log('\n🔄 ═══════════════════════════════════');
        console.log('🔄 UPDATING PROGRESS STEPS');
        console.log('🔄 ═══════════════════════════════════');
        
        // Check each section
        const section1Done = isSection1Complete();
        const section2Done = isSection2Complete();
        const section3Done = isSection3Complete();
        
        // Find first incomplete step
        let firstIncomplete = 0;
        if (section1Done) firstIncomplete = 1;
        if (section1Done && section2Done) firstIncomplete = 2;
        if (section1Done && section2Done && section3Done) firstIncomplete = 3; // All done!
        
        console.log('\n📍 First incomplete step:', firstIncomplete < 3 ? firstIncomplete + 1 : 'ALL DONE!');
        
        // Update each step
        steps.forEach((step, index) => {
            // Remove all classes first
            step.classList.remove('active', 'completed');
            
            if (index < firstIncomplete) {
                // Completed → green checkmark
                step.classList.add('completed');
                console.log(`✅ Step ${index + 1} → COMPLETED (green)`);
            } else if (index === firstIncomplete && firstIncomplete < 3) {
                // First incomplete → purple active
                step.classList.add('active');
                console.log(`🟣 Step ${index + 1} → ACTIVE (purple)`);
            } else {
                // Future or all done → gray
                console.log(`⚪ Step ${index + 1} → INACTIVE (gray)`);
            }
        });
        
        console.log('═══════════════════════════════════════\n');
    }
    
    // ====================================
    // ATTACH EVENT LISTENERS
    // ====================================
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        // Use both input and change for different input types
        input.addEventListener('input', updateSteps);
        input.addEventListener('change', updateSteps);
    });
    
    console.log('✅ Attached listeners to', inputs.length, 'inputs');
    
    // ====================================
    // CLICK TO SCROLL
    // ====================================
    steps.forEach((step, index) => {
        step.style.cursor = 'pointer';
        step.addEventListener('click', function(e) {
            e.preventDefault();
            if (sections[index]) {
                sections[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                console.log('🖱️ Clicked step', index + 1);
            }
        });
    });
    
    // ====================================
    // INITIAL + DELAYED CHECKS
    // ====================================
    console.log('🚀 Running initial check...');
    updateSteps();
    
    // Delayed checks for autofill/prefill
    setTimeout(updateSteps, 500);
    setTimeout(updateSteps, 1500);
    setTimeout(updateSteps, 3000);
    
    console.log('✅ Complete Profile Progress initialized!');
}

// ====================================
// INITIALIZATION
// ====================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initCompleteProfileProgress, 100);
    });
} else {
    setTimeout(initCompleteProfileProgress, 100);
}

// Re-init when page visibility changes (for SPA)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && document.getElementById('completeProfilePage')) {
        progressInitialized = false;
        setTimeout(initCompleteProfileProgress, 100);
    }
});

console.log('✅ Complete Profile Progress script loaded!');