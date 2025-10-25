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
    isPublished: boolean
}

export type CourseCurriculumFormData= {
    title: string,
    videoUrl: string,
    freePreview: boolean,
    public_id: string,
};

export type CreateCoursePayload = {
    instructorId: string,
    instructorName: string,
    date: Date,
    students:never[],
    curriculum: CourseCurriculumFormData[],
    isPublished: boolean,
} & CourseLandingFormData;