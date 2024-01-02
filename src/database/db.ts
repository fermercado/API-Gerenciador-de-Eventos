import mongoose from 'mongoose';
import { configDB } from '../config/configDB';

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${configDB.username}:${configDB.password}@${configDB.host}/?retryWrites=true&w=majority`,
    );
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro de conexão ao MongoDB:', error);
  }
};
