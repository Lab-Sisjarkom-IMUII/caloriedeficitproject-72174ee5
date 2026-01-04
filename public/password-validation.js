// ============================================
// PASSWORD VALIDATION WITH CHECKMARKS
// Real-time validation untuk password fields
// ============================================

console.log('🔐 Loading password validation...');

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

// CSS Styles for checkmark
const style = document.createElement('style');
style.textContent = `
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
document.head.appendChild(style);

// Init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPasswordValidation);
} else {
    initPasswordValidation();
}

console.log('✅ Password validation script loaded!');