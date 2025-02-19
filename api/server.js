import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// API Key middleware
async function validateApiKey(req, res, next) {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('key', apiKey)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  req.userId = data.user_id;
  next();
}

// Products endpoints
app.get('/api/products', validateApiKey, async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get('/api/products/:id', validateApiKey, async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(data);
});

// Categories endpoints
app.get('/api/categories', validateApiKey, async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get('/api/categories/:id', validateApiKey, async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Category not found' });
  }

  res.json(data);
});

// Orders endpoints
app.post('/api/orders', validateApiKey, async (req, res) => {
  const { first_name, last_name, email, items } = req.body;

  if (!first_name || !last_name || !email || !items || !items.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: req.userId,
      first_name,
      last_name,
      email,
      total,
      status: 'pending'
    }])
    .select()
    .single();

  if (orderError) {
    return res.status(500).json({ error: orderError.message });
  }

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    return res.status(500).json({ error: itemsError.message });
  }

  res.status(201).json(order);
});

app.get('/api/orders/:id', validateApiKey, async (req, res) => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (orderError) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  if (itemsError) {
    return res.status(500).json({ error: itemsError.message });
  }

  res.json({ ...order, items });
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});