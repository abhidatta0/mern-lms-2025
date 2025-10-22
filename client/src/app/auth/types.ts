export type User = {
    "_id":string,
    "userName":string,
    "userEmail":string,
    "password":string,
    "role":"user"|"instructor",
}