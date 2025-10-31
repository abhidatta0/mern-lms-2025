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

export type InstructorCourse = {
    _id: string,
    instructorId: string,
    instructorName: string,
    date: Date,
    students:{paidAmount: string, studentId: string}[],
    curriculum: CourseCurriculumFormData[],
    isPublished: boolean,
} & CourseLandingFormData;

export type CreateCoursePayload = Omit<InstructorCourse,'_id'|'students'>;
export type UpdateCoursePayload = Partial<InstructorCourse>;

export type CloudinarySingleMediaUploadResponse = {
  resource_type: 'video'|'image',
  rotation: number,
  secure_url: string,
  url: string,
  public_id:string,
}