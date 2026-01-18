import { supabase } from './supabase';

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
    getAll: async () => {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching wishes:', error);
        return [];
      }
      
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        message: item.message,
        date: new Date(item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
      })) as Wish[];
    },
    add: async (wish: Omit<Wish, 'id' | 'date'>) => {
      const { data, error } = await supabase
        .from('wishes')
        .insert([{ 
            name: wish.name, 
            message: wish.message,
            // created_at is handled by default now() in Supabase or we send it
        }])
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        message: data.message,
        date: new Date(data.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
      } as Wish;
    },
    delete: async (id: number) => {
      const { error } = await supabase.from('wishes').delete().eq('id', id);
      if (error) throw error;
    },
    update: async (id: number, data: Partial<Wish>) => {
      const { error } = await supabase.from('wishes').update(data).eq('id', id);
      if (error) throw error;
    }
  },
  rsvp: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('rsvp')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rsvp:', error);
        return [];
      }

      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        status: item.status,
        guests: item.guests,
        date: item.created_at
      })) as RsvpData[];
    },
    add: async (data: Omit<RsvpData, 'id' | 'date'>) => {
      const { data: result, error } = await supabase
        .from('rsvp')
        .insert([{ 
            name: data.name, 
            status: data.status, 
            guests: data.guests 
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: result.id,
        name: result.name,
        status: result.status,
        guests: result.guests,
        date: result.created_at
      } as RsvpData;
    },
    delete: async (id: number) => {
      const { error } = await supabase.from('rsvp').delete().eq('id', id);
      if (error) throw error;
    },
    update: async (id: number, data: Partial<RsvpData>) => {
      const { error } = await supabase.from('rsvp').update(data).eq('id', id);
      if (error) throw error;
    }
  },
  invitations: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

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
    },
    add: async (data: Omit<Invitation, 'id' | 'createdAt'>) => {
      const { data: result, error } = await supabase
        .from('invitations')
        .insert([{ 
            guest_name: data.guestName, 
            slug: data.slug 
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: result.id,
        slug: result.slug,
        guestName: result.guest_name,
        createdAt: result.created_at
      } as Invitation;
    },
    delete: async (id: number) => {
      const { error } = await supabase.from('invitations').delete().eq('id', id);
      if (error) throw error;
    },
    update: async (id: number, data: Partial<Invitation>) => {
        // Map camelCase to snake_case for specific fields if needed
        const updateData: any = { ...data };
        if (data.guestName) {
            updateData.guest_name = data.guestName;
            delete updateData.guestName;
        }
        
      const { error } = await supabase.from('invitations').update(updateData).eq('id', id);
      if (error) throw error;
    },
    getBySlug: async (slug: string) => {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error || !data) {
        return null;
      }
      
      return {
        id: data.id,
        slug: data.slug,
        guestName: data.guest_name,
        createdAt: data.created_at
      } as Invitation;
    }
  }
};
