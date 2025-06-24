/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('AuthenticateController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    await app.init();
  });

  it('should authenticate user', async () => {
    await prisma.user.create({
      data: {
        name: 'User Test',
        email: 'user@gmail.com',
        password: await hash('123456', 8),
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'user@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    );
  });
});
