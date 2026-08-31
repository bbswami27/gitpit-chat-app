import React, { useState } from 'react';
import { X, Search, Phone, User, Check, Smartphone } from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';
import { Contact } from '../../types';
import { networkSyncEngine } from '../../utils/networkSyncEngine';
import { soundEngine } from '../../utils/soundEffects';

interface ContactPickerModalProps {
  onSelectContact: (contact: { name: string; phoneNumber: string; countryCode?: string }) => void;
  onClose: () => void;
}

export const ContactPickerModal: React.FC<ContactPickerModalProps> = ({ onSelectContact, onClose }) => {
  const { contacts } = useGitPitStore();
  const [search, setSearch] = useState('');

  const filteredContacts = contacts.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phoneNumber.includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--header-bg)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold">
              👤
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[var(--text-primary)]">Select Contact to Share</h3>
              <p className="text-[10px] text-[var(--text-secondary)]">Choose actual contact from phonebook</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 text-[var(--text-secondary)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: Import from Android Device SIM */}
        <div className="p-3 border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5 space-y-2">
          <button
            onClick={async () => {
              const devContact = await networkSyncEngine.pickNativeDeviceContact();
              if (devContact) {
                soundEngine.playClick();
                onSelectContact({ name: devContact.name, phoneNumber: devContact.phoneNumber, countryCode: '+91' });
                onClose();
              }
            }}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>📱 Select from Android SIM / Device Contacts</span>
          </button>

          <div className="relative flex items-center bg-[var(--header-bg)] rounded-xl px-3 py-1.5 border border-[var(--border-color)]">
            <Search className="w-4 h-4 text-[var(--text-secondary)] mr-2" />
            <input
              type="text"
              placeholder="Search saved contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent text-[var(--text-primary)] focus:outline-none font-medium"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-secondary)] text-xs">
              No contacts found
            </div>
          ) : (
            filteredContacts.map((cnt) => (
              <div
                key={cnt.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectContact({ name: cnt.name, phoneNumber: cnt.phoneNumber, countryCode: cnt.countryCode || '+91' });
                  onClose();
                }}
                className="p-3 rounded-2xl bg-[var(--header-bg)] border border-[var(--border-color)] hover:border-blue-500 cursor-pointer flex items-center justify-between transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <img src={cnt.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-blue-500/30" />
                  <div>
                    <h4 className="font-extrabold text-xs text-[var(--text-primary)]">{cnt.name}</h4>
                    <p className="text-[11px] text-[var(--text-secondary)] font-medium">
                      📞 {cnt.countryCode || '+91'} {cnt.phoneNumber}
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs">
                  Share
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
