import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository';
import { PrismaAnswerAttachamentsRepository } from './prisma/repositories/prisma-answer-attachaments-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository';
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository';

@Module({
  providers: [
    PrismaService,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerAttachamentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsRepository,
  ],
  exports: [
    PrismaService,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerAttachamentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsRepository,
  ],
})
export class DatabaseModule {}
