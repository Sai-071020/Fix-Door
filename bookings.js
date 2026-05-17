// Booking statuses
const bookingStatus = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

let allBookings = [];
let currentFilter = 'all';

// Check authentication
function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

// Get all bookings from localStorage
function getAllBookings() {
    const bookings = localStorage.getItem('userBookings');
    if (bookings) {
        try {
            return JSON.parse(bookings);
        } catch (e) {
            console.error('Error parsing bookings:', e);
            return [];
        }
    }
    return [];
}

// Save bookings to localStorage
function saveBookings(bookings) {
    localStorage.setItem('userBookings', JSON.stringify(bookings));
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
    
    // Load bookings
    loadBookings();
    
    // Setup tab filters
    setupTabs();
    
    // Check for new booking from sessionStorage
    checkForNewBooking();
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

// Check for new booking from booking page
function checkForNewBooking() {
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
        try {
            const booking = JSON.parse(bookingData);
            addNewBooking(booking);
            // Clear sessionStorage after adding
            sessionStorage.removeItem('bookingData');
        } catch (e) {
            console.error('Error parsing new booking:', e);
        }
    }
}

// Add new booking
function addNewBooking(bookingData) {
    const newBooking = {
        id: Date.now().toString(),
        bookingNumber: 'BK' + Math.floor(100000 + Math.random() * 900000),
        technicianName: bookingData.technicianName || 'Technician',
        technicianId: bookingData.technicianId,
        serviceType: bookingData.serviceType || 'Home Service',
        servicePrice: bookingData.servicePrice || 500,
        customerName: bookingData.customerName,
        mobileNumber: bookingData.mobileNumber,
        address: bookingData.address,
        landmark: bookingData.landmark || '',
        preferredTime: bookingData.preferredTime || '',
        status: bookingStatus.ACTIVE,
        bookingDate: bookingData.bookingDate || new Date().toISOString(),
        completedDate: null,
        rating: null,
        review: null
    };
    
    allBookings = getAllBookings();
    allBookings.unshift(newBooking); // Add to beginning
    saveBookings(allBookings);
    
    // Reload display
    displayBookings();
}

// Load bookings
function loadBookings() {
    allBookings = getAllBookings();
    displayBookings();
}

// Display bookings
function displayBookings() {
    const container = document.getElementById('bookingsContainer');
    const emptyState = document.getElementById('emptyBookings');
    
    if (!container) return;
    
    // Filter bookings
    let filteredBookings = allBookings;
    if (currentFilter !== 'all') {
        filteredBookings = allBookings.filter(booking => booking.status === currentFilter);
    }
    
    // Sort by date (newest first)
    filteredBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
    
    if (filteredBookings.length === 0) {
        container.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Render bookings
    container.innerHTML = filteredBookings.map(booking => createBookingCard(booking)).join('');
    
    // Attach event listeners
    attachBookingListeners();
}

// Create booking card
function createBookingCard(booking) {
    const statusClass = booking.status === bookingStatus.ACTIVE ? 'active' : 
                       booking.status === bookingStatus.COMPLETED ? 'completed' : 'cancelled';
    const statusLabel = booking.status === bookingStatus.ACTIVE ? 'Active' : 
                       booking.status === bookingStatus.COMPLETED ? 'Completed' : 'Cancelled';
    const statusIcon = booking.status === bookingStatus.ACTIVE ? '🟢' : 
                      booking.status === bookingStatus.COMPLETED ? '✅' : '❌';
    
    const bookingDate = new Date(booking.bookingDate);
    const formattedDate = bookingDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let actionButtons = '';
    if (booking.status === bookingStatus.ACTIVE) {
        actionButtons = `
            <button class="btn-primary btn-track" data-booking-id="${booking.id}">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M9 5V9L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Track Now
            </button>
            <button class="btn-secondary btn-cancel" data-booking-id="${booking.id}">
                Cancel
            </button>
        `;
    } else if (booking.status === bookingStatus.COMPLETED) {
        if (!booking.rating) {
            actionButtons = `
                <button class="btn-primary btn-rate" data-booking-id="${booking.id}">
                    Rate & Review
                </button>
            `;
        } else {
            actionButtons = `
                <button class="btn-secondary btn-rebook" data-booking-id="${booking.id}">
                    Book Again
                </button>
            `;
        }
    }
    
    return `
        <div class="booking-card ${statusClass}">
            <div class="booking-card-header">
                <div class="booking-info">
                    <div class="booking-number">
                        <span class="booking-label">Booking #</span>
                        <span class="booking-value">${booking.bookingNumber}</span>
                    </div>
                    <div class="booking-date">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M2 6H14M5 2V6M11 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        ${formattedDate}
                    </div>
                </div>
                <div class="booking-status-badge ${statusClass}">
                    <span>${statusIcon}</span>
                    ${statusLabel}
                </div>
            </div>
            
            <div class="booking-card-body">
                <div class="technician-info-row">
                    <div class="tech-avatar-small">
                        <span>👨‍🔧</span>
                    </div>
                    <div class="tech-details-small">
                        <h4>${booking.technicianName}</h4>
                        <p>${booking.serviceType}</p>
                    </div>
                    <div class="service-price">
                        <span class="price-label">Amount</span>
                        <span class="price-value">₹${booking.servicePrice}</span>
                    </div>
                </div>
                
                <div class="booking-details-row">
                    <div class="detail-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M8 10C5.23858 10 3 11.7909 3 14V15H13V14C13 11.7909 10.7614 10 8 10Z" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                        <span>${booking.customerName}</span>
                    </div>
                    <div class="detail-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4H14M2 4V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V4M2 4L2 2C2 1.44772 2.44772 1 3 1H13C13.5523 1 14 1.44772 14 2V4M5 6H11M5 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <span>${booking.mobileNumber}</span>
                    </div>
                    <div class="detail-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1Z" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M8 4V8L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <span>${booking.address}</span>
                    </div>
                </div>
            </div>
            
            <div class="booking-card-footer">
                ${actionButtons}
            </div>
        </div>
    `;
}

// Attach event listeners to booking cards
function attachBookingListeners() {
    // Track buttons
    const trackButtons = document.querySelectorAll('.btn-track');
    trackButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking-id');
            trackBooking(bookingId);
        });
    });
    
    // Cancel buttons
    const cancelButtons = document.querySelectorAll('.btn-cancel');
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking-id');
            cancelBooking(bookingId);
        });
    });
    
    // Rate buttons
    const rateButtons = document.querySelectorAll('.btn-rate');
    rateButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking-id');
            rateBooking(bookingId);
        });
    });
    
    // Rebook buttons
    const rebookButtons = document.querySelectorAll('.btn-rebook');
    rebookButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking-id');
            rebookService(bookingId);
        });
    });
}

// Track booking
function trackBooking(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Store booking data for tracking page
    const trackingData = {
        technicianName: booking.technicianName,
        servicePrice: booking.servicePrice,
        address: booking.address,
        customerAddress: booking.address
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(trackingData));
    window.location.href = 'tracking.html';
}

// Cancel booking
function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    const booking = allBookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = bookingStatus.CANCELLED;
        saveBookings(allBookings);
        displayBookings();
    }
}

// Rate booking
function rateBooking(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const rating = prompt('Rate this service (1-5 stars):');
    if (rating && rating >= 1 && rating <= 5) {
        const review = prompt('Write a review (optional):');
        booking.rating = parseInt(rating);
        booking.review = review || '';
        saveBookings(allBookings);
        displayBookings();
    }
}

// Rebook service
function rebookService(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Navigate to service details page
    // You can enhance this to pre-select the service
    window.location.href = 'index.html#services';
}

// Setup tab filters
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            // Update filter
            currentFilter = this.getAttribute('data-tab');
            // Refresh display
            displayBookings();
        });
    });
}

