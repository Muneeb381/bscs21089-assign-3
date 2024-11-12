const express = require('express');
const fs = require('fs').promises;
const app = express();
const PORT = 3000;
const dataFile = 'data.json';

app.use(express.json()); 

async function readData() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading data:", err);
    return [];
  }
}

async function writeData(data) {
  try {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    console.log("Data saved successfully.");
  } catch (err) {
    console.error("Error writing data:", err);
  }
}

app.post('/users', async (req, res) => {
  const newUser = req.body;
  const data = await readData();
  data.push(newUser);
  await writeData(data);
  res.status(201).json({ message: 'User created successfully', user: newUser });
});

app.get('/users', async (req, res) => {
  const data = await readData();
  res.status(200).json(data);
});

app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updatedFields = req.body;
  const data = await readData();
  const index = data.findIndex(user => user.id === id);

  if (index !== -1) {
    data[index] = { ...data[index], ...updatedFields };
    await writeData(data);
    res.status(200).json({ message: 'User updated successfully', user: data[index] });
  } else {
    res.status(404).json({ message: `User with ID ${id} not found.` });
  }
});

app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = await readData();
  const newData = data.filter(user => user.id !== id);

  if (newData.length !== data.length) {
    await writeData(newData);
    res.status(200).json({ message: `User with ID ${id} deleted successfully.` });
  } else {
    res.status(404).json({ message: `User with ID ${id} not found.` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
