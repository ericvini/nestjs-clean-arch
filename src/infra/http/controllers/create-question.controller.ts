import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyTypeValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyTypeValidationPipe)
    body: CreateQuestionBodySchema,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    await this.createQuestion.execute({
      authorId: userId,
      title,
      content,
      attachmentsIds: [],
    });
  }
}
