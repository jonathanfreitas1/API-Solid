import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';


let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase
describe('Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        await gymsRepository.create({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -4.9381376,
            longitude: -37.9823225
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('Should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -4.9381376,
            userLongitude: -37.9823225,
        })

        expect(checkIn.id).toEqual(expect.any(String));
    })

    it('Should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -4.9381376,
            userLongitude: -37.9823225,
        })

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -4.9381376,
            userLongitude: -37.9823225,
        })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('Should not be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
        
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -4.9381376,
            userLongitude: -37.9823225,
        })

        vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))
        
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -4.9381376,
            userLongitude: -37.9823225,
        })
        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('Should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-4.9164599),
            longitude: new Decimal(-37.9968708)
            
        })
        
        await expect(() => sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -4.9381376,
            userLongitude: -37.9823225,
        })).rejects.toBeInstanceOf(MaxDistanceError)
    })
})