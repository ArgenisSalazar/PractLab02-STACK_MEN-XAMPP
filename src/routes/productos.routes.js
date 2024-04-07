import { Router } from 'express';
import pool from '../database.js';

const router = Router();

router.get('/addprod', (req, res) => {
    res.render('productos/add');
});

router.post('/addprod', async (req, res) => {
    try {
        const { nombre, precio, cantidad } = req.body;
        const newProducto = {
            nombre,
            precio,
            cantidad
        };
        await pool.query('INSERT INTO producto SET ?', [newProducto]);
        res.redirect('/listprod');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/listprod', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM producto');
        res.render('productos/list', { productos: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/editprod/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [producto] = await pool.query('SELECT * FROM producto WHERE idprod = ?', [id]);
        const productoEdit = producto[0];
        res.render('productos/edit', { producto: productoEdit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/editprod/:id', async (req, res) => {
    try {
        const { nombre, precio, cantidad } = req.body;
        const { id } = req.params;
        const editProducto = { nombre, precio, cantidad };
        await pool.query('UPDATE producto SET ? WHERE idprod = ?', [editProducto, id]);
        res.redirect('/listprod');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/deleteprod/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM producto WHERE idprod = ?', [id]);
        res.redirect('/listprod');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
