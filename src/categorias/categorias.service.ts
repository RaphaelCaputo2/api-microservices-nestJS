import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interface/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
  ) {}

  async listarCategorias(): Promise<Categoria[]> {
    const listarTodasAsCategorias = await this.categoriaModel.find({});

    if (!listarTodasAsCategorias)
      throw new BadRequestException('Não existem categorias cadastradas.');

    return listarTodasAsCategorias;
  }

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;
    const categoriaEncontrada = await this.categoriaModel.findOne({
      categoria,
    });

    if (categoriaEncontrada) {
      throw new BadRequestException('Essa categoria ja existe');
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDto).save();

    return categoriaCriada;
  }
}
