export class CreateProfileDto {
  userId: string;
  firstName: string;
  lastName: string;
  gender: string;      // <-- Changed back to a normal string
  dateOfBirth: string; 
  maritalStatus: string;
  motherTongue: string;
  city: string;
  country: string;
  religion: string;
  bio: string;
}