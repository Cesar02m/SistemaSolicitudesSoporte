
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const solicitudesRoutes = require('./routes/solicitudes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: 'API de solicitudes de soporte funcionando' });
});

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT NOW()');
        res.json({ api: 'ok', database: 'conectada' });
  } catch (error) {
    console.error('Error de conexión con Neon:', error);
    res.status(500).json({ api: 'ok', database: 'desconectada' });
}
});

app.use('/api/solicitudes', solicitudesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
