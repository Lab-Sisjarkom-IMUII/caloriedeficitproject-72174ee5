// ============================================
// FORCE PROGRESS UPDATE - DEBUG & AUTO-FIX
// ONLY for Registration Form (4 steps)
// SKIP for Complete Profile (3 steps)
// ============================================

console.log('🔄 Force Progress Update loading...');

// Run field discovery first
function discoverAllFields() {
    console.log('🔍 === FIELD DISCOVERY ===');
    
    const allInputs = document.querySelectorAll('input, select, textarea');
    
    console.log('📝 Total inputs found:', allInputs.length);
    console.log('');
    
    // Group by type
    const fieldsByType = {
        email: [],
        password: [],
        text: [],
        number: [],
        date: [],
        radio: [],
        select: []
    };
    
    allInputs.forEach((input, index) => {
        const type = input.type || 'select';
        const id = input.id || '';
        const name = input.name || '';
        const value = input.value || '';
        
        const fieldInfo = {
            index,
            type,
            id,
            name,
            value: value.substring(0, 20), // First 20 chars
            element: input
        };
        
        if (type === 'email') fieldsByType.email.push(fieldInfo);
        else if (type === 'password') fieldsByType.password.push(fieldInfo);
        else if (type === 'text') fieldsByType.text.push(fieldInfo);
        else if (type === 'number') fieldsByType.number.push(fieldInfo);
        else if (type === 'date') fieldsByType.date.push(fieldInfo);
        else if (type === 'radio') fieldsByType.radio.push(fieldInfo);
        else if (input.tagName === 'SELECT') fieldsByType.select.push(fieldInfo);
    });
    
    // Log each type
    Object.keys(fieldsByType).forEach(type => {
        if (fieldsByType[type].length > 0) {
            console.log(`📋 ${type.toUpperCase()} fields (${fieldsByType[type].length}):`);
            fieldsByType[type].forEach(field => {
                console.log(`   [${field.index}] ID: "${field.id}", Name: "${field.name}", Value: "${field.value}"`);
            });
            console.log('');
        }
    });
    
    return fieldsByType;
}

function updateProgressSteps() {
    // ⭐ SKIP jika di Complete Profile page (3 steps)
    const completeProfilePage = document.getElementById('completeProfilePage');
    if (completeProfilePage) {
        // Complete Profile punya script sendiri
        return;
    }
    
    // ⭐ ONLY run for Registration Form (4 steps)
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) {
        return;
    }
    
    const steps = registerForm.querySelectorAll('.progress-steps .step');
    
    if (steps.length === 0 || steps.length !== 4) {
        // Not registration form (should have exactly 4 steps)
        return;
    }
    
    console.log('📊 === REGISTRATION FORM VALIDATION ===');
    
    // === SECTION 1: AKUN ===
    
    const emailField = document.getElementById('regEmail') ||
                      document.querySelector('#registerForm input[type="email"]');
    
    const passwordField = document.getElementById('regPassword') ||
                         document.querySelector('#registerForm input[name="password"]');
    
    const passwordConfirmField = document.getElementById('regPasswordConfirm') ||
                                document.querySelector('#registerForm input[name="passwordConfirm"]');
    
    if (!emailField || !passwordField || !passwordConfirmField) {
        console.log('❌ Section 1 fields not found!');
        return;
    }
    
    const email = emailField.value?.trim() || '';
    const password = passwordField.value || '';
    const passwordConfirm = passwordConfirmField.value || '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(email);
    const passwordValid = password && password.length >= 6 && password === passwordConfirm;
    const section1Complete = emailValid && passwordValid;
    
    console.log('1️⃣ SECTION 1 (Akun):');
    console.log('   Email:', emailValid ? '✅' : '❌', email);
    console.log('   Password:', passwordValid ? '✅' : '❌', `(${password.length} chars)`);
    console.log('   Complete:', section1Complete ? '✅ YES' : '❌ NO');
    
    // === SECTION 2: DATA PRIBADI ===
    
    const namaLengkapField = document.getElementById('regNamaLengkap') ||
                            document.querySelector('#registerForm input[name="namaLengkap"]');
    
    const jenisKelamin = document.querySelector('#registerForm input[name="jenisKelamin"]:checked');
    
    const tempatLahirField = document.getElementById('regTempatLahir') ||
                            document.querySelector('#registerForm input[name="tempatLahir"]');
    
    const tanggalLahirField = document.getElementById('regTanggalLahir') ||
                             document.querySelector('#registerForm input[name="tanggalLahir"]');
    
    const golonganDarahField = document.getElementById('regGolonganDarah') ||
                              document.querySelector('#registerForm select[name="golonganDarah"]');
    
    const nomorWAField = document.getElementById('regNomorWA') ||
                        document.querySelector('#registerForm input[name="nomorWA"]');
    
    const namaLengkap = namaLengkapField?.value || '';
    const tempatLahir = tempatLahirField?.value || '';
    const tanggalLahir = tanggalLahirField?.value || '';
    const golonganDarah = golonganDarahField?.value || '';
    const nomorWA = nomorWAField?.value?.trim() || '';
    
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    const nomorWAValid = phoneRegex.test(nomorWA);
    
    const section2Complete = !!(
        namaLengkap &&
        jenisKelamin &&
        tempatLahir &&
        tanggalLahir &&
        golonganDarah &&
        nomorWAValid
    );
    
    console.log('2️⃣ SECTION 2 (Data Pribadi):');
    console.log('   Nama:', namaLengkap ? '✅' : '❌');
    console.log('   Jenis Kelamin:', jenisKelamin ? '✅' : '❌');
    console.log('   Tempat Lahir:', tempatLahir ? '✅' : '❌');
    console.log('   Tanggal Lahir:', tanggalLahir ? '✅' : '❌');
    console.log('   Golongan Darah:', golonganDarah ? '✅' : '❌');
    console.log('   Nomor WA:', nomorWAValid ? '✅' : '❌', nomorWA);
    console.log('   Complete:', section2Complete ? '✅ YES' : '❌ NO');
    
    // === SECTION 3: DATA FISIK ===
    
    const tinggiBadanField = document.getElementById('regTinggiBadan') ||
                            document.querySelector('#registerForm input[name="tinggiBadan"]');
    
    const beratBadanAwalField = document.getElementById('regBeratBadanAwal') ||
                               document.querySelector('#registerForm input[name="beratBadanAwal"]');
    
    const tinggiBadan = tinggiBadanField?.value || '';
    const beratBadanAwal = beratBadanAwalField?.value || '';
    const section3Complete = !!(tinggiBadan && beratBadanAwal);
    
    console.log('3️⃣ SECTION 3 (Data Fisik):');
    console.log('   Tinggi Badan:', tinggiBadan ? '✅' : '❌', tinggiBadan, 'cm');
    console.log('   Berat Badan:', beratBadanAwal ? '✅' : '❌', beratBadanAwal, 'kg');
    console.log('   Complete:', section3Complete ? '✅ YES' : '❌ NO');
    
    // === SECTION 4: TARGET ===
    
    const goal = document.querySelector('#registerForm input[name="goal"]:checked');
    
    const beratTargetField = document.getElementById('regBeratBadanTarget') ||
                            document.querySelector('#registerForm input[name="beratBadanTarget"]');
    
    const beratTarget = beratTargetField?.value || '';
    const section4Complete = goal && (goal.value === 'maintain' || beratTarget);
    
    console.log('4️⃣ SECTION 4 (Target):');
    console.log('   Goal:', goal ? '✅' : '❌', goal?.value || '(not selected)');
    console.log('   Berat Target:', beratTarget || '(not needed if maintain)');
    console.log('   Complete:', section4Complete ? '✅ YES' : '❌ NO');
    
    // === UPDATE STEPS ===
    
    console.log('🔄 Updating step indicators...');
    
    // Find first incomplete step
    let firstIncomplete = 0;
    if (section1Complete) firstIncomplete = 1;
    if (section1Complete && section2Complete) firstIncomplete = 2;
    if (section1Complete && section2Complete && section3Complete) firstIncomplete = 3;
    if (section1Complete && section2Complete && section3Complete && section4Complete) firstIncomplete = 4;
    
    // Update each step
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        
        if (index < firstIncomplete) {
            step.classList.add('completed');
            console.log(`✅ Step ${index + 1} → COMPLETED`);
        } else if (index === firstIncomplete && firstIncomplete < 4) {
            step.classList.add('active');
            console.log(`🟣 Step ${index + 1} → ACTIVE`);
        }
    });
    
    console.log('═══════════════════════════════════');
}

function setupEventListeners() {
    // ⭐ SKIP jika di Complete Profile page
    const completeProfilePage = document.getElementById('completeProfilePage');
    if (completeProfilePage) {
        console.log('ℹ️ Force Progress Update: Skipping for Complete Profile page');
        return;
    }
    
    // ⭐ ONLY for Registration Form
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) {
        // Not on registration page, retry later
        setTimeout(setupEventListeners, 1000);
        return;
    }
    
    console.log('🎧 Setting up event listeners for Registration Form...');
    
    const inputs = registerForm.querySelectorAll('input, select, textarea');
    
    console.log('📝 Attaching listeners to', inputs.length, 'fields');
    
    if (inputs.length === 0) {
        setTimeout(setupEventListeners, 1000);
        return;
    }
    
    inputs.forEach(input => {
        input.addEventListener('input', updateProgressSteps);
        input.addEventListener('change', updateProgressSteps);
        input.addEventListener('blur', updateProgressSteps);
    });
    
    console.log('✅ Event listeners attached');
    
    // Initial checks
    setTimeout(updateProgressSteps, 500);
    setTimeout(updateProgressSteps, 2000);
    setTimeout(updateProgressSteps, 5000);
}

function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupEventListeners);
    } else {
        setupEventListeners();
    }
    
    const observer = new MutationObserver(() => {
        const registerForm = document.getElementById('registerForm');
        const completeProfilePage = document.getElementById('completeProfilePage');
        
        // Only init for registration form, skip complete profile
        if (registerForm && !completeProfilePage) {
            setupEventListeners();
            observer.disconnect();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

init();

console.log('✅ Force Progress Update loaded (Registration Form only)!');