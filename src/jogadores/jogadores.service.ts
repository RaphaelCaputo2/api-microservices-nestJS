import { Injectable, NotFoundException } from '@nestjs/common';
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

  // private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(
    criarJogadorDto: CriarJogadorDto,
  ): Promise<Jogador | any> {
    const { email } = criarJogadorDto;
    // const jogadorEncontrado = await this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      return await this.atualizar(criarJogadorDto);
    } else {
      const criadoJogador = await this.criar(criarJogadorDto);
      return criadoJogador;
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultaPorEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException('Jogador nao encontrado');
    }
    return jogadorEncontrado;
  }
  async deletarJogador(email: string): Promise<any> {
    if (!email) throw new NotFoundException('O Campo email é necessário');
    const encontrarJogador = await this.jogadorModel.findOne({ email }).exec();
    console.log(encontrarJogador);
    if (!encontrarJogador) {
      throw new NotFoundException('Jogador nao encontrado');
    } else {
      return await this.jogadorModel
        .findByIdAndDelete({ _id: encontrarJogador.id })
        .exec();
    }

    // const jogadorEncontrado = await this.jogadores.find(
    //   (x) => x.email === email,
    // );
    // this.jogadores = this.jogadores.filter(
    //   (x) => x.email !== jogadorEncontrado.email,
    // );
  }
  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    return await jogadorCriado.save();
    // const { nome, telefoneCelular, email } = criarJogadorDto;
    // const jogador: Jogador = {
    //   _id: uuidv4(),
    //   nome,
    //   telefoneCelular,
    //   email,
    //   ranking: 'A',
    //   posicaoRanking: 1,
    //   urlFotoJogador: 'www.google.com.br/foto123.jpg',
    // };
    // this.logger.log(`criarJogadorDto: ${JSON.stringify(criarJogadorDto)}`);
    // this.jogadores.push(jogador);
  }
  private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadorModel
      .findByIdAndUpdate(
        { email: criarJogadorDto.email },
        { $set: criarJogadorDto },
      )
      .exec();

    // const { nome } = criarJogadorDto;
    // jogadorEncontrado.nome = nome;
  }
}
