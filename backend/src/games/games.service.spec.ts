import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { GameEntity } from '../database/entities/game.entity';
import { GameTagEntity } from '../database/entities/game-tag.entity';
import { RatingEntity } from '../database/entities/rating.entity';
import { TagEntity } from '../database/entities/tag.entity';
import { GamesMapper } from './games.mapper';
import { GamesService } from './games.service';

describe('GamesService', () => {
  let service: GamesService;
  let queryBuilder: {
    leftJoinAndSelect: jest.Mock;
    where: jest.Mock;
    orderBy: jest.Mock;
    getOne: jest.Mock;
  };
  let repository: Pick<Repository<GameEntity>, 'find' | 'findOne' | 'create' | 'save' | 'remove' | 'createQueryBuilder'>;
  let ratingRepository: Pick<Repository<RatingEntity>, 'findOne' | 'create' | 'save'>;
  let tagRepository: Pick<Repository<TagEntity>, 'findOne'>;
  let gameTagRepository: Pick<Repository<GameTagEntity>, 'findOne' | 'create' | 'save' | 'remove'>;

  beforeEach(() => {
    queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    repository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((payload) => payload),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    } as unknown as Pick<Repository<GameEntity>, 'find' | 'findOne' | 'create' | 'save' | 'remove' | 'createQueryBuilder'>;

    ratingRepository = {
      findOne: jest.fn(),
      create: jest.fn((payload) => payload),
      save: jest.fn(),
    } as unknown as Pick<Repository<RatingEntity>, 'findOne' | 'create' | 'save'>;

    tagRepository = {
      findOne: jest.fn(),
    } as unknown as Pick<Repository<TagEntity>, 'findOne'>;

    gameTagRepository = {
      findOne: jest.fn(),
      create: jest.fn((payload) => payload),
      save: jest.fn(),
      remove: jest.fn(),
    } as unknown as Pick<Repository<GameTagEntity>, 'findOne' | 'create' | 'save' | 'remove'>;

    service = new GamesService(
      repository as Repository<GameEntity>,
      ratingRepository as Repository<RatingEntity>,
      tagRepository as Repository<TagEntity>,
      gameTagRepository as Repository<GameTagEntity>,
      new GamesMapper(),
    );
  });

  it('résout la limite de liste avec valeur par défaut et plafond', () => {
    expect(service.resolveListLimit(undefined)).toBe(50);
    expect(service.resolveListLimit(10)).toBe(10);
    expect(service.resolveListLimit(999)).toBe(100);
  });

  it('mappe la liste des jeux au format API', async () => {
    (repository.find as jest.Mock).mockResolvedValue([
      {
        id: '1',
        title: 'Chrono Trigger',
        status: 'completed',
        playtimeTotal: 34.5,
        rating: { overallScore: 9.5 },
        gameTags: [{ tag: { name: 'jrpg' } }, { tag: { name: 'masterpiece' } }],
        createdAt: new Date('2025-01-02T03:04:05.000Z'),
        updatedAt: new Date('2025-01-03T04:05:06.000Z'),
      },
    ]);

    await expect(service.listGames(10)).resolves.toEqual([
      {
        id: 1,
        title: 'Chrono Trigger',
        status: 'completed',
        playtimeTotal: 34.5,
        overallScore: 9.5,
        tags: ['jrpg', 'masterpiece'],
        createdAt: '2025-01-02T03:04:05.000Z',
        updatedAt: '2025-01-03T04:05:06.000Z',
      },
    ]);
  });

  it('mappe le détail d’un jeu avec dates ISO et playthroughs triés', async () => {
    queryBuilder.getOne.mockResolvedValue({
      id: '7',
      title: 'Silent Hill 2',
      developer: 'Konami',
      releaseYear: 2001,
      genre: 'Survival horror',
      coverUrl: null,
      description: 'Fog and trauma.',
      status: 'completed',
      playtimeTotal: 12.5,
      rating: {
        gameplay: 8.5,
        levelDesign: 9,
        story: 10,
        atmosphere: 10,
        replayability: 7,
        overallScore: 9.5,
        notes: 'Classic.',
      },
      gameTags: [{ tag: { name: 'horror' } }],
      playthroughs: [
        {
          id: '11',
          platform: 'PS2',
          startDate: '2024-10-01',
          endDate: '2024-10-10',
          playtimeHours: 12.5,
          status: 'In Progress',
          notes: 'Revisited.',
          difficulty: null,
          achievementsCompleted: null,
          createdAt: new Date('2024-10-10T12:00:00.000Z'),
          updatedAt: new Date('2024-10-10T13:00:00.000Z'),
        },
      ],
      createdAt: new Date('2024-09-01T08:00:00.000Z'),
      updatedAt: new Date('2024-10-10T13:00:00.000Z'),
    });

    await expect(service.getGameById(7)).resolves.toEqual({
      id: 7,
      title: 'Silent Hill 2',
      developer: 'Konami',
      releaseYear: 2001,
      genre: 'Survival horror',
      coverUrl: null,
      description: 'Fog and trauma.',
      status: 'completed',
      playtimeTotal: 12.5,
      rating: {
        gameplay: 8.5,
        levelDesign: 9,
        story: 10,
        atmosphere: 10,
        replayability: 7,
        overallScore: 9.5,
        notes: 'Classic.',
      },
      tags: ['horror'],
      playthroughs: [
        {
          id: 11,
          platform: 'PS2',
          startDate: '2024-10-01T00:00:00.000Z',
          endDate: '2024-10-10T00:00:00.000Z',
          playtimeHours: 12.5,
          status: 'In Progress',
          notes: 'Revisited.',
          difficulty: null,
          achievementsCompleted: null,
          createdAt: '2024-10-10T12:00:00.000Z',
          updatedAt: '2024-10-10T13:00:00.000Z',
        },
      ],
      createdAt: '2024-09-01T08:00:00.000Z',
      updatedAt: '2024-10-10T13:00:00.000Z',
    });
  });

  it('crée un jeu via le mapper puis recharge le détail', async () => {
    (repository.save as jest.Mock).mockResolvedValue({ id: '21' });
    queryBuilder.getOne.mockResolvedValue({
      id: '21',
      title: 'Metaphor ReFantazio',
      developer: 'Studio Zero',
      releaseYear: 2024,
      genre: 'JRPG',
      coverUrl: null,
      description: null,
      status: 'backlog',
      playtimeTotal: 0,
      rating: null,
      gameTags: [],
      playthroughs: [],
      createdAt: new Date('2026-03-08T10:00:00.000Z'),
      updatedAt: new Date('2026-03-08T10:00:00.000Z'),
    });

    await expect(
      service.createGame({
        title: '  Metaphor ReFantazio  ',
        developer: ' Studio Zero ',
        releaseYear: 2024,
        genre: ' JRPG ',
      }),
    ).resolves.toEqual({
      id: 21,
      title: 'Metaphor ReFantazio',
      developer: 'Studio Zero',
      releaseYear: 2024,
      genre: 'JRPG',
      coverUrl: null,
      description: null,
      status: 'backlog',
      playtimeTotal: 0,
      rating: null,
      tags: [],
      playthroughs: [],
      createdAt: '2026-03-08T10:00:00.000Z',
      updatedAt: '2026-03-08T10:00:00.000Z',
    });

    expect(repository.create).toHaveBeenCalledWith({
      title: 'Metaphor ReFantazio',
      developer: 'Studio Zero',
      releaseYear: 2024,
      genre: 'JRPG',
      coverUrl: null,
      description: null,
      status: 'backlog',
    });
  });

  it('met à jour un jeu existant puis recharge le détail', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue({
      id: '7',
      title: 'Old title',
      developer: null,
      releaseYear: null,
      genre: null,
      coverUrl: null,
      description: null,
      status: 'backlog',
    });
    queryBuilder.getOne.mockResolvedValue({
      id: '7',
      title: 'Balatro',
      developer: 'LocalThunk',
      releaseYear: 2024,
      genre: 'Roguelike',
      coverUrl: null,
      description: 'Deckbuilder.',
      status: 'playing',
      playtimeTotal: 0,
      rating: null,
      gameTags: [],
      playthroughs: [],
      createdAt: new Date('2026-03-08T10:00:00.000Z'),
      updatedAt: new Date('2026-03-08T11:00:00.000Z'),
    });

    await expect(
      service.updateGame(7, {
        title: '  Balatro ',
        developer: ' LocalThunk ',
        releaseYear: 2024,
        genre: ' Roguelike ',
        coverUrl: null,
        description: ' Deckbuilder. ',
        status: 'playing',
      }),
    ).resolves.toEqual({
      id: 7,
      title: 'Balatro',
      developer: 'LocalThunk',
      releaseYear: 2024,
      genre: 'Roguelike',
      coverUrl: null,
      description: 'Deckbuilder.',
      status: 'playing',
      playtimeTotal: 0,
      rating: null,
      tags: [],
      playthroughs: [],
      createdAt: '2026-03-08T10:00:00.000Z',
      updatedAt: '2026-03-08T11:00:00.000Z',
    });

    expect(repository.save).toHaveBeenCalledWith({
      id: '7',
      title: 'Balatro',
      developer: 'LocalThunk',
      releaseYear: 2024,
      genre: 'Roguelike',
      coverUrl: null,
      description: 'Deckbuilder.',
      status: 'playing',
    });
  });

  it('supprime un jeu existant', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue({ id: '5', title: 'Celeste' });

    await expect(service.deleteGame(5)).resolves.toBeUndefined();
    expect(repository.remove).toHaveBeenCalledWith({ id: '5', title: 'Celeste' });
  });

  it('retourne une 404 si le jeu n’existe pas', async () => {
    queryBuilder.getOne.mockResolvedValue(null);

    await expect(service.getGameById(999)).rejects.toThrow(NotFoundException);
    await expect(service.getGameById(999)).rejects.toThrow('Game with id 999 was not found.');
  });
});

