// ============================================
// COMPLETE PROFILE SCROLL FIX
// Fix step navigation untuk halaman Complete Profile
// TIDAK mengubah fungsi Registration Page
// ============================================

console.log('🔧 Loading Complete Profile Scroll Fix...');

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', function() {
    
    // Only run on Complete Profile Page
    const completeProfilePage = document.getElementById('completeProfilePage');
    if (!completeProfilePage) {
        console.log('ℹ️ Not on Complete Profile page, skipping scroll fix');
        return;
    }
    
    console.log('✅ Complete Profile page detected, applying scroll fix...');
    
    // Small delay to ensure other scripts have initialized
    setTimeout(function() {
        
        // Get form container and steps
        const formContainer = completeProfilePage.querySelector('.form-container');
        const steps = completeProfilePage.querySelectorAll('.progress-steps .step');
        const sections = completeProfilePage.querySelectorAll('.form-section');
        
        if (!formContainer || steps.length === 0 || sections.length === 0) {
            console.error('❌ Required elements not found');
            console.log('Form container:', !!formContainer);
            console.log('Steps found:', steps.length);
            console.log('Sections found:', sections.length);
            return;
        }
        
        console.log('✅ Found', steps.length, 'steps and', sections.length, 'sections');
        
        // Create proper scroll function for Complete Profile
        function scrollToCompleteProfileSection(stepIndex) {
            const targetSection = sections[stepIndex];
            
            if (!targetSection) {
                console.error('❌ Section', stepIndex, 'not found');
                return;
            }
            
            console.log('📜 Scrolling to Complete Profile section', stepIndex + 1, ':', targetSection.querySelector('.section-title')?.textContent);
            
            // Calculate position relative to scrollable container
            const containerRect = formContainer.getBoundingClientRect();
            const sectionRect = targetSection.getBoundingClientRect();
            const currentScroll = formContainer.scrollTop;
            
            // Calculate scroll position
            const scrollPosition = currentScroll + (sectionRect.top - containerRect.top) - 20; // 20px offset
            
            console.log('Current scroll:', currentScroll);
            console.log('Target scroll:', scrollPosition);
            
            // Smooth scroll
            formContainer.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
        
        // Remove old click handlers and add new ones
        steps.forEach((step, index) => {
            // Clone to remove all event listeners
            const newStep = step.cloneNode(true);
            step.parentNode.replaceChild(newStep, step);
            
            // Add new click handler
            newStep.style.cursor = 'pointer';
            newStep.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🖱️ Complete Profile - Clicked step', index + 1);
                scrollToCompleteProfileSection(index);
            });
            
            console.log('✅ Attached scroll handler to step', index + 1);
        });
        
        console.log('✅ Complete Profile scroll fix applied!');
        
        // Debug: Log section IDs and positions
        sections.forEach((section, index) => {
            const title = section.querySelector('.section-title')?.textContent || 'No title';
            const sectionId = section.id || 'No ID';
            console.log(`Section ${index + 1}: ${title} (ID: ${sectionId})`);
        });
        
    }, 500); // 500ms delay to ensure everything is loaded
});

console.log('✅ Complete Profile Scroll Fix loaded successfully');