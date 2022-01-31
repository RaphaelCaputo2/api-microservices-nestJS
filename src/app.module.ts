import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DesafioService } from './desafio/desafio.service';
import { DesafioController } from './desafio/desafio.controller';
import * as dotenv from 'dotenv';
import { DesafioModule } from './desafio/desafio.module';
dotenv.config();

const { URL_DB } = process.env;
@Module({
  imports: [
    MongooseModule.forRoot(URL_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    JogadoresModule,
    CategoriasModule,
    DesafioModule,
  ],
  controllers: [DesafioController],
  providers: [DesafioService],
})
export class AppModule {}
