/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const result: Awaited<ReturnType<typeof sut.execute>> = await sut.execute({
      slug: 'example-question',
    });

    const typedValue = result.value as { question: { title: string } };

    expect(typedValue).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    });
  });
});
