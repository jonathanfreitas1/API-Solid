import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
    findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
    countByUserId(user_id: string): Promise<number>
    findById(id: string):Promise<CheckIn | null>
    findByUserIdOnDate(userId: string, data: Date): Promise<CheckIn | null>
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    save(checkIn: CheckIn): Promise<CheckIn>
}