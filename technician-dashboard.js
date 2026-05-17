// Order statuses
const orderStatus = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    DECLINED: 'declined',
    COMPLETED: 'completed'
};

let allOrders = [];
let currentFilter = 'pending';

// Check authentication and user type
function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

function isTechnician() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.userType === 'technician';
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication and user type
    if (!isAuthenticated() || !isTechnician()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update user menu
    updateUserMenu();
    
    // Load orders
    loadOrders();
    
    // Setup tab filters
    setupTabs();
    
    // Listen for new orders (from customer bookings)
    listenForNewOrders();
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

// Load orders from localStorage
function loadOrders() {
    // Get all customer bookings and convert to technician orders
    const customerBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    
    // Convert bookings to orders for technicians
    allOrders = customerBookings
        .filter(booking => booking.status === 'active' || booking.status === 'completed')
        .map(booking => ({
            id: booking.id,
            orderNumber: booking.bookingNumber,
            customerName: booking.customerName,
            customerPhone: booking.mobileNumber,
            customerAddress: booking.address,
            landmark: booking.landmark || '',
            serviceType: booking.serviceType || 'Home Service',
            servicePrice: booking.servicePrice,
            preferredTime: booking.preferredTime || '',
            bookingDate: booking.bookingDate,
            status: orderStatus.PENDING, // New orders start as pending
            technicianId: null,
            acceptedDate: null,
            completedDate: booking.completedDate || null
        }));
    
    // Also load technician-specific orders if they exist
    const techOrders = JSON.parse(localStorage.getItem('technicianOrders') || '[]');
    allOrders = [...techOrders, ...allOrders];
    
    // Remove duplicates
    const uniqueOrders = [];
    const seenIds = new Set();
    allOrders.forEach(order => {
        if (!seenIds.has(order.id)) {
            seenIds.add(order.id);
            uniqueOrders.push(order);
        }
    });
    allOrders = uniqueOrders;
    
    displayOrders();
    updateStats();
}

// Listen for new orders from customer bookings
function listenForNewOrders() {
    // Check localStorage periodically for new bookings
    setInterval(() => {
        const customerBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const newBookings = customerBookings.filter(booking => {
            return !allOrders.find(order => order.id === booking.id);
        });
        
        if (newBookings.length > 0) {
            newBookings.forEach(booking => {
                if (booking.status === 'active') {
                    const newOrder = {
                        id: booking.id,
                        orderNumber: booking.bookingNumber,
                        customerName: booking.customerName,
                        customerPhone: booking.mobileNumber,
                        customerAddress: booking.address,
                        landmark: booking.landmark || '',
                        serviceType: booking.serviceType || 'Home Service',
                        servicePrice: booking.servicePrice,
                        preferredTime: booking.preferredTime || '',
                        bookingDate: booking.bookingDate,
                        status: orderStatus.PENDING,
                        technicianId: null,
                        acceptedDate: null,
                        completedDate: null
                    };
                    allOrders.unshift(newOrder);
                }
            });
            saveOrders();
            displayOrders();
            updateStats();
        }
    }, 2000); // Check every 2 seconds
}

// Save orders
function saveOrders() {
    localStorage.setItem('technicianOrders', JSON.stringify(allOrders));
}

// Display orders
function displayOrders() {
    const container = document.getElementById('ordersContainer');
    const emptyState = document.getElementById('emptyOrders');
    const emptyMessage = document.getElementById('emptyMessage');
    
    if (!container) return;
    
    // Filter orders
    let filteredOrders = allOrders;
    if (currentFilter === 'pending') {
        filteredOrders = allOrders.filter(order => order.status === orderStatus.PENDING);
    } else if (currentFilter === 'accepted') {
        filteredOrders = allOrders.filter(order => order.status === orderStatus.ACCEPTED);
    } else if (currentFilter === 'completed') {
        filteredOrders = allOrders.filter(order => order.status === orderStatus.COMPLETED);
    }
    
    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
    
    if (filteredOrders.length === 0) {
        container.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
            if (emptyMessage) {
                if (currentFilter === 'pending') {
                    emptyMessage.textContent = 'You don\'t have any pending service requests at the moment.';
                } else if (currentFilter === 'accepted') {
                    emptyMessage.textContent = 'You haven\'t accepted any orders yet.';
                } else {
                    emptyMessage.textContent = 'You haven\'t completed any orders yet.';
                }
            }
        }
        return;
    }
    
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Render orders
    container.innerHTML = filteredOrders.map(order => createOrderCard(order)).join('');
    
    // Attach event listeners
    attachOrderListeners();
}

// Create order card
function createOrderCard(order) {
    const orderDate = new Date(order.bookingDate);
    const formattedDate = orderDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let actionButtons = '';
    if (order.status === orderStatus.PENDING) {
        actionButtons = `
            <div class="order-actions">
                <button class="btn-accept" data-order-id="${order.id}">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M15 4.5L6.75 12.75L3 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Accept Order
                </button>
                <button class="btn-decline" data-order-id="${order.id}">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Decline
                </button>
            </div>
        `;
    } else if (order.status === orderStatus.ACCEPTED) {
        actionButtons = `
            <div class="order-actions">
                <button class="btn-primary btn-complete" data-order-id="${order.id}">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M15 4.5L6.75 12.75L3 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Mark as Completed
                </button>
            </div>
        `;
    } else if (order.status === orderStatus.COMPLETED) {
        actionButtons = `
            <div class="order-status-badge completed">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Completed
            </div>
        `;
    }
    
    return `
        <div class="order-card ${order.status}">
            <div class="order-card-header">
                <div class="order-info">
                    <div class="order-number">
                        <span class="order-label">Order #</span>
                        <span class="order-value">${order.orderNumber}</span>
                    </div>
                    <div class="order-date">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M2 6H14M5 2V6M11 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        ${formattedDate}
                    </div>
                </div>
                <div class="order-status-badge ${order.status}">
                    ${order.status === orderStatus.PENDING ? '⏳ Pending' : 
                      order.status === orderStatus.ACCEPTED ? '✅ Accepted' : 
                      order.status === orderStatus.COMPLETED ? '✅ Completed' : '❌ Declined'}
                </div>
            </div>
            
            <div class="order-card-body">
                <div class="customer-info-section">
                    <h4>Customer Information</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M9 9C11.4853 9 13.5 6.98528 13.5 4.5C13.5 2.01472 11.4853 0 9 0C6.51472 0 4.5 2.01472 4.5 4.5C4.5 6.98528 6.51472 9 9 9Z" stroke="currentColor" stroke-width="1.5"/>
                                <path d="M9 11.25C5.27208 11.25 2.25 13.5221 2.25 16.5V18H15.75V16.5C15.75 13.5221 12.7279 11.25 9 11.25Z" stroke="currentColor" stroke-width="1.5"/>
                            </svg>
                            <div>
                                <span class="info-label">Name</span>
                                <span class="info-value">${order.customerName}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M2 4H14M2 4V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V4M2 4L2 2C2 1.44772 2.44772 1 3 1H13C13.5523 1 14 1.44772 14 2V4M5 6H11M5 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <div>
                                <span class="info-label">Phone</span>
                                <span class="info-value">${order.customerPhone}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="service-info-section">
                    <h4>Service Details</h4>
                    <div class="service-details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Service Type</span>
                            <span class="detail-value">${order.serviceType}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Service Charge</span>
                            <span class="detail-value price">₹${order.servicePrice}</span>
                        </div>
                        ${order.preferredTime ? `
                        <div class="detail-item">
                            <span class="detail-label">Preferred Time</span>
                            <span class="detail-value">${order.preferredTime}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="address-section">
                    <h4>Service Address</h4>
                    <div class="address-info">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1Z" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M9 4V9L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <div>
                            <p>${order.customerAddress}</p>
                            ${order.landmark ? `<p class="landmark">Landmark: ${order.landmark}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="order-card-footer">
                ${actionButtons}
            </div>
        </div>
    `;
}

// Attach event listeners
function attachOrderListeners() {
    // Accept buttons
    const acceptButtons = document.querySelectorAll('.btn-accept');
    acceptButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            acceptOrder(orderId);
        });
    });
    
    // Decline buttons
    const declineButtons = document.querySelectorAll('.btn-decline');
    declineButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            declineOrder(orderId);
        });
    });
    
    // Complete buttons
    const completeButtons = document.querySelectorAll('.btn-complete');
    completeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            completeOrder(orderId);
        });
    });
}

// Accept order
function acceptOrder(orderId) {
    if (!confirm('Are you sure you want to accept this order?')) {
        return;
    }
    
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        order.status = orderStatus.ACCEPTED;
        order.technicianId = userData.email || 'tech_' + Date.now();
        order.acceptedDate = new Date().toISOString();
        
        saveOrders();
        displayOrders();
        updateStats();
        
        alert('Order accepted successfully!');
    }
}

// Decline order
function declineOrder(orderId) {
    if (!confirm('Are you sure you want to decline this order? This action cannot be undone.')) {
        return;
    }
    
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
        order.status = orderStatus.DECLINED;
        
        saveOrders();
        displayOrders();
        updateStats();
        
        alert('Order declined.');
    }
}

// Complete order
function completeOrder(orderId) {
    if (!confirm('Mark this order as completed?')) {
        return;
    }
    
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
        order.status = orderStatus.COMPLETED;
        order.completedDate = new Date().toISOString();
        
        // Also update customer booking status
        const customerBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const booking = customerBookings.find(b => b.id === orderId);
        if (booking) {
            booking.status = 'completed';
            booking.completedDate = order.completedDate;
            localStorage.setItem('userBookings', JSON.stringify(customerBookings));
        }
        
        saveOrders();
        displayOrders();
        updateStats();
        
        alert('Order marked as completed!');
    }
}

// Update statistics
function updateStats() {
    const pendingCount = allOrders.filter(o => o.status === orderStatus.PENDING).length;
    const acceptedCount = allOrders.filter(o => o.status === orderStatus.ACCEPTED).length;
    const completedCount = allOrders.filter(o => o.status === orderStatus.COMPLETED).length;
    
    const pendingEl = document.getElementById('pendingCount');
    const acceptedEl = document.getElementById('acceptedCount');
    const completedEl = document.getElementById('completedCount');
    
    if (pendingEl) pendingEl.textContent = pendingCount;
    if (acceptedEl) acceptedEl.textContent = acceptedCount;
    if (completedEl) completedEl.textContent = completedCount;
}

// Setup tab filters
function setupTabs() {
    const tabs = document.querySelectorAll('.order-tabs .tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            // Update filter
            currentFilter = this.getAttribute('data-filter');
            // Refresh display
            displayOrders();
        });
    });
}

