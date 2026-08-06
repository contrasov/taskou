import { InputType, Field } from "@nestjs/graphql";

enum Category {
    documents = 'Documentação',
    codeReview = 'Code Review',
    test = 'Teste',
    design = 'Design',
    other = 'Outros'
}

enum Priority {
    low = 'Baixa',
    medium = 'Normal',
    high = 'Alta'
}

@InputType()
export class TaskDto {
    @Field()
    title: string;
    @Field()
    category: Category;
    @Field()
    priority: Priority;
    @Field()
    startDate: string;
    @Field({ nullable: true})
    endDate?: string;
    @Field()
    userId: string;
    @Field()
    finished: boolean;
} 