import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('FetchRecentQuestionsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  it('should return recent questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'User Test',
        email: 'user@gmail.com',
        password: '123456',
      },
    });

    const accessToken = jwt.sign({
      sub: user.id,
    });

    await prisma.question.createMany({
      data: [
        {
          title: 'Question title 1',
          slug: 'question-title-1',
          content: 'Question content 1',
          authorId: user.id,
        },
        {
          title: 'Question title 2',
          slug: 'question-title-2',
          content: 'Question content 2',
          authorId: user.id,
        },
        {
          title: 'Question title 3',
          slug: 'question-title-3',
          content: 'Question content 3',
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({
          title: 'Question title 1',
        }),
      ],
    });
  });
});
