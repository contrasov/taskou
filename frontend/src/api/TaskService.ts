import { fetchGraphQL } from './graphqlClient';

export interface Task {
    id?: string;
    title: string;
    category: string;
    priority: string;
    startDate: string;
    endDate: string | null;
    finished: boolean;
}

export class TaskService {
    static async getTasks(): Promise<Task[]> {
        const query = `
                query GetTasks {
                    listTaskByUser {
                        id
                        title
                        category
                        priority
                        startDate
                        endDate
                        finished                        
                    }
                }
             `;
        const response = await fetchGraphQL<{ listTaskByUser: Task[] }>(query);
        return response.listTaskByUser ?? [];
    }

    static async createTask(task: Task): Promise<Task> {
        const mutation = `
            mutation CreateTask($taskInput: TaskDto!) {
                createTask(taskInput: $taskInput) {
                    id
                    title
                    category
                    priority
                    startDate
                    endDate
                    finished
                }
            }
        `;
        const response = await fetchGraphQL<{ createTask: Task }>(mutation, { taskInput: task });
        return response.createTask;
    }

    static async deleteTask(taskId: string): Promise<void> {
        const mutation = `
            mutation DeleteTask($taskId: String!) {
                deleteTask(taskId: $taskId)
            }
        `;
        await fetchGraphQL(mutation, { taskId });
    }
}