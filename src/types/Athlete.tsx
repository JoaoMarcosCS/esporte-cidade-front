export interface Athlete {
    name: string;
    cpf: string;
    rg: string;
    phone: string;
    address: string;
    fatherName: string;
    motherName: string;
    birthday: string;
    phoneNumber: string;
    password: string;
    email: string;
    responsibleName: string;
    responsibleEmail: string;
    motherPhoneNumber: string;
    fatherPhoneNumber: string;
    bloodType: string;
    frontIdPhotoUrl:File | null;
    backIdPhotoUrl: File | null;
    athletePhotoUrl: File | null;
    foodAllergies: string;
}
