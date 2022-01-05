import * as mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema(
  {
    telefoneCelular: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    nome: {
      type: Number,
      required: true,
    },
    ranking: {
      type: String,
      required: true,
    },
    posicaoRanking: Number,
    urlFotoJogador: String,
  },
  {
    timestamps: true,
    collection: 'jogadores',
  },
);
