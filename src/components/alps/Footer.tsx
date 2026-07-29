import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MessageCircle, Music2, Twitter, Youtube } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { SOCIALS, FEATURES } from "@/lib/alps-data";
import { AWARDS } from "@/lib/awards";
import { INNOVATIONS } from "@/lib/innovations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { openSizeInfo, type SizeKind } from "@/lib/size-info-store";
import { openInnovation } from "@/lib/innovation-store";

const SIZE_GROUPS: SizeKind[] = ["kids", "men", "women", "unisex"];

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-foreground/40 bg-background text-foreground">
      <div
        className="
          mx-auto
          grid
          max-w-[1760px]
          grid-cols-1
          items-stretch
          px-6
          pb-10
          text-[11px]
          leading-[1.4]

          sm:grid-cols-2
          sm:px-8

          md:grid-cols-3

          lg:grid-cols-none
          lg:px-12
          lg:[grid-template-columns:minmax(0,0.72fr)_minmax(0,0.72fr)_minmax(0,1.15fr)_minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.72fr)]

          [&>*]:border-t-2
          [&>*]:border-foreground/40
          [&>*:first-child]:border-t-0

          sm:[&>*]:border-l-2
          sm:[&>*:nth-child(2n+1)]:border-l-0
          sm:[&>*:nth-child(-n+2)]:border-t-0

          md:[&>*]:border-l-2
          md:[&>*:nth-child(2n+1)]:border-l-2
          md:[&>*:nth-child(3n+1)]:border-l-0
          md:[&>*:nth-child(-n+3)]:border-t-0
          md:[&>*:nth-child(n+4)]:border-t-2

          lg:[&>*]:border-l-0
          lg:[&>*+*]:border-l-2
          lg:[&>*]:border-t-0
        "
      >
        <Col title="asia miles">
          <a
            href={SOCIALS.asiaMiles}
            target="_blank"
            rel="noreferrer"
            className="text-foreground/80 transition-colors hover:text-primary"
          >
            light fresh® technology CABAS 220 shoulder bag
          </a>
        </Col>

        <Col title="size info">
          {SIZE_GROUPS.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => openSizeInfo(size)}
              className="text-left text-foreground/80 transition-colors hover:text-primary"
            >
              {size}
            </button>
          ))}
        </Col>

        <Col title="features">
          <div className="flex flex-col gap-1">
            {FEATURES.map((feature) => {
              const innovation = INNOVATIONS.find((item) => item.filterKey === feature.key);

              return (
                <button
                  key={feature.key}
                  type="button"
                  onClick={() => openInnovation(innovation?.slug ?? feature.key)}
                  className="text-left text-foreground/80 transition-colors hover:text-primary"
                >
                  {feature.name}
                </button>
              );
            })}
          </div>
        </Col>

        <Col title="awards & accolades">
          <div className="flex flex-col gap-2">
            {AWARDS.map((award) => (
              <Link
                key={award.id}
                to="/press"
                hash={award.id}
                className="block text-foreground/80 transition-colors hover:text-primary"
              >
                <span className="block text-[11px] font-medium text-foreground">{award.organization}</span>

                <span className="block text-[10px] text-foreground/70">
                  {award.category} {award.year} — {award.level}
                </span>
              </Link>
            ))}
          </div>
        </Col>

        <Col title="find us">
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[12px] font-semibold tracking-wider text-foreground">ALPS</p>

              <div className="flex flex-wrap items-center gap-1 lg:flex-nowrap">
                <SocialIcon href={SOCIALS.facebook} label="ALPS Facebook page">
                  <Facebook fill="currentColor" strokeWidth={0} />
                </SocialIcon>

                <SocialIcon href={SOCIALS.instagram} label="ALPS Instagram">
                  <Instagram />
                </SocialIcon>

                <SocialIcon href={SOCIALS.x} label="ALPS X">
                  <Twitter fill="currentColor" strokeWidth={0} />
                </SocialIcon>

                <SocialIcon href={SOCIALS.youtube} label="ALPS YouTube">
                  <Youtube fill="currentColor" strokeWidth={0} />
                </SocialIcon>

                <SocialIcon href={SOCIALS.tiktok} label="ALPS TikTok">
                  <Music2 />
                </SocialIcon>

                <SocialIcon href={SOCIALS.threads} label="ALPS Threads">
                  <MessageCircle />
                </SocialIcon>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-1">
                <SocialIcon href={SOCIALS.facebookPersonal} label="Annie Ling Facebook">
                  <Facebook fill="currentColor" strokeWidth={0} />
                </SocialIcon>

                <SocialIcon href={SOCIALS.instagram2} label="ALPS alternate Instagram">
                  <Instagram />
                </SocialIcon>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-semibold text-foreground">vegan skincare</p>

              <div className="flex flex-wrap items-center gap-1">
                <SocialIcon href={SOCIALS.skincareFacebook} label="Vegan skincare Facebook">
                  <Facebook fill="currentColor" strokeWidth={0} />
                </SocialIcon>

                <SocialIcon href={SOCIALS.skincareInstagram} label="Vegan skincare Instagram English">
                  <Instagram />
                </SocialIcon>

                <SocialIcon
                  href={SOCIALS.skincareInstagramBilingual}
                  label="Vegan skincare Instagram English and Chinese"
                >
                  <Instagram />
                </SocialIcon>
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium text-foreground">support</p>

              <div className="flex flex-col gap-1.5">
                <Link to="/shipping" className="text-foreground/80 transition-colors hover:text-primary">
                  shipping
                </Link>

                <Link to="/returns" className="text-foreground/80 transition-colors hover:text-primary">
                  returns & exchanges
                </Link>

                <Link to="/terms" className="text-foreground/80 transition-colors hover:text-primary">
                  terms of service
                </Link>

                <Link to="/privacy" className="text-foreground/80 transition-colors hover:text-primary">
                  privacy
                </Link>
              </div>
            </div>
          </div>
        </Col>

        <Col title="pre-order">
          <Link to="/account" className="text-foreground/80 transition-colors hover:text-primary">
            catch up new item
          </Link>

          <div className="mt-8">
            <p className="mb-2 font-medium text-foreground">contact us</p>

            <a
              href={`mailto:${SOCIALS.email}`}
              className="block break-words text-foreground/80 transition-colors hover:text-primary"
            >
              {SOCIALS.email}
            </a>
          </div>
        </Col>
      </div>

      <NewsletterBar />
    </footer>
  );
}

function NewsletterBar() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = email.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!value || !validEmail) {
      toast.error("please enter a valid email");
      return;
    }

    setBusy(true);

    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: value,
    });

    setBusy(false);

    if (error && !error.message.toLowerCase().includes("duplicate")) {
      toast.error(error.message);
      return;
    }

    toast.success("subscribed — welcome to the ALPS list");

    setEmail("");
  };

  return (
    <div className="bg-primary text-primary-foreground">
      <div
        className="
          mx-auto
          flex
          max-w-[1760px]
          flex-col
          items-start
          justify-between
          gap-4
          px-6
          py-4
          text-[11px]

          md:flex-row
          md:items-center

          lg:px-10
        "
      >
        <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <span className="whitespace-nowrap uppercase tracking-[0.2em]">stay connected</span>

          <form className="flex w-full items-center sm:w-auto" onSubmit={submit}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="hello@youremail.com"
              aria-label="Email address"
              className="
                min-w-0
                flex-1
                bg-white/15
                px-3
                py-1.5
                text-[11px]
                text-white
                placeholder:text-white/70
                focus:outline-none

                sm:w-64
                sm:flex-none
              "
            />

            <button
              type="submit"
              disabled={busy}
              className="
                whitespace-nowrap
                border-l
                border-white/20
                bg-white/20
                px-4
                py-1.5
                text-[11px]
                tracking-wide
                text-white
                transition-colors
                hover:bg-white/30
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {busy ? "…" : "subscribe"}
            </button>
          </form>
        </div>

        <span className="whitespace-nowrap">© {new Date().getFullYear()} ALPS Annie Ling</span>
      </div>
    </div>
  );
}

interface ColProps {
  title: string;
  children: ReactNode;
  className?: string;
}

function Col({ title, children, className = "" }: ColProps) {
  return (
    <section
      className={`
        h-full
        min-w-0
        px-4
        py-4

        md:py-4
        lg:py-4

        ${className}
      `}
    >
      <h4 className="mb-3 text-[13px] font-semibold tracking-wide text-foreground">{title}</h4>

      <div className="flex min-w-0 flex-col gap-1">{children}</div>
    </section>
  );
}

interface SocialIconProps {
  href: string;
  label: string;
  children: ReactNode;
}

function SocialIcon({ href, label, children }: SocialIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="
        inline-flex
        h-6
        w-6
        shrink-0
        items-center
        justify-center
        bg-foreground
        text-background
        transition-colors
        hover:bg-primary

        [&>svg]:h-3
        [&>svg]:w-3
        [&>svg]:shrink-0
      "
    >
      {children}
    </a>
  );
}
