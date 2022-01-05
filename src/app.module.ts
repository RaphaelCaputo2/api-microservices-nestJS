import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import * as dotenv from 'dotenv';
dotenv.config();

const { URL_DB } = process.env;
@Module({
  imports: [
    MongooseModule.forRoot(URL_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    JogadoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
