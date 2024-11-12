const fs = require('fs').promises;
const dataFile = 'data.json';
// Helper function to read data from the JSON file
async function readData() {
try {
const data = await fs.readFile(dataFile, 'utf8');
return JSON.parse(data);
} catch (err) {
console.error("Error reading data:", err);
return [];
}
}
// Helper function to write data to the JSON file
async function writeData(data) {
try {
await fs.writeFile(dataFile, JSON.stringify(data, null,
2));
console.log("Data saved successfully.");
} catch (err) {
console.error("Error writing data:", err);
}
}
// Create a new item
async function createItem(newItem) {
const data = await readData();
data.push(newItem);
await writeData(data);
console.log("Item created:", newItem);}
// Read all items
async function readItems() {
const data = await readData();
console.log("All items:", data);
}
// Update an item by ID
async function updateItem(id, updatedFields) {
const data = await readData();
const index = data.findIndex(item => item.id === id);
if (index !== -1) {
data[index] = { ...data[index], ...updatedFields };
await writeData(data);
console.log("Item updated:", data[index]);
} else {
console.log(`Item with ID ${id} not found.`);
}
}
// Delete an item by ID
async function deleteItem(id) {
const data = await readData();
const newData = data.filter(item => item.id !== id);
if (newData.length !== data.length) {
await writeData(newData);
console.log(`Item with ID ${id} deleted.`);
} else {
console.log(`Item with ID ${id} not found.`);
}
}
// Example Usage of CRUD Functions
// immediately invoked function expression - iife
(async () => {
// Create a new item
await createItem({ id: 1, name: "Item 1", description: "This is the first item." });
await createItem({ id: 2, name: "Item 2", description: "This is the second item."});

await readItems();
// Update an item by ID
await updateItem(1, { name: "Updated Item 1", description:
"Updated description." });
// Read all items to see the update
await readItems();
// Delete an item by ID
await deleteItem(2);
// Read all items to confirm deletion
await readItems();

})();