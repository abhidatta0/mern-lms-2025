import type { FormEvent } from "react";
import { Button } from "../ui/button";
import FormControls from "./form-controls";
import type { FormControl, FormData } from "./types";


type Props = {
  handleSubmit: (data: FormEvent<HTMLFormElement>)=> void,
  buttonText: string,
  formControls: FormControl[],
  formData:FormData,
  setFormData: (val:FormData)=>void,
  isButtonDisabled?: boolean,
}
function CommonForm({
  handleSubmit,
  buttonText,
  formControls,
  formData,
  setFormData,
  isButtonDisabled = false,
}:Props) {
  return (
    <form onSubmit={handleSubmit}>
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button disabled={isButtonDisabled} type="submit" className="mt-5 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;