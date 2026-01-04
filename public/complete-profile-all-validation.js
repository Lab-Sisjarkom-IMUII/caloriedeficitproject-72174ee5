// ============================================
// COMPLETE PROFILE - ALL VALIDATIONS
// Password + Nomor WA (NO checkmark for WA!)
// Only show border colors, no checkmark icon
// ============================================

console.log('🔐 Loading Complete Profile Validations (No WA checkmark)...');

// ===== PASSWORD VALIDATION =====
function initPasswordValidation() {
    const completeProfileForm = document.getElementById('completeProfileForm');
    
    if (!completeProfileForm) {
        setTimeout(initPasswordValidation, 500);
        return;
    }
    
    const passwordField = document.getElementById('googlePassword');
    const passwordConfirmField = document.getElementById('googlePasswordConfirm');
    
    if (!passwordField || !passwordConfirmField) {
        setTimeout(initPasswordValidation, 500);
        return;
    }
    
    console.log('✅ Password fields found');
    
    // Function to validate password
    function validatePassword() {
        const password = passwordField.value;
        const passwordConfirm = passwordConfirmField.value;
        
        // Get or create checkmark icons
        let passwordCheck = passwordField.parentElement.querySelector('.password-check');
        let confirmCheck = passwordConfirmField.parentElement.querySelector('.password-check');
        
        if (!passwordCheck) {
            passwordCheck = document.createElement('span');
            passwordCheck.className = 'password-check';
            passwordCheck.innerHTML = '✓';
            passwordField.parentElement.style.position = 'relative';
            passwordField.parentElement.appendChild(passwordCheck);
        }
        
        if (!confirmCheck) {
            confirmCheck = document.createElement('span');
            confirmCheck.className = 'password-check';
            confirmCheck.innerHTML = '✓';
            passwordConfirmField.parentElement.style.position = 'relative';
            passwordConfirmField.parentElement.appendChild(confirmCheck);
        }
        
        // Validate password field
        if (password.length >= 6) {
            passwordCheck.style.display = 'block';
            passwordCheck.style.opacity = '1';
            passwordField.style.borderColor = '#10b981';
            passwordField.style.backgroundColor = '#f0fdf4';
        } else {
            passwordCheck.style.display = 'none';
            passwordField.style.borderColor = '';
            passwordField.style.backgroundColor = '';
        }
        
        // Validate confirm field
        if (passwordConfirm.length >= 6 && password === passwordConfirm && password.length > 0) {
            confirmCheck.style.display = 'block';
            confirmCheck.style.opacity = '1';
            passwordConfirmField.style.borderColor = '#10b981';
            passwordConfirmField.style.backgroundColor = '#f0fdf4';
        } else if (passwordConfirm.length > 0) {
            confirmCheck.style.display = 'none';
            passwordConfirmField.style.borderColor = '#ef4444';
            passwordConfirmField.style.backgroundColor = '#fef2f2';
        } else {
            confirmCheck.style.display = 'none';
            passwordConfirmField.style.borderColor = '';
            passwordConfirmField.style.backgroundColor = '';
        }
        
        // Log validation status
        const isValid = password.length >= 6 && password === passwordConfirm;
        console.log('🔐 Password validation:', {
            password: password.length >= 6 ? '✅' : '❌',
            match: password === passwordConfirm ? '✅' : '❌',
            overall: isValid ? '✅ VALID' : '❌ INVALID'
        });
    }
    
    // Attach listeners
    passwordField.addEventListener('input', validatePassword);
    passwordField.addEventListener('blur', validatePassword);
    passwordConfirmField.addEventListener('input', validatePassword);
    passwordConfirmField.addEventListener('blur', validatePassword);
    
    console.log('✅ Password validation listeners attached');
    
    // Initial validation (for autofill)
    setTimeout(validatePassword, 500);
    setTimeout(validatePassword, 1500);
}

// ===== NOMOR WA VALIDATION (NO CHECKMARK!) =====
function initNomorWAValidation() {
    const completeProfileForm = document.getElementById('completeProfileForm');
    
    if (!completeProfileForm) {
        setTimeout(initNomorWAValidation, 500);
        return;
    }
    
    const nomorWAField = document.getElementById('googleNomorWA');
    
    if (!nomorWAField) {
        setTimeout(initNomorWAValidation, 500);
        return;
    }
    
    console.log('✅ Nomor WA field found');
    
    // Function to validate Nomor WA format
    function validateNomorWA() {
        const nomorWA = nomorWAField.value.trim();
        
        // Check if it's a valid phone number
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        const isValid = phoneRegex.test(nomorWA);
        
        if (nomorWA.length === 0) {
            // Empty - default style
            nomorWAField.style.borderColor = '';
            nomorWAField.style.backgroundColor = '';
        } else if (isValid) {
            // Valid - green border (NO CHECKMARK!)
            nomorWAField.style.borderColor = '#10b981';
            nomorWAField.style.backgroundColor = '#f0fdf4';
        } else {
            // Invalid - red border
            nomorWAField.style.borderColor = '#ef4444';
            nomorWAField.style.backgroundColor = '#fef2f2';
        }
        
        console.log('📱 Nomor WA validation:', {
            value: nomorWA,
            isValid: isValid ? '✅' : '❌',
            format: isValid ? 'VALID' : 'INVALID (must be phone number)'
        });
        
        return isValid;
    }
    
    // Attach listeners
    nomorWAField.addEventListener('input', validateNomorWA);
    nomorWAField.addEventListener('blur', validateNomorWA);
    
    // Prevent email autofill
    nomorWAField.addEventListener('focus', function() {
        if (nomorWAField.value.includes('@')) {
            console.log('⚠️ Email detected - clearing...');
            nomorWAField.value = '';
            validateNomorWA();
        }
    });
    
    // Auto-fix on paste
    nomorWAField.addEventListener('paste', function(e) {
        setTimeout(() => {
            if (nomorWAField.value.includes('@')) {
                console.log('⚠️ Email pasted - clearing...');
                nomorWAField.value = '';
                validateNomorWA();
            }
        }, 10);
    });
    
    console.log('✅ Nomor WA validation listeners attached');
    
    // Initial validation
    setTimeout(validateNomorWA, 500);
    
    // Expose validation function for progress indicator
    window.isNomorWAValid = function() {
        const nomorWA = nomorWAField.value.trim();
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        return phoneRegex.test(nomorWA);
    };
}

// ===== CSS STYLES (ONLY ONCE!) =====
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    /* Password validation checkmark */
    .password-check {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #10b981;
        font-size: 24px;
        font-weight: bold;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        text-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
    }
    
    /* Form group position */
    .form-group {
        position: relative;
    }
    
    /* Success state */
    .form-group input.valid {
        border-color: #10b981 !important;
        background-color: #f0fdf4 !important;
    }
    
    /* Error state */
    .form-group input.invalid {
        border-color: #ef4444 !important;
        background-color: #fef2f2 !important;
    }
`;
document.head.appendChild(validationStyles);

// ===== INITIALIZE ALL =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initPasswordValidation();
        initNomorWAValidation();
    });
} else {
    initPasswordValidation();
    initNomorWAValidation();
}

console.log('✅ Complete Profile Validations loaded (No WA checkmark)!');