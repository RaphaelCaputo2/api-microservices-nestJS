import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio } from './interfaces/desafio.interface';

@Injectable()
export class DesafioService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriaService: CategoriasService,
  ) {}

  async buscarTodosDesafios(): Promise<Desafio[]> {
    const desafios = await this.desafioModel.find({});
    if (!desafios) throw new BadRequestException('Não existem Desafio');
    return desafios;
  }
  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    criarDesafioDto.jogadores.map((jogadorDto) => {
      const filterJogador = jogadores.filter(
        (jogador) => jogador._id == jogadorDto._id,
      );
      if (filterJogador.length === 0) {
        throw new BadRequestException('O id dos jogadores não existe');
      }
    });

    const verificarSolicitante = criarDesafioDto.jogadores.filter(
      (x) => String(x._id) == String(criarDesafioDto.solicitante),
    );
    if (verificarSolicitante.length === 0) {
      throw new BadRequestException(
        'O jogador solicitante, deve ser um dos jogadores da partida',
      );
    }

    const categoriaDoJogador =
      await this.categoriaService.buscarCategoriaPorJogador(
        String(criarDesafioDto.solicitante),
      );

    const criarDesafio = new this.desafioModel(criarDesafioDto);
    criarDesafio.categoria = categoriaDoJogador.categoria;
    criarDesafio.dataHoraSolicitacao = new Date();

    criarDesafio.status = DesafioStatus.PENDENTE;
    return await criarDesafio.save();
  }
}
