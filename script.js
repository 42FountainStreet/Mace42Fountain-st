document.addEventListener('DOMContentLoaded', () => {
    const desks = Array.from({ length: 12 }, (_, i) => `Desk ${i + 1}`);
    const desksContainer = document.getElementById('desks');
    const bookingDateInput = document.getElementById('booking-date');
    const adminResetButton = document.getElementById('admin-reset');
    const adminPassword = 'Test123'; // Updated password

    const loadBookings = () => {
        return JSON.parse(localStorage.getItem('bookings')) || {};
    };

    const saveBookings = (bookings) => {
        localStorage.setItem('bookings', JSON.stringify(bookings));
    };

    const renderDesks = () => {
        const bookings = loadBookings();
        const selectedDate = bookingDateInput.value || new Date().toISOString().split('T')[0];
        desksContainer.innerHTML = '';
        desks.forEach(desk => {
            const deskDiv = document.createElement('div');
            deskDiv.className = 'desk';
            deskDiv.innerHTML = `🪑 ${desk}`;
            if (bookings[desk] && bookings[desk].date === selectedDate) {
                deskDiv.classList.add('booked');
                deskDiv.innerHTML += ` - Booked by ${bookings[desk].user}`;
                deskDiv.addEventListener('click', () => {
                    if (confirmAdminPassword()) {
                        cancelBooking(desk, selectedDate);
                    }
                });
            } else {
                deskDiv.addEventListener('click', () => bookDesk(desk, selectedDate));
            }
            desksContainer.appendChild(deskDiv);
        });
    };

    const bookDesk = (desk, date) => {
        const user = prompt('Enter your name:');
        if (!user) return;
        const bookings = loadBookings();
        if (bookings[desk] && bookings[desk].date === date) {
            alert('This desk is already booked. Please contact the admin to overwrite.');
        } else {
            bookings[desk] = { date, user };
            saveBookings(bookings);
            renderDesks();
        }
    };

    const cancelBooking = (desk, date) => {
        const bookings = loadBookings();
        if (bookings[desk] && bookings[desk].date === date) {
            delete bookings[desk];
            saveBookings(bookings);
            renderDesks();
        }
    };

    const adminReset = () => {
        const password = prompt('Enter admin password:');
        if (password === adminPassword) {
            localStorage.removeItem('bookings');
            renderDesks();
            alert('All bookings have been reset.');
        } else {
            alert('Incorrect password.');
        }
    };

    const confirmAdminPassword = () => {
        const password = prompt('Enter admin password to overwrite booking:');
        return password === adminPassword;
    };

    bookingDateInput.addEventListener('change', renderDesks);
    adminResetButton.addEventListener('click', adminReset);
    renderDesks();
});


