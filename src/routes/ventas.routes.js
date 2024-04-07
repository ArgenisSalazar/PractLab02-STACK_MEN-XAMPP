import { Router } from 'express';
import pool from '../database.js';

const router = Router();

router.get('/addvent', async (req, res) => {
    try {
        const [clientes] = await pool.query('SELECT idcli, nomcli FROM cliente');
        const [productos] = await pool.query('SELECT idprod, nombre FROM producto');
        res.render('ventas/add', { clientes, productos });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/addvent', async (req, res) => {
    try {
        const { idcli, idprod, cantidad, fecha } = req.body;
        const newVenta = {
            idcli, idprod, cantidad, fecha_venta: fecha
        };
        await pool.query('INSERT INTO venta SET ?', [newVenta]);
        res.redirect('/listvent');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/listvent', async (req, res) => {
    try {
        const query = `
            SELECT venta.idventa, cliente.nomcli AS nombre_cliente, producto.nombre AS nombre_producto, venta.cantidad, venta.fecha_venta
            FROM venta
            INNER JOIN cliente ON venta.idcli = cliente.idcli
            INNER JOIN producto ON venta.idprod = producto.idprod
        `;
        const [result] = await pool.query(query);
        res.render('ventas/list', { ventas: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/editvent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [venta] = await pool.query('SELECT * FROM venta WHERE idventa = ?', [id]);
        res.render('ventas/edit', { venta: venta[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/editvent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { idcli, idprod, cantidad, fecha } = req.body;
        const editVenta = { idcli, idprod, cantidad, fecha_venta: fecha };
        await pool.query('UPDATE venta SET ? WHERE idventa = ?', [editVenta, id]);
        res.redirect('/listvent');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/deletevent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM venta WHERE idventa = ?', [id]);
        res.redirect('/listvent');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
