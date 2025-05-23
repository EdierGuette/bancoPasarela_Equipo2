import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'views')));

const PORT = process.env.PAYMENT_GATEWAY_PORT || 3001;

let datosPago = {};

// Banco payment processing logic extracted as a function
function procesarPago(datos) {
  const valorNum = Number(datos.valor);
  const aprobado = !isNaN(valorNum) && valorNum < 1000000;
  return {
    estado: aprobado ? 'Aprobado' : 'Rechazado',
    datos: datos
  };
}

app.post('/api/pagar', (req, res) => {
  datosPago = { ...req.body };
  if (datosPago.valor !== undefined) {
    datosPago.valor = datosPago.valor;
  }
  // Simulate payment status ID from bank
  const paymentStatusId = '12345'; // This should be replaced with real bank payment status ID logic

  // Simulate payment approval
  const paymentApproved = true;

  if (paymentApproved) {
    res.json({ paymentStatusId: paymentStatusId, redirectUrl: 'http://localhost:3003/' });
  } else {
    res.status(400).json({ error: 'Payment not approved' });
  }
});

app.get('/api/datos', (req, res) => {
  res.json(datosPago);
});

app.post('/api/procesar-pago', (req, res) => {
  const responseData = procesarPago(req.body);
  res.json(responseData);
});

app.post('/api/enviar-banco', (req, res) => {
  try {
    console.log('Request body received at /api/enviar-banco:', req.body);
    const bancoRequest = { ...req.body, valor: req.body.valor };
    console.log('Valor enviado al banco:', bancoRequest.valor);
    const responseData = procesarPago(bancoRequest);
    res.json(responseData);
  } catch (error) {
    console.error('Error processing payment:', error.message);
    res.status(500).send('Error processing payment.');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pagar.html'));
});

app.listen(PORT, () => {
  console.log(`Pasarela de pago corriendo en http://localhost:${PORT}`);
});
