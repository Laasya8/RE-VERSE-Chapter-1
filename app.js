document.addEventListener('DOMContentLoaded', () => {
    // Initialize Leaflet Map
    const map = L.map('map').setView([15, 0], 4);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    let currentMarker = null;
    let guardianMarkers = [];
    let lastPhraseIndex = -1;

    const dummyPhrases = [
        "lol…do you think finding the sword is that easy?",
        "wrong place,hero!",
        "Not here , keep going",
        "So close... but its empty here! Try again"
    ];

    // The correct spell fragments (in the right order)
    const CORRECT_SPELL = "The Man Who Walked With Shadows COMEBACK For A Reason Believing Fighting is Only Way To Save the World";
    // The sword's true name
    const SWORD_TRUE_NAME = "Eldryth";

    function getRandomPhrase() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * dummyPhrases.length);
        } while (newIndex === lastPhraseIndex && dummyPhrases.length > 1);
        lastPhraseIndex = newIndex;
        return dummyPhrases[newIndex];
    }

    const form = document.getElementById('mapForm');
    const latInput = document.getElementById('lat');
    const lngInput = document.getElementById('lng');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const latStr = latInput.value.trim();
        const lngStr = lngInput.value.trim();
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (isNaN(lat) || isNaN(lng)) {
            alert('Please enter valid numeric coordinates.');
            return;
        }
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            alert('Coordinates out of range. Latitude must be -90 to 90, Longitude -180 to 180.');
            return;
        }

        // Remove old markers
        if (currentMarker) {
            map.removeLayer(currentMarker);
            currentMarker = null;
        }
        guardianMarkers.forEach(m => map.removeLayer(m));
        guardianMarkers = [];

        // === CORRECT COORDINATES ===
        if (latStr === "17.285" && lngStr === "78.486") {
            map.flyTo([lat, lng], 15, { animate: true, duration: 2.5 });

            setTimeout(() => {
                // Create AMETHYST RUNE RING icon (Circling Shields Effect)
                const swordIcon = L.divIcon({
                    className: 'custom-sword-icon guarded-sword',
                    html: `
                        <div class="amethyst-rune-ring">
                            <svg viewBox="0 0 100 100">
                                <circle class="rune-ring-svg outer" cx="50" cy="50" r="45" />
                                <circle class="rune-ring-svg inner" cx="50" cy="50" r="30" />
                            </svg>
                        </div>
                        <div class="sword-marker-container guarded">🗡️</div>
                    `,
                    iconSize: [100, 100],
                    iconAnchor: [50, 50],
                    tooltipAnchor: [0, -60]
                });

                currentMarker = L.marker([lat, lng], { icon: swordIcon }).addTo(map);
                currentMarker.bindTooltip('Guarded by spirits', {
                    permanent: true,
                    direction: 'top',
                    className: 'custom-tooltip amethyst-guarded-label'
                });

                // Make sword clickable — triggers the Manuscript reveal
                currentMarker.on('click', () => {
                    showSpellNote();
                });

            }, 2500);

        } else if ((latStr === "11.1" && lngStr === "67.6")
            || (latStr === "56.4" && lngStr === "88.45")
            || (latStr === "47.89" && lngStr === "79.478")) {
            let r2link = document.getElementById("round2Link");
            if (r2link) r2link.classList.add("d-none");

            map.flyTo([lat, lng], 8, { animate: true, duration: 2.0 });
            const randomPhrase = getRandomPhrase();

            setTimeout(() => {
                const ghostIcon = L.divIcon({
                    className: 'custom-sword-icon',
                    html: '<div class="sword-marker-container" style="filter:none;">👻</div>',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    tooltipAnchor: [0, -30]
                });
                currentMarker = L.marker([lat, lng], { icon: ghostIcon }).addTo(map);
                currentMarker.bindTooltip(randomPhrase, {
                    permanent: true,
                    direction: 'top',
                    className: 'custom-tooltip'
                });
            }, 1000);

        } else {
            let r2link = document.getElementById("round2Link");
            if (r2link) r2link.classList.add("d-none");

            map.flyTo([lat, lng], 12, { animate: true, duration: 1.5 });

            setTimeout(() => {
                currentMarker = L.marker([lat, lng]).addTo(map);
                currentMarker.bindTooltip(getRandomPhrase(), {
                    permanent: true,
                    direction: 'top',
                    className: 'custom-tooltip'
                });
            }, 1000);
        }
    });

    // ===== HIGH-FIDELITY HEX-GRID RITUAL =====
    function showSpellNote() {
        const overlay = document.getElementById('spell-note-overlay');
        const swordStage = document.getElementById('manuscriptSwordStage');
        const contentArea = document.getElementById('manuscriptContent');
        const nameReveal = document.getElementById('ritual-name-reveal');

        overlay.classList.remove('d-none');
        nameReveal.classList.remove('visible'); // Reset name
        requestAnimationFrame(() => overlay.classList.add('active'));

        // 1. Generate Sword & Hex-Shield Barrier
        swordStage.innerHTML = `
            <div id="manuscriptSwordWrap" style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
                <img src="sword.png" class="manuscript-sword-img" id="ritualSword" />
                <div class="hex-shield-container" id="ritualShield">
                    <div class="hex-grid-overlay"></div>
                </div>
            </div>
        `;

        // 2. Generate Focused Content Area
        contentArea.innerHTML = `
            <div class="ancient-note-body">
                <p class="spell-note-desc">
                    What you need isn’t hidden.<br/>
                    You’ve already found it<br/>
                    Fragments of lost melodies.<br/>
                </p>
                <div class="spell-input-wrap">
                    <input type="text" id="spellInput" class="spell-input" placeholder="Recall the fragments..." autocomplete="off" />
                    <p class="case-warning">(The spell is case-sensitive)</p>
                    <button id="spellSubmitBtn" class="spell-submit-btn">INVOKE SEALS</button>
                </div>
                <p id="spellError" class="spell-error"></p>
            </div>
        `;

        const spellInput = document.getElementById('spellInput');
        const spellSubmitBtn = document.getElementById('spellSubmitBtn');
        const spellError = document.getElementById('spellError');

        spellSubmitBtn.addEventListener('click', () => {
            const userSpell = spellInput.value.trim();
            if (userSpell === CORRECT_SPELL) {
                // SUCCESS: HEX-GRID RELEASE
                // 1. Immediately Clear the Stage (Hide description/input)
                contentArea.style.opacity = '0';
                contentArea.style.pointerEvents = 'none';

                // 2. Fragmented Shatter (Primary Focus)
                const shield = document.getElementById('ritualShield');
                if (shield) shield.classList.add('hex-shard-shatter');

                // 3. Sword Highlight & Frost Glow (Secondary Focus)
                const sword = document.getElementById('ritualSword');
                if (sword) {
                    setTimeout(() => {
                        sword.classList.add('sword-revealed-highlight');
                        sword.classList.add('frost-reveal-glow');
                    }, 400);
                }

                // 4. Reveal Name (NIXBLADE)
                setTimeout(() => {
                    nameReveal.classList.add('visible');
                    // Keep the space occupied to prevent layout shift! 
                    contentArea.style.visibility = 'hidden';
                }, 1000);

            } else {
                spellError.textContent = "The seal remains firm...";
                spellInput.classList.add('shake');
                setTimeout(() => spellInput.classList.remove('shake'), 500);
            }
        });

        spellInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                spellSubmitBtn.click();
            }
        };
    }
});
