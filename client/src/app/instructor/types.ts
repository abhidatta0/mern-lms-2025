export type CourseLandingFormData = {
    title: string;
    category: string;
    level: string;
    primaryLanguage: string;
    subtitle: string;
    description: string;
    pricing: string;
    objectives: string;
    welcomeMessage: string;
    image: string;
}

export type CourseCurriculumFormData= {
    title: string,
    videoUrl: string,
    freePreview: boolean,
    public_id: string,
};