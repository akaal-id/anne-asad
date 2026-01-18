import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'src/data');
const wishesFile = path.join(dataDirectory, 'wishes.json');
const rsvpFile = path.join(dataDirectory, 'rsvp.json');
const invitationsFile = path.join(dataDirectory, 'invitations.json');

// Ensure data directory exists
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

// Helper to read JSON file
function readData<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(fileContents);
  } catch (e) {
    return [];
  }
}

// Helper to write JSON file
function writeData<T>(filePath: string, data: T[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export interface Wish {
  id: number;
  name: string;
  message: string;
  date: string;
}

export interface RsvpData {
  id: number;
  name: string;
  status: "hadir" | "tidak";
  guests: number;
  date: string;
}

export interface Invitation {
  id: number;
  slug: string;
  guestName: string;
  createdAt: string;
}

export const db = {
  wishes: {
    getAll: () => readData<Wish>(wishesFile),
    add: (wish: Omit<Wish, 'id' | 'date'>) => {
      const wishes = readData<Wish>(wishesFile);
      const newWish: Wish = {
        id: Date.now(),
        ...wish,
        date: new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
      };
      // Prepend to list
      writeData(wishesFile, [newWish, ...wishes]);
      return newWish;
    },
    delete: (id: number) => {
      const wishes = readData<Wish>(wishesFile);
      const filteredWishes = wishes.filter(w => w.id !== id);
      writeData(wishesFile, filteredWishes);
    },
    update: (id: number, data: Partial<Wish>) => {
      const wishes = readData<Wish>(wishesFile);
      const updatedWishes = wishes.map(w => w.id === id ? { ...w, ...data } : w);
      writeData(wishesFile, updatedWishes);
    }
  },
  rsvp: {
    getAll: () => readData<RsvpData>(rsvpFile),
    add: (data: Omit<RsvpData, 'id' | 'date'>) => {
      const rsvps = readData<RsvpData>(rsvpFile);
      const newRsvp: RsvpData = {
        id: Date.now(),
        ...data,
        date: new Date().toISOString()
      };
      writeData(rsvpFile, [newRsvp, ...rsvps]);
      return newRsvp;
    },
    delete: (id: number) => {
      const rsvps = readData<RsvpData>(rsvpFile);
      const filteredRsvps = rsvps.filter(r => r.id !== id);
      writeData(rsvpFile, filteredRsvps);
    },
    update: (id: number, data: Partial<RsvpData>) => {
      const rsvps = readData<RsvpData>(rsvpFile);
      const updatedRsvps = rsvps.map(r => r.id === id ? { ...r, ...data } : r);
      writeData(rsvpFile, updatedRsvps);
    }
  },
  invitations: {
    getAll: () => readData<Invitation>(invitationsFile),
    add: (data: Omit<Invitation, 'id' | 'createdAt'>) => {
      const invitations = readData<Invitation>(invitationsFile);
      const newInvitation: Invitation = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString()
      };
      writeData(invitationsFile, [newInvitation, ...invitations]);
      return newInvitation;
    },
    delete: (id: number) => {
      const invitations = readData<Invitation>(invitationsFile);
      const filteredInvitations = invitations.filter(i => i.id !== id);
      writeData(invitationsFile, filteredInvitations);
    },
    update: (id: number, data: Partial<Invitation>) => {
      const invitations = readData<Invitation>(invitationsFile);
      const updatedInvitations = invitations.map(i => i.id === id ? { ...i, ...data } : i);
      writeData(invitationsFile, updatedInvitations);
    }
  }
};
