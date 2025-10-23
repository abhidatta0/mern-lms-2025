import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useInstructorContext } from "../../InstructorContext";
import { courseCurriculumInitialFormData } from "@/config";
import { mediaUploadService } from "@/services";

const CourseCurriculum = () => {
  const {courseCurriculumFormData, setCourseCurriculumFormData, setMediaUploadProgress} = useInstructorContext();

  console.log({courseCurriculumFormData})

  function handleNewLecture(){
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0]
      }
    ])
  }

  function handleTitleChange(event:React.ChangeEvent<HTMLInputElement>, index: number){
    const copyCourseCurriculumFormData = [...courseCurriculumFormData];
    copyCourseCurriculumFormData[index] = {
      ...copyCourseCurriculumFormData[index],
      title: event.target.value,
    }

    setCourseCurriculumFormData(copyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(checked: boolean, index: number){
    const copyCourseCurriculumFormData = [...courseCurriculumFormData];
    copyCourseCurriculumFormData[index] = {
      ...copyCourseCurriculumFormData[index],
      freePreview: checked,
    }

    setCourseCurriculumFormData(copyCourseCurriculumFormData);
  }

   async function handleSingleLectureUpload(event:React.ChangeEvent<HTMLInputElement>, index:number) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          // setMediaUploadProgressPercentage
        );
        console.log({response});
        if (response.success) {
          const cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[index] = {
            ...cpyCourseCurriculumFormData[index],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((_, index) => (
            <div className="border p-5 rounded-md" key={index}>
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(event)=> handleTitleChange(event, index)}
                  value={courseCurriculumFormData[index].title}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value)=> handleFreePreviewChange(value, index)}
                    checked={courseCurriculumFormData[index].freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                 <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                    className="mb-4"
                  />
                
              </div>

            
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default CourseCurriculum