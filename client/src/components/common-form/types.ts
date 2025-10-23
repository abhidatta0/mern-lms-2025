export type FormControl =  {
    name: string,
    label: string,
    placeholder: string,
    type: "text"|"email"|"password"|'number',
    componentType: "input"|"select"|"textarea",
    options?:{id:string, label:string}[]
}

export type FormData = Record<string,string>;