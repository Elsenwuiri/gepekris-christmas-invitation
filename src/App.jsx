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
  MessageCircle
} from "lucide-react";

import { event } from "./data/event";
import Countdown from "./components/Countdown";
import RSVP from "./components/RSVP";
import MusicPlayer from "./components/MusicPlayer";


function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
          <img src="/images/logo-gepekris.webp" alt="Logo Gepekris" width="60" height="60" />
        </div>

        <div className="poster-heading">
          <p className="poster-eyebrow">
            Ibadah & Perayaan Natal
            <span>Gepekris Pasar Baru</span>
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

      <div className="poster-footer">
        GEPEKRIS PASAR BARU
        <span>•</span>
        CHRISTMAS CELEBRATION 2026
      </div>
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

    const duration = Math.min(2000, Math.max(1400, Math.abs(distance) * 1.5));
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
      const easedProgress = easeInOutCubic(progress);

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

    scrollToElementCinematic(nextSectionRef.current);
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

  const shareText = `Shalom! Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/Saudari untuk menghadiri Ibadah & Perayaan Natal Gepekris Pasar Baru dengan tema “${event.theme}”.

Minggu, 13 Desember 2026
Pukul 16.00–20.00 WIB
Pembicara: ${event.speaker}
Lokasi: ${event.address}

Informasi lebih lanjut: ${siteUrl}`;

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <main className="bg-ivory">
      <PosterHero cover onOpen={handleOpenInvitation} />

      <section
        id="verse"
        ref={nextSectionRef}
        className="relative bg-midnight px-6 py-24 sm:py-32 scroll-mt-0"
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

          <p className="eyebrow font-sans text-xs font-semibold uppercase tracking-[0.2em] text-champagne sm:text-sm">
            Firman Tuhan
          </p>

          {/* <h2 className="section-title mt-4 text-ivory">
                Kabar Sukacita
              </h2> */}

          <p className="mt-4 font-sans text-xs font-medium uppercase tracking-[.2em] text-champagne sm:text-sm">
            {event.bibleReference} {event.bibleTranslation}
          </p>

          <div className="mx-auto mt-8 max-w-4xl border border-champagne/25 bg-white/5 px-6 py-8 font-display text-lg leading-relaxed text-ivory sm:px-10 sm:py-10 sm:text-xl lg:text-2xl">
            {event.bibleText ||
              "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal."}
          </div>
        </div>
      </section>

      <section
        id="season"
        className="relative bg-ivory px-6 py-24 sm:py-32"
      >
        <div className="pointer-events-none absolute left-0 top-20 h-64 w-64 rounded-full bg-champagne/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-antique sm:text-sm">
            Musim Kasih
          </p>

          <h2 className="mt-4 font-display text-4xl font-medium tracking-wide text-espresso sm:text-5xl lg:text-6xl">
            Jiwa Natal
          </h2>

          <p className="section-subtitle font-sans mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-espresso/85 sm:text-xl lg:text-[22px]">
            Natal bukan sekadar perayaan tahunan. Natal adalah kisah kasih Allah yang dinyatakan melalui kehadiran Yesus Kristus ke dunia.
          </p>

          <p className="font-sans mx-auto mt-5 max-w-3xl text-[15px] leading-relaxed text-espresso/75 sm:text-base lg:text-[17px]">
            Di tengah rutinitas dan kesibukan, mari berhenti sejenak untuk mengingat kembali Sang Sumber Kehidupan. Dalam Kristus, kita menemukan jiwa dan nafas Natal yang sesungguhnya—kasih yang menghidupkan, pengharapan yang memulihkan, dan sukacita yang memberi arti bagi kehidupan.
          </p>

          <div className="ornament mt-8 text-antique">
            <span />
            ✦
            <span />
          </div>
        </div>
      </section>

      <section
        id="countdown"
        className="bg-espresso px-6 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-antique sm:text-sm">
              Tandai Tanggal
            </p>

            <h2 className="mt-4 font-display text-4xl font-medium tracking-wide text-white sm:text-5xl lg:text-6xl">
              Jiwa & Nafas Natal
            </h2>

            <p className="section-subtitle font-sans mx-auto mt-5 max-w-2xl text-lg font-medium leading-relaxed text-champagne/90 sm:text-xl lg:text-[22px]">
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
        className="bg-midnight px-6 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Waktu & Tempat"
            title="Informasi Perayaan"
            subtitle="Catat waktu dan lokasi ibadah serta perayaan Natal."
            light
          />

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

            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="outline-button"
            >
              <MapPin size={16} />
              Google Maps
              <ArrowUpRight size={16} />
            </a>
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

      <section
        id="speaker"
        className="bg-cream px-6 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-antique sm:text-sm">
              Pembicara Tamu
            </p>

            <p className="section-subtitle font-sans mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-espresso/85 sm:text-xl lg:text-[22px]">
              Firman Tuhan dalam perayaan Natal Gepekris Pasar Baru.
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
              <p className="eyebrow font-sans text-xs font-semibold uppercase tracking-[0.2em] text-antique sm:text-sm">
                Pembicara Tamu
              </p>

              <h3 className="mt-3 font-display text-4xl text-espresso sm:text-5xl">
                {event.speaker}
              </h3>

              <p className="font-sans mt-4 text-base font-medium leading-relaxed text-espresso/70 sm:text-lg">
                Ibadah & Perayaan Natal 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="teaser-contact"
        className="bg-espresso px-6 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Suasana Natal"
            title="Teaser Natal & Kontak"
            subtitle="Saksikan teaser dan hubungi kami untuk informasi lebih lanjut."
            light
          />

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
            </div>
          </div>
        </div>
      </section>


      <footer className="closing-section bg-midnight px-6 pb-14 pt-20 text-center">
        <div className="ornament text-champagne">
          <span />
          ✦
          <span />
        </div>

        <p className="mt-7 font-display text-4xl text-ivory">
          Jiwa <span className="italic text-champagne">&</span> Nafas Natal
        </p>

        <p className="mt-3 text-[10px] uppercase tracking-[.25em] text-ivory/45">
          Gepekris Pasar Baru · 13 December 2026
        </p>

        <p className="font-sans mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-ivory/70 sm:text-base lg:text-lg">
          Kiranya damai dan kasih Kristus memenuhi hati dan kehidupan kita.
        </p>

        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="gold-button mt-9"
        >
          <Share2 size={16} />
          Bagikan Undangan Melalui WhatsApp
        </a>

        <p className="mt-4 text-[10px] text-ivory/35">
          Bagikan undangan ini kepada keluarga dan sahabat.
        </p>

        <div className="mt-14 border-t border-white/10 pt-6 text-[10px] tracking-wide text-ivory/30">
          © 2026 Gepekris Pasar Baru
        </div>
      </footer>

      <audio
        ref={audioRef}
        src="https://qhhvpvihzmvmpmkxxlyw.supabase.co/storage/v1/object/public/invitation/musics/backsound.mp3"
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
