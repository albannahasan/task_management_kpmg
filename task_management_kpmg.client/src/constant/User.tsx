export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const users: User[] = [
  {
    id: 1,
    name: "Amina Yusuf",
    email: "amina.yusuf@example.com",
    role: "Project Manager",
  },
  {
    id: 2,
    name: "Miguel Hernandez",
    email: "miguel.hernandez@example.com",
    role: "Team Lead",
  },
  {
    id: 3,
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "Team Member",
  },
  {
    id: 4,
    name: "Jinwoo Park",
    email: "jinwoo.park@example.com",
    role: "Team Member",
  },
  {
    id: 5,
    name: "Fatima Al-Farsi",
    email: "fatima.alfarsi@example.com",
    role: "Project Manager",
  },
  {
    id: 6,
    name: "Hasan Al Banna",
    email: "hasan.albanna@example.com",
    role: "Team Lead",
  },
];

