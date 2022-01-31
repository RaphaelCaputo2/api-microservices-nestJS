import { Body, Controller, Post } from '@nestjs/common';
import { DesafioService } from './desafio.service';
import { CriarDesafioDto } from './dto/criar-desafio.dto';

@Controller('desafio')
export class DesafioController {
  constructor(private readonly desafioService: DesafioService) {}

  @Post()
  async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto): Promise<any> {
    await this.desafioService.criarDesafio(criarDesafioDto);
  }
}
