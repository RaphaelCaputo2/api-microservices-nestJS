import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { JogadoresModule } from 'src/jogadores/jogadores.module';
import { DesafioController } from './desafio.controller';
import { DesafioService } from './desafio.service';
import { DesafioSchema } from './interfaces/desafio.schema';
import { PartidaSchema } from './interfaces/partida.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Desafio', schema: DesafioSchema }]),
    MongooseModule.forFeature([{ name: 'Partida', schema: PartidaSchema }]),
    JogadoresModule,
    CategoriasModule,
  ],
  controllers: [DesafioController],
  providers: [DesafioService],
})
export class DesafioModule {}
