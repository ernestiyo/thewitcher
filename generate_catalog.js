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

    // Map of folder names to official titles and metadata
    const metadata = {
        "Last_Wish": {
            title: "The Last Wish",
            year: "1993",
            desc: "Geralt of Rivia is a Witcher. A cunning sorcerer. A merciless assassin. And a cold-blooded killer. His sole purpose: to destroy the monsters that plague the world. But not everything monstrous-looking is evil and not everything fair is good. And in every fairy tale there is a grain of truth."
        },
        "Sword_Destiny": {
            title: "Sword of Destiny",
            year: "1992",
            desc: "Geralt is a Witcher, a man whose magic powers, enhanced by long training and a mysterious elixir, have made him a brilliant fighter and a merciless assassin. Yet he is no ordinary murderer: his targets are the multifarious monsters and vile fiends that ravage the land and attack the innocent."
        },
        "Blood_Elves": {
            title: "Blood of Elves",
            year: "1994",
            desc: "For over a century, humans, dwarves, gnomes, and elves have lived together in relative peace. But times have changed, the uneasy peace is over, and now the races are fighting once again. The only good elf, it seems, is a dead elf."
        },
        "Time_Contempt": {
            title: "Time of Contempt",
            year: "1995",
            desc: "Geralt is a Witcher: guardian of the innocent; protector of those in need; a defender in dark times against some of the most frightening creatures of myth and legend. His task now is to protect Ciri. A child of prophecy, she will have the power to change the world for good or for evil."
        },
        "Baptism_Fire": {
            title: "Baptism of Fire",
            year: "1996",
            desc: "The Wizards Guild has been shattered by a coup, and, in the uproar, Geralt was seriously injured. The Witcher is supposed to be a guardian of the innocent, a protector of those in need, a defender against powerful and dangerous monsters that prey on men in dark times."
        },
        "Tower_Swallows": {
            title: "The Tower of the Swallows",
            year: "1997",
            desc: "The world has fallen into war. Ciri, the child of prophecy, has vanished. Hunted by friends and foes alike, she has taken on the guise of a petty bandit and lives free for the first time in her life. But the net around her is closing. Geralt, the Witcher, has assembled a group of allies determined to rescue her."
        },
        "Lady_Lake": {
            title: "The Lady of the Lake",
            year: "1999",
            desc: "After walking through the portal in the Tower of Swallows while narrowly escaping death, Ciri finds herself in a completely different world... an Elven world. She is trapped with no way out. Time does not seem to exist and there are no obvious borders or portals to cross back into her home world."
        },
        "Season_Storms": {
            title: "Season of Storms",
            year: "2013",
            desc: "Geralt of Rivia is a Witcher, one of the few capable of hunting the monsters that prey on humanity. A mutant who is tasked with killing unnatural beings. He uses magical signs, potions, and the pride of every Witcher – two swords, steel and silver. But a contract has gone wrong, and Geralt finds himself without his signature weapons."
        }
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
                const meta = metadata[entry.name] || {};
                books.push({
                    id: entry.name,
                    title: meta.title || entry.name.replace(/_/g, ' '),
                    year: meta.year || "Unknown",
                    desc: meta.desc || "No description available.",
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
