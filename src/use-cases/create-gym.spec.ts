import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';


let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase
describe('Register Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })
    it('Should be able to create gym', async () => {
        const { gym } = await sut.execute({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -4.9381376,
            longitude: -37.9823225,
        })

        expect(gym.id).toEqual(expect.any(String));
    })

   

    
})