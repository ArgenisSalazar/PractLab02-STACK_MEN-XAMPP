import { Router } from 'express'
import pool from '../database.js'

const router = Router();

router.get('/addcli', (req, res) => {
    res.render('clientes/add');
});

router.post('/addcli', async(req, res) => {
    try {
        const { nomcli, apecli, nrodnicli, telcli } = req.body;
        const newCliente = {
            nomcli, apecli, nrodnicli, telcli
        }
        await pool.query('INSERT INTO cliente SET ?', [newCliente]);
        res.redirect('/listcli');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/listcli', async(req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM cliente');
        res.render('clientes/list', { clientes: result });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/editcli/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const [cliente] = await pool.query('SELECT * FROM cliente WHERE idcli = ?', [id]);
        const clienteEdit = cliente[0];
        res.render('clientes/edit', { cliente: clienteEdit });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/editcli/:id', async(req, res) => {
    try {
        const { nomcli, apecli, nrodnicli, telcli } = req.body;
        const { id } = req.params;
        const editCliente = { nomcli, apecli, nrodnicli, telcli };
        await pool.query('UPDATE cliente SET ? WHERE idcli = ?', [editCliente, id]);
        res.redirect('/listcli');
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/deletecli/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        await pool.query('DELETE FROM cliente WHERE idcli = ?', [id]);
        res.redirect('/listcli');
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});

export default router;
