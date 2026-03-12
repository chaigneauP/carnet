import { Body, Controller, Delete, HttpCode, Param, Put } from '@nestjs/common';
import { PlaythroughIdParamDto } from './dto/playthrough-id-param.dto';
import { PlaythroughResponseDto } from './dto/playthrough-response.dto';
import { UpdatePlaythroughDto } from './dto/update-playthrough.dto';
import { PlaythroughsService } from './playthroughs.service';

@Controller('api/playthroughs')
export class PlaythroughsController {
  constructor(private readonly playthroughsService: PlaythroughsService) {}

  @Put(':id')
  async updatePlaythrough(
    @Param() params: PlaythroughIdParamDto,
    @Body() dto: UpdatePlaythroughDto,
  ): Promise<PlaythroughResponseDto> {
    const playthrough = await this.playthroughsService.updatePlaythrough(params.id, dto);
    return { data: playthrough };
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePlaythrough(@Param() params: PlaythroughIdParamDto): Promise<void> {
    await this.playthroughsService.deletePlaythrough(params.id);
  }
}

