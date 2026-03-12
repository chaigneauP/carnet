import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '../database/entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagDto } from './dto/tag-response.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async listTags(): Promise<TagDto[]> {
    const tags = await this.tagRepository.find({ order: { name: 'ASC' } });
    return tags.map((t) => this.toDto(t));
  }

  async createTag(dto: CreateTagDto): Promise<TagDto> {
    const normalized = dto.name.trim().toLowerCase();

    const existing = await this.tagRepository.findOne({ where: { name: normalized } });
    if (existing) {
      throw new ConflictException(`Tag "${normalized}" already exists.`);
    }

    const tag = this.tagRepository.create({ name: normalized });
    const saved = await this.tagRepository.save(tag);
    return this.toDto(saved);
  }

  private toDto(tag: TagEntity): TagDto {
    return { id: Number(tag.id), name: tag.name };
  }
}

