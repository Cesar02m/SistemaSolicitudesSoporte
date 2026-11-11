
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Consultar todas las solicitudes
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM solicitudes ORDER BY id DESC'
        );
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar solicitudes' });
    }
});

// Consultar una solicitud por folio
router.get('/:folio', async (req, res) => {
    try {
        const { folio } = req.params;
        const resultado = await pool.query(
            'SELECT * FROM solicitudes WHERE folio = $1',
            [folio]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar solicitud' });
    }
});

// Registrar una solicitud
router.post('/', async (req, res) => {
    try {
        const {
            nombre,
            correo,
            categoria,
            prioridad,
            descripcion
        } = req.body;

        if (!nombre || !correo || !categoria || !prioridad || !descripcion) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            });
        }

        const resultado = await pool.query(
            `INSERT INTO solicitudes
            (folio, nombre, correo, categoria, prioridad, descripcion)
            VALUES (
                'SOP-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' ||
                LPAD(nextval('solicitudes_folio_seq')::TEXT, 5, '0'),
                $1, $2, $3, $4, $5
            )
            RETURNING *`,
            [nombre, correo, categoria, prioridad, descripcion]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar solicitud' });
    }
});

module.exports = router;
