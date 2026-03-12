import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagResponseDto, TagsListResponseDto } from './dto/tag-response.dto';
import { TagsService } from './tags.service';

@Controller('api/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async listTags(): Promise<TagsListResponseDto> {
    const tags = await this.tagsService.listTags();
    return { data: tags };
  }

  @Post()
  @HttpCode(201)
  async createTag(@Body() dto: CreateTagDto): Promise<TagResponseDto> {
    const tag = await this.tagsService.createTag(dto);
    return { data: tag };
  }
}

