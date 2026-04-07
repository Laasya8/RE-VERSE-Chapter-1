export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { lat, lng } = req.body;

    const correctLat = process.env.CORRECT_LAT;
    const correctLng = process.env.CORRECT_LNG;

    if (lat === correctLat && lng === correctLng) {
        return res.status(200).json({ status: 'correct' });
    }

    const ghostCoordsStr = process.env.GHOST_COORDS || "";
    const ghostCoordsPairs = ghostCoordsStr.split(';');

    for (const pair of ghostCoordsPairs) {
        if (!pair) continue;
        const [gLat, gLng] = pair.split(',');
        if (lat === gLat && lng === gLng) {
            return res.status(200).json({ status: 'ghost' });
        }
    }

    return res.status(200).json({ status: 'none' });
}
