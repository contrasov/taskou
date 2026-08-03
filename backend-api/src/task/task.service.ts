import { Injectable } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, taskDto: TaskDto) {
        return await this.prisma.task.create({
            data: {
                title: taskDto.title,
                category: taskDto.category,
                priority: taskDto.priority,
                startDate: new Date(taskDto.startDate),
                endDate: taskDto.endDate ? new Date(taskDto.endDate) : null,
                userId: userId
            }
        })
    }

    async delete(taskId: string) {
        return await this.prisma.task.delete({
            where: { id: taskId }
        })
    }

    async update(taskId: string, taskDto: TaskDto) {
        return await this.prisma.task.update({
            where: { id: taskId },
            data: {
                title: taskDto.title,
                category: taskDto.category,
                priority: taskDto.priority,
                startDate: new Date(taskDto.startDate),
                endDate:  taskDto.endDate ? new Date(taskDto.endDate) : null
            }
        })
    }

    async listByUser(userId: string) {
        return await this.prisma.task.findMany({
            where: { userId: userId }
        })
    }

    async updateALotStatus(taskIds: string[], finished: boolean) {
        return await this.prisma.task.updateMany({
            where: {
                id: {
                    in: taskIds
                }
            },
            data: {
                finished: finished
            }
        })
    }
}
