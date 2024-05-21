import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { GetUserProfileUseCase } from './get-user-profile';

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })
    it('Should be able to get user profile', async () => {
        
        const createUser = await usersRepository.create({
            name: 'Jonathan',
            email: 'freitasjonathan2@gmail.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            userId: createUser.id
        })

        expect(user.name).toEqual('Jonathan');
    })

    it('Should not be able to get user profile with wrong email', async () => {
        
        await expect(() => sut.execute({
            userId: 'non-existing-id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

})