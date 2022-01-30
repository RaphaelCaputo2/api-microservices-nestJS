import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interface/jogador.interface';
// import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<any> {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      // return await this.atualizar(criarJogadorDto);
      throw new BadRequestException('Esse jogador ja existe');
    } else {
      return this.criar(criarJogadorDto);
    }
  }
  async atualizarJogador(
    _id: string,
    criarJogadorDto: CriarJogadorDto,
  ): Promise<void> {
    const jogadorEncontrado = await this.encontrarJogador(_id);

    if (!jogadorEncontrado)
      throw new BadRequestException('Esse jogador não existe');

    return await this.atualizar(criarJogadorDto, _id);
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultaPorId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.encontrarJogador(_id);
    if (!jogadorEncontrado) {
      throw new NotFoundException('Jogador nao encontrado');
    }
    return jogadorEncontrado;
  }
  async deletarJogador(_id: string): Promise<any> {
    const encontrarJogador = await this.encontrarJogador(_id);
    if (!encontrarJogador) {
      throw new NotFoundException('Jogador nao encontrado');
    }
    return await this.jogadorModel.deleteOne({ _id: encontrarJogador.id });
  }
  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    return await jogadorCriado.save();
  }

  private async encontrarJogador(_id: string): Promise<any> {
    return this.jogadorModel.findOne({ _id }).exec();
  }
  private async atualizar(
    criarJogadorDto: CriarJogadorDto,
    _id: string,
  ): Promise<any> {
    return await this.jogadorModel
      .findByIdAndUpdate({ _id }, { $set: criarJogadorDto })
      .exec();
  }
}
