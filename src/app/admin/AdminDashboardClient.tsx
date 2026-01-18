'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Copy, RefreshCw, Trash2, Edit2, Check, X } from 'lucide-react';
import { Wish, RsvpData, Invitation } from '@/lib/db';

interface AdminDashboardClientProps {
  initialWishes: Wish[];
  initialRsvps: RsvpData[];
  initialInvitations: Invitation[];
}

export function AdminDashboardClient({ initialWishes, initialRsvps, initialInvitations }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'links' | 'wishes' | 'rsvp'>('links');
  
  // Data states
  const [wishes, setWishes] = useState(initialWishes);
  const [rsvps, setRsvps] = useState(initialRsvps);
  const [invitations, setInvitations] = useState(initialInvitations);

  // Invitation Form
  const [guestName, setGuestName] = useState('');
  const [slug, setSlug] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  // Feedback
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const fetchData = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) {
           const text = await res.text();
           console.error(`Fetch error for ${url}:`, text);
           return [];
        }
        return res.json();
      };

      const [wishesRes, rsvpRes, invitationsRes] = await Promise.all([
          fetchData('/api/wishes'),
          fetchData('/api/rsvp'),
          fetchData('/api/invitations')
      ]);
      setWishes(wishesRes);
      setRsvps(rsvpRes);
      setInvitations(invitationsRes);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // --- Invitation Logic ---
  const handleGenerateLink = async () => {
    if (!guestName.trim()) return;
    
    // Auto-generate slug if empty (simple sanitization)
    const finalSlug = slug.trim() || guestName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    setIsGenerating(true);
    try {
        const res = await fetch('/api/invitations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guestName, slug: finalSlug })
        });
        
        if (res.ok) {
            setGuestName('');
            setSlug('');
            refreshData();
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDeleteInvitation = async (id: number) => {
      if(!confirm('Are you sure you want to delete this invitation?')) return;
      await fetch(`/api/invitations?id=${id}`, { method: 'DELETE' });
      refreshData();
  };

  // --- Generic Delete/Update Logic ---
  const handleDelete = async (endpoint: string, id: number) => {
      if(!confirm('Are you sure?')) return;
      await fetch(`/api/${endpoint}?id=${id}`, { method: 'DELETE' });
      refreshData();
  };

  const handleEdit = (item: any) => {
      setEditingId(item.id);
      setEditForm({ ...item });
  };

  const handleCancelEdit = () => {
      setEditingId(null);
      setEditForm({});
  };

  const handleSave = async (endpoint: string) => {
      await fetch(`/api/${endpoint}`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm)
      });
      setEditingId(null);
      refreshData();
  };

  const getInvitationLink = (slug: string) => {
      if (typeof window !== 'undefined') {
          return `${window.location.origin}/?u=${slug}`; // Using slug as the param value or name directly?
          // Based on previous implementation, ?u= reads the name directly. 
          // If we want to use the slug to lookup the name, we'd need to change the homepage logic.
          // But looking at the prompt "list tab list undangan yang sudah dibuat", implies managing these links.
          // If the homepage simply takes ?u=Name, then we don't strictly need a database for links unless we want to "manage" them (e.g. tracking who we invited).
          // If the previous homepage implementation used ?u=Name directly without DB lookup, then "slug" here might just be the name parameter value.
          // Let's assume ?u=GuestName for now as per previous step.
          // So "slug" here essentially acts as the name displayed in the URL if different, or just stored record.
          // Actually, let's keep it simple: ?u=NameEncoded.
      }
      return `/?u=${slug}`;
  };

  const copyLink = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopiedLink(text);
      setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="container mx-auto p-6 md:p-12 max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-navy-primary">Admin Dashboard</h1>
        <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
        </Button>
      </div>

      <div className="mb-8 flex space-x-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2 font-sans text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'links'
              ? 'border-b-2 border-navy-primary text-navy-primary'
              : 'text-gray-500 hover:text-navy-deep'
          }`}
        >
          Undangan ({invitations.length})
        </button>
        <button
          onClick={() => setActiveTab('wishes')}
          className={`px-4 py-2 font-sans text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'wishes'
              ? 'border-b-2 border-navy-primary text-navy-primary'
              : 'text-gray-500 hover:text-navy-deep'
          }`}
        >
          Ucapan & Doa ({wishes.length})
        </button>
        <button
          onClick={() => setActiveTab('rsvp')}
          className={`px-4 py-2 font-sans text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'rsvp'
              ? 'border-b-2 border-navy-primary text-navy-primary'
              : 'text-gray-500 hover:text-navy-deep'
          }`}
        >
          RSVP ({rsvps.length})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 min-h-[400px]">
        
        {/* --- INVITATIONS TAB --- */}
        {activeTab === 'links' && (
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-navy-deep mb-4">Buat Undangan Baru</h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Nama Tamu (e.g. Budi & Keluarga)"
                        className="flex-1 rounded-md border border-gray-300 p-2 focus:border-navy-primary focus:outline-none"
                    />
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="Custom URL Slug (optional)"
                        className="flex-1 rounded-md border border-gray-300 p-2 focus:border-navy-primary focus:outline-none"
                    />
                    <Button onClick={handleGenerateLink} disabled={isGenerating}>
                        {isGenerating ? 'Saving...' : 'Generate'}
                    </Button>
                </div>
            </div>

            {/* Filter */}
            <div className="flex justify-end">
              <input 
                type="text" 
                placeholder="Cari nama tamu..." 
                className="rounded-md border border-gray-300 p-2 text-sm focus:border-navy-primary focus:outline-none w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nama Tamu</th>
                    <th className="px-4 py-3 font-semibold">URL Slug</th>
                    <th className="px-4 py-3 font-semibold">Link</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invitations
                    .filter(inv => inv.guestName.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((inv) => {
                      const isEditing = editingId === inv.id;
                      const link = getInvitationLink(inv.guestName); // Using guestName as param based on page.tsx logic

                      return (
                        <tr key={inv.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-navy-deep">
                                {isEditing ? (
                                    <input 
                                        className="border rounded p-1 w-full"
                                        value={editForm.guestName}
                                        onChange={(e) => setEditForm({...editForm, guestName: e.target.value})}
                                    />
                                ) : inv.guestName}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                                {isEditing ? (
                                    <input 
                                        className="border rounded p-1 w-full"
                                        value={editForm.slug}
                                        onChange={(e) => setEditForm({...editForm, slug: e.target.value})}
                                    />
                                ) : inv.slug}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 truncate max-w-[200px]">{link}</span>
                                    <button onClick={() => copyLink(link)} className="text-navy-primary hover:text-navy-deep">
                                        {copiedLink === link ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={() => handleSave('invitations')} className="text-green-600 hover:text-green-800"><Check className="h-4 w-4" /></button>
                                        <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700"><X className="h-4 w-4" /></button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(inv)} className="text-blue-600 hover:text-blue-800"><Edit2 className="h-4 w-4" /></button>
                                        <button onClick={() => handleDeleteInvitation(inv.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                                    </>
                                )}
                            </td>
                        </tr>
                      );
                  })}
                  {invitations.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">Belum ada undangan.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- WISHES TAB --- */}
        {activeTab === 'wishes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Waktu</th>
                  <th className="px-4 py-3 font-semibold">Nama</th>
                  <th className="px-4 py-3 font-semibold">Ucapan</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wishes.map((wish) => {
                    const isEditing = editingId === wish.id;
                    return (
                        <tr key={wish.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{wish.date}</td>
                            <td className="px-4 py-3 font-medium text-navy-deep">
                                {isEditing ? (
                                    <input 
                                        className="border rounded p-1 w-full"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    />
                                ) : wish.name}
                            </td>
                            <td className="px-4 py-3 text-gray-700 max-w-md">
                                {isEditing ? (
                                    <textarea 
                                        className="border rounded p-1 w-full"
                                        value={editForm.message}
                                        onChange={(e) => setEditForm({...editForm, message: e.target.value})}
                                    />
                                ) : wish.message}
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={() => handleSave('wishes')} className="text-green-600 hover:text-green-800"><Check className="h-4 w-4" /></button>
                                        <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700"><X className="h-4 w-4" /></button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(wish)} className="text-blue-600 hover:text-blue-800"><Edit2 className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete('wishes', wish.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* --- RSVP TAB --- */}
        {activeTab === 'rsvp' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Waktu</th>
                  <th className="px-4 py-3 font-semibold">Nama</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-center">Jumlah</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rsvps.map((rsvp) => {
                    const isEditing = editingId === rsvp.id;
                    return (
                        <tr key={rsvp.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(rsvp.date).toLocaleString()}</td>
                            <td className="px-4 py-3 font-medium text-navy-deep">
                                {isEditing ? (
                                    <input 
                                        className="border rounded p-1 w-full"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    />
                                ) : rsvp.name}
                            </td>
                            <td className="px-4 py-3">
                                {isEditing ? (
                                    <select 
                                        className="border rounded p-1"
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                    >
                                        <option value="hadir">Hadir</option>
                                        <option value="tidak">Tidak Hadir</option>
                                    </select>
                                ) : (
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                                        rsvp.status === 'hadir' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {rsvp.status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700">
                                {isEditing && editForm.status === 'hadir' ? (
                                    <input 
                                        type="number"
                                        className="border rounded p-1 w-16"
                                        value={editForm.guests}
                                        onChange={(e) => setEditForm({...editForm, guests: Number(e.target.value)})}
                                    />
                                ) : rsvp.guests}
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={() => handleSave('rsvp')} className="text-green-600 hover:text-green-800"><Check className="h-4 w-4" /></button>
                                        <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700"><X className="h-4 w-4" /></button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(rsvp)} className="text-blue-600 hover:text-blue-800"><Edit2 className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete('rsvp', rsvp.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
