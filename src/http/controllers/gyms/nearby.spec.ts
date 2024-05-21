import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Nearby Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'JavaScript Gym',
            description: 'Some description',
            phone: '88981076724',
            latitude: -4.9381376,
            longitude: -37.9823225,
        })

        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'TypeScript Gym',
            description: 'Some description',
            phone: '88981076724',
            latitude: -4.7838821,
            longitude: -37.7943524,
        })

        const response = await request(app.server)
        .get('/gyms/nearby')
        .query({
            latitude: -4.9381376,
            longitude: -37.9823225,
        })
        .query({
            q: 'JavaScript',
        })
        .set('Authorization', `Bearer ${token}`)
        .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym'
            })
        ])
    })
})