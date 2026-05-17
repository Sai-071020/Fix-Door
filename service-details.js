// Map service slugs to service keys
const serviceNameMap = {
    'ac-repair': 'ac repair',
    'refrigerator-repair': 'refrigerator repair',
    'electrician': 'electrician',
    'washing-machine-repair': 'washing machine repair',
    'microwave-repair': 'microwave repair',
    'household-technician': 'household technician',
    'solar-panel-repair': 'solar panel repair',
    'cctv-repair': 'cctv repair',
    'switch-&-socket': 'switch & socket',
    'light-repair': 'light repair',
    'mcb-/-fuse': 'mcb / fuse',
    'doorbell-&-security': 'doorbell & security',
    'wiring': 'wiring',
    'plumbing': 'plumbing'
};

// Technician Data
const techniciansData = {
    mumbai: {
        "ac repair": [
            {
                id: 1,
                name: "Rajesh Kumar",
                experience: "8 years",
                rating: 4.8,
                reviews: 245,
                price: 500,
                profile: "Expert in AC installation, repair, and maintenance. Specialized in all major brands.",
                image: "👨‍🔧",
                verified: true
            },
            {
                id: 2,
                name: "Amit Sharma",
                experience: "12 years",
                rating: 4.9,
                reviews: 389,
                price: 600,
                profile: "Certified AC technician with extensive experience in commercial and residential AC systems.",
                image: "👨‍💼",
                verified: true
            },
            {
                id: 3,
                name: "Vikram Singh",
                experience: "6 years",
                rating: 4.7,
                reviews: 156,
                price: 450,
                profile: "Quick and reliable AC repair services. Available 24/7 for emergency repairs.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "refrigerator repair": [
            {
                id: 4,
                name: "Suresh Patel",
                experience: "10 years",
                rating: 4.8,
                reviews: 312,
                price: 550,
                profile: "Specialized in refrigerator and freezer repairs. Expert in all major brands.",
                image: "👨‍🔧",
                verified: true
            },
            {
                id: 5,
                name: "Manoj Desai",
                experience: "7 years",
                rating: 4.6,
                reviews: 198,
                price: 500,
                profile: "Quick refrigerator repair services with genuine parts guarantee.",
                image: "👨‍💼",
                verified: true
            }
        ],
        "electrician": [
            {
                id: 6,
                name: "Ramesh Iyer",
                experience: "15 years",
                rating: 4.9,
                reviews: 456,
                price: 400,
                profile: "Licensed electrician with expertise in home wiring, panel upgrades, and repairs.",
                image: "👨‍🔧",
                verified: true
            },
            {
                id: 7,
                name: "Kiran Reddy",
                experience: "9 years",
                rating: 4.7,
                reviews: 267,
                price: 350,
                profile: "Professional electrical services for homes and offices. Safety certified.",
                image: "👨‍💼",
                verified: true
            },
            {
                id: 8,
                name: "Anil Joshi",
                experience: "11 years",
                rating: 4.8,
                reviews: 334,
                price: 450,
                profile: "Expert in electrical troubleshooting, installations, and maintenance.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "washing machine repair": [
            {
                id: 9,
                name: "Prakash Mehta",
                experience: "9 years",
                rating: 4.7,
                reviews: 223,
                price: 500,
                profile: "Specialized in washing machine repairs for top and front load machines.",
                image: "👨‍🔧",
                verified: true
            },
            {
                id: 10,
                name: "Deepak Shah",
                experience: "6 years",
                rating: 4.6,
                reviews: 145,
                price: 450,
                profile: "Quick and efficient washing machine repair services with warranty.",
                image: "👨‍💼",
                verified: true
            }
        ],
        "microwave repair": [
            {
                id: 11,
                name: "Naresh Gupta",
                experience: "8 years",
                rating: 4.8,
                reviews: 189,
                price: 400,
                profile: "Expert in microwave oven repairs and maintenance for all brands.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "household technician": [
            {
                id: 12,
                name: "Mahesh Rao",
                experience: "14 years",
                rating: 4.9,
                reviews: 512,
                price: 600,
                profile: "All-in-one household technician for all your home appliance needs.",
                image: "👨‍💼",
                verified: true
            },
            {
                id: 13,
                name: "Sandeep Nair",
                experience: "10 years",
                rating: 4.7,
                reviews: 298,
                price: 550,
                profile: "Versatile technician handling multiple household appliances and repairs.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "solar panel repair": [
            {
                id: 14,
                name: "Arjun Menon",
                experience: "7 years",
                rating: 4.8,
                reviews: 167,
                price: 800,
                profile: "Certified solar panel installation and repair specialist.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "cctv repair": [
            {
                id: 15,
                name: "Ravi Kumar",
                experience: "11 years",
                rating: 4.7,
                reviews: 234,
                price: 500,
                profile: "Expert in CCTV installation, repair, and maintenance for homes and businesses.",
                image: "👨‍💼",
                verified: true
            },
            {
                id: 16,
                name: "Sunil Verma",
                experience: "8 years",
                rating: 4.6,
                reviews: 189,
                price: 450,
                profile: "Professional CCTV services with modern security solutions.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "switch & socket": [
            { id: 101, name: "Arjun Nair", experience: "6 years", rating: 4.7, reviews: 142, price: 200, profile: "Expert in switch, socket and modular fitting repairs.", image: "👨‍🔧", verified: true },
            { id: 102, name: "Deepak Rao", experience: "9 years", rating: 4.8, reviews: 198, price: 250, profile: "Fast switch & socket replacement with quality materials.", image: "👨‍💼", verified: true }
        ],
        "light repair": [
            { id: 103, name: "Kiran Mehta", experience: "7 years", rating: 4.6, reviews: 113, price: 180, profile: "Light fixture installation, LED & tube light repairs.", image: "👨‍🔧", verified: true },
            { id: 104, name: "Sanjay Pillai", experience: "5 years", rating: 4.5, reviews: 87, price: 150, profile: "Quick LED, CFL and tube light repairs & replacements.", image: "👨‍💼", verified: true }
        ],
        "mcb / fuse": [
            { id: 105, name: "Ganesh Kumar", experience: "10 years", rating: 4.8, reviews: 175, price: 300, profile: "MCB, fuse box repair & upgrades for homes and shops.", image: "👨‍🔧", verified: true },
            { id: 106, name: "Nandhu Prasad", experience: "8 years", rating: 4.7, reviews: 143, price: 280, profile: "Certified electrician for MCB & panel board work.", image: "👨‍💼", verified: true }
        ],
        "doorbell & security": [
            { id: 107, name: "Vinod Thomas", experience: "6 years", rating: 4.6, reviews: 96, price: 220, profile: "Doorbell, video door phone & security alarm installation.", image: "👨‍🔧", verified: true },
            { id: 108, name: "Pradeep Joshi", experience: "8 years", rating: 4.7, reviews: 128, price: 250, profile: "Smart doorbell & home security system specialist.", image: "👨‍💼", verified: true }
        ],
        "wiring": [
            { id: 109, name: "Balachandran S", experience: "12 years", rating: 4.9, reviews: 267, price: 400, profile: "House wiring, rewiring & conduit pipe work expert.", image: "👨‍🔧", verified: true },
            { id: 110, name: "Suresh Mohan", experience: "10 years", rating: 4.8, reviews: 214, price: 350, profile: "Full house wiring and panel installation services.", image: "👨‍💼", verified: true }
        ],
        "plumbing": [
            { id: 111, name: "Rajan Verma", experience: "9 years", rating: 4.7, reviews: 189, price: 300, profile: "Pipe repair, leakage fix & bathroom fitting specialist.", image: "👨‍🔧", verified: true },
            { id: 112, name: "Mohan Das", experience: "11 years", rating: 4.8, reviews: 231, price: 350, profile: "Expert plumber for kitchens, bathrooms & water lines.", image: "👨‍💼", verified: true }
        ]
    },
    delhi: {
        "ac repair": [
            {
                id: 17,
                name: "Mohit Agarwal",
                experience: "9 years",
                rating: 4.8,
                reviews: 312,
                price: 550,
                profile: "Expert AC technician serving Delhi NCR. Specialized in all major brands.",
                image: "👨‍🔧",
                verified: true
            },
            {
                id: 18,
                name: "Rohit Malhotra",
                experience: "13 years",
                rating: 4.9,
                reviews: 445,
                price: 650,
                profile: "Certified AC repair specialist with extensive experience.",
                image: "👨‍💼",
                verified: true
            }
        ],
        "electrician": [
            {
                id: 19,
                name: "Ajay Khanna",
                experience: "12 years",
                rating: 4.8,
                reviews: 356,
                price: 450,
                profile: "Licensed electrician providing quality electrical services in Delhi.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "refrigerator repair": [
            {
                id: 20,
                name: "Vishal Jain",
                experience: "8 years",
                rating: 4.7,
                reviews: 234,
                price: 520,
                profile: "Professional refrigerator repair services in Delhi.",
                image: "👨‍💼",
                verified: true
            }
        ],
        "washing machine repair": [
            {
                id: 21,
                name: "Ankit Bansal",
                experience: "7 years",
                rating: 4.6,
                reviews: 198,
                price: 480,
                profile: "Expert washing machine repair technician.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "microwave repair": [
            {
                id: 22,
                name: "Gaurav Singh",
                experience: "6 years",
                rating: 4.7,
                reviews: 156,
                price: 420,
                profile: "Quick microwave repair services in Delhi.",
                image: "👨‍💼",
                verified: true
            }
        ],
        "household technician": [
            {
                id: 23,
                name: "Tarun Mehta",
                experience: "11 years",
                rating: 4.8,
                reviews: 389,
                price: 600,
                profile: "All-in-one household technician for Delhi residents.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "solar panel repair": [
            {
                id: 24,
                name: "Karan Kapoor",
                experience: "8 years",
                rating: 4.7,
                reviews: 178,
                price: 850,
                profile: "Solar panel installation and repair specialist.",
                image: "👨‍💼",
                verified: true
            }
        ],
        "cctv repair": [
            {
                id: 25,
                name: "Nikhil Sharma",
                experience: "10 years",
                rating: 4.8,
                reviews: 267,
                price: 550,
                profile: "Professional CCTV installation and repair services.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "switch & socket": [
            { id: 201, name: "Arvind Gupta", experience: "7 years", rating: 4.7, reviews: 132, price: 200, profile: "Switch & socket repair and modular fitting in Delhi.", image: "👨‍🔧", verified: true }
        ],
        "light repair": [
            { id: 202, name: "Rohit Yadav", experience: "5 years", rating: 4.5, reviews: 98, price: 160, profile: "LED, CFL and tube light repair in Delhi.", image: "👨‍💼", verified: true }
        ],
        "mcb / fuse": [
            { id: 203, name: "Pradeep Singh", experience: "9 years", rating: 4.8, reviews: 154, price: 290, profile: "MCB and fuse box specialist for Delhi homes.", image: "👨‍🔧", verified: true }
        ],
        "doorbell & security": [
            { id: 204, name: "Rahul Mishra", experience: "6 years", rating: 4.6, reviews: 87, price: 230, profile: "Doorbell & security alarm installation in Delhi.", image: "👨‍💼", verified: true }
        ],
        "wiring": [
            { id: 205, name: "Anil Kumar", experience: "11 years", rating: 4.9, reviews: 245, price: 400, profile: "Full house wiring & rewiring expert in Delhi.", image: "👨‍🔧", verified: true }
        ],
        "plumbing": [
            { id: 206, name: "Satish Bhatt", experience: "8 years", rating: 4.7, reviews: 176, price: 300, profile: "Leakage fix, pipe repair & bathroom fittings in Delhi.", image: "👨‍💼", verified: true }
        ]
    },
    bangalore: {
        "ac repair": [
            {
                id: 26,
                name: "Srinivas Reddy",
                experience: "10 years",
                rating: 4.8,
                reviews: 298,
                price: 500,
                profile: "Expert AC repair services in Bangalore.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "electrician": [
            {
                id: 27,
                name: "Venkatesh Iyer",
                experience: "14 years",
                rating: 4.9,
                reviews: 412,
                price: 400,
                profile: "Licensed electrician serving Bangalore.",
                image: "👨‍💼",
                verified: true
            }
        ],
        "refrigerator repair": [
            {
                id: 28,
                name: "Raghavendra",
                experience: "9 years",
                rating: 4.7,
                reviews: 245,
                price: 530,
                profile: "Professional refrigerator repair technician.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "washing machine repair": [
            {
                id: 29,
                name: "Karthik",
                experience: "7 years",
                rating: 4.6,
                reviews: 189,
                price: 470,
                profile: "Expert washing machine repair services.",
                image: "👨‍💼",
                verified: true
            }
        ],
        "microwave repair": [
            {
                id: 30,
                name: "Praveen",
                experience: "8 years",
                rating: 4.7,
                reviews: 167,
                price: 410,
                profile: "Quick microwave repair in Bangalore.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "household technician": [
            {
                id: 31,
                name: "Murali",
                experience: "12 years",
                rating: 4.8,
                reviews: 356,
                price: 580,
                profile: "Versatile household technician.",
                image: "👨‍💼",
                verified: true
            }
        ],
        "solar panel repair": [
            {
                id: 32,
                name: "Rajendra",
                experience: "9 years",
                rating: 4.8,
                reviews: 201,
                price: 820,
                profile: "Solar panel specialist in Bangalore.",
                image: "👨‍🔧",
                verified: true
            }
        ],
        "cctv repair": [
            {
                id: 33,
                name: "Suresh",
                experience: "10 years",
                rating: 4.7,
                reviews: 223,
                price: 520,
                profile: "CCTV installation and repair expert.",
                image: "👨‍💼",
                verified: true
            }
        ],
        "switch & socket": [
            { id: 301, name: "Krishnamurthy V", experience: "8 years", rating: 4.8, reviews: 145, price: 200, profile: "Switch & socket repair and modular fittings in Bangalore.", image: "👨‍🔧", verified: true }
        ],
        "light repair": [
            { id: 302, name: "Manjunath H", experience: "6 years", rating: 4.6, reviews: 112, price: 170, profile: "LED & tube light repair and installation in Bangalore.", image: "👨‍💼", verified: true }
        ],
        "mcb / fuse": [
            { id: 303, name: "Ranjith Kumar", experience: "10 years", rating: 4.8, reviews: 167, price: 300, profile: "MCB, fuse box repair & panel upgrades in Bangalore.", image: "👨‍🔧", verified: true }
        ],
        "doorbell & security": [
            { id: 304, name: "Aakash Reddy", experience: "5 years", rating: 4.5, reviews: 78, price: 220, profile: "Doorbell & security alarm fitting in Bangalore.", image: "👨‍💼", verified: true }
        ],
        "wiring": [
            { id: 305, name: "Shiva Prasad", experience: "12 years", rating: 4.9, reviews: 254, price: 380, profile: "House wiring & rewiring specialist in Bangalore.", image: "👨‍🔧", verified: true }
        ],
        "plumbing": [
            { id: 306, name: "Nagesh Gowda", experience: "9 years", rating: 4.7, reviews: 193, price: 320, profile: "Plumbing, pipe repair & bathroom fittings in Bangalore.", image: "👨‍💼", verified: true }
        ]
    }
};

// Add more cities with similar structure (simplified for other cities)
const addMoreCities = (cityName, baseData) => {
    techniciansData[cityName] = {};
    Object.keys(baseData).forEach(service => {
        techniciansData[cityName][service] = baseData[service].map(tech => ({
            ...tech,
            id: tech.id + 100,
            name: tech.name + " (" + cityName.charAt(0).toUpperCase() + cityName.slice(1) + ")",
            reviews: Math.floor(tech.reviews * 0.8)
        }));
    });
};

// Add data for other cities
addMoreCities("hyderabad", techniciansData.mumbai);
addMoreCities("chennai", techniciansData.mumbai);
addMoreCities("pune", techniciansData.mumbai);
addMoreCities("kolkata", techniciansData.mumbai);
addMoreCities("ahmedabad", techniciansData.mumbai);

// Get service name from URL
function getServiceFromURL() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('service') || '';
    try { return decodeURIComponent(raw); } catch(e) { return raw; }
}

// Check authentication
function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        // Redirect to home page with sign in prompt
        const serviceSlug = getServiceFromURL();
        if (serviceSlug) {
            sessionStorage.setItem('pendingService', serviceSlug);
        }
        window.location.href = 'index.html';
        return;
    }
    
    const serviceSlug = getServiceFromURL();
    if (serviceSlug) {
        updateServiceTitle(serviceSlug);
    }
    
    setupEventListeners();
});

// Update service title
function updateServiceTitle(serviceSlug) {
    const titleElement = document.getElementById('serviceTitle');
    if (titleElement) {
        const serviceName = serviceNameMap[serviceSlug.toLowerCase()] || serviceSlug.replace(/-/g, ' ');
        const formattedName = serviceName.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        titleElement.textContent = formattedName + " Technicians";
    }
}

// Setup event listeners
function setupEventListeners() {
    const citySelect = document.getElementById('citySelect');
    const sortSelect = document.getElementById('sortSelect');
    
    if (citySelect) {
        citySelect.addEventListener('change', handleCityChange);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
}

// Handle city selection
function handleCityChange() {
    const citySelect = document.getElementById('citySelect');
    const city = citySelect.value;
    const serviceSlug = getServiceFromURL().toLowerCase();
    const serviceName = serviceNameMap[serviceSlug] || serviceSlug.replace(/-/g, ' ');
    
    if (city && serviceName) {
        displayTechnicians(city, serviceName);
    } else if (city) {
        displayEmptyState('Please select a service from the homepage');
    } else {
        displayEmptyState('Select a city to view available technicians');
    }
}

// Handle sort change
function handleSortChange() {
    const citySelect = document.getElementById('citySelect');
    const city = citySelect.value;
    const serviceSlug = getServiceFromURL().toLowerCase();
    const serviceName = serviceNameMap[serviceSlug] || serviceSlug.replace(/-/g, ' ');
    
    if (city && serviceName) {
        displayTechnicians(city, serviceName);
    }
}

// Display technicians
function displayTechnicians(city, serviceName) {
    const container = document.getElementById('techniciansContainer');
    if (!container) return;
    
    const technicians = techniciansData[city]?.[serviceName] || [];
    
    if (technicians.length === 0) {
        displayEmptyState('No technicians available for this service in the selected city');
        return;
    }
    
    // Store technicians globally for booking
    currentTechniciansList = technicians;
    
    // Sort technicians
    const sortBy = document.getElementById('sortSelect').value;
    let sortedTechnicians = [...technicians];
    
    switch(sortBy) {
        case 'rating':
            sortedTechnicians.sort((a, b) => b.rating - a.rating);
            break;
        case 'experience':
            sortedTechnicians.sort((a, b) => {
                const expA = parseInt(a.experience);
                const expB = parseInt(b.experience);
                return expB - expA;
            });
            break;
        case 'price':
            sortedTechnicians.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedTechnicians.sort((a, b) => b.price - a.price);
            break;
    }
    
    // Render technicians
    container.innerHTML = `
        <div class="technicians-header">
            <h2>${sortedTechnicians.length} Technician${sortedTechnicians.length > 1 ? 's' : ''} Available</h2>
        </div>
        <div class="technicians-grid">
            ${sortedTechnicians.map(tech => createTechnicianCard(tech)).join('')}
        </div>
    `;
    
    // Attach event listeners to all Book Now buttons
    attachBookButtonListeners();
}

// Attach event listeners to Book Now buttons
function attachBookButtonListeners() {
    const bookButtons = document.querySelectorAll('.btn-book');
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const techId = this.getAttribute('data-tech-id');
            const techName = this.getAttribute('data-tech-name');
            if (techId && techName) {
                bookTechnician(parseInt(techId), techName);
            }
        });
    });
}

// Create technician card HTML
function createTechnicianCard(tech) {
    const stars = '★'.repeat(Math.floor(tech.rating)) + '☆'.repeat(5 - Math.floor(tech.rating));
    
    return `
        <div class="technician-card">
            <div class="technician-header">
                <div class="technician-avatar">
                    <span class="avatar-icon">${tech.image}</span>
                    ${tech.verified ? '<span class="verified-badge">✓</span>' : ''}
                </div>
                <div class="technician-info">
                    <h3 class="technician-name">${tech.name}</h3>
                    <div class="technician-rating">
                        <span class="rating-stars">${stars}</span>
                        <span class="rating-value">${tech.rating}</span>
                        <span class="rating-count">(${tech.reviews} reviews)</span>
                    </div>
                </div>
            </div>
            
            <div class="technician-details">
                <div class="detail-item">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 1V17M1 9H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <span><strong>Experience:</strong> ${tech.experience}</span>
                </div>
                <div class="detail-item">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 9C11.4853 9 13.5 6.98528 13.5 4.5C13.5 2.01472 11.4853 0 9 0C6.51472 0 4.5 2.01472 4.5 4.5C4.5 6.98528 6.51472 9 9 9Z" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M9 11.25C5.27208 11.25 2.25 13.5221 2.25 16.5V18H15.75V16.5C15.75 13.5221 12.7279 11.25 9 11.25Z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    <span><strong>Profile:</strong> ${tech.profile}</span>
                </div>
            </div>
            
            <div class="technician-footer">
                <div class="technician-price">
                    <span class="price-label">Starting from</span>
                    <span class="price-value">₹${tech.price}</span>
                </div>
                <button class="btn-book" data-tech-id="${tech.id}" data-tech-name="${tech.name.replace(/"/g, '&quot;')}">
                    Book Now
                </button>
            </div>
        </div>
    `;
}

// Display empty state
function displayEmptyState(message) {
    const container = document.getElementById('techniciansContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style="margin-bottom: 24px; opacity: 0.5;">
                <circle cx="40" cy="40" r="30" stroke="currentColor" stroke-width="2"/>
                <path d="M40 25V40M40 40L50 50" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3>${message}</h3>
        </div>
    `;
}

// Store technicians data globally for booking
let currentTechniciansList = [];

// Book technician
function bookTechnician(technicianId, technicianName) {
    // Find technician data from the current list
    const technician = currentTechniciansList.find(tech => tech.id == technicianId);
    
    let techData;
    
    if (technician) {
        // Use technician data from list
        techData = {
            id: technician.id,
            name: technician.name,
            rating: technician.rating,
            experience: technician.experience,
            price: technician.price,
            image: technician.image
        };
    } else {
        // Fallback: Get technician data from the card
        const allCards = document.querySelectorAll('.technician-card');
        let technicianCard = null;
        
        // Find the card by technician name
        for (let card of allCards) {
            const nameElement = card.querySelector('.technician-name');
            if (nameElement && nameElement.textContent.trim() === technicianName) {
                technicianCard = card;
                break;
            }
        }
        
        if (!technicianCard) {
            // Last resort: use provided data with defaults
            techData = {
                id: technicianId,
                name: technicianName,
                rating: 4.5,
                experience: '5 years',
                price: 500,
                image: '👨‍🔧'
            };
        } else {
            // Extract technician data from DOM
            const ratingElement = technicianCard.querySelector('.rating-value');
            const experienceElements = technicianCard.querySelectorAll('.detail-item');
            const priceElement = technicianCard.querySelector('.price-value');
            const avatarElement = technicianCard.querySelector('.avatar-icon');
            
            const rating = ratingElement ? parseFloat(ratingElement.textContent) : 4.5;
            let experience = '';
            experienceElements.forEach(el => {
                const text = el.textContent;
                if (text.includes('Experience:')) {
                    experience = text.replace(/.*Experience:\s*/, '').trim();
                }
            });
            const price = priceElement ? parseInt(priceElement.textContent.replace('₹', '').replace(/,/g, '')) : 500;
            const image = avatarElement ? avatarElement.textContent.trim() : '👨‍🔧';
            
            techData = {
                id: technicianId,
                name: technicianName,
                rating: rating,
                experience: experience || '5 years',
                price: price,
                image: image
            };
        }
    }
    
    // Store technician data
    sessionStorage.setItem('selectedTechnician', JSON.stringify(techData));
    
    // Build URL with parameters
    const params = new URLSearchParams({
        techId: techData.id,
        name: encodeURIComponent(techData.name),
        rating: techData.rating,
        experience: encodeURIComponent(techData.experience),
        price: techData.price,
        image: encodeURIComponent(techData.image)
    });
    
    // Redirect to booking page
    window.location.href = `booking.html?${params.toString()}`;
}

