import { db } from '../config/database';
import { currency,primary_languages, course_levels  } from '../config/schema';

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

   const languageOptions = [
    {  name: "English" },
    {  name: "Spanish" },
    { name: "French" },
    { name: "German" },
    {  name: "Chinese" },
    {  name: "Japanese" },
    { name: "Korean" },
    { name: "Portuguese" },
    { name: "Arabic" },
    {  name: "Russian" },
  ];
    await db.insert(primary_languages).values(languageOptions);

    const courseLevelOptions = [
    {  name: "Beginner" },
    {  name: "Intermediate" },
    { name: "Advanced" },
  ];
    await db.insert(primary_languages).values(courseLevelOptions);


    console.log('✅ Currencies seeded');
    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
