/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interface/jogador.interface';
import { JogadoresService } from './jogadores.service';
@Controller('jogadores')
export class JogadoresController {

    constructor(private readonly jogadoresService: JogadoresService){}


    @Post()
    async criarAtualizarJogador(
        @Body() criarJogadorDto: CriarJogadorDto
    ): Promise<Jogador | any> {
      return await this.jogadoresService.criarAtualizarJogador(criarJogadorDto)
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
      @Query('email') email : string
    ) : Promise<void> {
      await this.jogadoresService.deletarJogador(email);
    }
  
}
