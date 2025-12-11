// Prisma v7 configuration file.
// Exports config for the Prisma CLI and a function to get client options.

const DEFAULT_DB_URL =  'mysql://root:password@localhost:3306/test';

export default {
  datasources: {
    db: {
      provider: 'mysql',
      url: DEFAULT_DB_URL,
    },
  },
};

// Export a function that returns PrismaClient constructor options for runtime use
export function getPrismaClientOptions() {
  return {
    datasources: {
      db: {
        url: DEFAULT_DB_URL,
      },
    },
  };
}
