const app = {
    data: [],

    init: async () => {
        try {
            const response = await fetch('catalog.json');
            if (!response.ok) throw new Error('Failed to load catalog');
            app.data = await response.json();
            app.renderGrid();
            app.updateHero();
        } catch (error) {
            console.error(error);
            document.getElementById('book-grid').innerHTML = '<p style="color:var(--accent-primary)">Failed to load library data.</p>';
        }
    },

    renderGrid: () => {
        const grid = document.getElementById('book-grid');
        grid.innerHTML = ''; // Clear loading state

        app.data.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            // Link to Detail Page first
            card.onclick = () => window.location.href = `detail.html?book=${encodeURIComponent(book.id)}`;

            // Use default cover if missing, or use relative path
            const coverSrc = book.cover ? book.cover : 'placeholder.jpg';

            card.innerHTML = `
                <div class="book-cover-container">
                    <img src="${coverSrc}" alt="${book.title}" class="book-cover" onerror="this.style.display='none'">
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${book.year}</div>
                </div>
            `;
            grid.appendChild(card);
        });

        // Re-init icons if any added dynamically (not needed for cards usually but good practice)
        if (window.lucide) lucide.createIcons();
    },

    updateHero: () => {
        // Optional: Randomly pick a featured book for the hero background?
        // For now we keep the static cool wallpaper in CSS,
        // but let's at least change the CTA if we have data.
        if (app.data.length > 0) {
            // Logic to feature the first book or random
        }
    }
};

// Start App
document.addEventListener('DOMContentLoaded', app.init);
