// Database configuration and connection utilities
// In production, this would connect to MongoDB or your preferred database

class Database {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect(uri) {
    try {
      // Mock connection for now - replace with actual MongoDB connection
      this.connection = { uri };
      this.isConnected = true;
      console.log('Database connection established');
      return this.connection;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      this.connection = null;
      this.isConnected = false;
      console.log('Database disconnected');
    } catch (error) {
      console.error('Database disconnection error:', error);
      throw error;
    }
  }

  getConnection() {
    return this.connection;
  }

  isConnectedToDB() {
    return this.isConnected;
  }
}

const db = new Database();

module.exports = db;

