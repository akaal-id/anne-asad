import { supabase } from './supabase';

// Timeout utility for database operations
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

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
  attended?: boolean; // New field for actual attendance checklist
}

export interface Invitation {
  id: number;
  slug: string;
  guestName: string;
  createdAt: string;
}

function formatDateAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
        return "Baru saja";
    } else if (diffHours < 24) {
        return `${diffHours} jam yang lalu`;
    } else if (diffDays <= 7) {
        return `${diffDays} hari yang lalu`;
    } else {
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
}

export const db = {
  wishes: {
    getAll: async () => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('wishes')
            .select('*')
            .order('created_at', { ascending: false }),
          10000
        );
        
        if (error) {
          console.error('Error fetching wishes:', error);
          return [];
        }
        
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          message: item.message,
          date: formatDateAgo(item.created_at)
        })) as Wish[];
      } catch (error) {
        console.error('Timeout or error fetching wishes:', error);
        return [];
      }
    },
    add: async (wish: Omit<Wish, 'id' | 'date'>) => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('wishes')
            .insert([{ 
                name: wish.name, 
                message: wish.message,
            }])
            .select()
            .single(),
          10000 // 10 second timeout
        );

        if (error) throw error;
      
        return {
          id: data.id,
          name: data.name,
          message: data.message,
          date: formatDateAgo(data.created_at)
        } as Wish;
      } catch (error) {
        console.error('Error adding wish:', error);
        throw error;
      }
    },
    delete: async (id: number) => {
      try {
        const { error } = await withTimeout(
          supabase.from('wishes').delete().eq('id', id),
          10000
        );
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting wish:', error);
        throw error;
      }
    },
    update: async (id: number, data: Partial<Wish>) => {
      try {
        const { id: _, date, ...updateData } = data as any;
        const { error } = await withTimeout(
          supabase.from('wishes').update(updateData).eq('id', id),
          10000
        );
        if (error) throw error;
      } catch (error) {
        console.error('Error updating wish:', error);
        throw error;
      }
    }
  },
  rsvp: {
    getAll: async () => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('rsvp')
            .select('*')
            .order('created_at', { ascending: false }),
          10000
        );

        if (error) {
          console.error('Error fetching rsvp:', error);
          return [];
        }

        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          status: item.status,
          guests: item.guests,
          date: item.created_at,
          attended: item.attended || false
        })) as RsvpData[];
      } catch (error) {
        console.error('Timeout or error fetching RSVP:', error);
        return [];
      }
    },
    add: async (data: Omit<RsvpData, 'id' | 'date'>) => {
      try {
        const { data: result, error } = await withTimeout(
          supabase
            .from('rsvp')
            .insert([{ 
                name: data.name, 
                status: data.status, 
                guests: data.guests,
                attended: data.attended || false
            }])
            .select()
            .single(),
          10000
        );

        if (error) throw error;

        return {
          id: result.id,
          name: result.name,
          status: result.status,
          guests: result.guests,
          date: result.created_at,
          attended: result.attended
        } as RsvpData;
      } catch (error) {
        console.error('Error adding RSVP:', error);
        throw error;
      }
    },
    delete: async (id: number) => {
      try {
        const { error } = await withTimeout(
          supabase.from('rsvp').delete().eq('id', id),
          10000
        );
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting RSVP:', error);
        throw error;
      }
    },
    update: async (id: number, data: Partial<RsvpData>) => {
      try {
        const { id: _, date, ...updateData } = data as any;
        const { error } = await withTimeout(
          supabase.from('rsvp').update(updateData).eq('id', id),
          10000
        );
        if (error) throw error;
      } catch (error) {
        console.error('Error updating RSVP:', error);
        throw error;
      }
    }
  },
  invitations: {
    getAll: async () => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('invitations')
            .select('*')
            .order('created_at', { ascending: false }),
          10000
        );

        if (error) {
          console.error('Error fetching invitations:', error);
          return [];
        }

        return data.map((item: any) => ({
          id: item.id,
          slug: item.slug,
          guestName: item.guest_name,
          createdAt: item.created_at
        })) as Invitation[];
      } catch (error) {
        console.error('Timeout or error fetching invitations:', error);
        return [];
      }
    },
    add: async (data: Omit<Invitation, 'id' | 'createdAt'>) => {
      try {
        const { data: result, error } = await withTimeout(
          supabase
            .from('invitations')
            .insert([{ 
                guest_name: data.guestName, 
                slug: data.slug 
            }])
            .select()
            .single(),
          10000
        );

        if (error) throw error;

        return {
          id: result.id,
          slug: result.slug,
          guestName: result.guest_name,
          createdAt: result.created_at
        } as Invitation;
      } catch (error) {
        console.error('Error adding invitation:', error);
        throw error;
      }
    },
    delete: async (id: number) => {
      try {
        const { error } = await withTimeout(
          supabase.from('invitations').delete().eq('id', id),
          10000
        );
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting invitation:', error);
        throw error;
      }
    },
    update: async (id: number, data: Partial<Invitation>) => {
      try {
        // Map camelCase to snake_case and remove non-DB fields
        const { id: _, createdAt, guestName, ...rest } = data as any;
        const updateData: any = { ...rest };
        
        if (guestName) {
            updateData.guest_name = guestName;
        }
        
        const { error } = await withTimeout(
          supabase.from('invitations').update(updateData).eq('id', id),
          10000
        );
        if (error) throw error;
      } catch (error) {
        console.error('Error updating invitation:', error);
        throw error;
      }
    },
    getBySlug: async (slug: string) => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('invitations')
            .select('*')
            .eq('slug', slug)
            .single(),
          10000
        );
        
        if (error || !data) {
          return null;
        }
        
        return {
          id: data.id,
          slug: data.slug,
          guestName: data.guest_name,
          createdAt: data.created_at
        } as Invitation;
      } catch (error) {
        console.error('Error fetching invitation by slug:', error);
        return null;
      }
    }
  }
};
