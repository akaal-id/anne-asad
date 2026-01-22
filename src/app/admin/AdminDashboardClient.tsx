'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Copy, RefreshCw, Trash2, Edit2, Check, X, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Wish, RsvpData, Invitation } from '@/lib/db';
import { BASE_PATH } from '@/lib/utils';

interface AdminDashboardClientProps {
  initialWishes: Wish[];
  initialRsvps: RsvpData[];
  initialInvitations: Invitation[];
}

export function AdminDashboardClient({ initialWishes, initialRsvps, initialInvitations }: AdminDashboardClientProps) {
  const router = useRouter();
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
  const [rsvpSearchQuery, setRsvpSearchQuery] = useState('');

  // Edit States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  // Feedback
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedTextId, setCopiedTextId] = useState<number | null>(null);

  // Pagination states
  const [invitationsPage, setInvitationsPage] = useState(1);
  const [wishesPage, setWishesPage] = useState(1);
  const [rsvpPage, setRsvpPage] = useState(1);
  const itemsPerPage = 10;

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
          fetchData(`${BASE_PATH}/api/wishes`),
          fetchData(`${BASE_PATH}/api/rsvp`),
          fetchData(`${BASE_PATH}/api/invitations`)
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
        const res = await fetch(`${BASE_PATH}/api/invitations`, {
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
      await fetch(`${BASE_PATH}/api/invitations?id=${id}`, { method: 'DELETE' });
      refreshData();
  };

  // --- Generic Delete/Update Logic ---
  const handleDelete = async (endpoint: string, id: number) => {
      if(!confirm('Are you sure?')) return;
      await fetch(`${BASE_PATH}/api/${endpoint}?id=${id}`, { method: 'DELETE' });
      refreshData();
  };

  const handleAttendanceCheck = async (id: number, checked: boolean) => {
      // Optimistic update
      setRsvps(prev => prev.map(r => r.id === id ? { ...r, attended: checked } : r));
      
      try {
        await fetch(`${BASE_PATH}/api/rsvp`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, attended: checked })
        });
      } catch (error) {
        console.error("Failed to update attendance", error);
        refreshData(); // Revert on error
      }
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
      await fetch(`${BASE_PATH}/api/${endpoint}`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm)
      });
      setEditingId(null);
      refreshData();
  };

  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin + BASE_PATH);
  }, []);

  // Reset pagination when tab changes
  useEffect(() => {
    setInvitationsPage(1);
    setWishesPage(1);
    setRsvpPage(1);
  }, [activeTab]);

  // Reset pagination when search query changes
  useEffect(() => {
    setInvitationsPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setRsvpPage(1);
  }, [rsvpSearchQuery]);


  const copyLink = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopiedLink(text);
      setTimeout(() => setCopiedLink(null), 2000);
  };

  const generateCustomText = (guestName: string, urlSlug: string) => {
    // Use the same logic as linkUrl generation in the table
    const linkUrl = origin ? `${origin}/?u=${urlSlug}` : `https://wedding.akaal.id${BASE_PATH}/?u=${urlSlug}`;
    
    const template = `لسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ

${guestName},

Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang ${guestName} untuk menghadiri acara pernikahan kami:

Aulianne Farah Anissa (Anne) & Asad Muhammad (Asad)

Insya Allah acara akan diselenggarakan pada:
Tanggal : Sabtu, 7 Februari 2026
Lokasi : Terlampir pada undangan digital

Berikut adalah tautan undangan digital kami untuk informasi lengkap dan konfirmasi kehadiran (RSVP):

🔗 Link Undangan:
${linkUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila ${guestName} berkenan hadir dan memberikan doa restu kepada kami.

Atas perhatian dan kehadirannya, kami ucapkan terima kasih.

وَالسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ

Hormat kami, Anne & Asad`;

    return template;
  };

  const copyCustomText = (inv: Invitation) => {
    const customText = generateCustomText(inv.guestName, inv.slug || inv.guestName);
    navigator.clipboard.writeText(customText);
    setCopiedTextId(inv.id);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  // Pagination helper
  const paginate = <T,>(items: T[], page: number, perPage: number) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return {
      paginatedItems: items.slice(startIndex, endIndex),
      totalPages: Math.ceil(items.length / perPage),
      totalItems: items.length,
      currentPage: page,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, items.length)
    };
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_PATH}/api/auth/logout`, {
        method: 'POST',
      });
      
      if (res.ok) {
        router.push(`${BASE_PATH}/admin/login`);
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, redirect to login
      router.push(`${BASE_PATH}/admin/login`);
      router.refresh();
    }
  };

  return (
    <div className="container mx-auto p-6 md:p-12 max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-navy-primary">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:border-red-300">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
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
                    <th className="px-4 py-3 font-semibold w-12">No</th>
                    <th className="px-4 py-3 font-semibold max-w-[200px]">Nama Tamu</th>
                    <th className="px-4 py-3 font-semibold">URL Slug</th>
                    <th className="px-4 py-3 font-semibold">Link</th>
                    <th className="px-4 py-3 font-semibold">Copy Teks Undangan</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(() => {
                    const filtered = invitations.filter(inv => inv.guestName.toLowerCase().includes(searchQuery.toLowerCase()));
                    const { paginatedItems, totalPages, totalItems, currentPage, startIndex } = paginate(filtered, invitationsPage, itemsPerPage);
                    
                    // Reset page if current page is out of bounds
                    if (currentPage > totalPages && totalPages > 0) {
                      setInvitationsPage(1);
                    }
                    
                    return paginatedItems.map((inv, index) => {
                      const isEditing = editingId === inv.id;
                      const linkUrl = origin ? `${origin}/?u=${inv.slug || inv.guestName}` : `/?u=${inv.slug || inv.guestName}`;

                      const rowNumber = startIndex + index;
                      return (
                        <tr key={inv.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-500 text-center">{rowNumber}</td>
                            <td className="px-4 py-3 font-medium text-navy-deep max-w-[200px]">
                                {isEditing ? (
                                    <input 
                                        className="border rounded p-1 w-full"
                                        value={editForm.guestName || ''}
                                        onChange={(e) => setEditForm({...editForm, guestName: e.target.value})}
                                    />
                                ) : (
                                    <span className="truncate block" title={inv.guestName}>{inv.guestName}</span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                                {isEditing ? (
                                    <input 
                                        className="border rounded p-1 w-full"
                                        value={editForm.slug || ''}
                                        onChange={(e) => setEditForm({...editForm, slug: e.target.value})}
                                    />
                                ) : inv.slug}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 truncate max-w-[200px]">{linkUrl}</span>
                                    <button onClick={() => copyLink(linkUrl)} className="text-navy-primary hover:text-navy-deep">
                                        {copiedLink === linkUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <button 
                                    onClick={() => copyCustomText(inv)} 
                                    className="flex items-center gap-2 text-sm text-navy-primary hover:text-navy-deep transition-colors"
                                    title="Copy teks undangan custom"
                                >
                                    {copiedTextId === inv.id ? (
                                        <>
                                            <Check className="h-4 w-4 text-green-600" />
                                            <span className="text-green-600">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            <span>Copy Teks</span>
                                        </>
                                    )}
                                </button>
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
                    });
                  })()}
                  {invitations.filter(inv => inv.guestName.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <tr><td colSpan={6} className="p-4 text-center text-gray-500">Belum ada undangan.</td></tr>
                  )}
                </tbody>
              </table>
              
              {/* Pagination Controls */}
              {(() => {
                const filtered = invitations.filter(inv => inv.guestName.toLowerCase().includes(searchQuery.toLowerCase()));
                const { totalPages, totalItems, currentPage, startIndex, endIndex } = paginate(filtered, invitationsPage, itemsPerPage);
                
                if (totalPages <= 1) return null;
                
                return (
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3">
                    <div className="text-sm text-gray-700">
                      Menampilkan <span className="font-medium">{startIndex}</span> sampai <span className="font-medium">{endIndex}</span> dari <span className="font-medium">{totalItems}</span> undangan
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInvitationsPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Sebelumnya
                      </button>
                      <span className="text-sm text-gray-700">
                        Halaman {currentPage} dari {totalPages}
                      </span>
                      <button
                        onClick={() => setInvitationsPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                      >
                        Selanjutnya
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* --- WISHES TAB --- */}
        {activeTab === 'wishes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold w-12">No</th>
                  <th className="px-4 py-3 font-semibold">Waktu</th>
                  <th className="px-4 py-3 font-semibold max-w-[200px]">Nama</th>
                  <th className="px-4 py-3 font-semibold">Ucapan</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(() => {
                  const { paginatedItems, totalPages, totalItems, currentPage, startIndex } = paginate(wishes, wishesPage, itemsPerPage);
                  
                  if (currentPage > totalPages && totalPages > 0) {
                    setWishesPage(1);
                  }
                  
                  return paginatedItems.map((wish, index) => {
                    const isEditing = editingId === wish.id;
                    const rowNumber = startIndex + index;
                    return (
                        <tr key={wish.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-500 text-center">{rowNumber}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{wish.date}</td>
                            <td className="px-4 py-3 font-medium text-navy-deep max-w-[200px]">
                                {isEditing ? (
                                    <input 
                                        className="border rounded p-1 w-full"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    />
                                ) : (
                                    <span className="truncate block" title={wish.name}>{wish.name}</span>
                                )}
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
                  });
                })()}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {(() => {
              const { totalPages, totalItems, currentPage, startIndex, endIndex } = paginate(wishes, wishesPage, itemsPerPage);
              
              if (totalPages <= 1) return null;
              
              return (
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3">
                  <div className="text-sm text-gray-700">
                    Menampilkan <span className="font-medium">{startIndex}</span> sampai <span className="font-medium">{endIndex}</span> dari <span className="font-medium">{totalItems}</span> ucapan
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWishesPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </button>
                    <span className="text-sm text-gray-700">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                      onClick={() => setWishesPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* --- RSVP TAB --- */}
        {activeTab === 'rsvp' && (
          <div className="space-y-4">
            {/* RSVP Filter */}
            <div className="flex justify-end">
              <input 
                type="text" 
                placeholder="Cari nama tamu di RSVP..." 
                className="rounded-md border border-gray-300 p-2 text-sm focus:border-navy-primary focus:outline-none w-full md:w-64"
                value={rsvpSearchQuery}
                onChange={(e) => setRsvpSearchQuery(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold w-12">No</th>
                    <th className="px-4 py-3 font-semibold">Waktu</th>
                    <th className="px-4 py-3 font-semibold max-w-[200px]">Nama</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-center">Jumlah</th>
                    <th className="px-4 py-3 font-semibold text-center">Hadir Hari H</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(() => {
                    const filtered = rsvps.filter(r => r.name.toLowerCase().includes(rsvpSearchQuery.toLowerCase()));
                    const { paginatedItems, totalPages, totalItems, currentPage, startIndex } = paginate(filtered, rsvpPage, itemsPerPage);
                    
                    if (currentPage > totalPages && totalPages > 0) {
                      setRsvpPage(1);
                    }
                    
                    return paginatedItems.map((rsvp, index) => {
                      const isEditing = editingId === rsvp.id;
                      const rowNumber = startIndex + index;
                      return (
                          <tr key={rsvp.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-500 text-center">{rowNumber}</td>
                              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(rsvp.date).toLocaleString()}</td>
                              <td className="px-4 py-3 font-medium text-navy-deep max-w-[200px]">
                                  {isEditing ? (
                                      <input 
                                          className="border rounded p-1 w-full"
                                          value={editForm.name}
                                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                      />
                                  ) : (
                                      <span className="truncate block" title={rsvp.name}>{rsvp.name}</span>
                                  )}
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
                              <td className="px-4 py-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    className="h-4 w-4 text-navy-primary rounded border-gray-300 focus:ring-navy-primary"
                                    checked={!!rsvp.attended}
                                    onChange={(e) => handleAttendanceCheck(rsvp.id, e.target.checked)}
                                  />
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
                    });
                  })()}
                  {rsvps.filter(r => r.name.toLowerCase().includes(rsvpSearchQuery.toLowerCase())).length === 0 && (
                    <tr><td colSpan={7} className="p-4 text-center text-gray-500">Belum ada data RSVP.</td></tr>
                  )}
                </tbody>
              </table>
              
              {/* Pagination Controls */}
              {(() => {
                const filtered = rsvps.filter(r => r.name.toLowerCase().includes(rsvpSearchQuery.toLowerCase()));
                const { totalPages, totalItems, currentPage, startIndex, endIndex } = paginate(filtered, rsvpPage, itemsPerPage);
                
                if (totalPages <= 1) return null;
                
                return (
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3">
                    <div className="text-sm text-gray-700">
                      Menampilkan <span className="font-medium">{startIndex}</span> sampai <span className="font-medium">{endIndex}</span> dari <span className="font-medium">{totalItems}</span> RSVP
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRsvpPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Sebelumnya
                      </button>
                      <span className="text-sm text-gray-700">
                        Halaman {currentPage} dari {totalPages}
                      </span>
                      <button
                        onClick={() => setRsvpPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                      >
                        Selanjutnya
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
