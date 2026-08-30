import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Database, Clock, Download, Upload, RefreshCw, CheckCircle2, AlertTriangle, HardDrive, Cloud, FileText } from 'lucide-react';
import { BackupPoint, getCloudBackupPoints, getLocalRollingBackups, createCloudBackupPoint, validateAndParseBackupJSON } from '../lib/backupEngine';
import { UserCompressedSnapshotState, unpackUserSnapshot } from '../lib/snapshotEngine';

interface BackupRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail?: string;
  activeState: UserCompressedSnapshotState;
  onRestoreState: (state: UserCompressedSnapshotState) => Promise<void>;
  onTriggerNewBackup: () => Promise<void>;
}

export const BackupRecoveryModal: React.FC<BackupRecoveryModalProps> = ({
  isOpen,
  onClose,
  userId,
  userEmail,
  activeState,
  onRestoreState,
  onTriggerNewBackup,
}) => {
  const [cloudBackups, setCloudBackups] = useState<BackupPoint[]>([]);
  const [localBackups, setLocalBackups] = useState<BackupPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupPoint | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [importedState, setImportedState] = useState<UserCompressedSnapshotState | null>(null);

  const fetchBackups = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const locals = getLocalRollingBackups(userId || 'guest_user');
      setLocalBackups(locals);

      if (userId && userId !== 'guest_user') {
        const clouds = await getCloudBackupPoints(userId);
        setCloudBackups(clouds);
      }
    } catch (err) {
      console.warn('Failed to load backup points:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen) {
      fetchBackups();
      setSelectedBackup(null);
      setRestoreSuccess(false);
      setErrorMessage(null);
      setImportedState(null);
      setImportFileName(null);
    }
  }, [isOpen, fetchBackups]);

  if (!isOpen) return null;

  const handleManualBackupNow = async () => {
    setIsBackingUp(true);
    setErrorMessage(null);
    try {
      await onTriggerNewBackup();
      await fetchBackups();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save cloud backup point.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestorePoint = async (point: BackupPoint) => {
    setIsRestoring(true);
    setErrorMessage(null);
    try {
      let stateToRestore: UserCompressedSnapshotState | null = null;

      if (point.rawPayload) {
        stateToRestore = point.rawPayload;
      } else if (point.docData) {
        stateToRestore = await unpackUserSnapshot(point.docData);
      }

      if (!stateToRestore) {
        throw new Error('Failed to unpack backup archive payload.');
      }

      await onRestoreState(stateToRestore);
      setRestoreSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to restore backup snapshot.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = validateAndParseBackupJSON(content);
        setImportedState(parsed);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Invalid backup JSON file.');
        setImportedState(null);
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreImportedFile = async () => {
    if (!importedState) return;
    setIsRestoring(true);
    setErrorMessage(null);
    try {
      await onRestoreState(importedState);
      setRestoreSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to restore imported portfolio backup.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(activeState, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `deckdivider_backup_${dateStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#DC143C] rounded-lg shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Recurring Backup & Collection Recovery
              </h3>
              <p className="font-mono text-xs text-slate-300">
                Continuous point-in-time cloud snapshots and local rolling failsafes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 font-sans">
          {/* Status Indicator */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <div className="font-heading font-bold text-xs text-emerald-950">
                  Recurring Cloud Backup Active
                </div>
                <div className="font-mono text-[11px] text-emerald-800">
                  Every 6 hours + instant failover. Zero data loss guarantee.
                </div>
              </div>
            </div>
            <button
              onClick={handleManualBackupNow}
              disabled={isBackingUp}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
              <span>{isBackingUp ? 'Saving Snapshot...' : 'Backup Now'}</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-mono text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {restoreSuccess && (
            <div className="p-4 bg-emerald-600 text-white font-heading font-bold text-sm rounded-xl flex items-center justify-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5" />
              <span>Collection Successfully Restored! Refreshing dashboard...</span>
            </div>
          )}

          {/* Backup Archives Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-[#0F172A] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#DC143C]" />
                <span>Point-In-Time Restoration Points</span>
              </h4>
              <button
                onClick={fetchBackups}
                disabled={isLoading}
                className="text-xs font-mono text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-[#64748B] font-mono text-xs">
                Loading point-in-time recovery points...
              </div>
            ) : cloudBackups.length === 0 && localBackups.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-[#CBD5E1] rounded-xl text-[#64748B] font-mono text-xs">
                No historical backups found yet. Click "Backup Now" to create your first cloud snapshot point.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {/* Cloud Backups */}
                {cloudBackups.map((point) => (
                  <div
                    key={point.id}
                    onClick={() => setSelectedBackup(point)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      selectedBackup?.id === point.id
                        ? 'bg-[#FFF5F5] border-[#DC143C] ring-2 ring-[#DC143C]/20'
                        : 'bg-white border-[#E2E8F0] hover:border-[#DC143C]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-slate-100 text-[#0F172A] rounded-lg shrink-0">
                        <Cloud className="w-4 h-4 text-[#DC143C]" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading font-bold text-xs text-[#0F172A] flex items-center gap-2">
                          <span>{new Date(point.timestamp).toLocaleString()}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800 font-bold">
                            Cloud
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-[#64748B] truncate">
                          {point.summary.deckCount} Decks • {point.summary.cardCount} Cards • {point.summary.sealedCount} Sealed Products
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestorePoint(point);
                      }}
                      disabled={isRestoring}
                      className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#DC143C] text-white font-mono text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      Restore
                    </button>
                  </div>
                ))}

                {/* Local Failsafe Backups */}
                {localBackups.map((point) => (
                  <div
                    key={point.id}
                    onClick={() => setSelectedBackup(point)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      selectedBackup?.id === point.id
                        ? 'bg-[#FFF5F5] border-[#DC143C] ring-2 ring-[#DC143C]/20'
                        : 'bg-white border-[#E2E8F0] hover:border-[#DC143C]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-amber-50 text-amber-700 rounded-lg shrink-0">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading font-bold text-xs text-[#0F172A] flex items-center gap-2">
                          <span>{new Date(point.timestamp).toLocaleString()}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-900 font-bold">
                            Local Failsafe
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-[#64748B] truncate">
                          {point.summary.deckCount} Decks • {point.summary.cardCount} Cards • {point.summary.sealedCount} Sealed
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestorePoint(point);
                      }}
                      disabled={isRestoring}
                      className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#DC143C] text-white font-mono text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Import / Export JSON Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E2E8F0]">
            {/* Export */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
              <div className="font-heading font-bold text-xs text-[#0F172A] flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#DC143C]" />
                <span>Export Offline JSON Backup</span>
              </div>
              <p className="font-mono text-[11px] text-[#64748B]">
                Download a clean offline JSON snapshot file of your entire portfolio.
              </p>
              <button
                onClick={handleExportJSON}
                className="w-full mt-2 py-2 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] font-mono text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#DC143C]" />
                <span>Download Backup (.json)</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
              <div className="font-heading font-bold text-xs text-[#0F172A] flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Restore From JSON File</span>
              </div>
              <p className="font-mono text-[11px] text-[#64748B]">
                Upload a previously exported .json portfolio backup file.
              </p>
              <label className="w-full mt-2 py-2 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] font-mono text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>{importFileName ? importFileName : 'Select Backup File'}</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>

              {importedState && (
                <button
                  onClick={handleRestoreImportedFile}
                  disabled={isRestoring}
                  className="w-full mt-2 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Restore {importedState.decks?.length || 0} Decks from File</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs font-mono text-[#64748B]">
          <span>Protected by AES Gzip Vault Sync</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
