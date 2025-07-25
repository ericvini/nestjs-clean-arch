import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('CreateAccountController (e2e)', () => {
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

  it('should create a new account', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'User Test',
      email: 'user@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: { email: 'user@gmail.com' },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
