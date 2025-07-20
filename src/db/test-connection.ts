import { PrismaClient } from '@prisma/client';

// This file can be run with ts-node to test the database connection
async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    // Try to connect and perform a simple query
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Database connection successful:', result);
    
    // Try to query the User table
    const userCount = await prisma.user.count();
    console.log(`User table accessible. Total users: ${userCount}`);
    
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then((success) => {
      if (success) {
        console.log('All database tests passed!');
      } else {
        console.log('Database tests failed!');
      }
    })
    .catch(console.error);
}

export default testConnection;