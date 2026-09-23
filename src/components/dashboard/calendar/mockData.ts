export const RESOURCES = [
  { id: 1, title: 'Dr. Ana Costa', room: 'Sala 01', avatar: 'AC' },
  { id: 2, title: 'Dr. Bruno Gomes', room: 'Sala 02', avatar: 'BG' },
  { id: 3, title: 'Dr. Clara Dias', room: 'Sala 03', avatar: 'CD' },
];

export const EVENTS = [
  {
    id: 1,
    title: 'João Pereira',
    type: 'cleaning',
    status: 'confirmed',
    resourceId: 1,
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
  },
  {
    id: 2,
    title: 'Mariana Costa',
    type: 'filling',
    status: 'cancelled',
    resourceId: 2,
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
  },
  {
    id: 3,
    title: 'Sofia Alves',
    type: 'checkup',
    status: 'pending',
    resourceId: 1,
    start: new Date(new Date().setHours(12, 0, 0, 0)),
    end: new Date(new Date().setHours(13, 0, 0, 0)),
  },
  {
    id: 4,
    title: 'Lucas Ferreira',
    type: 'ortho',
    status: 'confirmed',
    resourceId: 2,
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 30, 0, 0)),
  },
   {
    id: 5,
    title: 'Miguel Santos',
    type: 'rootcanal',
    status: 'confirmed',
    resourceId: 1,
    start: new Date(new Date().setHours(16, 0, 0, 0)),
    end: new Date(new Date().setHours(17, 30, 0, 0)),
  },
];
