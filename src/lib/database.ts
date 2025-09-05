import Database from '@tauri-apps/plugin-sql';

export interface Counter {
  id: number;
  name: string;
  value: number;
  created_at: string;
  updated_at: string;
}

export interface NewCounter {
  name: string;
  value?: number;
}

export interface UpdateCounter {
  id: number;
  name?: string;
  value?: number;
}

let db: Database | null = null;

export async function initDatabase(): Promise<Database> {
  if (!db) {
    db = await Database.load('sqlite:counters.db');
  }
  return db;
}

export async function getAllCounters(): Promise<Counter[]> {
  const database = await initDatabase();
  const result = await database.select<Counter[]>('SELECT * FROM counters ORDER BY created_at DESC');
  return result;
}

export async function getCounter(id: number): Promise<Counter | null> {
  const database = await initDatabase();
  const result = await database.select<Counter[]>('SELECT * FROM counters WHERE id = ?', [id]);
  return result.length > 0 ? result[0] : null;
}

export async function createCounter(counter: NewCounter): Promise<Counter> {
  const database = await initDatabase();
  const result = await database.execute(
    'INSERT INTO counters (name, value) VALUES (?, ?) RETURNING *',
    [counter.name, counter.value ?? 0]
  );
  
  // Get the created counter
  if (!result.lastInsertId) {
    throw new Error('Failed to create counter - no ID returned');
  }
  const createdCounter = await getCounter(result.lastInsertId);
  if (!createdCounter) {
    throw new Error('Failed to create counter');
  }
  return createdCounter;
}

export async function updateCounter(counter: UpdateCounter): Promise<Counter> {
  const database = await initDatabase();
  
  const updates: string[] = [];
  const values: any[] = [];
  
  if (counter.name !== undefined) {
    updates.push('name = ?');
    values.push(counter.name);
  }
  
  if (counter.value !== undefined) {
    updates.push('value = ?');
    values.push(counter.value);
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(counter.id);
  
  await database.execute(
    `UPDATE counters SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  
  const updatedCounter = await getCounter(counter.id);
  if (!updatedCounter) {
    throw new Error('Failed to update counter');
  }
  return updatedCounter;
}

export async function deleteCounter(id: number): Promise<void> {
  const database = await initDatabase();
  await database.execute('DELETE FROM counters WHERE id = ?', [id]);
}

export async function incrementCounter(id: number, amount: number = 1): Promise<Counter> {
  const database = await initDatabase();
  await database.execute(
    'UPDATE counters SET value = value + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [amount, id]
  );
  
  const updatedCounter = await getCounter(id);
  if (!updatedCounter) {
    throw new Error('Failed to increment counter');
  }
  return updatedCounter;
}

export async function resetCounter(id: number): Promise<Counter> {
  return updateCounter({ id, value: 0 });
}