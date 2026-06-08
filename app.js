//app.js

// ===============================
// GLOBAL STATE
// ===============================
let currentSection = 'dashboard';
let currentScript = 'opener';
let currentMediaTab = 'videos';
let userProfile = {
    name: '',
    phone: '',
    area: '',
    experience: '',
    motivation: ''
};

// Activity tracking for progress / lessons
let completedLessons = {
    product: false,
    opener: false,
    discovery: false,
    demo: false,
    close: false,
    followup: false,
    objections: false,
    media: false,
    mindset: false,
    calculator: false
};

// Load/save to localStorage
function loadProgress() {
    const saved = localStorage.getItem('closerke_progress');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            completedLessons = { ...completedLessons, ...data };
        } catch(e) {}
    }
    const savedProfile = localStorage.getItem('closerke_profile');
    if (savedProfile) {
        try {
            const prof = JSON.parse(savedProfile);
            userProfile = { ...userProfile, ...prof };
            updateProfileUI();
        } catch(e) {}
    }
}

function saveProgress() {
    localStorage.setItem('closerke_progress', JSON.stringify(completedLessons));
}

function saveProfile() {
    localStorage.setItem('closerke_profile', JSON.stringify(userProfile));
    updateProfileUI();
}

function updateProfileUI() {
    const navUserName = document.getElementById('navUserName');
    const navAvatar = document.getElementById('navAvatar');
    const udName = document.getElementById('udName');
    const udStatus = document.getElementById('udStatus');
    
    if (userProfile.name && userProfile.name.trim() !== '') {
        navUserName.innerText = userProfile.name;
        udName.innerText = userProfile.name;
        navAvatar.innerText = userProfile.name.charAt(0).toUpperCase();
        udStatus.innerText = 'Active closer';
    } else {
        navUserName.innerText = 'Set up profile';
        udName.innerText = 'Not set up yet';
        navAvatar.innerText = '?';
        udStatus.innerText = 'Complete your profile →';
    }
}

// Mark a lesson complete
function markLessonComplete(lessonId) {
    if (!completedLessons[lessonId]) {
        completedLessons[lessonId] = true;
        saveProgress();
        updateProgressUI();
        showToast(`✅ Completed: ${getLessonTitle(lessonId)}`);
        updateDashboardLessonStatus();
    }
}

function getLessonTitle(lessonId) {
    const titles = {
        product: 'The Product',
        opener: 'Cold Open Script',
        discovery: 'Discovery Script',
        demo: 'Live Demo',
        close: 'The Close',
        followup: 'Follow Up',
        objections: 'Objection Handling',
        media: 'Videos & Audio',
        mindset: 'Field Mindset',
        calculator: 'Earnings Calculator'
    };
    return titles[lessonId] || lessonId;
}

function updateProgressUI() {
    const totalLessons = Object.keys(completedLessons).length;
    let completed = 0;
    for (let key in completedLessons) {
        if (completedLessons[key]) completed++;
    }
    const percent = Math.round((completed / totalLessons) * 100);
    const fillEl = document.getElementById('progressFill');
    const labelEl = document.getElementById('progressLabel');
    if (fillEl) fillEl.style.width = percent + '%';
    if (labelEl) labelEl.innerText = percent + '% complete';
}

function updateDashboardLessonStatus() {
    const lessonItems = document.querySelectorAll('.lesson-item');
    if (lessonItems.length) {
        const lessons = ['product', 'opener', 'discovery', 'objections', 'media'];
        lessons.forEach((lesson, idx) => {
            const item = lessonItems[idx];
            if (item && completedLessons[lesson]) {
                item.classList.add('done');
                const numDiv = item.querySelector('.li-num');
                if (numDiv) numDiv.innerHTML = '✓';
            } else if (item && !completedLessons[lesson]) {
                item.classList.remove('done');
                const numDiv = item.querySelector('.li-num');
                if (numDiv && numDiv.innerHTML !== '✓') {
                    if (idx+1) numDiv.innerHTML = (idx+1).toString();
                }
            }
        });
    }
}

// Navigation
function navigate(section) {
    currentSection = section;
    
    // Hide all sections
    document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(`section-${section}`);
    if (targetSection) targetSection.classList.add('acti'e');
    
    // Update sidebar active states
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const activeNavItem = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (activeNavItem) activeNavItem.classList.add('active');
    
    // Update breadcrumb
    const breadcrumb = document.getElementById('breadcrumb');
    const sectionNames = {
        dashboard: 'Dashboard',
        product: 'Product Deep Dive',
        scripts: 'Sales Scripts',
        objections: 'Objection Handling',
        media: 'Videos & Audio',
        mindset: 'Field Mindset',
        calculator: 'Earnings Calculator',
        apply: 'Apply to Join',
        upload: 'Owner Upload Zone'
    };
    if (breadcrumb) breadcrumb.innerHTML = `<strong>${sectionNames[section] || section}</strong>`;
    
    // Close sidebar on mobile
    closeSidebar();
    
    // Special handling for scripts (restore last script view)
    if (section === 'scripts') {
        switchScript(currentScript);
    }
    
    // Mark media as visited on view
    if (section === 'media') {
        setTimeout(() => markLessonComplete('media'), 500);
    }
    if (section === 'objections') markLessonComplete('objections');
    if (section === 'mindset') markLessonComplete('mindset');
    if (section === 'calculator') markLessonComplete('calculator');
    if (section === 'product') markLessonComplete('product');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateScript(scriptId) {
    currentScript = scriptId;
    navigate('scripts');
    switchScript(scriptId);
}

function switchScript(scriptId) {
    currentScript = scriptId;
    
    // Update sidebar active class
    document.querySelectorAll('.script-nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-script') === scriptId) {
            item.classList.add('active');
        }
    });
    
    // Update panels
    document.querySelectorAll('.script-panel').forEach(panel => panel.classList.remove('active'));
    const targetPanel = document.getElementById(`sp-${scriptId}`);
    if (targetPanel) targetPanel.classList.add('active');
    
    // Mark script lessons as completed when viewed
    const scriptLessonMap = {
        opener: 'opener',
        discovery: 'discovery',
        demo: 'demo',
        close: 'close',
        followup: 'followup'
    };
    if (scriptLessonMap[scriptId]) {
        markLessonComplete(scriptLessonMap[scriptId]);
    }
}

// UI Helpers
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('mobile-open');
    if (overlay) overlay.classList.toggle('show');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('show');
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.toggle('open');
}

function toggleGroup(groupId) {
    const group = document.getElementById(`group-${groupId}`);
    if (group) group.classList.toggle('open');
}

function toggleObj(index) {
    const objItem = document.getElementById(`obj-${index}`);
    if (objItem) objItem.classList.toggle('open');
}

function switchMedia(tab) {
    currentMediaTab = tab;
    document.querySelectorAll('.media-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.media-panel').forEach(p => p.classList.remove('active'));
    
    const activeTab = document.querySelector(`.media-tab[data-tab="${tab}"]`);
    if (activeTab) activeTab.classList.add('active');
    
    const activePanel = document.getElementById(`mp-${tab}`);
    if (activePanel) activePanel.classList.add('active');
}

// Calculator logic
function calcUpdate() {
    const shops = parseInt(document.getElementById('r-shops')?.value || 20);
    const rateDenom = parseInt(document.getElementById('r-rate')?.value || 8);
    const avgPrice = parseInt(document.getElementById('r-price')?.value || 750);
    const daysPerWeek = parseInt(document.getElementById('r-days')?.value || 5);
    
    document.getElementById('v-shops').innerText = shops;
    document.getElementById('v-rate').innerText = rateDenom;
    document.getElementById('v-price').innerText = avgPrice;
    document.getElementById('v-days').innerText = daysPerWeek;
    
    const commissionPerSale = Math.max(0, avgPrice - 500);
    const dailyCloses = shops / rateDenom;
    const dailyCommission = dailyCloses * commissionPerSale;
    const weeklyCommission = dailyCommission * daysPerWeek;
    const monthlyCommission = weeklyCommission * 4;
    
    document.getElementById('r-dcloses').innerText = dailyCloses.toFixed(1);
    document.getElementById('r-daily').innerText = `Ksh ${Math.round(dailyCommission).toLocaleString()}`;
    document.getElementById('r-weekly').innerText = `Ksh ${Math.round(weeklyCommission).toLocaleString()}`;
    document.getElementById('r-monthly').innerText = `Ksh ${Math.round(monthlyCommission).toLocaleString()}`;
    document.getElementById('r-perSale').innerText = `Ksh ${commissionPerSale}`;
    document.getElementById('r-breakeven').innerText = Math.ceil(1000 / (commissionPerSale / rateDenom));
    
    updateCommissionTable();
}

function updateCommissionTable() {
    const tbody = document.getElementById('commissionTable');
    if (!tbody) return;
    let html = '';
    const prices = [500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 990];
    for (let price of prices) {
        const commission = price - 500;
        let note = '';
        if (price === 500) note = 'min sale';
        else if (price === 990) note = 'max sale ✦';
        else note = '';
        html += `<tr>
            <td>Ksh ${price}</td>
            <td>Ksh 500</td>
            <td class="you-col">Ksh ${commission}</td>
            <td class="rule-col">${note}</td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

// Toast notifications
function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (isError) toast.classList.add('error');
    toast.innerHTML = `<span>${isError ? '⚠️' : '✓'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

// Reset progress
function resetProgress() {
    if (confirm('Are you sure? This will reset all your lesson completion status. Your profile will remain.')) {
        for (let key in completedLessons) {
            completedLessons[key] = false;
        }
        saveProgress();
        updateProgressUI();
        updateDashboardLessonStatus();
        showToast('Progress has been reset');
    }
}

// Affirmations
const affirmations = [
    "Every door I walk into is a problem I can solve. Every problem I solve pays me.",
    "I am a professional problem-solver. My service creates value, value creates income.",
    "Rejection is just data. Today's no is tomorrow's yes with a better approach.",
    "I know my product better than anyone. I walk with certainty.",
    "One close changes my day. Ten closes change my month. Consistency wins.",
    "I am not begging. I am offering a tool that business owners genuinely need.",
    "Speed signals confidence. I move with purpose, clarity, and calm."
];
let affIndex = 0;

function nextAffirmation() {
    affIndex = (affIndex + 1) % affirmations.length;
    const affText = document.getElementById('affText');
    if (affText) affText.innerText = `"${affirmations[affIndex]}"`;
}

// Application submit
function clearErr(id) {
    const err = document.getElementById(id);
    if (err) err.style.display = 'none';
}

function validatePhone(phone) {
    const re = /^07[0-9]{8}$/;
    return re.test(phone);
}

// ===============================
// APPLICATION SUBMIT - SENDS TO WHATSAPP
// ===============================

function submitApply() {
    const name = document.getElementById('f-name')?.value.trim();
    const phone = document.getElementById('f-phone')?.value.trim();
    const area = document.getElementById('f-area')?.value.trim();
    const exp = document.getElementById('f-exp')?.value;
    const why = document.getElementById('f-why')?.value.trim();
    
    // Validation
    let valid = true;
    if (!name) { 
        document.getElementById('e-name').style.display = 'block'; 
        valid = false; 
    } else { 
        document.getElementById('e-name').style.display = 'none'; 
    }
    
    if (!phone || !validatePhone(phone)) { 
        document.getElementById('e-phone').style.display = 'block'; 
        valid = false; 
    } else { 
        document.getElementById('e-phone').style.display = 'none'; 
    }
    
    if (!area) { 
        document.getElementById('e-area').style.display = 'block'; 
        valid = false; 
    } else { 
        document.getElementById('e-area').style.display = 'none'; 
    }
    
    if (!valid) {
        showToast('Please fill all required fields correctly', true);
        return;
    }
    
    // Get selected experience label
    let expLabel = '';
    switch(exp) {
        case 'none': expLabel = 'No experience — starting fresh'; break;
        case 'some': expLabel = 'Some experience (chama sales, small biz)'; break;
        case 'field': expLabel = 'Field sales experience'; break;
        case 'digital': expLabel = 'Digital sales / social media'; break;
        default: expLabel = 'Not specified';
    }
    
    // Build WhatsApp message
    const message = `🟢 *NEW CLOSER APPLICATION* 🟢%0A%0A
📛 *Name:* ${name}%0A
📞 *Phone:* ${phone}%0A
📍 *Area:* ${area}%0A
💼 *Experience:* ${expLabel}%0A
💭 *Motivation:* ${why || 'Not provided'}%0A%0A
🔹 *Sent from CloserKE website* 🔹`;
    
    // Replace with YOUR WhatsApp number (include country code, no plus sign)
    // Example: 254700123456 for Kenya
    const YOUR_WHATSAPP_NUMBER = '254140438390';  // <--- CHANGE THIS TO YOUR NUMBER
    
    const whatsappUrl = `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${message}`;
    
    // Save profile locally (optional - for UI display only)
    userProfile = { name, phone, area, experience: exp, motivation: why };
    saveProfile();
    
    // Show success message
    const formWrap = document.getElementById('applyFormWrap');
    const successDiv = document.getElementById('applySuccess');
    if (formWrap && successDiv) {
        formWrap.style.display = 'none';
        successDiv.style.display = 'block';
    }
    
    showToast('Redirecting to WhatsApp...');
    
    // Open WhatsApp after a short delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 800);
}
    

// Dashboard lesson items: mark complete on click
function attachLessonListeners() {
    const lessonMap = {
        'Understand the product': 'product',
        'Cold open script': 'opener',
        'NEPQ discovery': 'discovery',
        'Handle the top 5 objections': 'objections',
        'Watch a real close': 'media'
    };
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.removeEventListener('click', lessonClickHandler);
        item.addEventListener('click', lessonClickHandler);
    });
}

function lessonClickHandler(e) {
    const titleEl = this.querySelector('.li-title');
    if (titleEl) {
        const title = titleEl.innerText;
        const lessonMap = {
            'Understand the product': 'product',
            'Cold open script': 'opener',
            'NEPQ discovery': 'discovery',
            'Handle the top 5 objections': 'objections',
            'Watch a real close': 'media'
        };
        if (lessonMap[title]) {
            setTimeout(() => markLessonComplete(lessonMap[title]), 500);
        }
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const pill = document.querySelector('.nav-user-pill');
    const dropdown = document.getElementById('userDropdown');
    if (pill && dropdown && !pill.contains(e.target)) {
        dropdown.classList.remove('open');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    updateProgressUI();
    updateDashboardLessonStatus();
    calcUpdate();
    attachLessonListeners();
    
    // Ensure sidebar group states
    const scriptsGroup = document.getElementById('group-scripts');
    if (scriptsGroup) scriptsGroup.classList.add('open');
    
    // Close user dropdown initial
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.remove('open');
    
    // Mark product as visited if on dashboard product card click
    const productCard = document.querySelector('.lesson-item:first-child');
    if (productCard) {
        productCard.addEventListener('click', () => setTimeout(() => markLessonComplete('product'), 500));
    }
    
    // Set default commission sidebar
    const sidebarComm = document.getElementById('sidebarCommission');
    if (sidebarComm) sidebarComm.innerText = 'Up to Ksh 490';
    
    // Initialize media from external data if available
    if (window.initMediaLibrary) window.initMediaLibrary();
});
