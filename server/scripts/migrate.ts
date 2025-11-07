import { db } from '../config/database';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import path from 'path';

const __dirname = import.meta.dirname;
const __filename = import.meta.filename;

async function runMigrations() {
  try {
    console.log('Running migrations...');
    console.log(process.cwd(),path.resolve(__dirname,'../migrations'));
    await migrate(db, { migrationsFolder: path.resolve(__dirname,'../migrations')});
    console.log('✅ Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();