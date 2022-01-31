import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interface/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async listarCategorias(): Promise<Categoria[]> {
    const listarTodasAsCategorias = await this.categoriaModel
      .find({})
      .populate('jogadores')
      .exec();

    if (!listarTodasAsCategorias)
      throw new BadRequestException('Não existem categorias cadastradas.');

    return listarTodasAsCategorias;
  }

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;
    const categoriaEncontrada = await this.categoriaModel
      .findOne({
        categoria,
      })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException('Essa categoria ja existe');
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDto).save();

    return categoriaCriada;
  }
  async buscarCategoriaPorId(categoria: Categoria): Promise<Categoria> {
    const encontrandoCategoria = await this.categoriaModel
      .findOne({
        categoria,
      })
      .exec();

    if (!encontrandoCategoria)
      throw new BadRequestException('Categoria não encontrada');

    return encontrandoCategoria;
  }
  async atualizarCategoria(
    categoria: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ): Promise<void> {
    const encontrarCategoria = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!encontrarCategoria)
      throw new BadRequestException('Essa categoria não existe');

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDto })
      .exec();
  }
  async atribuidCategoriaJogador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];

    await this.jogadoresService.consultaPorId(idJogador);

    const encontrarCategoria = await this.categoriaModel
      .findOne({ categoria })
      .exec();
    const jogadorCadastradoCategoria = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in(idJogador)
      .exec();
    if (jogadorCadastradoCategoria.length > 0)
      throw new BadRequestException('Esse jogador ja está em uma categoria');

    if (!encontrarCategoria)
      throw new BadRequestException('Categoria inexistente.');

    encontrarCategoria.jogadores.push(idJogador);
    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: encontrarCategoria })
      .exec();
  }
}
