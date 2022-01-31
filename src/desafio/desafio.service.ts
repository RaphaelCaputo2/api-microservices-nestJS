import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';

@Injectable()
export class DesafioService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
  ) {}

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<any> {
    return console.log(criarDesafioDto);
  }
}
