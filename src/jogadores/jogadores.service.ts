import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interface/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogadorEncontrado = await this.jogadores.find(
      (jogador) => jogador.email === email,
    );
    if (jogadorEncontrado) {
      this.atualizar(jogadorEncontrado, criarJogadorDto);
    } else {
      await this.criar(criarJogadorDto);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadores;
  }

  async consultaPorEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadores.find(
      (x) => x.email === email,
    );
    if (!jogadorEncontrado) {
      throw new NotFoundException('Jogador nao encontrado');
    }
    return jogadorEncontrado;
  }
  async deletarJogador(email: string): Promise<void> {
    const jogadorEncontrado = await this.jogadores.find(
      (x) => x.email === email,
    );
    this.jogadores = this.jogadores.filter(
      (x) => x.email !== jogadorEncontrado.email,
    );
  }
  private async criar(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { nome, telefoneCelular, email } = criarJogadorDto;

    const jogador: Jogador = {
      _id: uuidv4(),
      nome,
      telefoneCelular,
      email,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'www.google.com.br/foto123.jpg',
    };
    this.logger.log(`criarJogadorDto: ${JSON.stringify(criarJogadorDto)}`);

    this.jogadores.push(jogador);
  }
  private async atualizar(
    jogadorEncontrado: Jogador,
    criarJogadorDto: CriarJogadorDto,
  ): Promise<void> {
    const { nome } = criarJogadorDto;
    jogadorEncontrado.nome = nome;
  }
}
