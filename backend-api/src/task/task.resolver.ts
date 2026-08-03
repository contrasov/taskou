import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { TaskDto } from './dto/task.dto';
import { TaskService } from './task.service';
import { Task } from './dto/task.model';

@Resolver()
@UseGuards(GqlAuthGuard)
export class TaskResolver {
    constructor(private readonly taskService: TaskService) { }

    @Mutation(() => Task)
    async createTask(@CurrentUser() user: any, @Args('taskDto') taskDto: TaskDto) {
        return await this.taskService.create(user.id, taskDto)
    }

    @Mutation(() => Task)
    async deleteTask(@Args('taskId') taskId: string) {
        return await this.taskService.delete(taskId)
    }

    @Mutation(() => Task)
    async updateTask(@Args('taskId') taskId: string, @Args('taskDto') taskDto: TaskDto) {
        return await this.taskService.update(taskId, taskDto)
    }

    @Query(() => [Task])
    async listTaskByUser(@CurrentUser() user: any) {
        return await this.taskService.listByUser(user.id)
    }

    @Mutation(() => Boolean)
    async updateALotStatus(@Args('taskIds', { type: () => [String] }) taskIds: string[], @Args('finished') finished: boolean) {
        return await this.taskService.updateALotStatus(taskIds, finished)
    }

}
