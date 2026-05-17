// Tracking states
const trackingStates = {
    CONFIRMED: { id: 1, label: 'Order Confirmed', icon: '✓', color: '#10B981' },
    ASSIGNED: { id: 2, label: 'Technician Assigned', icon: '👤', color: '#3B82F6' },
    ON_THE_WAY: { id: 3, label: 'On the Way', icon: '🚗', color: '#F59E0B' },
    ARRIVED: { id: 4, label: 'Arrived at Location', icon: '📍', color: '#8B5CF6' },
    SERVICE_STARTED: { id: 5, label: 'Service Started', icon: '🔧', color: '#6366F1' },
    COMPLETED: { id: 6, label: 'Service Completed', icon: '✅', color: '#10B981' }
};

let currentStatus = trackingStates.CONFIRMED;
let trackingInterval = null;
let locationUpdateInterval = null;

// Get booking data
function getBookingData() {
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
        try {
            return JSON.parse(bookingData);
        } catch (e) {
            console.error('Error parsing booking data:', e);
        }
    }
    
    // Fallback to URL parameters
    const params = new URLSearchParams(window.location.search);
    const data = {
        technicianName: params.get('name') || decodeURIComponent(params.get('name') || 'Technician'),
        servicePrice: params.get('price') || '500',
        customerAddress: params.get('address') || decodeURIComponent(params.get('address') || 'Your Address'),
        address: params.get('address') || decodeURIComponent(params.get('address') || 'Your Address')
    };
    
    // If we have some data, return it
    if (data.technicianName || data.servicePrice) {
        return data;
    }
    
    // Last resort: return default data so tracking can still work
    return {
        technicianName: 'Technician',
        servicePrice: '500',
        customerAddress: 'Your Address',
        address: 'Your Address'
    };
}

// Initialize tracking page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update user menu
    updateUserMenu();
    
    // Load booking data
    const bookingData = getBookingData();
    
    // Initialize tracking (even with default data)
    initializeTracking(bookingData);
    
    // Start location simulation immediately
    setTimeout(() => {
        startLocationTracking();
        // Force initial update
        updateLocation();
    }, 500);
    
    // Setup refresh button
    const refreshBtn = document.getElementById('refreshLocation');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            updateLocation();
        });
    }
    
    // Setup call button
    const callBtn = document.getElementById('callTechnician');
    if (callBtn) {
        callBtn.addEventListener('click', function() {
            const phoneNumber = '1800-123-4567'; // Demo number
            alert(`Calling technician at ${phoneNumber}\n\nIn a real app, this would initiate a phone call.`);
        });
    }
});

// Check authentication
function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

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

// Initialize tracking
function initializeTracking(bookingData) {
    // Update technician details
    updateTechnicianDetails(bookingData);
    
    // Initialize status timeline
    initializeStatusTimeline();
    
    // Start status progression
    startStatusProgression();
}

// Update technician details
function updateTechnicianDetails(bookingData) {
    const techName = document.getElementById('techNameLarge');
    const techNameLabel = document.getElementById('techNameLabel');
    const techAvatar = document.getElementById('techAvatarLarge');
    const techRating = document.getElementById('techRatingLarge');
    const serviceType = document.getElementById('serviceType');
    const serviceCharge = document.getElementById('serviceCharge');
    const customerAddress = document.getElementById('customerAddress');
    
    if (techName) techName.textContent = bookingData.technicianName || 'Technician';
    if (techNameLabel) techNameLabel.textContent = bookingData.technicianName || 'Technician';
    if (techAvatar) techAvatar.textContent = '👨‍🔧';
    
    if (techRating) {
        const rating = 4.8; // Default rating
        const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
        techRating.innerHTML = `
            <span class="rating-stars">${stars}</span>
            <span class="rating-value">${rating}</span>
        `;
    }
    
    if (serviceType) {
        // Extract service type from technician name or use default
        serviceType.textContent = 'Home Service';
    }
    
    if (serviceCharge) {
        serviceCharge.textContent = `₹${bookingData.servicePrice || 500}`;
    }
    
    if (customerAddress) {
        customerAddress.textContent = bookingData.address || bookingData.customerAddress || 'Your Address';
    }
}

// Initialize status timeline
function initializeStatusTimeline() {
    const timeline = document.getElementById('statusTimeline');
    if (!timeline) return;
    
    const states = Object.values(trackingStates);
    timeline.innerHTML = states.map((state, index) => {
        const isActive = state.id <= currentStatus.id;
        const isCurrent = state.id === currentStatus.id;
        
        return `
            <div class="status-item ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}">
                <div class="status-icon">
                    <span>${state.icon}</span>
                </div>
                <div class="status-content">
                    <h4>${state.label}</h4>
                    ${isCurrent ? '<p class="status-time" id="statusTime">Just now</p>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Start status progression
function startStatusProgression() {
    let statusIndex = 1; // Start from CONFIRMED (already shown)
    
    // Immediately show first status update after 3 seconds
    setTimeout(() => {
        if (statusIndex < Object.keys(trackingStates).length) {
            const states = Object.values(trackingStates);
            currentStatus = states[statusIndex];
            statusIndex++;
            
            updateStatusTimeline();
            updateMapBasedOnStatus();
            updateLocation();
        }
    }, 3000);
    
    trackingInterval = setInterval(() => {
        if (statusIndex < Object.keys(trackingStates).length) {
            const states = Object.values(trackingStates);
            currentStatus = states[statusIndex];
            statusIndex++;
            
            updateStatusTimeline();
            updateMapBasedOnStatus();
            updateLocation();
            
            // Stop at COMPLETED
            if (currentStatus.id === trackingStates.COMPLETED.id) {
                clearInterval(trackingInterval);
            }
        }
    }, 12000); // Update every 12 seconds for demo (faster for testing)
}

// Update status timeline
function updateStatusTimeline() {
    const timeline = document.getElementById('statusTimeline');
    if (!timeline) return;
    
    const states = Object.values(trackingStates);
    timeline.innerHTML = states.map((state) => {
        const isActive = state.id <= currentStatus.id;
        const isCurrent = state.id === currentStatus.id;
        
        return `
            <div class="status-item ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}">
                <div class="status-icon">
                    <span>${state.icon}</span>
                </div>
                <div class="status-content">
                    <h4>${state.label}</h4>
                    ${isCurrent ? '<p class="status-time" id="statusTime">Just now</p>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Start location tracking
function startLocationTracking() {
    // Initial location setup
    updateLocation();
    
    // Update location every 1 second for smooth movement
    locationUpdateInterval = setInterval(() => {
        updateLocation();
    }, 1000);
}

// Update location on map
function updateLocation() {
    const techLocation = document.getElementById('technicianLocation');
    const customerLocation = document.getElementById('customerLocation');
    const routeLine = document.getElementById('routeLine');
    const estimatedTime = document.getElementById('estimatedTime');
    const distance = document.getElementById('distance');
    
    if (!techLocation || !customerLocation) return;
    
    // Simulate technician movement
    const progress = getLocationProgress();
    
    // Customer location (fixed at bottom)
    customerLocation.style.left = '50%';
    customerLocation.style.bottom = '15%';
    
    // Technician location (moves based on status)
    if (currentStatus.id < trackingStates.ON_THE_WAY.id) {
        // Technician not started yet
        techLocation.style.left = '20%';
        techLocation.style.top = '20%';
        techLocation.style.display = 'none';
    } else if (currentStatus.id === trackingStates.ON_THE_WAY.id) {
        // Technician is moving
        techLocation.style.display = 'block';
        const leftPos = 20 + (progress * 30); // Move from 20% to 50%
        const topPos = 20 + (progress * 50); // Move from 20% to 70%
        techLocation.style.left = `${leftPos}%`;
        techLocation.style.top = `${topPos}%`;
        
        // Update estimated time and distance
        if (estimatedTime) {
            const timeLeft = Math.max(5, 15 - Math.floor(progress * 10));
            estimatedTime.textContent = `${timeLeft} min`;
        }
        if (distance) {
            const dist = (3.2 - (progress * 2.5)).toFixed(1);
            distance.textContent = `${dist} km`;
        }
        
        // Draw route line
        if (routeLine) {
            drawRouteLine(customerLocation, techLocation);
        }
    } else if (currentStatus.id >= trackingStates.ARRIVED.id) {
        // Technician arrived
        techLocation.style.left = '50%';
        techLocation.style.top = '70%';
        techLocation.style.display = 'block';
        
        if (estimatedTime) estimatedTime.textContent = 'Arrived';
        if (distance) distance.textContent = '0 km';
        if (routeLine) routeLine.style.display = 'none';
    }
}

// Track when technician started moving
let movementStartTime = null;

// Get location progress (0 to 1)
function getLocationProgress() {
    if (currentStatus.id < trackingStates.ON_THE_WAY.id) return 0;
    if (currentStatus.id >= trackingStates.ARRIVED.id) return 1;
    
    // Initialize movement start time when technician starts moving
    if (!movementStartTime) {
        movementStartTime = Date.now();
    }
    
    // Simulate progress based on time
    const elapsed = Date.now() - movementStartTime;
    const totalTime = 12000; // 12 seconds to arrive (for demo)
    const progress = Math.min(1, elapsed / totalTime);
    
    return progress;
}

// Draw route line between customer and technician
function drawRouteLine(customerEl, techEl) {
    const routeLine = document.getElementById('routeLine');
    if (!routeLine || !customerEl || !techEl) return;
    
    const customerRect = customerEl.getBoundingClientRect();
    const techRect = techEl.getBoundingClientRect();
    const mapRect = document.getElementById('mapPlaceholder').getBoundingClientRect();
    
    const customerX = customerRect.left + customerRect.width / 2 - mapRect.left;
    const customerY = customerRect.top + customerRect.height / 2 - mapRect.top;
    const techX = techRect.left + techRect.width / 2 - mapRect.left;
    const techY = techRect.top + techRect.height / 2 - mapRect.top;
    
    const length = Math.sqrt(Math.pow(techX - customerX, 2) + Math.pow(techY - customerY, 2));
    const angle = Math.atan2(techY - customerY, techX - customerX) * 180 / Math.PI;
    
    routeLine.style.width = `${length}px`;
    routeLine.style.left = `${customerX}px`;
    routeLine.style.top = `${customerY}px`;
    routeLine.style.transform = `rotate(${angle}deg)`;
    routeLine.style.transformOrigin = '0 50%';
    routeLine.style.display = 'block';
}

// Update map based on status
function updateMapBasedOnStatus() {
    const mapView = document.getElementById('mapView');
    if (!mapView) return;
    
    // Update map appearance based on status
    if (currentStatus.id >= trackingStates.ON_THE_WAY.id) {
        mapView.classList.add('active-tracking');
    }
    
    if (currentStatus.id >= trackingStates.ARRIVED.id) {
        mapView.classList.add('arrived');
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (trackingInterval) clearInterval(trackingInterval);
    if (locationUpdateInterval) clearInterval(locationUpdateInterval);
});

