import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtribuirDesafioPartidaDto } from './dto/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dto/atualizar-desafio.dto';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio, Partida } from './interfaces/desafio.interface';

@Injectable()
export class DesafioService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriaService: CategoriasService,
  ) {}

  async buscarTodosDesafios(): Promise<Desafio[]> {
    return await this.desafioModel
      .find({})
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }

  async consultadorDesafiosDeUmJogador(_id: any): Promise<Desafio[]> {
    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    const jogadorFilter = jogadores.filter((jogador) => jogador._id == _id);
    if (jogadorFilter.length === 0)
      throw new BadRequestException('Esse Id não existe');

    return await this.desafioModel
      .find()
      .where('jogadores')
      .in(_id)
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida');
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

  async atualizarDesafio(
    _id: string,
    atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById({ _id }).exec();

    if (!desafioEncontrado)
      throw new NotFoundException('Desafio não cadastrado');

    if (atualizarDesafioDto.status) {
      desafioEncontrado.dataHoraResposta = new Date();
    }
    desafioEncontrado.status = atualizarDesafioDto.status;
    desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }

  async deletarDesafio(_id: string): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById({ _id }).exec();

    if (!desafioEncontrado)
      throw new BadRequestException('Desafio não encontrado');

    desafioEncontrado.status = DesafioStatus.CANCELADO;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }

  async atribuirDesafioPartida(
    _id: string,
    atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById({ _id }).exec();

    if (!desafioEncontrado)
      throw new NotFoundException('Desafio não encontrado');

    const jogadorFilter = desafioEncontrado.jogadores.filter(
      (jogador) => jogador._id == String(atribuirDesafioPartidaDto.def),
    );

    if (jogadorFilter.length === 0)
      throw new BadRequestException(
        'O jogador vencedor não faz parte do desafio!',
      );

    const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto);

    partidaCriada.categoria = desafioEncontrado.categoria;

    const resultado = await partidaCriada.save();

    desafioEncontrado.status = DesafioStatus.REALIZADO;

    desafioEncontrado.partida = resultado._id;

    try {
      await this.desafioModel
        .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
        .exec();
    } catch (error) {
      await this.partidaModel.deleteOne({ _id: resultado._id }).exec();
      throw new InternalServerErrorException();
    }
  }
}
