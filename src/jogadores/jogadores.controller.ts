/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interface/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';
@Controller('jogadores')
export class JogadoresController {

    constructor(private readonly jogadoresService: JogadoresService){}


    @Post()
    @UsePipes(ValidationPipe)
    async criarAtualizarJogador(
        @Body() criarJogadorDto: CriarJogadorDto
    ): Promise<Jogador | Error> {
      try{
        return await this.jogadoresService.criarAtualizarJogador(criarJogadorDto)
      }catch(error){
       throw new Error(error.message);
      }
     
    }
    // @Get()
    // async jogadorPorEmail(
    //   @Body() email: string
    // ) : Promise<void>{
    //   this.jogadoresService.consultarJogadorEmail(email)
    // }
   
    @Get(
     
    )
    async consultarJogadores(
      @Query('email') email: string
    ): Promise<Jogador[] | Jogador>{
      if(email){
        return await this.jogadoresService.consultaPorEmail(email)
      }else{
        return this.jogadoresService.consultarTodosJogadores();
      }
    }

    @Delete()
    async deletarJogador(
      @Query('email', JogadoresValidacaoParametrosPipe) email : string
    ) : Promise<void> {
      await this.jogadoresService.deletarJogador(email);
    }
  
}
