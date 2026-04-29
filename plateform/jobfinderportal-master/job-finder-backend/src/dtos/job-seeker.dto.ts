export class RegisterJobSeekerDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio?: string;
  skills?: string[];
}

export class LoginJobSeekerDto {
  email: string;
  password: string;
}
