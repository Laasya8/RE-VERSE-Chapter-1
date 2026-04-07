export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { spell } = req.body;
    const correctSpell = process.env.CORRECT_SPELL;

    if (spell === correctSpell) {
        return res.status(200).json({ success: true, trueName: process.env.SWORD_TRUE_NAME });
    } else {
        return res.status(200).json({ success: false });
    }
}
