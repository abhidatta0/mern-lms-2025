import { db } from '../config/database';
import { currency,  } from '../config/schema';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Seed currencies
    console.log('Seeding currencies...');
    const currencyData = [
      {  name: 'US Dollar', code: 'USD' },
      {  name: 'Euro', code: 'EUR' },
      {  name: 'Indian Rupee', code: 'INR' },
      {  name: 'British Pound', code: 'GBP' },
    ];
    
    await db.insert(currency).values(currencyData);
    console.log('✅ Currencies seeded');
    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
