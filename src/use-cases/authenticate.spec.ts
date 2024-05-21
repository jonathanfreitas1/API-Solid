import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })
    it('Should be able to authenticate', async () => {
        
        await usersRepository.create({
            name: 'Jonathan',
            email: 'freitasjonathan2@gmail.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            email: 'freitasjonathan2@gmail.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String));
    })

    it('Should not be able to authenticate with wrong email', async () => {
        
        await expect(() => sut.execute({
            email: 'freitasjonathan2@gmail.com',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('Should be able to authenticate with wrong password', async () => {
        
        await usersRepository.create({
            name: 'Jonathan',
            email: 'freitasjonathan2@gmail.com',
            password_hash: await hash('123456', 6)
        })

        await expect(() => sut.execute({
            email: 'freitasjonathan2@gmail.com',
            password: '123123'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

})