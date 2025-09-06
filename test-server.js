const express = require('express');
const app = express();
const PORT = 5999;

app.get('/api/test', (req, res) => {
    res.json({ message: 'It works! 🎉' });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});