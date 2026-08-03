import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class Task {
    @Field(() => ID)
    id: string;

    @Field()
    title: string;

    @Field()
    category: string;

    @Field()
    priority: string;

    @Field()
    startDate: Date;

    @Field({nullable: true})
    endDate: Date;

    @Field()
    userId: string;

    @Field()
    finished: boolean;
}