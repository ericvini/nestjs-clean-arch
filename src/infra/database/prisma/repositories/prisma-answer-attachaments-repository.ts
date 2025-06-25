import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper';

@Injectable()
export class PrismaAnswerAttachamentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerComment = await this.prisma.attachement.findMany({
      where: {
        answerId,
      },
    });

    return answerComment.map(PrismaAnswerAttachmentMapper.toDomain);
  }
  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachement.deleteMany({
      where: { answerId },
    });
  }
}
