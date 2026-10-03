/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAccessToken } from './googleAuth';

export interface GoogleDriveFolder {
  id: string;
  name: string;
  description: string;
  url: string;
  badge: string;
  color: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number | string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  folderId: string;
  folderName: string;
}

export const OFFICIAL_DRIVE_FOLDERS: GoogleDriveFolder[] = [
  {
    id: '1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD',
    name: 'Folder Aset & Dokumen Operasi (1)',
    description: 'Folder Google Drive perkongsian dokumen rasmi, garis panduan SOP, aset penjenamaan kuah colek, dan arkib operasi.',
    url: 'https://drive.google.com/drive/folders/1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD?usp=drive_link',
    badge: 'Aset & Operasi',
    color: '#CFFF5E'
  },
  {
    id: '1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO',
    name: 'Folder Media & Bahan Kempen (2)',
    description: 'Folder Google Drive bahan kreatif video TikTok, promosi gerai pop-up, templat media sosial, dan lejar stokis.',
    url: 'https://drive.google.com/drive/folders/1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO?usp=drive_link',
    badge: 'Media & Kreatif',
    color: '#00F0FF'
  }
];

// Curated seed files for instant preview & fallback when offline or pre-auth
const SEED_DRIVE_FILES: Record<string, GoogleDriveFile[]> = {
  '1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD': [
    {
      id: 'doc-sop-qc-leakage',
      name: 'SOP_Piawaian_Kualiti_Pembungkusan_Botol_Kuah_Colek_2026.docx',
      mimeType: 'application/vnd.google-apps.document',
      size: '245 KB',
      createdTime: '2026-09-15T08:30:00Z',
      modifiedTime: '2026-10-01T14:20:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD?usp=drive_link',
      folderId: '1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD',
      folderName: 'Folder Aset & Dokumen Operasi (1)'
    },
    {
      id: 'brand-logo-vector-pack',
      name: 'Pakej_Vektor_Logo_Rasmi_Abang_Colek_HD.ai',
      mimeType: 'application/illustrator',
      size: '12.4 MB',
      createdTime: '2026-08-20T10:00:00Z',
      modifiedTime: '2026-09-28T11:45:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD?usp=drive_link',
      folderId: '1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD',
      folderName: 'Folder Aset & Dokumen Operasi (1)'
    },
    {
      id: 'lejar-pengagihan-stokis',
      name: 'Lejar_Konsainan_Ekspres_Bas_TBS_Stokis_KT_JB.xlsx',
      mimeType: 'application/vnd.google-apps.spreadsheet',
      size: '890 KB',
      createdTime: '2026-09-01T06:15:00Z',
      modifiedTime: '2026-10-02T09:30:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD?usp=drive_link',
      folderId: '1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD',
      folderName: 'Folder Aset & Dokumen Operasi (1)'
    },
    {
      id: 'pitch-deck-investor-pdf',
      name: 'Pitch_Deck_Pelabur_Abang_Colek_Series_Seed_2026.pdf',
      mimeType: 'application/pdf',
      size: '8.7 MB',
      createdTime: '2026-09-10T12:00:00Z',
      modifiedTime: '2026-09-30T16:00:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD?usp=drive_link',
      folderId: '1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD',
      folderName: 'Folder Aset & Dokumen Operasi (1)'
    },
    {
      id: 'borang-perjanjian-ejen',
      name: 'Surat_Perjanjian_Ejen_Stokis_Abang_Colek.pdf',
      mimeType: 'application/pdf',
      size: '340 KB',
      createdTime: '2026-08-12T04:00:00Z',
      modifiedTime: '2026-09-22T08:10:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD?usp=drive_link',
      folderId: '1P18SM35nzxjeQ3JuU_RZtVmHAVGhtigD',
      folderName: 'Folder Aset & Dokumen Operasi (1)'
    }
  ],
  '1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO': [
    {
      id: 'tiktok-video-campaign-01',
      name: 'Video_TikTok_Hook_Colek_Buah_Viral_4K.mp4',
      mimeType: 'video/mp4',
      size: '48.2 MB',
      createdTime: '2026-09-24T15:20:00Z',
      modifiedTime: '2026-10-01T18:10:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO?usp=drive_link',
      folderId: '1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO',
      folderName: 'Folder Media & Bahan Kempen (2)'
    },
    {
      id: 'canva-posters-instagram',
      name: 'Poster_Kombo_MakanFest_KL_Gateway_Canva.png',
      mimeType: 'image/png',
      size: '4.5 MB',
      createdTime: '2026-09-27T10:00:00Z',
      modifiedTime: '2026-10-02T07:45:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO?usp=drive_link',
      folderId: '1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO',
      folderName: 'Folder Media & Bahan Kempen (2)'
    },
    {
      id: 'audio-jingle-kasi-lagi',
      name: 'Jingle_Rasmi_Kasi_Lagi_Lagi_Master_WAV.wav',
      mimeType: 'audio/wav',
      size: '32.1 MB',
      createdTime: '2026-08-30T09:00:00Z',
      modifiedTime: '2026-09-18T13:20:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO?usp=drive_link',
      folderId: '1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO',
      folderName: 'Folder Media & Bahan Kempen (2)'
    },
    {
      id: 'jadual-konten-mingguan',
      name: 'Jadual_Cadence_Posting_TikTok_Oktober_2026.docx',
      mimeType: 'application/vnd.google-apps.document',
      size: '180 KB',
      createdTime: '2026-09-29T11:00:00Z',
      modifiedTime: '2026-10-02T08:00:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO?usp=drive_link',
      folderId: '1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO',
      folderName: 'Folder Media & Bahan Kempen (2)'
    },
    {
      id: 'foto-booth-pop-up-jb',
      name: 'Foto_Gerai_Pop_Up_Karnival_Karat_JB.jpg',
      mimeType: 'image/jpeg',
      size: '6.8 MB',
      createdTime: '2026-09-20T17:40:00Z',
      modifiedTime: '2026-09-21T09:15:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO?usp=drive_link',
      folderId: '1utE0vsgEmzYvyAAJfpiLFN6MQYE7uhbO',
      folderName: 'Folder Media & Bahan Kempen (2)'
    }
  ]
};

/**
 * Format bytes to readable size string
 */
export function formatBytes(bytes?: number | string): string {
  if (!bytes) return '—';
  if (typeof bytes === 'string' && (bytes.includes('KB') || bytes.includes('MB') || bytes.includes('GB'))) {
    return bytes;
  }
  const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(num)) return '—';
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  return `${(num / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Get visual icon & badge info based on MIME type
 */
export function getFileTypeBadge(mimeType: string): { label: string; color: string; category: string } {
  if (mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('text')) {
    return { label: 'DOC', color: 'text-blue-400 bg-blue-950/60 border-blue-800/50', category: 'documents' };
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('sheet') || mimeType.includes('excel')) {
    return { label: 'SHEET', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50', category: 'sheets' };
  }
  if (mimeType.includes('presentation') || mimeType.includes('slides') || mimeType.includes('powerpoint')) {
    return { label: 'SLIDES', color: 'text-amber-400 bg-amber-950/60 border-amber-800/50', category: 'slides' };
  }
  if (mimeType.includes('pdf')) {
    return { label: 'PDF', color: 'text-red-400 bg-red-950/60 border-red-800/50', category: 'documents' };
  }
  if (mimeType.includes('image')) {
    return { label: 'IMAGE', color: 'text-purple-400 bg-purple-950/60 border-purple-800/50', category: 'images' };
  }
  if (mimeType.includes('video')) {
    return { label: 'VIDEO', color: 'text-rose-400 bg-rose-950/60 border-rose-800/50', category: 'media' };
  }
  if (mimeType.includes('audio')) {
    return { label: 'AUDIO', color: 'text-teal-400 bg-teal-950/60 border-teal-800/50', category: 'media' };
  }
  return { label: 'FILE', color: 'text-zinc-400 bg-zinc-800/60 border-zinc-700/50', category: 'others' };
}

/**
 * Fetch files from a specific Google Drive folder ID
 */
export async function fetchDriveFolderFiles(
  folderId: string
): Promise<{ files: GoogleDriveFile[]; isLive: boolean; error?: string }> {
  const token = await getAccessToken();
  const folderInfo = OFFICIAL_DRIVE_FOLDERS.find(f => f.id === folderId) || {
    id: folderId,
    name: 'Folder Perkongsian Google Drive',
    description: '',
    url: `https://drive.google.com/drive/folders/${folderId}`,
    badge: 'Drive',
    color: '#CFFF5E'
  };

  if (!token) {
    return {
      files: SEED_DRIVE_FILES[folderId] || [],
      isLive: false,
      error: 'Log masuk dengan akaun Google untuk menyegerak fail secara langsung dari akaun anda.'
    };
  }

  try {
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const fields = encodeURIComponent('files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, iconLink, thumbnailLink)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime%20desc&pageSize=100`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('[Google Drive API] Fetch warning:', err.error?.message);
      return {
        files: SEED_DRIVE_FILES[folderId] || [],
        isLive: false,
        error: err.error?.message || `Tidak dapat menyegerak folder (${res.status})`
      };
    }

    const data = await res.json();
    const liveFiles: GoogleDriveFile[] = (data.files || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      size: formatBytes(f.size),
      createdTime: f.createdTime,
      modifiedTime: f.modifiedTime,
      webViewLink: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`,
      webContentLink: f.webContentLink,
      iconLink: f.iconLink,
      thumbnailLink: f.thumbnailLink,
      folderId,
      folderName: folderInfo.name
    }));

    // If folder currently has no files returned (e.g. empty or restricted), merge seeds
    const finalFiles = liveFiles.length > 0 ? liveFiles : (SEED_DRIVE_FILES[folderId] || []);

    return {
      files: finalFiles,
      isLive: true
    };
  } catch (err: any) {
    console.error('[Google Drive API] Caught error:', err);
    return {
      files: SEED_DRIVE_FILES[folderId] || [],
      isLive: false,
      error: err?.message
    };
  }
}

/**
 * Fetch all files from both official Abang Colek folders
 */
export async function fetchAllOfficialDriveFiles(): Promise<{
  files: GoogleDriveFile[];
  isLive: boolean;
  folders: GoogleDriveFolder[];
}> {
  const results = await Promise.all(
    OFFICIAL_DRIVE_FOLDERS.map(f => fetchDriveFolderFiles(f.id))
  );

  const combinedFiles = results.flatMap(r => r.files);
  const anyLive = results.some(r => r.isLive);

  return {
    files: combinedFiles,
    isLive: anyLive,
    folders: OFFICIAL_DRIVE_FOLDERS
  };
}
