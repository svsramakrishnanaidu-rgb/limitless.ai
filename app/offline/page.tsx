"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CloudOff, Download, HardDrive, RefreshCw, Trash2, Wifi } from "lucide-react";
import { Glass, PageHeader, EmptyState, Callout, Skeleton } from "@/components/ui";
import { useStored, prettyDate } from "@/lib/store";
import type { DownloadItem } from "@/lib/types";
import { useToast } from "@/components/providers";

const TYPE_HREF: Record<DownloadItem["type"], string> = {
  article: "/library",
  practice: "/yoga",
  recipe: "/nutrition",
  "first-aid": "/emergency",
};

export default function OfflinePage() {
  const [downloads, setDownloads] = useStored<DownloadItem[]>("downloads", []);
  const [online, setOnline] = useState(true);
  const [estimate, setEstimate] = useState<{ usage: number; quota: number } | null>(null);
  const [swReady, setSwReady] = useState<boolean | null>(null);
  const toast = useToast();

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    if (navigator.storage?.estimate) {
      navigator.storage.estimate().then((e) => setEstimate({ usage: e.usage ?? 0, quota: e.quota ?? 0 }));
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => setSwReady(Boolean(reg)));
    } else {
      setSwReady(false);
    }
  }, []);

  const remove = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
    toast.push("Removed from your offline list.", "success");
  };

  const sync = () => {
    toast.push(online ? "Content is available and up to date for this session." : "Still offline. Cached pages will load when the connection returns.", online ? "success" : "error");
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${Math.round(bytes / 1024)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <div>
      <PageHeader
        eyebrow="Offline healthcare library"
        title="Reading that survives a bad connection"
        description="Save articles and guides for low-connectivity use. Downloaded content is cached by your browser and stored on this device."
        actions={
          <button type="button" className="ghost-button" onClick={sync}>
            <RefreshCw size={15} aria-hidden /> Check status
          </button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Glass className="card-pad flex items-center gap-3">
          <span className="nav-medallion" aria-hidden>{online ? <Wifi size={15} /> : <CloudOff size={15} />}</span>
          <div>
            <p className="tiny muted">Connection</p>
            <p className="small font-medium">{online ? "Online" : "Offline"}</p>
          </div>
        </Glass>
        <Glass className="card-pad flex items-center gap-3">
          <span className="nav-medallion" aria-hidden><HardDrive size={15} /></span>
          <div>
            <p className="tiny muted">Storage used by this site</p>
            <p className="small font-medium">{estimate ? formatBytes(estimate.usage) : "Checking…"}</p>
          </div>
        </Glass>
        <Glass className="card-pad flex items-center gap-3">
          <span className="nav-medallion" aria-hidden><Download size={15} /></span>
          <div>
            <p className="tiny muted">Saved items</p>
            <p className="small font-medium">{downloads.length}</p>
          </div>
        </Glass>
      </div>

      {swReady === false && (
        <div className="mb-4">
          <Callout tone="warning" title="Offline caching is not active">
            This browser did not register the service worker, so pages will not load without a connection. Downloading still stores your reading list,
            and content works when the app is open online.
          </Callout>
        </div>
      )}

      <Glass className="card-pad mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="section-title">How downloads work</h2>
            <p className="tiny muted mt-1">
              Articles are bundled with the app, so marking one for offline keeps it available after the page has been cached. The app shell is cached
              on first visit.
            </p>
          </div>
          <Link href="/library" className="gold-button">Browse to download</Link>
        </div>
      </Glass>

      {downloads.length === 0 ? (
        <Glass className="card-pad">
          <EmptyState
            icon={<Download size={18} aria-hidden />}
            title="No offline content yet"
            description="Open any library article and choose “Download for offline”."
            action={
              <div className="flex gap-2">
                <Link href="/library" className="ghost-button">Library</Link>
                <Link href="/yoga" className="ghost-button">Yoga</Link>
              </div>
            }
          />
        </Glass>
      ) : (
        <ul className="flex flex-col gap-2">
          {downloads.map((item) => (
            <li key={item.id}>
              <Glass className="card-pad flex flex-wrap items-center gap-3">
                <span className="badge capitalize">{item.type.replace("-", " ")}</span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={item.type === "article" ? `/library/${item.slug}` : TYPE_HREF[item.type]}
                    className="small font-medium hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="tiny muted">Added {prettyDate(item.savedAt.slice(0, 10))}</p>
                </div>
                <button
                  type="button"
                  className="icon-button"
                  style={{ width: 36, height: 36 }}
                  aria-label={`Remove ${item.title} from offline library`}
                  onClick={() => remove(item.id)}
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              </Glass>
            </li>
          ))}
        </ul>
      )}

      {estimate && (
        <div className="mt-4">
          <p className="tiny muted">
            Browser quota: {formatBytes(estimate.quota)}. Cached content can be cleared by your browser at any time; re-download after clearing site data.
          </p>
        </div>
      )}

      <div className="mt-4">
        <Callout tone="info" title="What works offline">
          Downloaded library entries, first-aid guidance you have opened, your tracker history and reminders all work without a connection. LIMITLESS AI,
          plant scanning and hospital search need internet. Cloud sync and offline AI models are not part of this release.
        </Callout>
      </div>
    </div>
  );
}
