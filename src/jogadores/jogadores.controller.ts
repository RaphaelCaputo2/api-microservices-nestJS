import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interface/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
import { ValidarIdMongoose } from '../common/pipes/validarIdMongoose.pipe';
@Controller('jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto): Promise<any> {
    return await this.jogadoresService.criarJogador(criarJogadorDto);
  }
  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async AtualizarJogador(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param('_id', ValidacaoParametrosPipe, ValidarIdMongoose)
    _id: string,
  ): Promise<void> {
    try {
      return await this.jogadoresService.atualizarJogador(
        _id,
        atualizarJogadorDto,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get()
  async consultarJogadores(): Promise<Jogador[]> {
    return this.jogadoresService.consultarTodosJogadores();
  }
  @Get('/:_id')
  async consultarJogadorPeloId(
    @Param('_id', ValidacaoParametrosPipe, ValidarIdMongoose)
    _id: string,
  ): Promise<Jogador> {
    return await this.jogadoresService.consultaPorId(_id);
  }

  @Delete('/:_id')
  async deletarJogador(
    @Param('_id', ValidacaoParametrosPipe, ValidarIdMongoose)
    _id: string,
  ): Promise<void> {
    await this.jogadoresService.deletarJogador(_id);
  }
}
