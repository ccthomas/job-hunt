export type Interaction = {
    id?: string | undefined;
    application_id: string;
    name: string;
    company: string;
    job_title: string;
    type: InteractionType;
    rating: number;
    notes: string;
    interaction_timestamp: string;
}

export enum InteractionType { 
    HiringManager = 'HIRING_MANAGER',
    InitialContact = 'INITIAL_CONTACT',
    PhoneScreening = 'PHONE_SCREENING',
}