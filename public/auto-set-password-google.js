// ============================================
// AUTO-SET PASSWORD FOR GOOGLE USERS - FIXED
// Handle session timing issues
// ============================================

console.log('🔐 Loading Auto-Set Password Patch (Fixed Version)...');

/**
 * Set password untuk Google OAuth user di Supabase Auth
 * Fixed version - handle session timing
 */
async function setPasswordForGoogleUser(email, password) {
    if (!window.supabaseClient) {
        console.error('❌ Supabase client not initialized');
        return { success: false, error: 'Supabase not initialized' };
    }
    
    if (!password || password.length < 6) {
        console.warn('⚠️ Password invalid or too short');
        return { success: false, error: 'Password too short' };
    }
    
    try {
        console.log('🔐 Setting password for Google user:', email);
        
        // Approach 1: Try to create auth account with email/password
        // This will link the password to existing Google OAuth account
        console.log('📝 Step 1: Creating password-based auth...');
        
        const { data: signUpData, error: signUpError } = 
            await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        linked_from_google: true
                    }
                }
            });
        
        if (signUpError) {
            // If "User already registered", that's actually GOOD
            if (signUpError.message && signUpError.message.includes('already registered')) {
                console.log('ℹ️ User already registered - trying to link password...');
                
                // Try to sign in with the password to verify it works
                const { data: signInData, error: signInError } = 
                    await window.supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password
                    });
                
                if (signInError) {
                    console.log('⚠️ Cannot sign in with password yet - will try alternative method');
                    
                    // Alternative: Use admin API or wait for session
                    // For now, we'll use the "forgot password" flow approach
                    console.log('📧 User will need to use "Forgot Password" to set their password');
                    
                    return { 
                        success: false, 
                        error: 'Password not set - use Forgot Password',
                        requiresPasswordReset: true
                    };
                } else {
                    console.log('✅ Password works! User can now login with email+password');
                    return { 
                        success: true, 
                        message: 'Password linked successfully',
                        user: signInData.user 
                    };
                }
            } else {
                console.error('❌ Sign up error:', signUpError.message);
                return { success: false, error: signUpError.message };
            }
        }
        
        console.log('✅ Auth account created with password!');
        console.log('✅ User can now login with:');
        console.log('   1. Google Sign-In (OAuth)');
        console.log('   2. Email + Password');
        
        return { 
            success: true, 
            message: 'Password set successfully',
            user: signUpData.user 
        };
        
    } catch (error) {
        console.error('❌ Exception in setPasswordForGoogleUser:', error);
        return { success: false, error: error.message };
    }
}

// Expose globally
window.setPasswordForGoogleUser = setPasswordForGoogleUser;

/**
 * Enhanced handleGoogleProfileComplete
 * Fixed version - better timing
 */
(function() {
    // Wait for original function to be defined
    function patchGoogleProfileComplete() {
        if (typeof window.handleGoogleProfileComplete !== 'function') {
            console.log('⏳ Waiting for handleGoogleProfileComplete...');
            setTimeout(patchGoogleProfileComplete, 500);
            return;
        }
        
        console.log('🔧 Patching handleGoogleProfileComplete...');
        
        // Store original function
        const originalHandleGoogleProfileComplete = window.handleGoogleProfileComplete;
        
        // Replace with enhanced version
        window.handleGoogleProfileComplete = async function(event) {
            console.log('🎯 Enhanced handleGoogleProfileComplete called');
            
            // Get password field value BEFORE calling original
            const passwordField = document.getElementById('googlePassword');
            const password = passwordField ? passwordField.value : null;
            
            // Get email from temp storage
            const tempGoogleUser = JSON.parse(
                sessionStorage.getItem('tempGoogleUser') || 
                localStorage.getItem('tempGoogleUser') || 
                '{}'
            );
            
            const email = tempGoogleUser.email;
            
            console.log('📧 Email:', email);
            console.log('🔐 Password provided:', password ? 'Yes (' + password.length + ' chars)' : 'No');
            
            // Call original function first and WAIT for it to complete
            console.log('⏳ Calling original handleGoogleProfileComplete...');
            const result = await originalHandleGoogleProfileComplete(event);
            console.log('✅ Original function completed');
            
            // Wait a bit for session to be established
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Then set password if provided
            if (password && email) {
                console.log('🔐 Attempting to set password for Google user...');
                
                const passwordResult = await setPasswordForGoogleUser(email, password);
                
                if (passwordResult.success) {
                    console.log('✅ Password set successfully!');
                    
                    // Show success message to user
                    showSuccessNotification('✅ Password berhasil diset!<br><small>Sekarang bisa login dengan email & password</small>');
                    
                } else if (passwordResult.requiresPasswordReset) {
                    console.warn('⚠️ Password requires reset flow');
                    
                    // Show info message
                    showInfoNotification('ℹ️ Untuk set password, gunakan "Lupa Password" di halaman login');
                    
                } else {
                    console.warn('⚠️ Failed to set password:', passwordResult.error);
                    console.log('ℹ️ User can still use Google Sign-In');
                    
                    // Don't show error to user - they can still use Google
                }
            } else {
                console.log('ℹ️ No password to set (user may login via Google only)');
            }
            
            return result;
        };
        
        console.log('✅ handleGoogleProfileComplete patched successfully!');
    }
    
    // Start patching
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchGoogleProfileComplete);
    } else {
        patchGoogleProfileComplete();
    }
})();

/**
 * Show success notification
 */
function showSuccessNotification(message) {
    const notification = createNotification(message, 'success');
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Show info notification
 */
function showInfoNotification(message) {
    const notification = createNotification(message, 'info');
    document.body.appendChild(notification);
    
    // Remove after 7 seconds (longer for info)
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 7000);
}

/**
 * Create notification element
 */
function createNotification(message, type = 'success') {
    const notification = document.createElement('div');
    
    const colors = {
        success: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            shadow: 'rgba(16, 185, 129, 0.4)'
        },
        info: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            shadow: 'rgba(59, 130, 246, 0.4)'
        },
        error: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            shadow: 'rgba(239, 68, 68, 0.4)'
        }
    };
    
    const color = colors[type] || colors.success;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color.background};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px ${color.shadow};
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    notification.innerHTML = message;
    
    return notification;
}

// Add animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Auto-Set Password Patch loaded (Fixed Version)!');
console.log('📝 Improvements:');
console.log('   • Fixed session timing issues');
console.log('   • Better error handling');
console.log('   • Fallback to Forgot Password flow if needed');
console.log('   • Non-blocking - app continues even if password setting fails');