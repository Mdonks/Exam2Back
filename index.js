import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { database } from './database/connection.js';

const app = express();
const PORT = process.env.PORT || 7689;

app.use(express.json());
app.use(cors());

// Configuración de Multer para manejar la carga de imágenes en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', async (req, res) => {
  try {
    const sql = `SELECT * FROM Items`;
    const result = await database.any(sql);
    res.json(result);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});
app.get('/item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM Items WHERE id = $1`;
    const result = await database.query(sql, [id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

app.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, estado, categoria, precio } = req.body;
    const imagen = req.file ? req.file.buffer.toString('base64') : null;
    const params = [nombre, descripcion, estado, categoria, precio, imagen];
    const sql = `INSERT INTO Items
                (nombre, descripcion, estado, categoria, precio, imagen)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, 'Insertado con éxito' as mensaje`;

    const result = await database.one(sql, params);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ mensaje: err.message });
  }
});
app.delete('/item/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM Items WHERE id = $1 RETURNING 'Item eliminado con éxito' as mensaje`;
    const result = await database.query(sql, [id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
