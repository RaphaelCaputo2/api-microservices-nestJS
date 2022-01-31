import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DesafioController } from './desafio.controller';
import { DesafioService } from './desafio.service';
import { DesafioSchema } from './interfaces/desafio.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Desafio', schema: DesafioSchema }]),
  ],
  controllers: [DesafioController],
  providers: [DesafioService],
})
export class DesafioModule {}
