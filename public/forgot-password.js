// ============================================
// FORGOT PASSWORD FEATURE
// Add "Lupa Password" button to login form
// ============================================

console.log('🔑 Loading Forgot Password Feature...');

/**
 * Add "Lupa Password" link to login form
 */
function addForgotPasswordLink() {
    // Wait for login form to exist
    const loginForm = document.querySelector('form[action*="login"]') || 
                      document.querySelector('.login-container form') ||
                      document.querySelector('#loginForm');
    
    if (!loginForm) {
        console.log('⏳ Login form not found, waiting...');
        setTimeout(addForgotPasswordLink, 500);
        return;
    }
    
    // Check if already added
    if (document.getElementById('forgotPasswordLink')) {
        console.log('ℹ️ Forgot Password link already exists');
        return;
    }
    
    console.log('➕ Adding Forgot Password link to login form');
    
    // Find password input field
    const passwordInput = loginForm.querySelector('input[type="password"]') ||
                          loginForm.querySelector('#password') ||
                          loginForm.querySelector('#loginPassword');
    
    if (!passwordInput) {
        console.warn('⚠️ Password input not found');
        return;
    }
    
    // Create "Lupa Password?" link
    const forgotPasswordLink = document.createElement('div');
    forgotPasswordLink.id = 'forgotPasswordLink';
    forgotPasswordLink.style.cssText = `
        margin-top: 8px;
        text-align: right;
        margin-bottom: 16px;
    `;
    
    forgotPasswordLink.innerHTML = `
        <a href="#" 
           onclick="window.showForgotPasswordModal(); return false;"
           style="
               color: #3b82f6;
               text-decoration: none;
               font-size: 14px;
               font-weight: 500;
               transition: all 0.2s;
           "
           onmouseover="this.style.color='#2563eb'; this.style.textDecoration='underline';"
           onmouseout="this.style.color='#3b82f6'; this.style.textDecoration='none';">
            Lupa Password?
        </a>
    `;
    
    // Insert after password input's parent
    const passwordContainer = passwordInput.parentElement;
    passwordContainer.parentElement.insertBefore(forgotPasswordLink, passwordContainer.nextSibling);
    
    console.log('✅ Forgot Password link added!');
}

/**
 * Show Forgot Password Modal
 */
window.showForgotPasswordModal = function() {
    console.log('📧 Opening Forgot Password modal');
    
    // Check if modal already exists
    let modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        return;
    }
    
    // Create modal
    modal = document.createElement('div');
    modal.id = 'forgotPasswordModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 2rem;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0; font-size: 24px; color: #1f2937;">
                    🔑 Reset Password
                </h2>
                <button onclick="window.closeForgotPasswordModal()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6b7280;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">
                    ×
                </button>
            </div>
            
            <p style="color: #6b7280; margin-bottom: 1.5rem; line-height: 1.6;">
                Masukkan email Anda dan kami akan kirim link untuk reset password.
            </p>
            
            <form id="forgotPasswordForm" onsubmit="window.handleForgotPasswordSubmit(event); return false;">
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 8px; color: #374151; font-weight: 500;">
                        Email
                    </label>
                    <input 
                        type="email" 
                        id="forgotPasswordEmail"
                        required
                        placeholder="email@example.com"
                        style="
                            width: 100%;
                            padding: 12px 16px;
                            border: 2px solid #e5e7eb;
                            border-radius: 8px;
                            font-size: 16px;
                            transition: all 0.2s;
                            box-sizing: border-box;
                        "
                        onfocus="this.style.borderColor='#3b82f6'; this.style.outline='none';"
                        onblur="this.style.borderColor='#e5e7eb';"
                    />
                </div>
                
                <div id="forgotPasswordMessage" style="
                    margin-bottom: 1rem;
                    padding: 12px;
                    border-radius: 8px;
                    display: none;
                "></div>
                
                <button 
                    type="submit"
                    id="forgotPasswordButton"
                    style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                    "
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(59, 130, 246, 0.4)';"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)';"
                >
                    Kirim Link Reset
                </button>
            </form>
            
            <p style="margin-top: 1.5rem; text-align: center; color: #6b7280; font-size: 14px;">
                Ingat password Anda? 
                <a href="#" onclick="window.closeForgotPasswordModal(); return false;" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                    Kembali ke Login
                </a>
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus on email input
    setTimeout(() => {
        document.getElementById('forgotPasswordEmail').focus();
    }, 100);
};

/**
 * Close Forgot Password Modal
 */
window.closeForgotPasswordModal = function() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => {
            modal.remove();
        }, 200);
    }
};

/**
 * Handle Forgot Password Form Submit
 */
window.handleForgotPasswordSubmit = async function(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('forgotPasswordEmail');
    const button = document.getElementById('forgotPasswordButton');
    const messageDiv = document.getElementById('forgotPasswordMessage');
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage(messageDiv, 'error', 'Email tidak boleh kosong');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage(messageDiv, 'error', 'Format email tidak valid');
        return;
    }
    
    // Check if Supabase is available
    if (!window.supabaseClient) {
        showMessage(messageDiv, 'error', 'Supabase belum siap, coba lagi');
        return;
    }
    
    // Show loading state
    button.disabled = true;
    button.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <div style="
                width: 16px;
                height: 16px;
                border: 2px solid white;
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 0.6s linear infinite;
            "></div>
            Mengirim...
        </div>
    `;
    
    try {
        console.log('📧 Sending password reset email to:', email);
        
        const { data, error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });
        
        if (error) {
            console.error('❌ Error sending reset email:', error);
            showMessage(messageDiv, 'error', `Error: ${error.message}`);
            
            button.disabled = false;
            button.innerHTML = 'Kirim Link Reset';
            return;
        }
        
        console.log('✅ Password reset email sent!');
        
        // Show success message
        showMessage(messageDiv, 'success', `
            ✅ Link reset password sudah dikirim ke <strong>${email}</strong>!<br>
            <small style="opacity: 0.9;">Cek inbox email Anda (dan folder spam jika tidak ada)</small>
        `);
        
        // Clear input
        emailInput.value = '';
        
        // Change button to close
        button.innerHTML = 'Tutup';
        button.onclick = function() {
            window.closeForgotPasswordModal();
        };
        
    } catch (err) {
        console.error('❌ Exception:', err);
        showMessage(messageDiv, 'error', 'Terjadi kesalahan, coba lagi');
        
        button.disabled = false;
        button.innerHTML = 'Kirim Link Reset';
    }
};

/**
 * Show message in modal
 */
function showMessage(messageDiv, type, message) {
    const colors = {
        success: {
            bg: '#d1fae5',
            border: '#10b981',
            text: '#065f46'
        },
        error: {
            bg: '#fee2e2',
            border: '#ef4444',
            text: '#991b1b'
        },
        info: {
            bg: '#dbeafe',
            border: '#3b82f6',
            text: '#1e40af'
        }
    };
    
    const color = colors[type] || colors.info;
    
    messageDiv.style.display = 'block';
    messageDiv.style.background = color.bg;
    messageDiv.style.border = `2px solid ${color.border}`;
    messageDiv.style.color = color.text;
    messageDiv.innerHTML = message;
}

// Add CSS animations
const forgotPasswordStyle = document.createElement('style');
forgotPasswordStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(forgotPasswordStyle);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addForgotPasswordLink);
} else {
    addForgotPasswordLink();
}

// Also check when navigating (for SPA)
const observer = new MutationObserver(() => {
    addForgotPasswordLink();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('✅ Forgot Password Feature loaded!');
console.log('📝 Features:');
console.log('   • "Lupa Password?" link added to login form');
console.log('   • Beautiful modal with email input');
console.log('   • Send password reset email via Supabase');
console.log('   • User-friendly success/error messages');