const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, 'Books');
const outputFile = path.join(__dirname, 'catalog.json');

// Helper to escape paths for web (windows backslashes to forward slashes)
const toWebPath = (fullPath) => {
    const relative = path.relative(__dirname, fullPath);
    return relative.split(path.sep).join('/');
};

function scanBooks() {
    if (!fs.existsSync(booksDir)) {
        console.error('Books directory not found!');
        return;
    }

    const books = [];
    const entries = fs.readdirSync(booksDir, { withFileTypes: true });

    // Map of folder names to official titles
    const titleMap = {
        "Baptism_Fire": "Baptism of Fire",
        "Blood_Elves": "Blood of Elves",
        "Lady_Lake": "The Lady of the Lake",
        "Last_Wish": "The Last Wish",
        "Season_Storms": "Season of Storms",
        "Sword_Destiny": "Sword of Destiny",
        "Time_Contempt": "Time of Contempt",
        "Tower_Swallows": "The Tower of the Swallows"
    };

    entries.forEach(entry => {
        if (entry.isDirectory()) {
            const bookPath = path.join(booksDir, entry.name);
            const content = fs.readdirSync(bookPath);

            // Find Cover (prefer *cover.jpg, then any jpg/png)
            const coverFile = content.find(file => file.toLowerCase().includes('cover') && (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')))
                || content.find(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));

            const pdfFile = content.find(file => file.endsWith('.pdf'));

            if (pdfFile) {
                books.push({
                    id: entry.name, // Folder name as ID
                    title: titleMap[entry.name] || entry.name.replace(/_/g, ' '), // Use map or fallback
                    cover: coverFile ? toWebPath(path.join(bookPath, coverFile)) : null,
                    pdf: toWebPath(path.join(bookPath, pdfFile))
                });
            }
        }
    });

    // Define Reading Order
    const readingOrder = [
        "Last_Wish",
        "Sword_Destiny",
        "Blood_Elves",
        "Time_Contempt",
        "Baptism_Fire",
        "Tower_Swallows",
        "Lady_Lake",
        "Season_Storms"
    ];

    // Sort books based on readingOrder
    books.sort((a, b) => {
        const indexA = readingOrder.indexOf(a.id);
        const indexB = readingOrder.indexOf(b.id);
        // If not found in order, put at the end
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

    fs.writeFileSync(outputFile, JSON.stringify(books, null, 2));
    console.log(`Successfully generated catalog with ${books.length} books.`);
    console.log(`Saved to: ${outputFile}`);
}

scanBooks();
