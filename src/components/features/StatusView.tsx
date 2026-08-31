import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Clock, 
  X, 
  Send, 
  Camera, 
  Image as ImageIcon, 
  Video, 
  Type, 
  Upload, 
  Volume2, 
  VolumeX, 
  Trash2, 
  HardDrive, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  PlusCircle, 
  Eye 
} from 'lucide-react';
import { StatusStory } from '../../types';
import { useGitPitStore } from '../../store/gitPitStore';
import { soundEngine, triggerConfetti } from '../../utils/soundEffects';

// EXACT ALLOCATED STORAGE LIMIT: 30 MB
const MAX_TOTAL_STORAGE_MB = 30.0;

interface BatchQueueItem {
  id: string;
  mediaType: 'image' | 'video' | 'text';
  content: string;
  caption: string;
  bgGradient?: string;
  sizeMb: number;
  fileName?: string;
}

export const StatusView: React.FC = () => {
  const { 
    statusStories, 
    currentUser, 
    addStatusStory, 
    deleteStatusStory 
  } = useGitPitStore();

  // Multi-Story Viewer states
  const [activeStoryList, setActiveStoryList] = useState<StatusStory[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);

  // Batch Multi-Status Composer states
  const [batchModalOpen, setBatchModalOpen] = useState<boolean>(false);
  const [manageStoriesOpen, setManageStoriesOpen] = useState<boolean>(false);
  const [batchQueue, setBatchQueue] = useState<BatchQueueItem[]>([]);
  const [selectedQueueIndex, setSelectedQueueIndex] = useState<number>(0);

  // Text composer temporary states (for adding text card into batch)
  const [textInput, setTextInput] = useState<string>('');
  const [selectedBg, setSelectedBg] = useState<string>('from-emerald-600 via-teal-700 to-cyan-800');
  const [showAddTextModal, setShowAddTextModal] = useState<boolean>(false);
  const [showViewersModal, setShowViewersModal] = useState<boolean>(false);

  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const singleAddFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Preset Photos
  const presetPhotos = [
    { name: 'Mountain Sunrise', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80', sizeMb: 2.4 },
    { name: 'Tech Workspace', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80', sizeMb: 3.1 },
    { name: 'Neon City Night', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80', sizeMb: 2.9 },
    { name: 'Ocean Vibes', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', sizeMb: 2.1 }
  ];

  // Preset Videos
  const presetVideos = [
    { name: 'Digital Code Matrix', url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31911-large.mp4', sizeMb: 7.5 },
    { name: 'Ocean Sunset Waves', url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4', sizeMb: 6.8 },
    { name: 'Highway Traffic Lights', url: 'https://assets.mixkit.co/videos/preview/mixkit-fast-motion-of-cars-on-a-highway-at-night-42861-large.mp4', sizeMb: 8.2 }
  ];

  // Group statuses by user
  const myStories = statusStories.filter((s) => s.userId === currentUser.id || s.userId === 'user_me');
  
  // Calculate total storage used by My Active Stories
  const myTotalUsedStorageMb = myStories.reduce((sum, s) => sum + (s.sizeMb || (s.mediaType === 'video' ? 7.5 : s.mediaType === 'image' ? 2.5 : 0.05)), 0);
  const myStoragePercentage = Math.min(100, (myTotalUsedStorageMb / MAX_TOTAL_STORAGE_MB) * 100);

  // Calculate total size of currently queued batch items
  const batchTotalSizeMb = batchQueue.reduce((sum, item) => sum + item.sizeMb, 0);
  const prospectiveTotalStorageMb = myTotalUsedStorageMb + batchTotalSizeMb;
  const prospectiveStoragePercentage = Math.min(100, (prospectiveTotalStorageMb / MAX_TOTAL_STORAGE_MB) * 100);

  // Group other contacts' statuses by unique userId
  const otherUsersMap = new Map<string, StatusStory[]>();
  statusStories
    .filter((s) => s.userId !== currentUser.id && s.userId !== 'user_me')
    .forEach((story) => {
      const existing = otherUsersMap.get(story.userId) || [];
      otherUsersMap.set(story.userId, [...existing, story]);
    });

  const otherUsersList = Array.from(otherUsersMap.entries()).map(([userId, stories]) => ({
    userId,
    userName: stories[0].userName,
    userAvatar: stories[0].userAvatar,
    latestTime: stories[stories.length - 1].formattedTime,
    stories
  }));

  // Handle Multi-File Upload at once
  const handleMultipleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: BatchQueueItem[] = [];

    files.forEach((file, idx) => {
      const isVideo = file.type.startsWith('video');
      const sizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2)) || (isVideo ? 6.5 : 2.2);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newItems.push({
            id: 'batch_' + Date.now() + '_' + idx + '_' + Math.random().toString(36).substring(2, 5),
            mediaType: isVideo ? 'video' : 'image',
            content: reader.result,
            caption: '',
            sizeMb: sizeMb,
            fileName: file.name
          });

          // When all files in this batch are read
          if (newItems.length === files.length) {
            setBatchQueue((prev) => [...prev, ...newItems]);
            setSelectedQueueIndex(batchQueue.length);
            setBatchModalOpen(true);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  // Add Preset Photo/Video to Batch Queue
  const handleAddPresetToQueue = (preset: { name: string; url: string; sizeMb: number }, type: 'image' | 'video') => {
    soundEngine.playClick();
    const newItem: BatchQueueItem = {
      id: 'batch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      mediaType: type,
      content: preset.url,
      caption: preset.name,
      sizeMb: preset.sizeMb,
      fileName: preset.name
    };
    setBatchQueue((prev) => [...prev, newItem]);
    setSelectedQueueIndex(batchQueue.length);
  };

  // Add Text Card to Batch Queue
  const handleAddTextCardToQueue = () => {
    if (!textInput.trim()) return;
    soundEngine.playClick();
    const newItem: BatchQueueItem = {
      id: 'batch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      mediaType: 'text',
      content: textInput.trim(),
      caption: '',
      bgGradient: selectedBg,
      sizeMb: 0.05
    };
    setBatchQueue((prev) => [...prev, newItem]);
    setSelectedQueueIndex(batchQueue.length);
    setTextInput('');
    setShowAddTextModal(false);
  };

  // Remove Item from Batch Queue
  const handleRemoveFromQueue = (index: number) => {
    soundEngine.playClick();
    const updated = batchQueue.filter((_, idx) => idx !== index);
    setBatchQueue(updated);
    if (selectedQueueIndex >= updated.length) {
      setSelectedQueueIndex(Math.max(0, updated.length - 1));
    }
  };

  // Publish All Queued Statuses at Once
  const handlePublishAllBatch = () => {
    if (batchQueue.length === 0) return;

    // Check 30MB total allocation limit
    if (prospectiveTotalStorageMb > MAX_TOTAL_STORAGE_MB) {
      alert("⚠️ Total 30MB Storage Limit Exceeded! Your batch of " + batchQueue.length + " stories (" + batchTotalSizeMb.toFixed(1) + " MB) plus existing stories (" + myTotalUsedStorageMb.toFixed(1) + " MB) totals " + prospectiveTotalStorageMb.toFixed(1) + " MB (Limit is " + MAX_TOTAL_STORAGE_MB + " MB). Please remove some items or delete older stories.");
      return;
    }

    soundEngine.playSentPop();

    // Publish all items sequentially into store
    batchQueue.forEach((item) => {
      addStatusStory({
        mediaType: item.mediaType,
        content: item.content,
        caption: item.caption,
        bgGradient: item.bgGradient,
        sizeMb: item.sizeMb
      });
    });

    setBatchQueue([]);
    setBatchModalOpen(false);
    triggerConfetti();
    alert("🎉 " + batchQueue.length + " Status Stories Published Simultaneously! (" + batchTotalSizeMb.toFixed(1) + " MB added to your 30MB allocated space)");
  };

  // Open Fullscreen Viewer
  const handleOpenUserStories = (stories: StatusStory[], startIndex: number = 0) => {
    if (!stories || stories.length === 0) return;
    setActiveStoryList(stories);
    setCurrentStoryIndex(startIndex);
    setIsViewerOpen(true);
    soundEngine.playClick();
  };

  const handleNextStory = () => {
    if (currentStoryIndex < activeStoryList.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      setIsViewerOpen(false);
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const currentViewerStory = activeStoryList[currentStoryIndex];
  const currentSelectedItem = batchQueue[selectedQueueIndex];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--sidebar-bg)] p-4 select-none">
      
      {/* Top Title Bar with Batch Add Button */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-black text-[var(--text-primary)]">
            GitPit 24h Status
          </h2>
          <span className="text-[11px] text-[var(--text-secondary)] font-semibold">
            Batch Multi-Status • 30 MB Allocated Quota
          </span>
        </div>

        <div className="flex gap-1.5">
          {/* Hidden Multi-file picker */}
          <input
            ref={multiFileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMultipleFilesSelected}
            className="hidden"
          />

          <button
            onClick={() => multiFileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-full shadow-md cursor-pointer transition-all active:scale-95"
            title="Attach multiple photos and videos at once"
          >
            <Plus className="w-4 h-4" />
            <span>Add Multi-Status</span>
          </button>
        </div>
      </div>

      {/* 30 MB Total Allocated Storage Limit Card */}
      <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-[var(--text-primary)] flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-teal-500" />
            <span>Total Allocated Storage Limit (30 MB)</span>
          </span>
          <span className={"font-bold text-[11px] " + (myStoragePercentage > 85 ? 'text-red-500' : myStoragePercentage > 60 ? 'text-amber-500' : 'text-emerald-500')}>
            {myTotalUsedStorageMb.toFixed(1)} MB / {MAX_TOTAL_STORAGE_MB.toFixed(0)} MB ({myStoragePercentage.toFixed(0)}%)
          </span>
        </div>

        {/* Dynamic Color Progress Bar */}
        <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className={"h-full rounded-full transition-all duration-300 " + (
              myStoragePercentage > 85 ? 'bg-red-500' : myStoragePercentage > 60 ? 'bg-amber-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'
            )}
            style={{ width: myStoragePercentage + '%' }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
          <span>{myStories.length} active stories attached</span>
          <span>Free space: {(MAX_TOTAL_STORAGE_MB - myTotalUsedStorageMb).toFixed(1)} MB remaining</span>
        </div>
      </div>

      {/* My Status Card */}
      <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] mb-4">
        <div 
          onClick={() => myStories.length > 0 ? handleOpenUserStories(myStories, 0) : multiFileInputRef.current?.click()}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[var(--accent)] shadow"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-[var(--accent)] text-white rounded-full flex items-center justify-center shadow">
              <Plus className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-sm text-[var(--text-primary)]">My Status</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              {myStories.length > 0 
                ? (myStories.length + " active stories attached (" + myTotalUsedStorageMb.toFixed(1) + " MB) • Tap to view") 
                : 'Tap to attach multiple photos, videos & text'}
            </p>
          </div>
        </div>

        {/* Manage & Add More Stories Actions */}
        {myStories.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
            <button
              onClick={() => setManageStoriesOpen(!manageStoriesOpen)}
              className="text-[var(--accent)] font-bold hover:underline flex items-center gap-1 cursor-pointer text-[11px]"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{manageStoriesOpen ? 'Hide' : 'Manage & Delete Stories'} ({myStories.length})</span>
            </button>

            <button
              onClick={() => multiFileInputRef.current?.click()}
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Post More Stories</span>
            </button>
          </div>
        )}


        {/* Expanded Stories Management Drawer */}
        {manageStoriesOpen && myStories.length > 0 && (
          <div className="mt-2 space-y-1.5 pt-1 border-t border-[var(--border-color)]">
            {myStories.map((story, idx) => (
              <div key={story.id} className="flex items-center justify-between p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] text-xs">
                <div 
                  onClick={() => handleOpenUserStories(myStories, idx)}
                  className="flex items-center gap-2 flex-1 cursor-pointer truncate"
                >
                  <span className="font-bold text-[var(--accent)]">#{idx + 1}</span>
                  <span className="font-semibold uppercase text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">
                    {story.mediaType}
                  </span>
                  <span className="truncate text-[var(--text-secondary)] text-[11px]">
                    {story.caption || story.content.substring(0, 20)}
                  </span>
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                    ({(story.sizeMb || 2.5).toFixed(1)} MB)
                  </span>
                </div>

                <button
                  onClick={() => {
                    deleteStatusStory(story.id);
                    alert("Story deleted! Reclaimed space.");
                  }}
                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer shrink-0"
                  title="Delete story to free storage"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Contact Updates List */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
          Recent Contact Updates ({otherUsersList.length})
        </span>

        {otherUsersList.map((userGroup) => (
          <div
            key={userGroup.userId}
            onClick={() => handleOpenUserStories(userGroup.stories, 0)}
            className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="p-0.5 rounded-full border-2 border-[var(--accent)] shrink-0">
              <img
                src={userGroup.userAvatar}
                alt={userGroup.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">{userGroup.userName}</h4>
                <span className="text-[10px] font-extrabold bg-[var(--accent)]/15 text-[var(--accent)] px-2 py-0.5 rounded-full">
                  {userGroup.stories.length} {userGroup.stories.length === 1 ? 'story' : 'stories'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-0.5">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {userGroup.latestTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BATCH MULTI-STATUS COMPOSER MODAL (Add Multiple Statuses At Once) */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header with Batch Storage Indicator */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] bg-[var(--header-bg)]">
              <div>
                <h3 className="font-extrabold text-base text-[var(--text-primary)] flex items-center gap-2">
                  <span>Batch Multi-Status Publisher</span>
                  <span className="text-xs font-bold bg-teal-500 text-white px-2 py-0.5 rounded-full">
                    {batchQueue.length} {batchQueue.length === 1 ? 'item' : 'items'} queued
                  </span>
                </h3>
                <div className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5 flex items-center gap-2">
                  <span>Batch Size: <strong className="text-[var(--text-primary)]">{batchTotalSizeMb.toFixed(1)} MB</strong></span>
                  <span>•</span>
                  <span>Total after publish: <strong className={prospectiveTotalStorageMb > MAX_TOTAL_STORAGE_MB ? 'text-red-500' : 'text-teal-600 dark:text-teal-400'}>{prospectiveTotalStorageMb.toFixed(1)} / 30.0 MB</strong></span>
                </div>
              </div>

              <button 
                onClick={() => setBatchModalOpen(false)} 
                className="p-1.5 text-[var(--text-secondary)] hover:bg-black/10 dark:hover:bg-white/10 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Storage Exceeded Warning Banner if applicable */}
            {prospectiveTotalStorageMb > MAX_TOTAL_STORAGE_MB && (
              <div className="p-3 bg-red-500/15 border-b border-red-500/30 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Exceeds 30MB limit by {(prospectiveTotalStorageMb - MAX_TOTAL_STORAGE_MB).toFixed(1)} MB. Please remove some items.</span>
              </div>
            )}

            {/* Main Center Preview of currently selected queue item */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {currentSelectedItem ? (
                <div className="space-y-3">
                  <div className="relative aspect-video sm:aspect-16/9 rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-[var(--border-color)]">
                    {currentSelectedItem.mediaType === 'image' && (
                      <img 
                        src={currentSelectedItem.content} 
                        alt="Preview" 
                        className="w-full h-full object-contain" 
                      />
                    )}

                    {currentSelectedItem.mediaType === 'video' && (
                      <video
                        src={currentSelectedItem.content}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    )}

                    {currentSelectedItem.mediaType === 'text' && (
                      <div className={"p-6 rounded-2xl bg-gradient-to-tr " + (currentSelectedItem.bgGradient || 'from-emerald-600 to-teal-800') + " text-white font-black text-xl text-center max-w-sm"}>
                        {currentSelectedItem.content}
                      </div>
                    )}

                    <div className="absolute top-2 right-2 px-2.5 py-1 bg-black/80 rounded-md text-[11px] font-bold text-teal-400 flex items-center gap-1 shadow">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>{currentSelectedItem.sizeMb.toFixed(1)} MB</span>
                    </div>

                    <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/80 rounded-md text-[11px] font-bold text-white uppercase">
                      Item {selectedQueueIndex + 1} of {batchQueue.length} ({currentSelectedItem.mediaType})
                    </div>
                  </div>

                  {/* Caption Input for selected item */}
                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
                      Caption for item #{selectedQueueIndex + 1}:
                    </label>
                    <input
                      type="text"
                      value={currentSelectedItem.caption}
                      onChange={(e) => {
                        const updated = [...batchQueue];
                        updated[selectedQueueIndex].caption = e.target.value;
                        setBatchQueue(updated);
                      }}
                      placeholder="Add caption or emojis for this story..."
                      className="w-full text-xs p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
                  No items in batch queue. Add photos, videos or text below!
                </div>
              )}

              {/* Queue Items Filmstrip (Scrollable thumbnail list) */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-extrabold text-[var(--text-secondary)] uppercase tracking-wider text-[11px]">
                    Batch Queue Items ({batchQueue.length})
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-semibold">Click thumbnail to inspect & caption</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {batchQueue.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedQueueIndex(idx)}
                      className={"relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all " + (
                        selectedQueueIndex === idx ? 'border-teal-500 scale-105 shadow-lg ring-2 ring-teal-500/50' : 'border-[var(--border-color)] opacity-70 hover:opacity-100'
                      )}
                    >
                      {item.mediaType === 'image' && <img src={item.content} alt="" className="w-full h-full object-cover" />}
                      {item.mediaType === 'video' && (
                        <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs font-bold">
                          <Video className="w-6 h-6 text-teal-400" />
                        </div>
                      )}
                      {item.mediaType === 'text' && (
                        <div className={"w-full h-full bg-gradient-to-tr " + item.bgGradient + " flex items-center justify-center p-1 text-[8px] font-bold text-white text-center truncate"}>
                          {item.content.substring(0, 12)}
                        </div>
                      )}

                      {/* Size Badge */}
                      <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-teal-300 font-black text-center py-0.5">
                        {item.sizeMb.toFixed(1)}MB
                      </span>

                      {/* Delete button from queue */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromQueue(idx);
                        }}
                        className="absolute top-1 right-1 w-4 h-4 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow"
                        title="Remove from batch"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add More Photos / Videos to queue */}
                  <div
                    onClick={() => singleAddFileInputRef.current?.click()}
                    className="shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-teal-500/50 hover:border-teal-500 bg-teal-500/10 flex flex-col items-center justify-center text-teal-600 dark:text-teal-400 cursor-pointer transition-colors p-1"
                  >
                    <PlusCircle className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-bold text-center leading-tight">+ Media</span>
                  </div>

                  {/* Add Text Card to queue */}
                  <div
                    onClick={() => setShowAddTextModal(true)}
                    className="shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-purple-500/50 hover:border-purple-500 bg-purple-500/10 flex flex-col items-center justify-center text-purple-600 dark:text-purple-400 cursor-pointer transition-colors p-1"
                  >
                    <Type className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-bold text-center leading-tight">+ Text</span>
                  </div>

                  <input
                    ref={singleAddFileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMultipleFilesSelected}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Presets Quick-Add Row */}
              <div className="pt-2 border-t border-[var(--border-color)]">
                <span className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1.5">
                  Quick-Add Aesthetic HD Presets to Batch:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {presetPhotos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddPresetToQueue(p, 'image')}
                      className="p-1.5 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5 hover:border-teal-500 text-[10px] font-bold truncate text-left flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3 h-3 text-teal-500 shrink-0" />
                      <span className="truncate">{p.name} ({p.sizeMb}MB)</span>
                    </button>
                  ))}
                  {presetVideos.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddPresetToQueue(v, 'video')}
                      className="p-1.5 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5 hover:border-teal-500 text-[10px] font-bold truncate text-left flex items-center gap-1 cursor-pointer"
                    >
                      <Video className="w-3 h-3 text-purple-500 shrink-0" />
                      <span className="truncate">{v.name} ({v.sizeMb}MB)</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer Publish All Button */}
            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--header-bg)] flex items-center gap-3">
              <button
                onClick={() => setBatchQueue([])}
                className="px-4 py-3 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                Clear Queue
              </button>

              <button
                onClick={handlePublishAllBatch}
                disabled={batchQueue.length === 0 || prospectiveTotalStorageMb > MAX_TOTAL_STORAGE_MB}
                className="flex-1 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Publish All {batchQueue.length} Status Stories at Once ({batchTotalSizeMb.toFixed(1)} MB)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Text Card Helper Modal */}
      {showAddTextModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-sm rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[var(--text-primary)]">Add Text Story to Batch</h3>
              <button onClick={() => setShowAddTextModal(false)} className="text-[var(--text-secondary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={"p-6 rounded-2xl bg-gradient-to-tr " + selectedBg + " flex items-center justify-center min-h-[140px]"}>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your message..."
                rows={3}
                className="w-full text-center text-white font-black text-base bg-transparent placeholder-white/70 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              {[
                'from-emerald-600 via-teal-700 to-cyan-800',
                'from-rose-600 via-pink-600 to-purple-800',
                'from-amber-500 via-orange-600 to-red-700',
                'from-blue-600 via-indigo-700 to-purple-900',
                'from-purple-800 via-pink-700 to-amber-600'
              ].map((bg, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedBg(bg)}
                  className={"w-7 h-7 rounded-full bg-gradient-to-tr " + bg + " border-2 cursor-pointer " + (selectedBg === bg ? 'border-white scale-110' : 'border-transparent')}
                />
              ))}
            </div>

            <button
              onClick={handleAddTextCardToQueue}
              disabled={!textInput.trim()}
              className="w-full py-2.5 bg-[var(--accent)] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              Add to Batch Queue (0.05 MB)
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Multi-Story Carousel Player */}
      {isViewerOpen && currentViewerStory && (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-4 animate-in fade-in duration-200">
          
          {/* Top Multi-Segmented Progress Bars */}
          <div className="flex items-center gap-1.5 w-full z-20">
            {activeStoryList.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className={"h-full " + (
                    idx < currentStoryIndex ? 'bg-white' : idx === currentStoryIndex ? 'bg-white animate-pulse' : 'bg-transparent'
                  )} 
                />
              </div>
            ))}
          </div>

          {/* User Bar */}
          <div className="flex items-center justify-between py-2 z-20">
            <div className="flex items-center gap-2.5">
              <img src={currentViewerStory.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover border" />
              <div>
                <h4 className="font-bold text-sm leading-none flex items-center gap-2">
                  <span>{currentViewerStory.userName}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                    {currentStoryIndex + 1} of {activeStoryList.length}
                  </span>
                </h4>
                <span className="text-xs text-white/70">{currentViewerStory.formattedTime} • {currentViewerStory.mediaType.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentViewerStory.mediaType === 'video' && (
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
                >
                  {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={() => setShowViewersModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold hover:bg-black/80 cursor-pointer border border-white/20"
              >
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                <span>Seen by {currentViewerStory.viewers?.length || 0} contacts</span>
              </button>

              {(currentViewerStory.userId === currentUser.id || currentViewerStory.userId === 'user_me') && (
                <button
                  onClick={() => {
                    deleteStatusStory(currentViewerStory.id);
                    setIsViewerOpen(false);
                    alert("Story removed. Storage recovered!");
                  }}
                  className="p-2 rounded-full bg-red-600/80 text-white hover:bg-red-600 cursor-pointer"
                  title="Delete this status"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button 
                onClick={() => setIsViewerOpen(false)} 
                className="p-1.5 text-white/80 hover:text-white rounded-full bg-white/10 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Story Body with Tap Left/Right Navigation Areas */}
          <div className="flex-1 flex flex-col items-center justify-center my-auto p-2 text-center max-w-lg mx-auto w-full relative">
            
            {/* Left Tap Zone for Previous */}
            <div 
              onClick={handlePrevStory}
              className="absolute left-0 inset-y-0 w-1/3 z-10 cursor-pointer"
              title="Previous Story"
            />

            {/* Right Tap Zone for Next */}
            <div 
              onClick={handleNextStory}
              className="absolute right-0 inset-y-0 w-1/3 z-10 cursor-pointer"
              title="Next Story"
            />

            {/* Previous & Next Navigation Buttons */}
            {currentStoryIndex > 0 && (
              <button
                onClick={handlePrevStory}
                className="absolute left-2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {currentStoryIndex < activeStoryList.length - 1 && (
              <button
                onClick={handleNextStory}
                className="absolute right-2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image Story */}
            {currentViewerStory.mediaType === 'image' && (
              <div className="relative w-full flex flex-col items-center">
                <img 
                  src={currentViewerStory.content} 
                  alt="status" 
                  className="max-h-[65vh] max-w-full rounded-2xl shadow-2xl object-contain" 
                />
                {currentViewerStory.caption && (
                  <div className="mt-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-sm font-semibold text-white max-w-md">
                    {currentViewerStory.caption}
                  </div>
                )}
              </div>
            )}

            {/* Video Story */}
            {currentViewerStory.mediaType === 'video' && (
              <div className="relative w-full flex flex-col items-center">
                <video
                  ref={videoRef}
                  src={currentViewerStory.content}
                  autoPlay
                  loop
                  playsInline
                  muted={isVideoMuted}
                  className="max-h-[65vh] max-w-full rounded-2xl shadow-2xl object-contain bg-black"
                />
                {currentViewerStory.caption && (
                  <div className="mt-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-sm font-semibold text-white max-w-md">
                    {currentViewerStory.caption}
                  </div>
                )}
              </div>
            )}

            {/* Text Story */}
            {currentViewerStory.mediaType === 'text' && (
              <div className={"p-8 rounded-3xl bg-gradient-to-tr " + (currentViewerStory.bgGradient || 'from-emerald-600 to-teal-800') + " text-xl sm:text-2xl font-extrabold max-w-md shadow-2xl leading-relaxed"}>
                {currentViewerStory.content}
              </div>
            )}
          </div>

          {/* Reply Bar */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full max-w-md mx-auto w-full z-20">
            <input
              type="text"
              placeholder="Reply to status..."
              className="flex-1 bg-transparent text-white placeholder-white/60 text-xs focus:outline-none"
            />
            <button 
              onClick={() => {
                soundEngine.playSentPop();
                alert('Reply sent to user inbox!');
                setIsViewerOpen(false);
              }}
              className="p-1.5 text-[var(--accent)] hover:scale-110 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    
      {/* STATUS VIEWERS / SEEN BY LIST MODAL */}
      {showViewersModal && currentViewerStory && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] bg-[var(--header-bg)]">
              <h3 className="font-extrabold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-500" />
                <span>Status Views ({currentViewerStory.viewers?.length || 0} Contacts)</span>
              </h3>
              <button onClick={() => setShowViewersModal(false)} className="p-1 rounded-full text-[var(--text-secondary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(!currentViewerStory.viewers || currentViewerStory.viewers.length === 0) ? (
                <div className="py-8 text-center text-xs text-[var(--text-secondary)]">
                  👁️ No contacts have viewed this status story yet.
                </div>
              ) : (
                currentViewerStory.viewers.map((viewer, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-xs">
                    <div className="flex items-center gap-3">
                      <img src={viewer.userAvatar} alt="" className="w-9 h-9 rounded-full object-cover border" />
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)]">{viewer.userName}</h4>
                        <span className="text-[10px] text-[var(--text-secondary)]">Viewed {viewer.viewedAt}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold bg-teal-500/15 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full">
                      🟢 Verified View
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
  
</div>
  );
};