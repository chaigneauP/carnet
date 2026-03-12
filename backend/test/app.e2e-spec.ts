import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppController } from '../src/app.controller';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { GamesController } from '../src/games/games.controller';
import { GamesService } from '../src/games/games.service';
import { HealthController } from '../src/health/health.controller';
import { HealthService } from '../src/health/health.service';
import { PlaythroughsService } from '../src/playthroughs/playthroughs.service';

describe('Backend HTTP contract', () => {
  let app: INestApplication;

  const gamesServiceMock = {
    resolveListLimit: jest.fn(),
    listGames: jest.fn(),
    getGameById: jest.fn(),
    createGame: jest.fn(),
    updateGame: jest.fn(),
    deleteGame: jest.fn(),
    getRating: jest.fn(),
    createRating: jest.fn(),
    updateRating: jest.fn(),
    addTagToGame: jest.fn(),
    removeTagFromGame: jest.fn(),
  };

  const healthServiceMock = {
    checkDatabaseConnection: jest.fn(),
  };

  const playthroughsServiceMock = {
    listByGame: jest.fn(),
    createForGame: jest.fn(),
    updatePlaythrough: jest.fn(),
    deletePlaythrough: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController, GamesController, HealthController],
      providers: [
        { provide: GamesService, useValue: gamesServiceMock },
        { provide: HealthService, useValue: healthServiceMock },
        { provide: PlaythroughsService, useValue: playthroughsServiceMock },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / retourne la racine du service', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({
        name: 'carnet-backend',
        status: 'ok',
        docs: ['/api/health', '/api/games'],
      });
  });

  it('GET /api/games retourne data + meta', async () => {
    gamesServiceMock.resolveListLimit.mockReturnValue(10);
    gamesServiceMock.listGames.mockResolvedValue([
      {
        id: 1,
        title: 'Celeste',
        status: 'completed',
        playtimeTotal: 20,
        overallScore: 9,
        tags: ['platformer'],
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    ]);

    await request(app.getHttpServer())
      .get('/api/games?limit=10')
      .expect(200)
      .expect({
        data: [
          {
            id: 1,
            title: 'Celeste',
            status: 'completed',
            playtimeTotal: 20,
            overallScore: 9,
            tags: ['platformer'],
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
          },
        ],
        meta: {
          count: 1,
          limit: 10,
        },
      });
  });

  it('GET /api/games rejette une limite invalide via DTO', async () => {
    await request(app.getHttpServer())
      .get('/api/games?limit=abc')
      .expect(400)
      .expect({
        message: 'The "limit" query parameter must be a positive integer.',
      });
  });

  it('GET /api/games/:id retourne le détail', async () => {
    gamesServiceMock.getGameById.mockResolvedValue({
      id: 3,
      title: 'Outer Wilds',
      developer: 'Mobius Digital',
      releaseYear: 2019,
      genre: 'Adventure',
      coverUrl: null,
      description: null,
      status: 'completed',
      playtimeTotal: 18,
      rating: null,
      tags: ['space'],
      playthroughs: [],
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    });

    await request(app.getHttpServer())
      .get('/api/games/3')
      .expect(200)
      .expect({
        data: {
          id: 3,
          title: 'Outer Wilds',
          developer: 'Mobius Digital',
          releaseYear: 2019,
          genre: 'Adventure',
          coverUrl: null,
          description: null,
          status: 'completed',
          playtimeTotal: 18,
          rating: null,
          tags: ['space'],
          playthroughs: [],
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      });
  });

  it('POST /api/games crée un jeu via DTO', async () => {
    gamesServiceMock.createGame.mockResolvedValue({
      id: 4,
      title: 'Balatro',
      developer: 'LocalThunk',
      releaseYear: 2024,
      genre: 'Roguelike',
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

    await request(app.getHttpServer())
      .post('/api/games')
      .send({
        title: 'Balatro',
        developer: 'LocalThunk',
        releaseYear: 2024,
        genre: 'Roguelike',
      })
      .expect(201)
      .expect({
        data: {
          id: 4,
          title: 'Balatro',
          developer: 'LocalThunk',
          releaseYear: 2024,
          genre: 'Roguelike',
          coverUrl: null,
          description: null,
          status: 'backlog',
          playtimeTotal: 0,
          rating: null,
          tags: [],
          playthroughs: [],
          createdAt: '2026-03-08T10:00:00.000Z',
          updatedAt: '2026-03-08T10:00:00.000Z',
        },
      });
  });

  it('POST /api/games rejette un status invalide', async () => {
    await request(app.getHttpServer())
      .post('/api/games')
      .send({
        title: 'Balatro',
        status: 'invalid',
      })
      .expect(400)
      .expect({
        message: 'status must be one of the following values: backlog, playing, completed, dropped',
      });
  });

  it('PUT /api/games/:id met à jour un jeu', async () => {
    gamesServiceMock.updateGame.mockResolvedValue({
      id: 4,
      title: 'Balatro',
      developer: 'LocalThunk',
      releaseYear: 2024,
      genre: 'Roguelike',
      coverUrl: null,
      description: 'Deckbuilder',
      status: 'playing',
      playtimeTotal: 0,
      rating: null,
      tags: [],
      playthroughs: [],
      createdAt: '2026-03-08T10:00:00.000Z',
      updatedAt: '2026-03-08T11:00:00.000Z',
    });

    await request(app.getHttpServer())
      .put('/api/games/4')
      .send({
        title: 'Balatro',
        developer: 'LocalThunk',
        releaseYear: 2024,
        genre: 'Roguelike',
        description: 'Deckbuilder',
        status: 'playing',
      })
      .expect(200)
      .expect({
        data: {
          id: 4,
          title: 'Balatro',
          developer: 'LocalThunk',
          releaseYear: 2024,
          genre: 'Roguelike',
          coverUrl: null,
          description: 'Deckbuilder',
          status: 'playing',
          playtimeTotal: 0,
          rating: null,
          tags: [],
          playthroughs: [],
          createdAt: '2026-03-08T10:00:00.000Z',
          updatedAt: '2026-03-08T11:00:00.000Z',
        },
      });
  });

  it('PUT /api/games/:id rejette un id invalide via DTO', async () => {
    await request(app.getHttpServer())
      .put('/api/games/abc')
      .send({
        title: 'Balatro',
        status: 'playing',
      })
      .expect(400)
      .expect({
        message: 'The "id" route parameter must be a positive integer.',
      });
  });

  it('DELETE /api/games/:id retourne 204', async () => {
    gamesServiceMock.deleteGame.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete('/api/games/4').expect(204);
    expect(gamesServiceMock.deleteGame).toHaveBeenCalledWith(4);
  });

  it('GET /api/health retourne 200 quand la base répond', async () => {
    healthServiceMock.checkDatabaseConnection.mockResolvedValue(undefined);

    const response = await request(app.getHttpServer()).get('/api/health').expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.database).toBe('up');
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('GET /api/health retourne 503 quand la base tombe', async () => {
    healthServiceMock.checkDatabaseConnection.mockRejectedValue(new Error('database offline'));

    const response = await request(app.getHttpServer()).get('/api/health').expect(503);

    expect(response.body).toEqual({
      status: 'error',
      database: 'down',
      message: 'database offline',
      timestamp: expect.any(String),
    });
  });

  it('retourne le format 404 historique pour une route inconnue', async () => {
    await request(app.getHttpServer())
      .get('/api/unknown')
      .expect(404)
      .expect({
        message: 'Route not found: GET /api/unknown',
      });
  });
});

