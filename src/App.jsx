import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Cross,
  Sparkles,
  Heart,
  Share2,
  Download,
  MessageCircle,
  Star
} from "lucide-react";

import { event } from "./data/event";
import Countdown from "./components/Countdown";
import RSVP from "./components/RSVP";
import MusicPlayer from "./components/MusicPlayer";
import { Instagram } from "lucide-react";


function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function SectionHeading({ eyebrow, title, subtitle, light = false }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className={`eyebrow font-sans text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm ${light ? "text-champagne" : "text-antique"}`}>
        {eyebrow}
      </p>

      <h2 className={`section-title font-display mt-3 text-3xl sm:text-4xl lg:text-[44px] leading-tight ${light ? "text-ivory" : "text-espresso"}`}>
        {title}
      </h2>

      {subtitle && (
        <p className={`section-subtitle font-sans mt-4 text-lg sm:text-xl lg:text-[22px] leading-relaxed font-normal ${light ? "text-ivory/80" : "text-espresso/80"}`}>
          {subtitle}
        </p>
      )}

      <div className={`ornament mt-6 ${light ? "text-champagne" : "text-antique"}`}>
        <span />
        ✦
        <span />
      </div>
    </div>
  );
}

const addToCalendar = () => {
  const event = {
    title: "Perayaan Natal Gepekris Pasar Baru",
    description:
      "Perayaan Natal Gepekris Pasar Baru dengan tema Jiwa & Nafas Natal. Sampai bertemu dalam sukacita Natal.",
    location:
      "Jl. Kelinci Raya No.66 B-C, RT.4/RW.3, Ps. Baru, Kecamatan Sawah Besar, Kota Jakarta Pusat",
    start: "20261213T090000Z",
    end: "20261213T130000Z",
  };

  const calendarUrl = new URL(
    "https://calendar.google.com/calendar/render"
  );

  calendarUrl.search = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${event.start}/${event.end}`,
  }).toString();

  window.open(calendarUrl.toString(), "_blank", "noopener,noreferrer");
};

function PosterHero({ cover = false, onOpen }) {
  return (
    <section
      className={[
        "poster-hero",
        cover ? "poster-hero-cover" : "poster-hero-main"
      ].join(" ")}
      aria-label="Jiwa dan Nafas Natal - Gepekris Pasar Baru"
    >
      <div className="poster-canvas">
        <div className="poster-brand">
          <img src="/images/logo-gepekris.webp" alt="Logo Gepekris" width="50" height="50" />
        </div>

        <div className="poster-heading">
          <p className="poster-eyebrow">
            Ibadah & Perayaan Natal Gepekris Pasar Baru
          </p>

          <h1 className="poster-title">
            <span className="poster-title-first">
              Jiwa <span className="poster-title-amp">&</span> Nafas
            </span>
            <span className="poster-title-second">Natal</span>
          </h1>

          <div className="poster-divider">
            <span />
            ✦
            <span />
          </div>

          <p className="poster-theme">
            A celebration of life, grace, and the hope found in Christ.
          </p>
        </div>

        <div className="poster-scripture">
          <p className="poster-scripture-label">
            THE PROMISE OF CHRISTMAS
          </p>
          <p className="poster-scripture-reference">LUKAS 2:6–10</p>
        </div>

        <div className="poster-speaker">
          <p className="poster-speaker-label">Pembicara:</p>
          <h2 className="poster-speaker-name">GI. Freda Adjan</h2>
        </div>

        <div className="poster-event-details">
          <div className="poster-event-item">
            <CalendarDays size={17} strokeWidth={1.4} />
            <span>
              Minggu,
              <span>13 Desember 2026</span>
            </span>
          </div>

          <div className="poster-event-divider">
            <span />
            <Star size={12} strokeWidth={1.3} />
            <span />
          </div>

          <div className="poster-event-item">
            <Clock3 size={17} strokeWidth={1.4} />
            <span>16.00 WIB</span>
          </div>
        </div>

      </div>

      {cover && (
        <div className="poster-cover-action">
          <button
            type="button"
            className="gold-button cover-button"
            onClick={onOpen}
          >
            Buka Undangan
            <ArrowUpRight size={16} />
          </button>
        </div>
      )}

    </section>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const nextSectionRef = useRef(null);
  const audioRef = useRef(null);
  const scrollAnimationRef = useRef(null);
  const fadeAnimationRef = useRef(null);
  const userMusicEnabledRef = useRef(false);
  const teaserPlayingRef = useRef(false);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
    };
  }, []);

  const scrollToElementCinematic = (element) => {
    if (!element) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targetY = element.getBoundingClientRect().top + (window.scrollY || document.documentElement.scrollTop);

    if (prefersReduced) {
      window.scrollTo(0, targetY);
      return;
    }

    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }

    const startY = window.scrollY || document.documentElement.scrollTop;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
    const duration = isDesktop
      ? Math.min(1200, Math.max(900, Math.abs(distance) * 0.9))
      : Math.min(1800, Math.max(1400, Math.abs(distance) * 1.3));
    const easingFn = isDesktop ? easeOutCubic : easeInOutCubic;
    let startTime = null;
    isScrollingRef.current = true;

    const cleanupListeners = () => {
      window.removeEventListener("wheel", handleInterrupt);
      window.removeEventListener("touchstart", handleInterrupt);
    };

    const handleInterrupt = () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
      isScrollingRef.current = false;
      cleanupListeners();
    };

    window.addEventListener("wheel", handleInterrupt, { passive: true });
    window.addEventListener("touchstart", handleInterrupt, { passive: true });

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);

      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(step);
      } else {
        scrollAnimationRef.current = null;
        isScrollingRef.current = false;
        cleanupListeners();
      }
    };

    scrollAnimationRef.current = requestAnimationFrame(step);
  };

  const fadeAudio = (targetVolume, duration = 800, onComplete) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeAnimationRef.current) {
      cancelAnimationFrame(fadeAnimationRef.current);
      fadeAnimationRef.current = null;
    }

    if (targetVolume > 0 && audio.paused) {
      audio.play().catch((err) => {
        console.warn("Audio play error during fade-in:", err);
      });
    }

    const startVolume = audio.volume;
    const volumeDelta = targetVolume - startVolume;

    if (Math.abs(volumeDelta) < 0.01) {
      audio.volume = targetVolume;
      if (targetVolume === 0 && !audio.paused) {
        audio.pause();
      }
      if (onComplete) onComplete();
      return;
    }

    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = targetVolume < startVolume
        ? progress * progress
        : 1 - Math.pow(1 - progress, 2);

      const nextVolume = Math.min(1, Math.max(0, startVolume + volumeDelta * eased));
      audio.volume = nextVolume;

      if (progress < 1) {
        fadeAnimationRef.current = requestAnimationFrame(step);
      } else {
        audio.volume = targetVolume;
        fadeAnimationRef.current = null;
        if (targetVolume === 0 && !audio.paused) {
          audio.pause();
        }
        if (onComplete) onComplete();
      }
    };

    fadeAnimationRef.current = requestAnimationFrame(step);
  };

  const handleOpenInvitation = () => {
    setOpened(true);
    userMusicEnabledRef.current = true;

    const audio = audioRef.current;
    if (audio) {
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
        fadeAnimationRef.current = null;
      }
      audio.volume = 1;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch((err) => {
          console.warn("Audio playback failed:", err);
          setAudioError(true);
        });
    }

    requestAnimationFrame(() => {
      scrollToElementCinematic(nextSectionRef.current);
    });
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeAnimationRef.current) {
      cancelAnimationFrame(fadeAnimationRef.current);
      fadeAnimationRef.current = null;
    }

    if (userMusicEnabledRef.current && !audio.paused) {
      userMusicEnabledRef.current = false;
      audio.pause();
      setIsPlaying(false);
    } else {
      userMusicEnabledRef.current = true;
      audio.volume = 1;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch((err) => {
          console.warn("Audio playback failed:", err);
          setAudioError(true);
        });
    }
  };

  const handleVideoPlay = () => {
    teaserPlayingRef.current = true;
    if (userMusicEnabledRef.current) {
      fadeAudio(0, 800, () => {
        setIsPlaying(false);
      });
    }
  };

  const handleVideoPause = () => {
    teaserPlayingRef.current = false;
    if (userMusicEnabledRef.current) {
      setIsPlaying(true);
      fadeAudio(1.0, 1000);
    }
  };

  const handleVideoEnded = () => {
    teaserPlayingRef.current = false;
    if (userMusicEnabledRef.current) {
      setIsPlaying(true);
      fadeAudio(1.0, 1000);
    }
  };

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`;

  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(event.mapQuery)}&output=embed`;

  const siteUrl =
    event.siteUrl ||
    (typeof window !== "undefined"
      ? window.location.href.split("#")[0]
      : "");

  const shareText = event.shareText;

  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <main className="bg-ivory">
      <PosterHero cover onOpen={handleOpenInvitation} />

      <section
        id="verse"
        ref={nextSectionRef}
        className="section-verse relative px-6 py-24 sm:py-32 scroll-mt-0"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(#D9A641 0.7px, transparent 0.7px)",
            backgroundSize: "26px 26px"
          }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <Cross
            className="mx-auto mb-5 text-champagne"
            size={26}
            strokeWidth={1.2}
          />

          <p className="eyebrow font-display text-[24px] font-semibold uppercase tracking-[0.2em] text-champagne sm:text-[24px]">
            PESAN NATAL
          </p>

          <p className="mt-4 font-display text-[16px] font-medium uppercase tracking-[0.2em] text-champagne sm:text-[20px]">
            {event.bibleReference} {event.bibleTranslation}
          </p>

          <div className="mx-auto mt-8 max-w-4xl border border-champagne/40 bg-white/10 px-6 py-8 font-display text-lg leading-relaxed text-ivory sm:px-10 sm:py-10 sm:text-xl lg:text-2xl">
            {event.bibleText || (
              <>
                <p>
                  "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah
                  mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang
                  percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal."
                </p>

                <p className="mt-6">
                  Natal bukan hanya tentang perayaan yang datang setiap tahun. Natal
                  adalah kisah kasih Allah yang begitu besar, kasih yang dinyatakan
                  melalui kehadiran Yesus Kristus ke dunia.
                </p>

                <p className="mt-6">
                  Di tengah rutinitas dan kesibukan kita, mari berhenti sejenak untuk
                  mengingat kembali Sang Sumber Kehidupan. Sebab di dalam Kristus,
                  kita menemukan jiwa dan nafas Natal yang sesungguhnya—kasih yang
                  menghidupkan, pengharapan yang memulihkan, dan sukacita yang
                  memberi arti bagi kehidupan.
                </p>

                <p className="mt-8 font-semibold italic">
                  With love, GEPEKRIS Pasar Baru
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section
        id="countdown"
        className="section-countdown px-6 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="font-display text-[16px] font-semibold uppercase tracking-[0.3em] text-antique sm:text-[20px]">
              Tandai Tanggal
            </p>

            <h2 className="mt-4 font-display text-[42px] font-semibold tracking-wide text-white sm:text-[58px] lg:text-[72px]">
              Jiwa & Nafas Natal
            </h2>

            <p className="font-display mx-auto mt-5 max-w-2xl text-[20px] font-medium leading-relaxed tracking-wide text-champagne/90 sm:text-[24px] lg:text-[28px]">
              13 Desember 2026 · 16.00 WIB
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <Countdown target={event.dateISO} />
          </div>
        </div>
      </section>

      <section
        id="event"
        className="section-event px-6 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-display text-[16px] font-semibold uppercase tracking-[0.3em] text-antique sm:text-[20px]">
              Waktu & Tempat
            </p>

            <h2 className="mt-4 font-display text-[42px] font-semibold tracking-wide text-white sm:text-[58px] lg:text-[72px]">
              Informasi Perayaan
            </h2>

            <p className="mx-auto mt-5 max-w-2xl font-display text-[18px] font-medium leading-relaxed tracking-wide text-champagne/90 sm:text-[22px] lg:text-[26px]">
              Catat waktu dan lokasi ibadah serta perayaan Natal.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="event-card">
              <CalendarDays
                className="mx-auto text-champagne"
                size={25}
              />

              <p className="event-card-label">
                Tanggal
              </p>

              <p className="event-card-value">
                {event.dateLabel}
              </p>
            </div>

            <div className="event-card">
              <Clock3
                className="mx-auto text-champagne"
                size={25}
              />

              <p className="event-card-label">
                Waktu
              </p>

              <p className="event-card-value">
                {event.timeLabel}
              </p>
            </div>

            <div className="event-card">
              <MapPin
                className="mx-auto text-champagne"
                size={25}
              />

              <p className="event-card-label">
                Tempat
              </p>

              <p className="event-card-value">
                Gepekris Pasar Baru
              </p>
            </div>
          </div>

          <p className="font-sans mx-auto mt-8 max-w-2xl text-center text-[15px] leading-relaxed text-ivory/75 sm:text-base">
            {event.address}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={addToCalendar}
              className="gold-button"
            >
              Tambah Kalender
              <CalendarDays size={16} />
            </button>

            <button
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="outline-button"
            >
              <MapPin size={16} />
              Google Maps
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="mx-auto mt-10 max-w-4xl overflow-hidden border border-white/10">
            <iframe
              title="Google Maps - Gepekris Pasar Baru"
              src={mapEmbed}
              className="h-[320px] w-full border-0 sm:h-[400px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section id="speaker" className="section-speaker px-6 py-24 sm:py-28">
        <div className="speaker-section-container">
          <div className="text-center">
            <p className="eyebrow mb-4 font-display text-[24px] font-semibold uppercase tracking-[0.2em] text-champagne sm:text-[24px]">
              PEMBICARA NATAL
            </p>

          </div>

          <div className="speaker-card">
            <div className="speaker-photo-wrap">
              <img
                src={event.speakerPhoto}
                alt={`Foto ${event.speaker}`}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="speaker-photo-placeholder">
                <img src="/images/speaker-photo.webp" alt="Foto Pembicara" width="60" height="60" />

              </div>
            </div>

            <div className="speaker-copy">
              <h3 className="mt-3 whitespace-nowrap font-display text-[clamp(25px,8vw,42px)] font-medium italic tracking-[0.02em] text-espresso sm:text-[52px] sm:tracking-wide lg:text-[60px]">
                {event.speaker}
              </h3>

              <p className="mt-4 font-display text-[20px] font-medium italic leading-relaxed tracking-wide text-espresso/70 sm:text-[24px]">
                Ibadah & Perayaan Natal 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="teaser-contact"
        className="section-teaser px-6 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-display text-[16px] font-semibold uppercase tracking-[0.25em] text-antique sm:text-[20px]">
              Suasana Natal
            </p>

            <h2 className="mt-4 font-display text-[40px] font-semibold tracking-wide text-white sm:text-[54px] lg:text-[64px]">
              Teaser Natal & Kontak
            </h2>

            <p className="mx-auto mt-5 max-w-2xl font-display text-[18px] font-medium leading-relaxed tracking-wide text-champagne/90 sm:text-[22px] lg:text-[24px]">
              Saksikan teaser dan hubungi kami untuk informasi lebih lanjut.
            </p>
          </div>
          <SectionHeading>
            light
          </SectionHeading>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div className="teaser-frame">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/images/hero-landscape.webp"
                className="w-full h-auto"
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
              >
                <source
                  src="https://qhhvpvihzmvmpmkxxlyw.supabase.co/storage/v1/object/public/invitation/videos/teaser%20natal.mp4"
                  type="video/mp4"
                />
                Browser Anda tidak mendukung pemutaran video.
              </video>
            </div>

            <div>
              <p className="eyebrow font-sans text-xs font-semibold uppercase tracking-[0.2em] text-champagne sm:text-sm">
                Kontak
              </p>

              <h3 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">
                Kami siap membantu Anda.
              </h3>

              <div className="mt-6 space-y-4">
                {event.contacts.map((contact) => (
                  <div
                    key={contact.whatsapp}
                    className="contact-card"
                  >
                    <div>
                      <p className="font-display text-xl text-ivory">
                        {contact.name}
                      </p>

                      <p className="mt-1 text-xs text-ivory/55">
                        {contact.phone}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${contact.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`WhatsApp ${contact.name}`}
                      className="contact-link"
                    >
                      <MessageCircle size={18} />
                    </a>
                  </div>

                ))}
              </div>
              <h3 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">
                For More Information
              </h3>
              <div className="mt-6">
                <div className="contact-card">
                  <div>
                    <p className="font-display text-xl text-ivory">
                      Stay Connected With Us
                    </p>

                    <p className="mt-1 text-xs text-ivory/55">
                      @gepekrispb
                    </p>
                  </div>

                  <a
                    href="https://www.instagram.com/gepekrispb/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram GEPEKRIS Pasar Baru"
                    className="contact-link"
                  >
                    <Instagram size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <footer className="closing-section section-footer px-6 pb-14 pt-20 text-center">
        <div className="ornament text-champagne">
          <span />
          ✦
          <span />
        </div>

        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto mb-7 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-champagne/40" />
            <span className="font-display text-[13px] italic tracking-[0.2em] text-champagne/70">
              With Love & Blessings
            </span>
            <span className="h-px w-12 bg-champagne/40" />
          </div>

          <h2 className="font-display text-[42px] font-medium tracking-wide text-ivory sm:text-[54px] lg:text-[64px]">
            Jiwa <span className="italic text-champagne">&</span> Nafas Natal
          </h2>

          <p className="mt-4 font-display text-[13px] font-medium uppercase tracking-[0.18em] text-ivory/50 sm:text-[15px] sm:tracking-[0.25em]">
            <span className="block sm:inline">
              GEPEKRIS Pasar Baru
            </span>

            <span className="hidden sm:inline mx-3 text-champagne/60">
              ·
            </span>

            <span className="block mt-1 sm:inline sm:mt-0">
              13 December 2026
            </span>
          </p>

          <div className="mx-auto my-8 h-px w-16 bg-champagne/40" />

          <p className="mx-auto max-w-xl font-display text-[21px] italic leading-relaxed text-champagne/85 sm:text-[25px] lg:text-[27px]">
            Kiranya damai dan kasih Kristus memenuhi hati dan kehidupan kita.
          </p>

          <p className="mt-5 font-display text-[15px] tracking-wide text-ivory/55 sm:text-[17px]">
            Sampai berjumpa dalam sukacita Natal.
          </p>

          <div className="mt-10">
            <button
              type="button"
              onClick={() => window.open(shareUrl, "_blank", "noopener,noreferrer")}
              className="gold-button inline-flex items-center gap-3"
            >
              <Share2 size={17} />
              <span className="font-display text-[16px] tracking-wide sm:text-[18px]">
                Bagikan Undangan
              </span>
            </button>

            <p className="mt-4 font-display text-[14px] italic text-ivory/50">
              Sebarkan sukacita Natal kepada keluarga dan sahabat.
            </p>
          </div>

          <div className="mt-16 border-t border-champagne/15 pt-7">
            <p className="font-display text-[15px] tracking-[0.15em] text-ivory/50">
              GEPEKRIS PASAR BARU
            </p>

            <p className="mt-2 font-display text-[12px] italic tracking-wide text-ivory/50">
              © 2026 · All Rights Reserved
            </p>
          </div>

        </div>
      </footer>

      <audio
        ref={audioRef}
        src="https://qhhvpvihzmvmpmkxxlyw.supabase.co/storage/v1/object/public/invitation/musics/backsound-music.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <MusicPlayer
        isPlaying={isPlaying}
        onToggle={toggleMusic}
        visible={opened}
        error={audioError}
      />
    </main>
  );
}
