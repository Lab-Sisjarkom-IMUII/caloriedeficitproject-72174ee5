// ============================================
// COMPLETE PROFILE VALIDATION FIX
// Add format validation for Nomor WA
// ============================================

console.log('🔧 Loading Complete Profile validation fix...');

function initCompleteProfileValidation() {
    const completeProfileForm = document.getElementById('completeProfileForm');
    
    if (!completeProfileForm) {
        setTimeout(initCompleteProfileValidation, 500);
        return;
    }
    
    const nomorWAField = document.getElementById('googleNomorWA');
    
    if (!nomorWAField) {
        setTimeout(initCompleteProfileValidation, 500);
        return;
    }
    
    console.log('✅ Nomor WA field found');
    
    // Function to validate Nomor WA format
    function validateNomorWA() {
        const nomorWA = nomorWAField.value.trim();
        
        // Check if it's a valid phone number (only digits, starts with 0 or +62)
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        const isValid = phoneRegex.test(nomorWA);
        
        // Get or create validation icon
        let validationIcon = nomorWAField.parentElement.querySelector('.wa-validation');
        
        if (!validationIcon) {
            validationIcon = document.createElement('span');
            validationIcon.className = 'wa-validation';
            nomorWAField.parentElement.style.position = 'relative';
            nomorWAField.parentElement.appendChild(validationIcon);
        }
        
        if (nomorWA.length === 0) {
            // Empty - no validation
            validationIcon.style.display = 'none';
            nomorWAField.style.borderColor = '';
            nomorWAField.style.backgroundColor = '';
        } else if (isValid) {
            // Valid phone number
            validationIcon.innerHTML = '✓';
            validationIcon.style.color = '#10b981';
            validationIcon.style.display = 'block';
            validationIcon.style.opacity = '1';
            nomorWAField.style.borderColor = '#10b981';
            nomorWAField.style.backgroundColor = '#f0fdf4';
        } else {
            // Invalid format
            validationIcon.innerHTML = '✕';
            validationIcon.style.color = '#ef4444';
            validationIcon.style.display = 'block';
            validationIcon.style.opacity = '1';
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
        // If field contains @ (email), clear it
        if (nomorWAField.value.includes('@')) {
            console.log('⚠️ Email detected in Nomor WA field - clearing...');
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
    
    // Expose validation function globally for progress indicator
    window.isNomorWAValid = function() {
        const nomorWA = nomorWAField.value.trim();
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        return phoneRegex.test(nomorWA);
    };
}

// CSS for validation icon
const style = document.createElement('style');
style.textContent = `
    .wa-validation {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 24px;
        font-weight: bold;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);

// Init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompleteProfileValidation);
} else {
    initCompleteProfileValidation();
}

console.log('✅ Complete Profile validation fix loaded!');