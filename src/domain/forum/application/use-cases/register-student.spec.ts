import { RegisterStudentUseCase } from './register-student';
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let inMemoryStudentsRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;

let sut: RegisterStudentUseCase;

describe('Create Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
  });

  it('should be able to create a student', async () => {
    const result = await sut.execute({
      name: 'carla',
      email: 'carla@gmail.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'carla',
      email: 'carla@gmail.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });
});
