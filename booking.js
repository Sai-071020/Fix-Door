// Check authentication
function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

// Get technician data from URL or sessionStorage
function getTechnicianData() {
    const params = new URLSearchParams(window.location.search);
    const techId = params.get('techId');
    const techName = params.get('name');
    const techRating = params.get('rating');
    const techExperience = params.get('experience');
    const techPrice = params.get('price');
    const techImage = params.get('image');
    
    if (techId) {
        return {
            id: techId,
            name: decodeURIComponent(techName || ''),
            rating: parseFloat(techRating || 0),
            experience: decodeURIComponent(techExperience || ''),
            price: parseInt(techPrice || 0),
            image: decodeURIComponent(techImage || '👨‍🔧')
        };
    }
    
    // Fallback to sessionStorage
    const stored = sessionStorage.getItem('selectedTechnician');
    if (stored) {
        return JSON.parse(stored);
    }
    
    return null;
}

// Go back function
function goBack() {
    const referrer = document.referrer;
    if (referrer && referrer.includes('service-details.html')) {
        window.history.back();
    } else {
        window.location.href = 'service-details.html';
    }
}

// Go to tracking page
function goToTracking() {
    window.location.href = 'tracking.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update user menu
    updateUserMenu();
    
    // Load technician data
    const techData = getTechnicianData();
    if (techData) {
        displayTechnicianSummary(techData);
        setupBookingForm(techData);
    } else {
        // Use demo technician so booking flow still works
        const demoTech = { id: 'demo', name: 'Demo Technician', rating: 4.8, experience: '5 years', price: 500, image: '👨‍🔧' };
        displayTechnicianSummary(demoTech);
        setupBookingForm(demoTech);
    }
});

// Update user menu
function updateUserMenu() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userName = document.getElementById('userName');
    const signOutBtn = document.getElementById('signOutBtn');
    
    if (userName && userData.name) {
        userName.textContent = userData.name;
    }
    
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function() {
            localStorage.setItem('isAuthenticated', 'false');
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
        });
    }
}

// Display technician summary
function displayTechnicianSummary(techData) {
    const summaryAvatar = document.getElementById('summaryAvatar');
    const summaryName = document.getElementById('summaryName');
    const summaryRating = document.getElementById('summaryRating');
    const summaryExperience = document.getElementById('summaryExperience');
    const summaryPrice = document.getElementById('summaryPrice');
    
    if (summaryAvatar) {
        summaryAvatar.textContent = techData.image || '👨‍🔧';
    }
    
    if (summaryName) {
        summaryName.textContent = techData.name || 'Technician';
    }
    
    if (summaryRating) {
        const stars = '★'.repeat(Math.floor(techData.rating)) + '☆'.repeat(5 - Math.floor(techData.rating));
        summaryRating.innerHTML = `
            <span class="rating-stars">${stars}</span>
            <span class="rating-value">${techData.rating}</span>
        `;
    }
    
    if (summaryExperience) {
        summaryExperience.textContent = `Experience: ${techData.experience}`;
    }
    
    if (summaryPrice) {
        summaryPrice.textContent = `₹${techData.price}`;
    }
}

// Setup booking form
function setupBookingForm(techData) {
    const bookingForm = document.getElementById('bookingForm');
    const mobileInput = document.getElementById('mobileNumber');
    
    // Mobile number validation (only numbers)
    if (mobileInput) {
        mobileInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmission(techData);
        });
    }
}

// Handle booking submission
function handleBookingSubmission(techData) {
    const formData = {
        technicianId: techData.id,
        technicianName: techData.name,
        customerName: document.getElementById('customerName').value.trim(),
        mobileNumber: document.getElementById('mobileNumber').value.trim(),
        address: document.getElementById('address').value.trim(),
        landmark: document.getElementById('landmark').value.trim(),
        preferredTime: document.getElementById('preferredTime').value,
        emergencyBooking: document.getElementById('emergencyBooking').checked,
        servicePrice: techData.price,
        emergencyFee: document.getElementById('emergencyBooking').checked ? 200 : 0,
        totalPrice: techData.price + (document.getElementById('emergencyBooking').checked ? 200 : 0),
        bookingDate: new Date().toISOString()
    };
    
    // Validate mobile number
    if (formData.mobileNumber.length !== 10) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
    
    // Validate required fields
    if (!formData.customerName || !formData.mobileNumber || !formData.address) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Store booking data temporarily
    sessionStorage.setItem('pendingBookingData', JSON.stringify(formData));
    
    // Generate and show OTP modal
    generateAndShowOTP(formData.mobileNumber);
}

// Generate OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Generate and show OTP modal
function generateAndShowOTP(mobileNumber) {
    const otp = generateOTP();
    const bookingData = JSON.parse(sessionStorage.getItem('pendingBookingData'));
    
    // Store OTP temporarily (in real app, this would be sent via SMS)
    sessionStorage.setItem('currentOTP', otp);
    sessionStorage.setItem('otpGeneratedTime', Date.now().toString());
    
    // Show OTP modal
    const otpModalOverlay = document.getElementById('otpModalOverlay');
    const otpPhoneDisplay = document.getElementById('otpPhoneDisplay');
    
    if (otpModalOverlay && otpPhoneDisplay) {
        // Display masked phone number
        const maskedPhone = '+91 ' + mobileNumber.slice(0, 3) + '* **** ' + mobileNumber.slice(-4);
        otpPhoneDisplay.textContent = maskedPhone;
        
        otpModalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Clear previous OTP inputs
        document.getElementById('otpInput1').value = '';
        document.getElementById('otpInput2').value = '';
        document.getElementById('otpInput3').value = '';
        document.getElementById('otpInput4').value = '';
        
        // Focus on first input
        document.getElementById('otpInput1').focus();
        
        // For demo purposes, show OTP in console
        console.log('Demo OTP (for testing):', otp);
        
        // Setup OTP input handlers
        setupOTPInputHandlers();
        
        // Start resend timer
        startResendTimer();
    }
}

// Setup OTP input handlers
function setupOTPInputHandlers() {
    const inputs = [
        document.getElementById('otpInput1'),
        document.getElementById('otpInput2'),
        document.getElementById('otpInput3'),
        document.getElementById('otpInput4')
    ];
    
    inputs.forEach((input, index) => {
        input.addEventListener('keyup', function(e) {
            // Only allow numbers
            this.value = this.value.replace(/\D/g, '');
            
            // Move to next input
            if (this.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            
            // Move to previous input on backspace
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
        
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
            
            // Distribute pasted numbers across inputs
            for (let i = 0; i < inputs.length && i < pastedData.length; i++) {
                inputs[i].value = pastedData[i];
            }
            
            // Focus on last input
            if (pastedData.length > 0) {
                inputs[Math.min(pastedData.length - 1, inputs.length - 1)].focus();
            }
        });
    });
}

// Verify OTP
function verifyOtp() {
    const enteredOTP = 
        document.getElementById('otpInput1').value +
        document.getElementById('otpInput2').value +
        document.getElementById('otpInput3').value +
        document.getElementById('otpInput4').value;
    
    const correctOTP = sessionStorage.getItem('currentOTP');
    const testOTP = '0710'; // Test OTP for demo purposes
    
    if (enteredOTP.length !== 4) {
        alert('Please enter all 4 digits');
        return;
    }
    
    // Accept either the generated OTP or the fixed OTP (0710)
    if (enteredOTP === correctOTP || enteredOTP === '0710') {
        // OTP verified successfully
        completeBooking();
    } else {
        alert('Invalid OTP. Please enter the correct 4-digit OTP.');
        // Clear inputs
        document.getElementById('otpInput1').value = '';
        document.getElementById('otpInput2').value = '';
        document.getElementById('otpInput3').value = '';
        document.getElementById('otpInput4').value = '';
        document.getElementById('otpInput1').focus();
    }
}

// Start resend timer
function startResendTimer() {
    let timeLeft = 60;
    const resendBtn = document.getElementById('resendOtpBtn');
    const timerDisplay = document.getElementById('resendTimer');
    
    if (resendBtn) {
        resendBtn.disabled = true;
    }
    
    const timer = setInterval(() => {
        timeLeft--;
        if (timerDisplay) {
            timerDisplay.textContent = `(${timeLeft}s)`;
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (resendBtn) {
                resendBtn.disabled = false;
                timerDisplay.textContent = '';
            }
        }
    }, 1000);
}

// Resend OTP
function resendOtp() {
    const bookingData = JSON.parse(sessionStorage.getItem('pendingBookingData'));
    const otp = generateOTP();
    
    sessionStorage.setItem('currentOTP', otp);
    sessionStorage.setItem('otpGeneratedTime', Date.now().toString());
    
    // For demo purposes
    console.log('New OTP (for testing):', otp);
    
    // Show notification
    showToastNotification('OTP sent again to your phone');
    
    // Clear inputs
    document.getElementById('otpInput1').value = '';
    document.getElementById('otpInput2').value = '';
    document.getElementById('otpInput3').value = '';
    document.getElementById('otpInput4').value = '';
    document.getElementById('otpInput1').focus();
    
    // Reset timer
    startResendTimer();
}

// Close OTP modal
function closeOtpModal() {
    const otpModalOverlay = document.getElementById('otpModalOverlay');
    if (otpModalOverlay) {
        otpModalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Show payment modal
function showPaymentModal(bookingData) {
    const paymentModalOverlay = document.getElementById('paymentModalOverlay');
    const emergencyFeeRow = document.getElementById('emergencyFeeRow');
    
    if (paymentModalOverlay) {
        // Display payment details
        document.getElementById('paymentServiceCharge').textContent = `₹${bookingData.servicePrice}`;
        
        if (bookingData.emergencyFee > 0) {
            emergencyFeeRow.style.display = 'flex';
            document.getElementById('paymentEmergencyFee').textContent = `₹${bookingData.emergencyFee}`;
        } else {
            emergencyFeeRow.style.display = 'none';
        }
        
        document.getElementById('paymentTotal').textContent = `₹${bookingData.totalPrice}`;
        
        // Show modal
        paymentModalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close payment modal
function closePaymentModal() {
    const paymentModalOverlay = document.getElementById('paymentModalOverlay');
    if (paymentModalOverlay) {
        paymentModalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Process payment
function processPayment() {
    const bookingData = JSON.parse(sessionStorage.getItem('pendingBookingData'));
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Add payment method to booking data
    bookingData.paymentMethod = paymentMethod;
    bookingData.paymentStatus = 'completed';
    bookingData.paymentDate = new Date().toISOString();
    
    // Show loading state on button
    const payNowBtn = document.getElementById('payNowBtn');
    const originalText = payNowBtn.textContent;
    payNowBtn.textContent = 'Processing...';
    payNowBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Close payment modal
        closePaymentModal();
        
        // Save booking to history with payment info
        const savedBooking = saveBookingToHistory(bookingData);
        
        // Store data for tracking page
        sessionStorage.setItem('bookingData', JSON.stringify({
            technicianName: bookingData.technicianName,
            technicianId: bookingData.technicianId,
            servicePrice: bookingData.totalPrice,
            address: bookingData.address,
            customerName: bookingData.customerName
        }));
        
        // Show success modal
        showBookingSuccess(bookingData);
        
        // Clear temporary data
        sessionStorage.removeItem('pendingBookingData');
        sessionStorage.removeItem('currentOTP');
        sessionStorage.removeItem('otpGeneratedTime');
        
        // Reset button
        payNowBtn.textContent = originalText;
        payNowBtn.disabled = false;
        
        // Show success notification
        showToastNotification('Payment successful! Booking confirmed.');
    }, 1500);
}

// Complete booking after OTP verification
function completeBooking() {
    const bookingData = JSON.parse(sessionStorage.getItem('pendingBookingData'));
    
    // Close OTP modal
    closeOtpModal();
    
    // Show payment modal
    showPaymentModal(bookingData);
}

// Show toast notification
function showToastNotification(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Save booking to history
function saveBookingToHistory(bookingData) {
    try {
        const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const bookingId = 'BK' + Math.floor(100000 + Math.random() * 900000);
        const newBooking = {
            id: Date.now().toString(),
            bookingNumber: bookingId,
            technicianName: bookingData.technicianName,
            technicianId: bookingData.technicianId,
            serviceType: 'Home Service',
            servicePrice: bookingData.servicePrice,
            emergencyBooking: bookingData.emergencyBooking,
            emergencyFee: bookingData.emergencyFee,
            totalPrice: bookingData.totalPrice,
            customerName: bookingData.customerName,
            mobileNumber: bookingData.mobileNumber,
            address: bookingData.address,
            landmark: bookingData.landmark || '',
            preferredTime: bookingData.preferredTime || '',
            status: 'confirmed',
            bookingDate: bookingData.bookingDate || new Date().toISOString(),
            estimatedArrival: getEstimatedArrivalTime(bookingData.emergencyBooking),
            completedDate: null,
            rating: null,
            review: null
        };
        existingBookings.unshift(newBooking);
        localStorage.setItem('userBookings', JSON.stringify(existingBookings));
        
        // Store booking number in session for success modal
        sessionStorage.setItem('lastBookingNumber', bookingId);
        sessionStorage.setItem('lastBookingData', JSON.stringify(newBooking));
    } catch (e) {
        console.error('Error saving booking to history:', e);
    }
}

// Get estimated arrival time
function getEstimatedArrivalTime(isEmergency) {
    const now = new Date();
    if (isEmergency) {
        // 2 hours for emergency
        now.setHours(now.getHours() + 2);
    } else {
        // 4 hours for normal
        now.setHours(now.getHours() + 4);
    }
    return now.toLocaleString('en-IN', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

// Show booking success
function showBookingSuccess(bookingData) {
    const successModalOverlay = document.getElementById('successModalOverlay');
    const lastBookingData = JSON.parse(sessionStorage.getItem('lastBookingData'));
    
    if (successModalOverlay && lastBookingData) {
        // Populate success modal
        document.getElementById('successBookingId').textContent = lastBookingData.bookingNumber;
        document.getElementById('successTechName').textContent = lastBookingData.technicianName;
        document.getElementById('successArrivalTime').textContent = lastBookingData.estimatedArrival;
        document.getElementById('successAmount').textContent = `₹${lastBookingData.totalPrice}`;
        
        if (bookingData.emergencyBooking) {
            const amountElement = document.getElementById('successAmount');
            amountElement.innerHTML = `₹${lastBookingData.totalPrice} <span class="emergency-label">(+₹200 Emergency)</span>`;
        }
        
        successModalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Go to tracking page
function goToTracking() {
    window.location.href = 'tracking.html';
}

// Go to home page
function goToHome() {
    window.location.href = 'index.html';
}

