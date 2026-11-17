import Link from "next/link";
import { Glass } from "@/components/ui";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-[55vh] items-center justify-center">
      <Glass className="card-pad max-w-md text-center">
        <div className="mx-auto w-fit"><LogoMark size={52} /></div>
        <h1 className="brand-serif mt-4" style={{ fontSize: "1.8rem" }}>This page does not exist</h1>
        <p className="small muted mt-2">
          The link may be old, or the section may have moved. Nothing you saved has been affected.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link href="/" className="gold-button">Dashboard</Link>
          <Link href="/explore" className="ghost-button">Explore modules</Link>
          <Link href="/emergency" className="ghost-button" style={{ borderColor: "rgba(229,72,77,0.45)", color: "var(--danger)" }}>Emergency</Link>
        </div>
      </Glass>
    </div>
  );
}
