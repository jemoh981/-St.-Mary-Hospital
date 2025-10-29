
const ADMIN_USER = { username: 'admin', password: 'admin123', role: 'admin' };
const DUMMY_DOCTORS = [
    { id: 'dr001', username: 'john.smith', name: 'Dr. John Smith', specialty: 'Cardiology', password: 'password123', role: 'doctor' },
    { id: 'dr002', username: 'emily.chen', name: 'Dr. Emily Chen', specialty: 'Neurology', password: 'password123', role: 'doctor' },
    { id: 'dr003', username: 'alex.varma', name: 'Dr. Alex Varma', specialty: 'Pediatrics', password: 'password123', role: 'doctor' },
];
const DUMMY_NURSE = { id: 'nr001', username: 'jane.doe', name: 'Nurse Jane Doe', password: 'password123', role: 'nurse' };

let users = JSON.parse(localStorage.getItem('hmsUsers')) || [
    ADMIN_USER, 
    DUMMY_DOCTORS[0], DUMMY_DOCTORS[1], DUMMY_DOCTORS[2], 
    DUMMY_NURSE,
    { username: 'test.patient', password: 'password123', role: 'patient' }
];

let appointments = JSON.parse(localStorage.getItem('hmsAppointments')) || [
    { id: 'a1', patient: 'test.patient', doctorId: 'dr001', doctorName: 'Dr. John Smith', date: '2025-11-01', reason: 'Annual check-up', status: 'Approved', linkedNurse: DUMMY_NURSE.username },
];
let prescriptions = JSON.parse(localStorage.getItem('hmsPrescriptions')) || [
    { id: 'p1', appointmentId: 'a1', patient: 'test.patient', doctor: 'Dr. John Smith', date: '2020-01-01', details: 'Aspirin 81mg, daily.' }
];
let reviews = JSON.parse(localStorage.getItem('hmsReviews')) || [];
let consultations = JSON.parse(localStorage.getItem('hmsConsultations')) || [];
let patientVitals = JSON.parse(localStorage.getItem('hmsVitals')) || [];
let medicationLogs = JSON.parse(localStorage.getItem('hmsMedLogs')) || [];
let labTests = JSON.parse(localStorage.getItem('hmsLabTests')) || [];
let payments = JSON.parse(localStorage.getItem('hmsPayments')) || [
    { id: 'pay1', patient: 'test.patient', amount: 150.00, date: '2025-10-27', status: 'Paid', service: 'Consultation Fee' }
];


const saveData = () => {
    localStorage.setItem('hmsUsers', JSON.stringify(users));
    localStorage.setItem('hmsAppointments', JSON.stringify(appointments));
    localStorage.setItem('hmsPrescriptions', JSON.stringify(prescriptions));
    localStorage.setItem('hmsReviews', JSON.stringify(reviews));
    localStorage.setItem('hmsConsultations', JSON.stringify(consultations));
    localStorage.setItem('hmsVitals', JSON.stringify(patientVitals));
    localStorage.setItem('hmsMedLogs', JSON.stringify(medicationLogs));
    localStorage.setItem('hmsLabTests', JSON.stringify(labTests));
    localStorage.setItem('hmsPayments', JSON.stringify(payments));
};


const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const welcomeModal = document.getElementById('welcomeModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const ctaBookBtn = document.getElementById('ctaBookBtn');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const welcomeMessageText = document.getElementById('welcomeMessageText');

const mainContent = document.querySelector('main');
const header = document.querySelector('header');
const dashboardArea = document.getElementById('dashboard');
const logoutBtn = document.getElementById('logoutBtn');
const userNameDisplay = document.getElementById('userNameDisplay');
const userRoleDisplay = document.getElementById('userRoleDisplay');

const closeModal = (modal) => {
    modal.classList.add('hidden');
    if (modal.querySelector('form')) modal.querySelector('form').reset();
    if (modal.querySelector('.error-message')) modal.querySelector('.error-message').textContent = '';
};


const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return minLength && hasLetter && hasNumber;
};

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginMessage.textContent = '';
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        closeModal(loginModal);
        renderDashboard(user);
    } else {
        loginMessage.textContent = 'Invalid username or password.';
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    registerMessage.textContent = '';

    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    if (!role) {
        registerMessage.textContent = 'Please select a role.';
        return;
    }

    if (users.some(u => u.username === username)) {
        registerMessage.textContent = 'Username already exists.';
        return;
    }

    if (!validatePassword(password)) {
        registerMessage.textContent = 'Password must be at least 6 characters and include both letters and numbers.';
        return;
    }

    const newUser = { username, password, role };
    users.push(newUser);
    saveData();

    welcomeMessageText.innerHTML = `Welcome **${username}**! A success confirmation has been sent to your simulated contact (email/WhatsApp). You can now log in.`;
    closeModal(registerModal);
    welcomeModal.classList.remove('hidden');
});


[loginBtn, ctaBookBtn].forEach(btn => btn.addEventListener('click', () => loginModal.classList.remove('hidden')));
registerBtn.addEventListener('click', () => registerModal.classList.remove('hidden'));

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal')));
});
document.getElementById('welcomeModalClose').addEventListener('click', () => {
    closeModal(welcomeModal);
    loginModal.classList.remove('hidden'); 
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal(loginModal);
    if (e.target === registerModal) closeModal(registerModal);
    if (e.target === welcomeModal) closeModal(welcomeModal);
});

document.getElementById('switchToRegister').addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    registerModal.classList.remove('hidden');
});
document.getElementById('switchToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(registerModal);
    loginModal.classList.remove('hidden');
});



const hideAllSections = () => {
    mainContent.classList.add('hidden');
    dashboardArea.classList.add('hidden');
    header.style.display = 'flex'; 
};

const renderDashboard = (user) => {
    hideAllSections();
    
    header.style.display = 'none'; 
    dashboardArea.classList.remove('hidden');

    userNameDisplay.textContent = `Welcome, ${user.username}!`;
    userRoleDisplay.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1); 

    document.querySelectorAll('.dashboard-nav a').forEach(el => {
        el.classList.add('hidden');
    });

    document.getElementById('dashLink-home').classList.remove('hidden');

    switch (user.role) {
        case 'admin':
            document.getElementById('dashLink-adminAppointments').classList.remove('hidden');
            document.getElementById('dashLink-manageUsers').classList.remove('hidden');
            document.getElementById('dashLink-payments').classList.remove('hidden');
            document.getElementById('dashLink-adminReports').classList.remove('hidden');
            break;
        case 'doctor':
            document.getElementById('dashLink-patientsInWaiting').classList.remove('hidden');
            document.getElementById('dashLink-docConsultation').classList.remove('hidden');
            document.getElementById('dashLink-prescriptions').classList.remove('hidden');
            document.getElementById('dashLink-labTests').classList.remove('hidden');
            break;
        case 'nurse':
            document.getElementById('dashLink-nurseReports').classList.remove('hidden');
            document.getElementById('dashLink-medicationLogs').classList.remove('hidden');
            document.getElementById('dashLink-vitals').classList.remove('hidden');
            break;
        case 'patient':
            document.getElementById('dashLink-appointments').classList.remove('hidden');
            document.getElementById('dashLink-reviews').classList.remove('hidden');
            document.getElementById('dashLink-consultation').classList.remove('hidden');
            document.getElementById('dashLink-patientReports').classList.remove('hidden');
            break;
    }

    const defaultLink = document.querySelector('.dashboard-nav a:not(.hidden)');
    if (defaultLink) {
        loadDashboardContent(user, defaultLink.id.replace('dashLink-', ''));
        defaultLink.classList.add('active');
    }
};

const loadDashboardContent = (user, section) => {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = ''; 

    document.querySelectorAll('.dashboard-nav a').forEach(a => a.classList.remove('active'));
    document.getElementById(`dashLink-${section}`).classList.add('active');
    
   
    let title = section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    document.getElementById('dashboardTitle').innerHTML = title.replace(' ', ' **') + '**';

    
    switch (section) {
        case 'home':
            renderDashboardHome(user, contentArea);
            break;
        case 'manageUsers':
            if (user.role === 'admin') renderAdminUserList(contentArea);
            break;
        case 'appointments': 
            if (user.role === 'patient') renderPatientAppointmentSection(user, contentArea);
            break;
        case 'reviews': 
            if (user.role === 'patient') renderPatientReviewSection(user, contentArea);
            break;
        case 'consultation': 
            if (user.role === 'patient') renderPatientConsultationSection(user, contentArea);
            break;
        case 'patientReports': 
            if (user.role === 'patient') renderPatientReportsSection(user, contentArea);
            break;
        case 'patientsInWaiting':
            if (user.role === 'doctor') renderDoctorPatientsInWaiting(user, contentArea);
            break;
        case 'docConsultation': 
            if (user.role === 'doctor') renderDoctorConsultationSection(user, contentArea);
            break;
        case 'prescriptions': 
            if (user.role === 'doctor') renderDoctorPrescriptionSection(user, contentArea);
            break;
        case 'labTests': 
            if (user.role === 'doctor') renderDoctorLabTests(user, contentArea);
            break;
        case 'nurseReports': 
            if (user.role === 'nurse') renderNurseReports(user, contentArea);
            break;
        case 'medicationLogs': 
            if (user.role === 'nurse') renderNurseMedicationLogs(user, contentArea);
            break;
        case 'vitals': 
            if (user.role === 'nurse') renderNurseVitals(user, contentArea);
            break;
        case 'adminAppointments': 
            if (user.role === 'admin') renderAdminAppointments(user, contentArea);
            break;
        case 'payments': 
            if (user.role === 'admin') renderAdminPayments(user, contentArea);
            break;
        case 'adminReports': 
            if (user.role === 'admin') renderAdminSystemReports(user, contentArea);
            break;
        default:
            contentArea.innerHTML = `<div class="role-content"><h3>Coming Soon</h3><p>Content for the **${title}** section is under development.</p></div>`;
    }
};


document.querySelectorAll('.dashboard-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const section = link.id.replace('dashLink-', '');
            loadDashboardContent(currentUser, section);
        }
    });
});


logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    hideAllSections();
    mainContent.classList.remove('hidden'); 
    window.scrollTo(0, 0); 
});




const renderStarRating = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

const populateDoctorSelect = (selectId) => {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Select Doctor</option>';
    DUMMY_DOCTORS.forEach(doc => {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = `${doc.name} (${doc.specialty})`;
        select.appendChild(option);
    });
};

const populatePatientSelect = (selectId) => {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Select Patient</option>';
    users.filter(u => u.role === 'patient').forEach(p => {
        select.innerHTML += `<option value="${p.username}">${p.username}</option>`;
    });
};


const renderDashboardHome = (user, contentArea) => {
    let statsHtml = '';
    let summaryText = '';
    
    const doctorDetails = DUMMY_DOCTORS.find(d => d.username === user.username);

    if (user.role === 'patient') {
        const upcoming = appointments.filter(a => a.patient === user.username && a.status === 'Approved').length;
        summaryText = `<p>You have ${upcoming} upcoming approved appointments. Check your Consultation Chat for active doctor links.</p>`;
        statsHtml = `
            <div class="stats-grid">
                <div class="stat-card"><div class="value">${upcoming}</div><div class="label">Upcoming Appointments</div></div>
                <div class="stat-card"><div class="value">${prescriptions.filter(p => p.patient === user.username).length}</div><div class="label">Total Prescriptions</div></div>
                <div class="stat-card"><div class="value">${patientVitals.filter(v => v.patient === user.username).length}</div><div class="label">Total Vitals Recorded</div></div>
            </div>`;
    } else if (user.role === 'doctor') {
        const waiting = appointments.filter(a => doctorDetails && a.doctorId === doctorDetails.id && a.status === 'Pending').length;
        summaryText = `<p>You have ${waiting} patients awaiting approval/consultation. Review the Patients in Waiting section.</p>`;
        statsHtml = `
            <div class="stats-grid">
                <div class="stat-card"><div class="value">${waiting}</div><div class="label">Patients in Waiting</div></div>
                <div class="stat-card"><div class="value">${appointments.filter(a => doctorDetails && a.doctorId === doctorDetails.id && a.status === 'Approved').length}</div><div class="label">Approved Appointments</div></div>
                <div class="stat-card"><div class="value">${prescriptions.filter(p => p.doctor.includes(user.username)).length}</div><div class="label">Prescriptions Issued</div></div>
            </div>`;
    } else if (user.role === 'nurse') {
        const newVitals = patientVitals.filter(v => v.date === new Date().toLocaleDateString('en-US')).length;
        summaryText = `<p>Welcome, Nurse! You have ${newVitals} new vital records logged today. Please check Patient Reports.</p>`;
        statsHtml = `
            <div class="stats-grid">
                <div class="stat-card"><div class="value">${newVitals}</div><div class="label">Vitals Logged Today</div></div>
                <div class="stat-card"><div class="value">${medicationLogs.length}</div><div class="label">Total Meds Administered</div></div>
                <div class="stat-card"><div class="value">${appointments.filter(a => a.status === 'Approved').length}</div><div class="label">Active Patients</div></div>
            </div>`;
    } else if (user.role === 'admin') {
        const pendingApps = appointments.filter(a => a.status === 'Pending').length;
        summaryText = `<p>System Health is good. There are ${pendingApps} pending appointments that need attention.</p>`;
        statsHtml = `
            <div class="stats-grid">
                <div class="stat-card"><div class="value">${users.filter(u => u.role === 'patient').length}</div><div class="label">Total Patients</div></div>
                <div class="stat-card"><div class="value">${DUMMY_DOCTORS.length}</div><div class="label">Total Doctors</div></div>
                <div class="stat-card"><div class="value">${pendingApps}</div><div class="label">Pending Appointments</div></div>
                <div class="stat-card"><div class="value">$${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</div><div class="label">Total Revenue (Simulated)</div></div>
            </div>`;
    }

    contentArea.innerHTML = `
        <div class="role-content">
            <h3>Role Summary</h3>
            ${summaryText}
        </div>
        ${statsHtml}
    `;
};


const renderPatientAppointmentSection = (user, contentArea) => {
    contentArea.innerHTML = `
        <div class="role-content" id="appointmentBooking">
            <h3>Book a New Appointment</h3>
            <form id="bookAppointmentForm">
                <select id="doctorSelect" required></select>
                <input type="date" id="appointmentDate" required>
                <textarea placeholder="Reason for visit" required></textarea>
                <button type="submit" class="cta-primary">Book Now</button>
            </form>
        </div>

        <div class="role-content">
            <h3>Your Scheduled **Appointments**</h3>
            <div id="patientAppointmentList"></div>
        </div>
    `;

    populateDoctorSelect('doctorSelect');
    
    const patientAppointmentListDiv = document.getElementById('patientAppointmentList');
    const patientAppointments = appointments.filter(app => app.patient === user.username).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (patientAppointments.length === 0) {
        patientAppointmentListDiv.innerHTML = '<p>You have no scheduled appointments.</p>';
    } else {
        let listHtml = '<table><thead><tr><th>Doctor</th><th>Date</th><th>Reason</th><th>Status</th></tr></thead><tbody>';
        patientAppointments.forEach(app => {
            listHtml += `<tr>
                <td>${app.doctorName}</td>
                <td>${app.date}</td>
                <td>${app.reason.substring(0, 50)}...</td>
                <td><span class="status-${app.status.toLowerCase()}">${app.status}</span></td>
            </tr>`;
        });
        listHtml += '</tbody></table>';
        patientAppointmentListDiv.innerHTML = listHtml;
    }

    document.getElementById('bookAppointmentForm').addEventListener('submit', handleAppointmentBooking);
};

const handleAppointmentBooking = (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const doctorId = document.getElementById('doctorSelect').value;
    const date = document.getElementById('appointmentDate').value;
    const reason = e.target.querySelector('textarea').value;

    const doctor = DUMMY_DOCTORS.find(d => d.id === doctorId);

    const newAppointment = {
        id: Date.now().toString(),
        patient: currentUser.username,
        doctorId: doctorId,
        doctorName: doctor.name,
        date: date,
        reason: reason,
        status: 'Pending',
        linkedNurse: DUMMY_NURSE.username, 
    };

    appointments.push(newAppointment);
    saveData();
    e.target.reset();
    alert('Appointment booked successfully! Status: Pending. Please wait for doctor approval.');
    loadDashboardContent(currentUser, 'appointments'); 

const renderPatientReviewSection = (user, contentArea) => {
    contentArea.innerHTML = `
        <div class="role-content" id="reviewFormArea">
            <h3>**Review** a Doctor's Service</h3>
            <form id="reviewForm">
                <select id="reviewDoctorSelect" required></select>
                <label for="reviewRating">Rating:</label>
                <select id="reviewRating" required>
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                    <option value="2">⭐⭐ (2 Stars)</option>
                    <option value="1">⭐ (1 Star)</option>
                </select>
                <textarea id="reviewComment" placeholder="Your comments about the service..." required></textarea>
                <button type="submit" class="cta-primary">Submit Review</button>
            </form>
        </div>

        <div class="role-content">
            <h3>All Doctor **Reviews**</h3>
            <div id="allReviewsDisplay"></div>
        </div>
    `;

    populateDoctorSelect('reviewDoctorSelect');
    renderAllReviews('allReviewsDisplay');
    
    document.getElementById('reviewForm').addEventListener('submit', handleReviewSubmission);
};

const handleReviewSubmission = (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const doctorId = document.getElementById('reviewDoctorSelect').value;
    const rating = document.getElementById('reviewRating').value;
    const comment = document.getElementById('reviewComment').value;

    const doctor = DUMMY_DOCTORS.find(d => d.id === doctorId);

    const newReview = {
        id: Date.now().toString(),
        doctorId: doctorId,
        doctorName: doctor.name,
        patient: currentUser.username,
        rating: parseInt(rating),
        comment: comment,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    reviews.push(newReview);
    saveData();
    e.target.reset();
    alert(`Thank you for your ${rating}-star review for ${doctor.name}!`);
    loadDashboardContent(currentUser, 'reviews'); 
};

const renderAllReviews = (elementId) => {
    const displayDiv = document.getElementById(elementId);
    if (reviews.length === 0) {
        displayDiv.innerHTML = '<p>No reviews have been submitted yet.</p>';
        return;
    }

    let html = '<div class="review-grid">';
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(r => {
        html += `
            <div class="review-card">
                <p class="review-stars">${renderStarRating(r.rating)}</p>
                <p><strong>Dr. ${r.doctorName}</strong></p>
                <p class="review-comment">${r.comment}</p>
                <small>By ${r.patient} on ${r.date}</small>
            </div>
        `;
    });
    html += '</div>';
    displayDiv.innerHTML = html;
};

const renderPatientConsultationSection = (user, contentArea) => {
    const latestAppointment = appointments.find(a => a.patient === user.username && a.status === 'Approved');

    if (!latestAppointment) {
        contentArea.innerHTML = `<div class="role-content"><h3>No Active Consultation</h3><p>Please book and get an appointment approved to start a consultation chat with your doctor.</p></div>`;
        return;
    }

    const consultationId = latestAppointment.id;
    const activeConsultation = consultations.filter(c => c.appointmentId === consultationId).sort((a,b) => a.timestamp - b.timestamp);

    contentArea.innerHTML = `
        <div class="role-content">
            <h3>Active Consultation with **${latestAppointment.doctorName}**</h3>
            <p>Appointment on: ${latestAppointment.date}</p>
            <div class="chat-window">
                <div class="chat-messages" id="chatMessages">
                    ${activeConsultation.map(msg => `
                        <div class="message ${msg.sender === user.username ? 'user' : 'other'}">
                            <strong>${msg.sender === user.username ? 'You' : latestAppointment.doctorName}</strong>: ${msg.text}
                        </div>
                    `).join('')}
                </div>
                <div class="chat-input">
                    <input type="text" id="chatInput" placeholder="Type your message...">
                    <button id="sendMessageBtn" class="cta-primary small-btn"><i class="fas fa-paper-plane"></i> Send</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('sendMessageBtn').addEventListener('click', () => handleConsultationSend(consultationId, user.username, 'consultation'));
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleConsultationSend(consultationId, user.username, 'consultation');
    });

    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
};

const handleConsultationSend = (consultationId, sender, section) => {
    const input = document.getElementById(section === 'consultation' ? 'chatInput' : 'chatInputDoc');
    const text = input.value.trim();

    if (text) {
        const newMsg = {
            appointmentId: consultationId,
            sender: sender,
            text: text,
            timestamp: Date.now()
        };
        consultations.push(newMsg);
        saveData();
        input.value = '';
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (section === 'consultation') {
             renderPatientConsultationSection(currentUser, document.getElementById('contentArea'));
        } else {
             displayDoctorChat(consultationId, currentUser, document.getElementById('selectedChatWindow'));
        }
    }
};

const renderPatientReportsSection = (user, contentArea) => {
    contentArea.innerHTML = `
        <div class="role-content">
            <h3>Your **Vitals** History (from Nurse)</h3>
            <div id="vitalsHistory"></div>
        </div>
        <div class="role-content">
            <h3>Your **Lab Test** Results (from Doctor/Lab)</h3>
            <div id="labTestResults"></div>
        </div>
    `;

    const vitalsDiv = document.getElementById('vitalsHistory');
    const patientVitalsFiltered = patientVitals.filter(v => v.patient === user.username);
    if (patientVitalsFiltered.length > 0) {
        let html = '<table><thead><tr><th>Date</th><th>B.P.</th><th>Temp.</th><th>Heart Rate</th><th>Logged By</th></tr></thead><tbody>';
        patientVitalsFiltered.slice(-10).reverse().forEach(v => {
            html += `<tr><td>${v.date}</td><td>${v.bloodPressure}</td><td>${v.temperature}°C</td><td>${v.heartRate} bpm</td><td>${v.nurse}</td></tr>`;
        });
        vitalsDiv.innerHTML = html + '</tbody></table>';
    } else {
        vitalsDiv.innerHTML = '<p>No vital records found yet.</p>';
    }

    const labDiv = document.getElementById('labTestResults');
    const patientLabTests = labTests.filter(l => l.patient === user.username);
    if (patientLabTests.length > 0) {
        let html = '<table><thead><tr><th>Date</th><th>Test Name</th><th>Result</th><th>Status</th><th>Ordered By</th></tr></thead><tbody>';
        patientLabTests.forEach(l => {
            html += `<tr><td>${l.date}</td><td>${l.testName}</td><td>${l.result || 'Awaiting Lab'}</td><td><span class="status-${l.status.toLowerCase()}">${l.status}</span></td><td>${l.doctor}</td></tr>`;
        });
        labDiv.innerHTML = html + '</tbody></table>';
    } else {
        labDiv.innerHTML = '<p>No lab test orders or results found yet.</p>';
    }
};


const renderDoctorPatientsInWaiting = (user, contentArea) => {
    const doctor = DUMMY_DOCTORS.find(d => d.username === user.username);
    
    const relevantAppointments = appointments.filter(app => 
        doctor && app.doctorId === doctor.id && app.status !== 'Done'
    ).sort((a, b) => new Date(a.date) - new Date(b.date)); 

    contentArea.innerHTML = `
        <div class="role-content">
            <h3>Appointments Requiring Your **Attention**</h3>
            <div id="appointmentList"></div>
        </div>
    `;
    const listDiv = document.getElementById('appointmentList');

    if (relevantAppointments.length === 0) {
        listDiv.innerHTML = '<p>No appointments pending or approved for your attention.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Patient</th><th>Date</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead><tbody>';
    relevantAppointments.forEach(app => {
        html += `<tr>
            <td>${app.patient}</td>
            <td>${app.date}</td>
            <td>${app.reason.substring(0, 30)}...</td>
            <td><span class="status-${app.status.toLowerCase()}">${app.status}</span></td>
            <td>`;
        
        if (app.status === 'Pending') {
            html += `<button class="cta-primary small-btn approve-btn" data-id="${app.id}">Approve</button>`;
        } else if (app.status === 'Approved') {
            html += `<button class="cta-secondary small-btn start-consult-btn" data-id="${app.id}" onclick="loadDashboardContent(JSON.parse(localStorage.getItem('currentUser')), 'docConsultation')">Go to Chat</button>`;
            html += `<button class="cta-primary small-btn mark-done-btn" data-id="${app.id}">Mark Done</button>`;
        }
        html += `</td></tr>`;
    });
    html += '</tbody></table>';
    listDiv.innerHTML = html;

    listDiv.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const appId = e.target.dataset.id;
            const app = appointments.find(a => a.id === appId);
            if (app) {
                app.status = 'Approved';
                saveData();
                loadDashboardContent(user, 'patientsInWaiting'); 
            }
        });
    });

    listDiv.querySelectorAll('.mark-done-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const appId = e.target.dataset.id;
            const app = appointments.find(a => a.id === appId);
            if (app) {
                app.status = 'Done';
                saveData();
                alert(`Consultation with ${app.patient} marked as Done.`);
                loadDashboardContent(user, 'patientsInWaiting'); 
            }
        });
    });
};

const renderDoctorConsultationSection = (user, contentArea) => {
    const doctor = DUMMY_DOCTORS.find(d => d.username === user.username);
    
    const activeAppointments = appointments.filter(a => 
        doctor && a.doctorId === doctor.id && a.status === 'Approved'
    );

    if (activeAppointments.length === 0) {
        contentArea.innerHTML = `<div class="role-content"><h3>No Active Consultations</h3><p>You have no approved appointments to start consultation chats with.</p></div>`;
        return;
    }

    contentArea.innerHTML = `
        <div class="role-content">
            <h3>Active **Consultation Links**</h3>
            <p>Select a patient to view/reply to the chat.</p>
            <ul>
                ${activeAppointments.map(app => `
                    <li><button class="cta-secondary small-btn chat-link" data-appid="${app.id}">${app.patient} - ${app.date}</button></li>
                `).join('')}
            </ul>
        </div>
        <div id="selectedChatWindow" class="role-content hidden"></div>
    `;

    document.querySelectorAll('.chat-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const appId = e.target.dataset.appid;
            displayDoctorChat(appId, user, document.getElementById('selectedChatWindow'));
        });
    });
};

const displayDoctorChat = (appointmentId, user, chatWindowDiv) => {
    const app = appointments.find(a => a.id === appointmentId);
    const activeConsultation = consultations.filter(c => c.appointmentId === appointmentId).sort((a,b) => a.timestamp - b.timestamp);

    chatWindowDiv.classList.remove('hidden');
    chatWindowDiv.innerHTML = `
        <h3>Chat with **${app.patient}**</h3>
        <div class="chat-window">
            <div class="chat-messages" id="chatMessagesDoc">
                ${activeConsultation.map(msg => `
                    <div class="message ${msg.sender === user.username ? 'user' : 'other'}">
                        <strong>${msg.sender === user.username ? 'You' : app.patient}</strong>: ${msg.text}
                    </div>
                `).join('')}
            </div>
            <div class="chat-input">
                <input type="text" id="chatInputDoc" placeholder="Type your message to ${app.patient}...">
                <button id="sendMessageBtnDoc" class="cta-primary small-btn"><i class="fas fa-paper-plane"></i> Send</button>
            </div>
        </div>
    `;

    const chatMessagesDoc = document.getElementById('chatMessagesDoc');
    chatMessagesDoc.scrollTop = chatMessagesDoc.scrollHeight;

    document.getElementById('sendMessageBtnDoc').addEventListener('click', () => handleConsultationSend(appointmentId, user.username, 'docConsultation'));
    document.getElementById('chatInputDoc').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleConsultationSend(appointmentId, user.username, 'docConsultation');
    });
};

const renderDoctorPrescriptionSection = (user, contentArea) => {
    contentArea.innerHTML = `
        <div class="role-content">
            <h3>Issue New **Prescription**</h3>
            <form id="writePrescriptionForm">
                <select id="patientSelectPres" required></select>
                <textarea id="medicationDetails" placeholder="Medication Details (e.g., Drug X, 1 tab twice daily)" required></textarea>
                <button type="submit" class="cta-primary">Issue Prescription</button>
            </form>
        </div>
        <div class="role-content">
            <h3>Issued **Prescriptions**</h3>
            <div id="prescriptionList"></div>
        </div>
    `;
    populatePatientSelect('patientSelectPres');

    document.getElementById('writePrescriptionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const patientUsername = document.getElementById('patientSelectPres').value;
        const details = document.getElementById('medicationDetails').value;
        
        const doctorDetails = DUMMY_DOCTORS.find(d => d.username === user.username);

        const newPrescription = {
            id: Date.now().toString(),
            patient: patientUsername,
            doctor: doctorDetails ? doctorDetails.name : user.username,
            date: new Date().toLocaleDateString(),
            details: details
        };
        prescriptions.push(newPrescription);
        saveData();
        alert('Prescription issued successfully!');
        loadDashboardContent(user, 'prescriptions'); 
    });

  
    const listDiv = document.getElementById('prescriptionList');
    const doctorPrescriptions = prescriptions.filter(p => p.doctor.includes(user.username)).sort((a, b) => new Date(b.date) - new Date(a.date)); // Simplified filter

    if (doctorPrescriptions.length === 0) {
        listDiv.innerHTML = '<p>No prescriptions issued by you yet.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Date</th><th>Patient</th><th>Details</th></tr></thead><tbody>';
    doctorPrescriptions.forEach(p => {
        html += `<tr>
            <td>${p.date}</td>
            <td>${p.patient}</td>
            <td>${p.details}</td>
        </tr>`;
    });
    listDiv.innerHTML = html + '</tbody></table>';
};


const renderDoctorLabTests = (user, contentArea) => {
    contentArea.innerHTML = `
        <div class="role-content">
            <h3>**Order** New Lab Test</h3>
            <form id="orderLabTestForm">
                <select id="patientSelectLab" required></select>
                <input type="text" id="testName" placeholder="e.g., Complete Blood Count (CBC)" required>
                <textarea id="testNotes" placeholder="Clinical notes for the lab..."></textarea>
                <button type="submit" class="cta-primary">Order Test</button>
            </form>
        </div>
        <div class="role-content">
            <h3>**Ordered** Tests & Results</h3>
            <div id="labTestList"></div>
        </div>
    `;
    populatePatientSelect('patientSelectLab');

    document.getElementById('orderLabTestForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const patientUsername = document.getElementById('patientSelectLab').value;
        const testName = document.getElementById('testName').value;
        
        const doctorDetails = DUMMY_DOCTORS.find(d => d.username === user.username);
        
        const newTest = {
            id: Date.now().toString(),
            patient: patientUsername,
            doctor: doctorDetails ? doctorDetails.name : user.username,
            date: new Date().toLocaleDateString(),
            testName: testName,
            status: 'Ordered',
            result: null
        };
        labTests.push(newTest);
        saveData();
        alert('Lab Test ordered successfully!');
        loadDashboardContent(user, 'labTests'); 
    });

    const listDiv = document.getElementById('labTestList');
    const doctorTests = labTests.filter(l => l.doctor.includes(user.username)).sort((a, b) => new Date(b.date) - new Date(a.date)); 

    if (doctorTests.length === 0) {
        listDiv.innerHTML = '<p>No lab tests ordered by you yet.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Date</th><th>Patient</th><th>Test Name</th><th>Status</th><th>Result</th><th>Action</th></tr></thead><tbody>';
    doctorTests.forEach(l => {
        html += `<tr>
            <td>${l.date}</td>
            <td>${l.patient}</td>
            <td>${l.testName}</td>
            <td><span class="status-${l.status.toLowerCase()}">${l.status}</span></td>
            <td>${l.result || 'Pending'}</td>
            <td>
                ${l.status === 'Ordered' ? `<button class="cta-primary small-btn" onclick="handleSimulateResult('${l.id}', '${user.username}')">Simulate Result</button>` : ''}
            </td>
        </tr>`;
    });
    listDiv.innerHTML = html + '</tbody></table>';
};

const handleSimulateResult = (testId, doctorUsername) => {
    const test = labTests.find(l => l.id === testId);
    if (test) {
        test.status = 'Completed';
        test.result = "All results within normal range."; 
        saveData();
        alert(`Test ${test.testName} for ${test.patient} marked as Completed.`);
        loadDashboardContent({ username: doctorUsername, role: 'doctor' }, 'labTests'); 
    }
}



const renderNurseVitals = (user, contentArea) => {
    contentArea.innerHTML = `
        <div class="role-content">
            <h3>**Log** Patient Vitals</h3>
            <form id="logVitalsForm">
                <select id="patientSelectVitals" required></select>
                <input type="text" id="bpInput" placeholder="Blood Pressure (e.g., 120/80)" required>
                <input type="number" id="tempInput" step="0.1" placeholder="Temperature (°C)" required>
                <input type="number" id="hrInput" placeholder="Heart Rate (bpm)" required>
                <button type="submit" class="cta-primary">Log Vitals</button>
            </form>
        </div>
        <div class="role-content">
            <h3>Recent Vitals **History**</h3>
            <div id="recentVitals"></div>
        </div>
    `;
    populatePatientSelect('patientSelectVitals');

    document.getElementById('logVitalsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const patientUsername = document.getElementById('patientSelectVitals').value;
        const bp = document.getElementById('bpInput').value;
        const temp = document.getElementById('tempInput').value;
        const hr = document.getElementById('hrInput').value;
        
        const newVital = {
            id: Date.now().toString(),
            patient: patientUsername,
            nurse: user.username,
            date: new Date().toLocaleDateString(),
            bloodPressure: bp,
            temperature: parseFloat(temp),
            heartRate: parseInt(hr),
        };
        patientVitals.push(newVital);
        saveData();
        alert(`Vitals for ${patientUsername} logged successfully!`);
        loadDashboardContent(user, 'vitals');
    });

    const historyDiv = document.getElementById('recentVitals');
    if (patientVitals.length === 0) {
        historyDiv.innerHTML = '<p>No vital records logged yet.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Date</th><th>Patient</th><th>B.P.</th><th>Temp.</th><th>HR</th></tr></thead><tbody>';
    patientVitals.slice(-10).reverse().forEach(v => { 
        html += `<tr><td>${v.date}</td><td>${v.patient}</td><td>${v.bloodPressure}</td><td>${v.temperature}°C</td><td>${v.heartRate} bpm</td></tr>`;
    });
    historyDiv.innerHTML = html + '</tbody></table>';
};


const renderNurseMedicationLogs = (user, contentArea) => {
    contentArea.innerHTML = `
        <div class="role-content">
            <h3>**Log** Medication Administration</h3>
            <form id="logMedicationForm">
                <select id="patientSelectMed" required></select>
                <input type="text" id="medName" placeholder="Medication Name" required>
                <input type="text" id="dosage" placeholder="Dosage (e.g., 5mg)" required>
                <button type="submit" class="cta-primary">Log Administration</button>
            </form>
        </div>
        <div class="role-content">
            <h3>Recent Medication **Logs**</h3>
            <div id="recentMedLogs"></div>
        </div>
    `;
    populatePatientSelect('patientSelectMed');

    document.getElementById('logMedicationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const patientUsername = document.getElementById('patientSelectMed').value;
        const medName = document.getElementById('medName').value;
        const dosage = document.getElementById('dosage').value;
        
        const newLog = {
            id: Date.now().toString(),
            patient: patientUsername,
            nurse: user.username,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            medication: medName,
            dosage: dosage,
        };
        medicationLogs.push(newLog);
        saveData();
        alert(`Medication for ${patientUsername} logged successfully!`);
        loadDashboardContent(user, 'medicationLogs');
    });

    const historyDiv = document.getElementById('recentMedLogs');
    if (medicationLogs.length === 0) {
        historyDiv.innerHTML = '<p>No medication administration logged yet.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Date/Time</th><th>Patient</th><th>Medication</th><th>Dosage</th></tr></thead><tbody>';
    medicationLogs.slice(-10).reverse().forEach(l => { 
        html += `<tr><td>${l.date} / ${l.time}</td><td>${l.patient}</td><td>${l.medication}</td><td>${l.dosage}</td></tr>`;
    });
    historyDiv.innerHTML = html + '</tbody></table>';
};


const renderNurseReports = (user, contentArea) => {
    contentArea.innerHTML = `
        <div class="role-content">
            <h3>**Patient Reports** Summary</h3>
            <p>This section allows the nurse to get a quick summary of vital statistics and medication history for active patients.</p>
            <div id="patientSummaryList"></div>
        </div>
    `;

    const summaryDiv = document.getElementById('patientSummaryList');
    const patientUsernames = [...new Set(appointments.filter(a => a.status === 'Approved' || a.status === 'Done').map(a => a.patient))];

    if (patientUsernames.length === 0) {
        summaryDiv.innerHTML = '<p>No patients currently marked as "Approved" or "Done" for care.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Patient</th><th>Last B.P.</th><th>Last Temp.</th><th>Last Medication</th><th>Assigned Doctor</th></tr></thead><tbody>';
    
    patientUsernames.forEach(p => {
        const lastVital = patientVitals.filter(v => v.patient === p).sort((a, b) => b.id - a.id)[0];
        const lastMed = medicationLogs.filter(l => l.patient === p).sort((a, b) => b.id - a.id)[0];
        const assignedApp = appointments.find(a => a.patient === p && (a.status === 'Approved' || a.status === 'Done'));

        html += `<tr>
            <td>${p}</td>
            <td>${lastVital ? lastVital.bloodPressure : 'N/A'}</td>
            <td>${lastVital ? `${lastVital.temperature}°C` : 'N/A'}</td>
            <td>${lastMed ? lastMed.medication : 'N/A'}</td>
            <td>${assignedApp ? assignedApp.doctorName : 'N/A'}</td>
        </tr>`;
    });
    summaryDiv.innerHTML = html + '</tbody></table>';
};


const renderAdminUserList = (contentArea) => {
    contentArea.innerHTML = `
        <div class="role-content">
            <h3>Admin: **User Management**</h3>
            <div id="userList"></div>
        </div>
    `;
    const userListDiv = document.getElementById('userList');
    let html = '<table><thead><tr><th>Username</th><th>Role</th><th>Action</th></tr></thead><tbody>';
    
    users.filter(u => u.username !== 'admin').forEach(user => { 
        html += `<tr>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td><button class="cta-secondary small-btn delete-btn" data-username="${user.username}">Delete</button></td>
        </tr>`;
    });
    html += '</tbody></table>';
    userListDiv.innerHTML = html;
    
    userListDiv.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const usernameToDelete = e.target.dataset.username;
            users = users.filter(u => u.username !== usernameToDelete);
            saveData();
            renderAdminUserList(contentArea); 
        });
    });
};

const renderAdminAppointments = (user, contentArea) => {
    contentArea.innerHTML = `
        <div class="role-content">
            <h3>All **Appointments** Overview</h3>
            <p>Admin can view all appointments and assign/reassign doctors.</p>
            <div id="adminAppointmentList"></div>
        </div>
    `;
    const listDiv = document.getElementById('adminAppointmentList');
    
    if (appointments.length === 0) {
        listDiv.innerHTML = '<p>No appointments recorded in the system.</p>';
        return;
    }

    let html = '<table><thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>';
    appointments.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(app => {
        html += `<tr>
            <td>${app.id.substring(0, 5)}...</td>
            <td>${app.patient}</td>
            <td>${app.doctorName}</td>
            <td>${app.date}</td>
            <td><span class="status-${app.status.toLowerCase()}">${app.status}</span></td>
            <td>
                <button class="cta-secondary small-btn reassign-btn" data-id="${app.id}">Reassign</button>
            </td>
        </tr>`;
    });
    listDiv.innerHTML = html + '</tbody></table>';

    listDiv.querySelectorAll('.reassign-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const appId = e.target.dataset.id;
            const app = appointments.find(a => a.id === appId);
            
            const doctorNames = DUMMY_DOCTORS.map(d => `${d.id}: ${d.name}`).join('\n');
            const newDoctorId = prompt(`Enter new Doctor ID (e.g., dr002) for appointment ${appId}:\n\nAvailable Doctors:\n${doctorNames}`);
            
            if (newDoctorId) {
                const doctor = DUMMY_DOCTORS.find(d => d.id === newDoctorId);
                if (app && doctor) {
                    app.doctorId = doctor.id;
                    app.doctorName = doctor.name;
                    app.status = 'Pending'; 
                    saveData();
                    loadDashboardContent(user, 'adminAppointments');
                } else {
                    alert('Invalid Doctor ID.');
                }
            }
        });
    });
};

const renderAdminPayments = (user, contentArea) => {
    contentArea.innerHTML = `
        <div class="role-content">
            <h3>Financial **Payments** Ledger</h3>
            <p>Total Revenue: **$${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}** (Simulated)</p>
            <div id="paymentsList"></div>
        </div>
    `;
    const listDiv = document.getElementById('paymentsList');

    if (payments.length === 0) {
        listDiv.innerHTML = '<p>No payment records found.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Date</th><th>Patient</th><th>Service</th><th>Amount</th><th>Status</th></tr></thead><tbody>';
    payments.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(p => {
        html += `<tr>
            <td>${p.date}</td>
            <td>${p.patient}</td>
            <td>${p.service}</td>
            <td>$${p.amount.toFixed(2)}</td>
            <td><span class="status-${p.status.toLowerCase()}">${p.status}</span></td>
        </tr>`;
    });
    listDiv.innerHTML = html + '</tbody></table>';
};

const renderAdminSystemReports = (user, contentArea) => {
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2);
    const approvedApps = appointments.filter(a => a.status === 'Approved').length;
    
    contentArea.innerHTML = `
        <div class="role-content">
            <h3>System **Performance** Reports</h3>
            <div class="stats-grid">
                <div class="stat-card"><div class="value">${reviews.length}</div><div class="label">Total Reviews</div></div>
                <div class="stat-card"><div class="value">${avgRating || 0} / 5</div><div class="label">Average Doctor Rating</div></div>
                <div class="stat-card"><div class="value">${approvedApps}</div><div class="label">Approved Appointments</div></div>
                <div class="stat-card"><div class="value">${labTests.filter(l => l.status === 'Ordered').length}</div><div class="label">Pending Lab Tests</div></div>
            </div>
            
            <h3>User Distribution</h3>
            <pre class="role-content">
Total Users: ${users.length}
- Admin: ${users.filter(u => u.role === 'admin').length}
- Doctors: ${users.filter(u => u.role === 'doctor').length}
- Nurses: ${users.filter(u => u.role === 'nurse').length}
- Patients: ${users.filter(u => u.role === 'patient').length}
            </pre>
            
             <h3>Financial Summary (Last 10 Payments)</h3>
             <div id="adminFinancialSummary"></div>
        </div>
    `;
    
    const financialDiv = document.getElementById('adminFinancialSummary');
    const lastPayments = payments.slice(-10).reverse();
    let html = '<table><thead><tr><th>Date</th><th>Patient</th><th>Amount</th></tr></thead><tbody>';
    lastPayments.forEach(p => {
        html += `<tr><td>${p.date}</td><td>${p.patient}</td><td>$${p.amount.toFixed(2)}</td></tr>`;
    });
    financialDiv.innerHTML = html + '</tbody></table>';
};



document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        renderDashboard(currentUser);
    } else {
        hideAllSections();
        mainContent.classList.remove('hidden');
    }
});

  const form = document.getElementById('contactForm');
  const popup = document.getElementById('successPopup');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    popup.style.display = 'flex';

    setTimeout(() => {
      popup.style.display = 'none';
    }, 4000);

    setTimeout(() => {
      form.submit();
    }, 1500); 
  });

  function closePopup() {
    popup.style.display = 'none';
  }
}