import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Removed BANK_PORT and listen to avoid separate server

app.post('/api/procesar-pago', (req, res) => { 
  const datos = req.body;

  // Parse valor as number safely
  const valorNum = Number(datos.valor);
  const aprobado = !isNaN(valorNum) && valorNum < 1000000;

  res.json({
    estado: aprobado ? 'Aprobado' : 'Rechazado',
    datos: datos
  });
});

// Removed app.listen to avoid separate server
