import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DesafioService } from './desafio.service';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';

@Controller('desafio')
export class DesafioController {
  constructor(private readonly desafioService: DesafioService) {}

  @Get()
  async buscarTodosDesafios(): Promise<Desafio[]> {
    return await this.desafioService.buscarTodosDesafios();
  }
  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDto,
  ): Promise<Desafio> {
    return await this.desafioService.criarDesafio(criarDesafioDto);
  }
}
