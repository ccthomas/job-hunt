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
    Rejected = 'REJECTED',
    TurnedDown = 'TURNED_DOWN'
}

export const interactionDescriptions: Record<InteractionType, string> = {
    [InteractionType.HiringManager]: "Hiring Manager meeting with the applicant..",
    [InteractionType.InitialContact]: "Initial contact between company hiring & applicant.",
    [InteractionType.PhoneScreening]: "Phone Screening with recuirter and applicant.",
    [InteractionType.Rejected]: "Company rejectiing the applicant's application",
    [InteractionType.TurnedDown]: "Applicant turning down and offer from said company."
};
