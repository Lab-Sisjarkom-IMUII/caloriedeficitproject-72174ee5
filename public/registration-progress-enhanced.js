// ============================================
// ENHANCED REGISTRATION PROGRESS SYSTEM
// Real-time validation + Auto-scroll navigation
// + Goal Preview (Ringkasan Target)
// ============================================

console.log('🎯 Loading Enhanced Registration Progress System...');

// ============================================
// ⭐ HELPER FUNCTIONS - KALORI CALCULATOR
// ============================================

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

function hitungBMR(jenisKelamin, beratBadan, tinggiBadan, umur) {
    let bmr;
    
    if (jenisKelamin === 'laki-laki') {
        bmr = 88.362 + (13.397 * beratBadan) + (4.799 * tinggiBadan) - (5.677 * umur);
    } else {
        bmr = 447.593 + (9.247 * beratBadan) + (3.098 * tinggiBadan) - (4.330 * umur);
    }
    
    return Math.round(bmr);
}

function hitungTDEE(bmr, activityLevel = 'light') {
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
    };
    
    const multiplier = activityMultipliers[activityLevel] || activityMultipliers.light;
    return Math.round(bmr * multiplier);
}

function hitungTargetKalori(tdee, goal, jenisKelamin) {
    let targetKalori;
    let defisitSurplus = 0;
    
    if (goal === 'turun') {
        defisitSurplus = -500;
        targetKalori = tdee + defisitSurplus;
        
        const minKalori = jenisKelamin === 'laki-laki' ? 1500 : 1100;
        if (targetKalori < minKalori) {
            targetKalori = minKalori;
            defisitSurplus = targetKalori - tdee;
        }
        
    } else if (goal === 'naik') {
        defisitSurplus = 400;
        targetKalori = tdee + defisitSurplus;
        
    } else {
        targetKalori = tdee;
        defisitSurplus = 0;
    }
    
    return {
        targetKalori: Math.round(targetKalori),
        defisitSurplus: Math.round(defisitSurplus)
    };
}

// ============================================
// ⭐ UPDATE PREVIEW - RINGKASAN TARGET
// ============================================

function updateRegPreview() {
    console.log('🔄 updateRegPreview called');
    
    // Get form values
    const jenisKelamin = document.querySelector('input[name="jenisKelamin"]:checked')?.value;
    const tanggalLahir = document.getElementById('regTanggalLahir')?.value;
    const tinggiBadan = parseFloat(document.getElementById('regTinggiBadan')?.value);
    const beratBadanAwal = parseFloat(document.getElementById('regBeratBadanAwal')?.value);
    const beratBadanTarget = parseFloat(document.getElementById('regBeratBadanTarget')?.value);
    const goal = document.querySelector('input[name="goal"]:checked')?.value;
    
    // Get preview element
    const goalPreview = document.getElementById('goalPreview');
    
    if (!goalPreview) {
        console.log('❌ goalPreview element not found');
        return;
    }
    
    // Check if we have enough data
    if (!jenisKelamin || !tanggalLahir || !tinggiBadan || !beratBadanAwal || !goal) {
        console.log('⚠️ Missing data for preview');
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
    
    // Calculate
    const umur = hitungUmur(tanggalLahir);
    const bmr = hitungBMR(jenisKelamin, beratBadanAwal, tinggiBadan, umur);
    const tdee = hitungTDEE(bmr, 'light');
    const { targetKalori, defisitSurplus } = hitungTargetKalori(tdee, goal, jenisKelamin);
    
    console.log('📊 Calculation:', { umur, bmr, tdee, targetKalori, goal });
    
    // Get preview elements
    const previewBBAwal = document.getElementById('previewBBAwal');
    const previewBBTarget = document.getElementById('previewBBTarget');
    const previewSelisih = document.getElementById('previewSelisih');
    const previewKalori = document.getElementById('previewKalori');
    const previewNote = document.getElementById('previewNote');
    
    // Update values
    if (previewBBAwal) previewBBAwal.textContent = `${beratBadanAwal} kg`;
    if (previewBBTarget) previewBBTarget.textContent = `${targetBB} kg`;
    
    // Selisih
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
    
    // Kalori
    if (previewKalori) {
        previewKalori.textContent = `${targetKalori} kkal/hari`;
    }
    
    // Note
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

// Make it globally available
window.updateRegPreview = updateRegPreview;
window.updatePreview = updateRegPreview; // Alias

/**
 * Main initialization function
 */
function initRegistrationProgress() {
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) {
        setTimeout(initRegistrationProgress, 500);
        return;
    }
    
    // Get progress steps container
    const progressSteps = document.getElementById('regProgressSteps');
    if (!progressSteps) {
        console.warn('⚠️ Progress steps not found');
        setTimeout(initRegistrationProgress, 500);
        return;
    }
    
    const steps = progressSteps.querySelectorAll('.step');
    const sections = [
        document.getElementById('regSection1'), // Akun
        document.getElementById('regSection2'), // Data Pribadi
        document.getElementById('regSection3'), // Data Fisik
        document.getElementById('regSection4')  // Target
    ].filter(s => s !== null);
    
    if (steps.length === 0 || sections.length === 0) {
        console.warn('⚠️ Steps or sections not found');
        setTimeout(initRegistrationProgress, 500);
        return;
    }
    
    console.log('✅ Found', steps.length, 'steps and', sections.length, 'sections');
    
    // ===== VALIDATION FUNCTIONS =====
    
    function validateSection1() {
        const email = document.getElementById('regEmail')?.value?.trim();
        const password = document.getElementById('regPassword')?.value;
        const passwordConfirm = document.getElementById('regPasswordConfirm')?.value;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValid = email && emailRegex.test(email);
        const passwordValid = password && password.length >= 6;
        const passwordMatch = password === passwordConfirm && password.length > 0;
        
        const isComplete = emailValid && passwordValid && passwordMatch;
        
        console.log('📧 Section 1 (Akun):', {
            email: emailValid ? '✅' : '❌',
            password: passwordValid ? '✅' : '❌',
            match: passwordMatch ? '✅' : '❌',
            complete: isComplete ? '✅ COMPLETE' : '❌ INCOMPLETE'
        });
        
        return isComplete;
    }
    
    function validateSection2() {
        const namaLengkap = document.getElementById('regNamaLengkap')?.value?.trim();
        const jenisKelamin = document.querySelector('input[name="jenisKelamin"]:checked');
        const tempatLahir = document.getElementById('regTempatLahir')?.value?.trim();
        const tanggalLahir = document.getElementById('regTanggalLahir')?.value;
        const golonganDarah = document.getElementById('regGolonganDarah')?.value;
        const nomorWA = document.getElementById('regNomorWA')?.value?.trim();
        
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        const nomorWAValid = nomorWA && phoneRegex.test(nomorWA);
        
        const isComplete = !!(
            namaLengkap &&
            jenisKelamin &&
            tempatLahir &&
            tanggalLahir &&
            golonganDarah &&
            nomorWAValid
        );
        
        console.log('👤 Section 2 (Data Pribadi):', {
            nama: namaLengkap ? `✅ ${namaLengkap}` : '❌',
            gender: jenisKelamin ? `✅ ${jenisKelamin.value}` : '❌',
            tempat: tempatLahir ? `✅ ${tempatLahir}` : '❌',
            tanggal: tanggalLahir ? `✅ ${tanggalLahir}` : '❌',
            darah: golonganDarah ? `✅ ${golonganDarah}` : '❌',
            wa: nomorWAValid ? `✅ ${nomorWA}` : '❌',
            complete: isComplete ? '✅ COMPLETE' : '❌ INCOMPLETE'
        });
        
        return isComplete;
    }
    
    function validateSection3() {
        const tinggiBadan = document.getElementById('regTinggiBadan')?.value;
        const beratBadanAwal = document.getElementById('regBeratBadanAwal')?.value;
        
        // Must be numeric and greater than 0
        const tinggiValid = tinggiBadan && parseInt(tinggiBadan) > 0;
        const beratValid = beratBadanAwal && parseFloat(beratBadanAwal) > 0;
        
        const isComplete = !!(tinggiValid && beratValid);
        
        console.log('📏 Section 3 (Data Fisik):', {
            tinggi: tinggiValid ? `✅ ${tinggiBadan} cm` : '❌',
            berat: beratValid ? `✅ ${beratBadanAwal} kg` : '❌',
            complete: isComplete ? '✅ COMPLETE' : '❌ INCOMPLETE'
        });
        
        return isComplete;
    }
    
    function validateSection4() {
        const goal = document.querySelector('input[name="goal"]:checked');
        const beratBadanTarget = document.getElementById('regBeratBadanTarget')?.value;
        
        const isComplete = goal && (
            goal.value === 'maintain' || 
            (beratBadanTarget && parseFloat(beratBadanTarget) > 0)
        );
        
        console.log('🎯 Section 4 (Target):', {
            goal: goal?.value || 'not set',
            target: beratBadanTarget || 'not needed',
            complete: isComplete ? '✅ COMPLETE' : '❌ INCOMPLETE'
        });
        
        return isComplete;
    }
    
    function updateProgressSteps() {
        console.log('🔄 Updating progress steps...');
        
        const section1Complete = validateSection1();
        const section2Complete = validateSection2();
        const section3Complete = validateSection3();
        const section4Complete = validateSection4();
        
        // Update Step 1
        if (steps[0]) {
            steps[0].classList.remove('active', 'completed');
            if (section1Complete) {
                steps[0].classList.add('completed');
            } else {
                steps[0].classList.add('active');
            }
        }
        
        // Update Step 2
        if (steps[1]) {
            steps[1].classList.remove('active', 'completed');
            if (section2Complete) {
                steps[1].classList.add('completed');
            } else if (section1Complete) {
                steps[1].classList.add('active');
            }
        }
        
        // Update Step 3
        if (steps[2]) {
            steps[2].classList.remove('active', 'completed');
            if (section3Complete) {
                steps[2].classList.add('completed');
            } else if (section1Complete && section2Complete) {
                steps[2].classList.add('active');
            }
        }
        
        // Update Step 4
        if (steps[3]) {
            steps[3].classList.remove('active', 'completed');
            if (section4Complete) {
                steps[3].classList.add('completed');
            } else if (section1Complete && section2Complete && section3Complete) {
                steps[3].classList.add('active');
            }
        }
        
        // ⭐ ALSO UPDATE PREVIEW!
        updateRegPreview();
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
    
    function scrollToSection(index) {
        if (!sections[index]) {
            console.error('❌ Section', index, 'not found');
            return;
        }
        
        console.log('📜 Scrolling to section', index + 1);
        
        const scrollContainer = registerForm.querySelector('.form-container');
        
        if (!scrollContainer) {
            console.error('❌ Scrollable container not found!');
            sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        
        const sectionTop = sections[index].offsetTop - scrollContainer.offsetTop;
        
        scrollContainer.scrollTo({
            top: sectionTop - 20,
            behavior: 'smooth'
        });
    }
    
    // Click handlers for steps
    steps.forEach((step, index) => {
        step.style.cursor = 'pointer';
        
        step.addEventListener('click', function() {
            console.log('🖱️ Clicked step', index + 1);
            scrollToSection(index);
        });
    });
    
    // Listen to all input changes
    const allInputs = registerForm.querySelectorAll('input, select');
    
    allInputs.forEach(input => {
        input.addEventListener('input', updateProgressSteps);
        input.addEventListener('change', updateProgressSteps);
        input.addEventListener('blur', updateProgressSteps); // 🆕 Add blur for better reliability
    });
    
    // Initial update
    updateProgressSteps();
    
    console.log('✅ Registration progress system initialized with preview!');
}

// ===== PASSWORD VALIDATION =====

function initPasswordValidation() {
    const passwordField = document.getElementById('regPassword');
    const confirmField = document.getElementById('regPasswordConfirm');
    
    if (!passwordField || !confirmField) {
        setTimeout(initPasswordValidation, 500);
        return;
    }
    
    function validatePasswords() {
        const password = passwordField.value;
        const confirm = confirmField.value;
        
        // Password field validation
        if (password.length === 0) {
            passwordField.style.borderColor = '';
            passwordField.style.backgroundColor = '';
        } else if (password.length >= 6) {
            passwordField.style.borderColor = '#10b981';
            passwordField.style.backgroundColor = '#f0fdf4';
        } else {
            passwordField.style.borderColor = '#ef4444';
            passwordField.style.backgroundColor = '#fef2f2';
        }
        
        // Confirm field validation
        if (confirm.length > 0) {
            if (confirm === password && password.length >= 6) {
                confirmField.style.borderColor = '#10b981';
                confirmField.style.backgroundColor = '#f0fdf4';
            } else {
                confirmField.style.borderColor = '#ef4444';
                confirmField.style.backgroundColor = '#fef2f2';
            }
        } else {
            confirmField.style.borderColor = '';
            confirmField.style.backgroundColor = '';
        }
    }
    
    passwordField.addEventListener('input', validatePasswords);
    confirmField.addEventListener('input', validatePasswords);
    
    console.log('✅ Password validation initialized');
}

// ===== NOMOR WA VALIDATION =====

function initNomorWAValidation() {
    const nomorWAField = document.getElementById('regNomorWA');
    
    if (!nomorWAField) {
        setTimeout(initNomorWAValidation, 500);
        return;
    }
    
    function validateNomorWA() {
        const nomorWA = nomorWAField.value.trim();
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        
        if (nomorWA.length === 0) {
            nomorWAField.style.borderColor = '';
            nomorWAField.style.backgroundColor = '';
        } else if (phoneRegex.test(nomorWA)) {
            nomorWAField.style.borderColor = '#10b981';
            nomorWAField.style.backgroundColor = '#f0fdf4';
        } else {
            nomorWAField.style.borderColor = '#ef4444';
            nomorWAField.style.backgroundColor = '#fef2f2';
        }
    }
    
    nomorWAField.addEventListener('input', validateNomorWA);
    nomorWAField.addEventListener('blur', validateNomorWA);
    
    nomorWAField.addEventListener('focus', function() {
        if (nomorWAField.value.includes('@')) {
            nomorWAField.value = '';
            validateNomorWA();
        }
    });
    
    console.log('✅ Nomor WA validation initialized');
}

// ===== GOAL SELECTION + PREVIEW =====

function initGoalSelection() {
    const goalInputs = document.querySelectorAll('input[name="goal"]');
    const targetWeightGroup = document.getElementById('regBeratBadanTarget')?.closest('.form-group');
    
    if (goalInputs.length === 0) {
        setTimeout(initGoalSelection, 500);
        return;
    }
    
    function updateTargetWeightVisibility() {
        const selectedGoal = document.querySelector('input[name="goal"]:checked');
        
        if (targetWeightGroup) {
            if (selectedGoal && selectedGoal.value === 'maintain') {
                targetWeightGroup.style.display = 'none';
                console.log('🎯 Goal: Maintain → Target weight hidden');
            } else {
                targetWeightGroup.style.display = 'block';
                console.log('🎯 Goal:', selectedGoal?.value, '→ Target weight visible');
            }
        }
        
        // ⭐ UPDATE PREVIEW when goal changes!
        updateRegPreview();
    }
    
    goalInputs.forEach(input => {
        input.addEventListener('change', updateTargetWeightVisibility);
    });
    
    // Initial check
    updateTargetWeightVisibility();
    
    console.log('✅ Goal selection handler initialized');
}

// ===== PREVIEW LISTENERS =====

function initPreviewListeners() {
    console.log('🔄 Initializing preview listeners...');
    
    const fieldIds = [
        'regTanggalLahir',
        'regTinggiBadan', 
        'regBeratBadanAwal',
        'regBeratBadanTarget'
    ];
    
    fieldIds.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateRegPreview);
            field.addEventListener('change', updateRegPreview);
            console.log(`✅ Preview listener attached to ${fieldId}`);
        }
    });
    
    // Gender radios
    const genderRadios = document.querySelectorAll('input[name="jenisKelamin"]');
    genderRadios.forEach(radio => {
        radio.addEventListener('change', updateRegPreview);
    });
    if (genderRadios.length > 0) {
        console.log('✅ Preview listener attached to jenisKelamin');
    }
    
    // Goal radios
    const goalRadios = document.querySelectorAll('input[name="goal"]');
    goalRadios.forEach(radio => {
        radio.addEventListener('change', updateRegPreview);
    });
    if (goalRadios.length > 0) {
        console.log('✅ Preview listener attached to goal');
    }
    
    console.log('✅ Preview listeners initialized!');
}

// ===== INITIALIZE ALL =====

function initAll() {
    console.log('🔄 Initializing Enhanced Registration Progress...');
    initRegistrationProgress();
    initPasswordValidation();
    initNomorWAValidation();
    initGoalSelection();
    initPreviewListeners();
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initAll();
        setTimeout(initAll, 500);
        setTimeout(initAll, 1500);
        setTimeout(initAll, 3000);
    });
} else {
    initAll();
    setTimeout(initAll, 500);
    setTimeout(initAll, 1500);
    setTimeout(initAll, 3000);
}

// Watch for form visibility changes
const regProgressObserver = new MutationObserver(function(mutations) {
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) return;
    
    const isVisible = registerForm.style.display !== 'none' && 
                     registerForm.offsetParent !== null;
    
    if (isVisible && !registerForm.dataset.progressInitialized) {
        console.log('🎯 Register form is now visible - initializing...');
        registerForm.dataset.progressInitialized = 'true';
        
        setTimeout(() => {
            initAll();
            console.log('✅ Progress system initialized!');
        }, 100);
    }
});

regProgressObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
});

console.log('✅ Enhanced Registration Progress System loaded!');
console.log('📋 Features:');
console.log('  ✓ Real-time validation');
console.log('  ✓ Click steps to navigate');
console.log('  ✓ Auto-scroll on completion');
console.log('  ✓ ⭐ Goal Preview (Ringkasan Target)');