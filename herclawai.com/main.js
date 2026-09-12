(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const canAnimate = typeof Element !== "undefined" && typeof Element.prototype.animate === "function";
  const rand = (min, max) => min + Math.random() * (max - min);

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  const intro = $("#intro");
  if (intro) {
    let seen = false;
    try { seen = sessionStorage.getItem("herclaw-introed") === "1"; } catch (_) {}
    if (reduceMotion || seen) {
      intro.remove();
    } else {
      try { sessionStorage.setItem("herclaw-introed", "1"); } catch (_) {}
      document.body.style.overflow = "hidden";
      const fill = $("#introFill");
      const pct = $("#introPct");
      const start = performance.now();
      const duration = 1300;
      let raf = 0;
      let closed = false;
      const draw = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const v = Math.round((1 - Math.pow(1 - t, 2)) * 100);
        if (fill) fill.style.width = `${v}%`;
        if (pct) pct.textContent = `${v}%`;
        if (t < 1) raf = requestAnimationFrame(draw);
      };
      const finish = () => {
        if (closed) return;
        closed = true;
        cancelAnimationFrame(raf);
        if (fill) fill.style.width = "100%";
        if (pct) pct.textContent = "100%";
        intro.classList.add("is-done");
        document.body.style.overflow = "";
        setTimeout(() => intro.remove(), 840);
        ["pointerdown", "keydown", "wheel", "touchstart"].forEach((eventName) =>
          window.removeEventListener(eventName, skip));
      };
      const skip = () => { clearTimeout(timer); finish(); };
      raf = requestAnimationFrame(draw);
      const timer = setTimeout(finish, 1760);
      ["pointerdown", "keydown", "wheel", "touchstart"].forEach((eventName) =>
        window.addEventListener(eventName, skip, { passive: true }));
    }
  }

  const ambient = $("#ambient");
  if (ambient && !reduceMotion) {
    ambient.innerHTML = Array.from({ length: 16 }, () => {
      const size = rand(10, 48);
      const dur = rand(14, 30);
      return `<span style="left:${rand(0, 100).toFixed(1)}%;width:${size | 0}px;height:${size | 0}px;animation-duration:${dur.toFixed(1)}s;animation-delay:${(-Math.random() * dur).toFixed(1)}s"></span>`;
    }).join("");
  }

  const bladeSVG = (h, w, fill, stroke, waves, phase) => {
    const steps = 14;
    const left = [];
    const right = [];
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = +(h - t * h).toFixed(1);
      const halfW = (w * .5) * (1 - t * .9) + .6;
      const cx = w * .5 + Math.sin(phase + t * waves * Math.PI) * (w * .7) * t;
      const lx = cx - halfW;
      const rx = cx + halfW;
      minX = Math.min(minX, lx);
      maxX = Math.max(maxX, rx);
      left.push([lx, y]);
      right.push([rx, y]);
    }
    const points = left.concat(right.reverse());
    const d = `M${points.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L")}Z`;
    const pad = 2;
    const vbX = (minX - pad).toFixed(1);
    const vbW = (maxX - minX + pad * 2).toFixed(1);
    const st = stroke ? `stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round"` : "";
    return `<svg width="${vbW}" height="${h | 0}" viewBox="${vbX} 0 ${vbW} ${h | 0}"><path d="${d}" fill="${fill}" ${st}/></svg>`;
  };
  const edgeLeft = (edge) => {
    const r = Math.random() * edge;
    return Math.random() < .5 ? r : 100 - r;
  };
  const weedField = (n, options) => Array.from({ length: n }, () => {
    const left = options.edge ? edgeLeft(options.edge) : Math.random() * 100;
    const h = rand(options.hMin, options.hMax);
    const w = h * rand(.12, .19);
    const fill = options.palette[(Math.random() * options.palette.length) | 0];
    const stroke = options.outline && Math.random() < options.outline ? "var(--ink)" : "";
    const svg = bladeSVG(h, w, fill, stroke, rand(.7, 1.5), Math.random() * Math.PI * 2);
    const dur = rand(4.5, 8.3).toFixed(2);
    const op = rand(options.opMin, options.opMax).toFixed(2);
    return `<span class="weed" data-weed style="left:${left.toFixed(1)}%;opacity:${op};z-index:${h | 0}"><i style="--sd:${dur}s;--sdl:${(-Math.random() * dur).toFixed(2)}s;--amp:${rand(2.4, 6).toFixed(1)}deg">${svg}</i></span>`;
  }).join("");
  const pebbleRow = (n, options) => {
    const colors = ["#cbb68a", "#a7a290", "#86a05a", "#5e6b49"];
    return Array.from({ length: n }, () => {
      const left = options.edge ? edgeLeft(options.edge) : Math.random() * 100;
      const w = rand(options.wMin, options.wMax);
      const h = w * rand(.5, .72);
      return `<span class="pebble" style="left:${left.toFixed(1)}%;width:${w | 0}px;height:${h | 0}px;background:${colors[(Math.random() * colors.length) | 0]};opacity:${rand(options.opMin, options.opMax).toFixed(2)};transform:rotate(${rand(-8, 8).toFixed(1)}deg);z-index:${(w | 0) + 200}"></span>`;
    }).join("");
  };
  const greens = ["#c8ff2d", "#3ddc97", "#1f9e6e"];
  const agentFlora = $("#agentFlora");
  if (agentFlora) {
    const small = window.innerWidth < 640;
    agentFlora.innerHTML =
      weedField(small ? 7 : 12, { hMin: 60, hMax: 150, palette: ["#3ddc97", "#1f9e6e"], outline: 0, opMin: .16, opMax: .3 }) +
      weedField(small ? 5 : 9, { hMin: 70, hMax: 175, palette: greens, outline: .7, opMin: .7, opMax: .95, edge: 30 }) +
      pebbleRow(small ? 9 : 16, { wMin: 16, wMax: 46, opMin: .55, opMax: .9 });
  }
  const seabed = $("#seabed");
  if (seabed && window.innerWidth >= 720) {
    seabed.innerHTML =
      weedField(10, { hMin: 46, hMax: 104, palette: greens, outline: .5, opMin: .14, opMax: .26, edge: 17 }) +
      pebbleRow(10, { wMin: 14, wMax: 40, opMin: .12, opMax: .24, edge: 17 });
  }
  const agentBubbles = $("#agentBubbles");
  if (agentBubbles && !reduceMotion) {
    agentBubbles.innerHTML = Array.from({ length: 13 }, () => {
      const size = rand(8, 34);
      const dur = rand(7, 15);
      return `<span style="left:${rand(0, 100).toFixed(1)}%;width:${size | 0}px;height:${size | 0}px;--rise:${rand(460, 760) | 0}px;animation-duration:${dur.toFixed(1)}s;animation-delay:${(-Math.random() * dur).toFixed(1)}s"></span>`;
    }).join("");
  }

  const pointer = { x: -1, y: -1 };
  const agentPanel = $(".agents");
  const floraWeeds = agentFlora ? $$("[data-weed]", agentFlora) : [];
  if (floraWeeds.length && agentPanel) {
    let weedMeta = [];
    const measure = () => {
      weedMeta = floraWeeds.map((el) => ({ el, cx: el.offsetLeft + el.offsetWidth / 2 }));
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    let raf = 0;
    let lastBand = false;
    const updateBend = () => {
      raf = 0;
      const r = agentPanel.getBoundingClientRect();
      const band = pointer.x >= 0 && pointer.y > r.bottom - 180 && pointer.y < r.bottom + 55 && pointer.x > r.left - 80 && pointer.x < r.right + 80;
      if (!band) {
        if (lastBand) weedMeta.forEach((m) => m.el.style.setProperty("--push", "0deg"));
        lastBand = false;
        return;
      }
      lastBand = true;
      for (const m of weedMeta) {
        const d = pointer.x - (r.left + m.cx);
        const push = Math.abs(d) < 86 ? -Math.sign(d) * (1 - Math.abs(d) / 86) * 17 : 0;
        m.el.style.setProperty("--push", `${push.toFixed(1)}deg`);
      }
    };
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!raf) raf = requestAnimationFrame(updateBend);
    }, { passive: true });
    document.addEventListener("mouseleave", () => {
      pointer.x = -1;
      pointer.y = -1;
      if (!raf) raf = requestAnimationFrame(updateBend);
    });
  } else {
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }, { passive: true });
  }

  const crittersHost = $("#critters");
  if (crittersHost && !reduceMotion) {
    const colors = ["#3d6e8e", "#4fa3a0", "#7c6b8a", "#c56a3d", "#557a8e"];
    const fishSVG = (color) =>
      `<svg width="36" height="22" viewBox="0 0 36 22"><path d="M3 11 C6 3.5,21 3.5,26 11 C21 18.5,6 18.5,3 11Z" fill="${color}" stroke="#14110b" stroke-width="1.6"/><path d="M24.5 11 L34 5 L32 11 L34 17Z" fill="${color}" stroke="#14110b" stroke-width="1.6" stroke-linejoin="round"/><circle cx="9" cy="9.4" r="1.5" fill="#14110b"/></svg>`;
    let w = innerWidth;
    let h = innerHeight;
    const fishes = [];
    const reset = (fish, now, spread) => {
      fish.dir = Math.random() < .5 ? 1 : -1;
      fish.scale = rand(.55, 1.1);
      fish.baseY = rand(.16, .78) * h;
      fish.bobA = rand(6, 20);
      fish.bobW = rand(.8, 1.7);
      fish.phase = rand(0, Math.PI * 2);
      fish.speed = rand(30, 66);
      fish.x = spread ? Math.random() * w : (fish.dir > 0 ? -60 : w + 60);
      fish.waitUntil = spread ? 0 : now + rand(1500, 5500);
      fish.el.style.opacity = rand(.18, .34).toFixed(2);
    };
    for (let i = 0; i < (w < 720 ? 2 : 3); i++) {
      const el = document.createElement("span");
      el.className = "fish";
      el.innerHTML = fishSVG(colors[(Math.random() * colors.length) | 0]);
      crittersHost.appendChild(el);
      const fish = { el, y: 0 };
      reset(fish, 0, true);
      fishes.push(fish);
    }
    let last = performance.now();
    let raf = 0;
    const tick = (now) => {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      for (const fish of fishes) {
        if (now < fish.waitUntil) continue;
        let speed = fish.speed;
        let veer = 0;
        if (pointer.x >= 0) {
          const dx = fish.x - pointer.x;
          const dy = fish.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 135) {
            const k = 1 - dist / 135;
            speed = fish.speed * (1 + k * 2.4);
            veer = Math.sign(dy || 1) * k * 50;
          }
        }
        fish.x += fish.dir * speed * dt;
        fish.y = fish.baseY + Math.sin(t * fish.bobW + fish.phase) * fish.bobA + veer;
        if ((fish.dir > 0 && fish.x > w + 70) || (fish.dir < 0 && fish.x < -70)) reset(fish, now, false);
        fish.el.style.transform = `translate(${fish.x.toFixed(1)}px, ${fish.y.toFixed(1)}px) scale(${fish.scale.toFixed(2)}) scaleX(${fish.dir})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", () => { w = innerWidth; h = innerHeight; }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
    });
  }

  const reveals = $$("[data-reveal]");
  $$(".work__grid [data-reveal], .agent-cards [data-reveal], .audience__grid [data-reveal], .skill-grid [data-reveal]")
    .forEach((el, i) => { el.style.transitionDelay = `${(i % 6) * 60}ms`; });
  let pending = reduceMotion ? [] : reveals.slice();
  const reveal = (el) => el.classList.add("is-in");
  if (reduceMotion) reveals.forEach(reveal);
  const runReveal = () => {
    if (!pending.length) return;
    const vh = window.innerHeight;
    pending = pending.filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * .92 && r.bottom > -60) {
        reveal(el);
        return false;
      }
      return true;
    });
  };
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
          pending = pending.filter((el) => el !== entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  const nav = $("#nav");
  const progress = $("#scrollProgress");
  const scrollLob = $("#scrollLob");
  const scrollPeek = $("#scrollPeek");
  const links = $$("#navLinks a");
  let scrollRaf = 0;
  let lastScrollY = window.scrollY;
  let peekTimer = 0;
  let peekHopTimer = 0;
  const popScrollPeek = () => {
    if (!scrollPeek || reduceMotion) return;
    scrollPeek.classList.add("is-peeking");
    scrollPeek.classList.remove("is-hop");
    void scrollPeek.offsetWidth;
    scrollPeek.classList.add("is-hop");
    clearTimeout(peekHopTimer);
    peekHopTimer = setTimeout(() => scrollPeek.classList.remove("is-hop"), 700);
    clearTimeout(peekTimer);
    peekTimer = setTimeout(() => scrollPeek.classList.remove("is-peeking"), 1500);
  };
  const onFrame = () => {
    scrollRaf = 0;
    const y = window.scrollY;
    if (nav) nav.classList.toggle("is-stuck", y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (y / (max || 1)) * 100;
    if (progress) progress.style.width = `${pct}%`;
    if (scrollLob) scrollLob.style.left = `${pct}%`;
    runReveal();
  };
  const onScroll = () => {
    const y = window.scrollY;
    if (lastScrollY - y > 8 && y > 120) popScrollPeek();
    lastScrollY = y;
    if (!scrollRaf) scrollRaf = requestAnimationFrame(onFrame);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", (event) => {
    if (event.deltaY < -8 && window.scrollY > 120) popScrollPeek();
  }, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onFrame();
  window.addEventListener("load", () => requestAnimationFrame(onFrame));
  setTimeout(onFrame, 400);

  if (links.length && "IntersectionObserver" in window) {
    const linkMap = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => link.classList.remove("is-active"));
          const active = linkMap.get(entry.target.id);
          if (active) active.classList.add("is-active");
        }
      });
    }, { threshold: .3, rootMargin: "-30% 0px -55% 0px" });
    ["problem", "box", "agents", "skills", "audience"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  const burger = $("#navBurger");
  const navLinks = $("#navLinks");
  burger?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  navLinks?.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      navLinks.classList.remove("is-open");
      burger?.setAttribute("aria-expanded", "false");
    }
  });

  const eggLayer = document.createElement("div");
  eggLayer.className = "egg-layer";
  eggLayer.setAttribute("aria-hidden", "true");
  document.body.appendChild(eggLayer);
  const fxLayer = document.createElement("div");
  fxLayer.style.cssText = "position:fixed;inset:0;z-index:9989;pointer-events:none;overflow:hidden";
  fxLayer.setAttribute("aria-hidden", "true");
  document.body.appendChild(fxLayer);

  let toastTimer = 0;
  const toast = (message, hold = 2600) => {
    let el = eggLayer.querySelector(".egg-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "egg-toast";
      eggLayer.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-show"), hold);
  };
  const disturb = (x, y) => {
    if (reduceMotion || !canAnimate) return;
    for (let i = 0; i < 4; i++) {
      const bubble = document.createElement("span");
      bubble.className = "egg-rise";
      const size = rand(5, 12);
      bubble.style.width = bubble.style.height = `${size | 0}px`;
      fxLayer.appendChild(bubble);
      const x0 = x + rand(-9, 9);
      const y0 = y + rand(-4, 4);
      const rise = rand(42, 100);
      const drift = rand(-11, 11);
      bubble.animate([
        { transform: `translate(${x0.toFixed(1)}px, ${y0.toFixed(1)}px) scale(.5)`, opacity: 0 },
        { opacity: .85, offset: .15 },
        { transform: `translate(${(x0 + drift).toFixed(1)}px, ${(y0 - rise).toFixed(1)}px) scale(1)`, opacity: 0 }
      ], { duration: rand(700, 1200), delay: i * 40, easing: "cubic-bezier(.4,0,.5,1)", fill: "forwards" })
        .onfinish = () => bubble.remove();
    }
  };
  window.addEventListener("pointerdown", (event) => disturb(event.clientX, event.clientY), { passive: true });

  let feedBusy = false;
  const feed = () => {
    const visual = $(".hero__visual");
    visual?.classList.add("is-feeding");
    setTimeout(() => visual?.classList.remove("is-feeding"), 900);
    if (feedBusy) return;
    feedBusy = true;
    toast("🍤 投喂时间！小龙虾们冲过来啦");

    if (!canAnimate) {
      setTimeout(() => { feedBusy = false; }, 1600);
      return;
    }
    if (reduceMotion) {
      setTimeout(() => { feedBusy = false; }, 2200);
      return;
    }

    const small = window.innerWidth < 640;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ground = h - (small ? 54 : 66);
    const foods = [];
    const nFood = small ? 6 : 9;
    for (let i = 0; i < nFood; i++) {
      const el = document.createElement("span");
      el.className = "egg-food";
      el.style.background = ["#ff4d1c", "#ff5da2", "#c8ff2d"][i % 3];
      eggLayer.appendChild(el);
      foods.push({
        el,
        x: rand(.12, .88) * w,
        y: rand(-60, -10),
        vy: rand(120, 190),
        swA: rand(8, 22),
        swW: rand(1, 2.4),
        phase: rand(0, Math.PI * 2),
        eaten: false
      });
    }

    const lobs = [];
    const nLob = small ? 2 : 3;
    const pad = 12;
    for (let i = 0; i < nLob; i++) {
      const el = document.createElement("span");
      el.className = "egg-feedlob";
      el.textContent = "🦞";
      el.style.fontSize = `${(small ? rand(30, 42) : rand(36, 50)) | 0}px`;
      eggLayer.appendChild(el);
      const width = el.offsetWidth || 42;
      const usable = Math.max(1, w - 2 * pad - width);
      const x = pad + (nLob === 1 ? usable / 2 : (i / (nLob - 1)) * usable) + rand(-8, 8);
      lobs.push({ el, width, x, y: ground, speed: rand(230, 320), chomp: 0 });
    }

    let last = performance.now();
    const t0 = last;
    let raf = 0;
    let ended = false;
    const finish = () => {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      lobs.forEach((lob, i) => {
        const dir = lob.x < w / 2 ? -1 : 1;
        lob.el.animate([
          { transform: lob.el.style.transform, opacity: 1 },
          { transform: `translate(${(lob.x + dir * w * .34) | 0}px, ${lob.y | 0}px) scaleX(${dir < 0 ? 1 : -1})`, opacity: 0 }
        ], { duration: 1100, delay: i * 90, easing: "ease-in", fill: "forwards" }).onfinish = () => lob.el.remove();
      });
      foods.forEach((food) => { if (!food.eaten) food.el.remove(); });
      toast("🦞 喂饱啦，HerClaw 继续干活", 3200);
      setTimeout(() => { feedBusy = false; }, 1500);
    };

    const tick = (now) => {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      const t = (now - t0) / 1000;
      for (const food of foods) {
        if (food.eaten) continue;
        food.y = Math.min(ground + 6, food.y + food.vy * dt);
        const x = food.x + Math.sin(t * food.swW + food.phase) * food.swA;
        food.el.style.transform = `translate(${x.toFixed(1)}px, ${food.y.toFixed(1)}px)`;
      }
      for (const lob of lobs) {
        const lc = lob.x + lob.width / 2;
        let target = null;
        let distance = Infinity;
        for (const food of foods) {
          if (food.eaten) continue;
          const d = Math.abs((food.x + 6) - lc);
          if (d < distance) {
            distance = d;
            target = food;
          }
        }
        let dir = 0;
        if (target) {
          const fc = target.x + 6;
          dir = Math.sign(fc - lc);
          if (Math.abs(fc - lc) > 6) lob.x += dir * lob.speed * dt;
          const targetY = target.y > ground - 230 ? Math.max(target.y - 16, ground - 150) : ground;
          lob.y += (targetY - lob.y) * Math.min(1, dt * 6);
          if (Math.abs(fc - (lob.x + lob.width / 2)) < 24 && Math.abs(target.y - lob.y) < 38) {
            target.eaten = true;
            lob.chomp = 1;
            const fx = target.x;
            const fy = target.y;
            target.el.remove();
            disturb(fx, fy);
          }
        } else {
          lob.y += (ground - lob.y) * Math.min(1, dt * 6);
        }
        lob.x = Math.max(pad, Math.min(w - lob.width - pad, lob.x));
        lob.chomp = Math.max(0, lob.chomp - dt * 3);
        const face = dir < 0 ? 1 : -1;
        const bob = Math.sin(t * 12 + lob.x * .05) * (dir !== 0 ? 3 : 1);
        lob.el.style.transform = `translate(${lob.x.toFixed(1)}px, ${(lob.y + bob).toFixed(1)}px) scale(${(1 + lob.chomp * .25).toFixed(2)}) scaleX(${face})`;
      }
      if (foods.every((food) => food.eaten) || t > (small ? 9 : 11)) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  $("#feedButton")?.addEventListener("click", feed);
  $("#productHero")?.addEventListener("click", feed);
  $("#popLobster")?.addEventListener("click", feed);
  scrollPeek?.addEventListener("click", feed);
  $("#hintButton")?.addEventListener("click", () => {
    toast("彩蛋：滑到底部再往上滑，会放一群小龙虾；也可以点击投喂");
    feed();
  });

  let clicks = 0;
  let clickTimer = 0;
  const parade = () => {
    toast("🦞 一大群小龙虾游过！");
    const count = reduceMotion ? 6 : 16;
    for (let i = 0; i < count; i++) {
      const lob = document.createElement("span");
      lob.className = "egg-lob";
      lob.textContent = "🦞";
      lob.style.fontSize = `${rand(22, 48) | 0}px`;
      lob.style.top = `${rand(5, 90).toFixed(1)}vh`;
      eggLayer.appendChild(lob);
      const bob = rand(10, 26);
      lob.animate([
        { transform: "translateX(-20vw) translateY(0px) rotate(-8deg) scaleX(-1)", opacity: 0 },
        { opacity: 1, offset: .06 },
        { transform: `translateX(16vw) translateY(${-bob}px) rotate(7deg) scaleX(-1)`, offset: .25 },
        { transform: `translateX(50vw) translateY(${(bob * .5).toFixed(0)}px) rotate(-6deg) scaleX(-1)`, offset: .5 },
        { transform: `translateX(84vw) translateY(${-bob}px) rotate(7deg) scaleX(-1)`, offset: .75 },
        { opacity: 1, offset: .94 },
        { transform: "translateX(122vw) translateY(0px) rotate(-8deg) scaleX(-1)", opacity: 0 }
      ], { duration: reduceMotion ? 1000 : rand(2400, 4200), delay: reduceMotion ? i * 40 : rand(0, 800), easing: "linear", fill: "forwards" })
        .onfinish = () => lob.remove();
    }
  };
  let bottomPrimed = false;
  let bottomBurstBusy = false;
  let bottomWatchY = window.scrollY;
  const nearBottom = () =>
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
  const burstFromBottom = (originVw) => {
    const count = reduceMotion ? 6 : (window.innerWidth < 640 ? 8 : 12);
    const upEase = "cubic-bezier(.3,.72,.4,1)";
    const downEase = "cubic-bezier(.55,0,.78,.46)";
    for (let i = 0; i < count; i++) {
      const lob = document.createElement("span");
      lob.className = "egg-lob egg-lob--burst";
      lob.textContent = "🦞";
      lob.style.left = `${originVw}vw`;
      lob.style.top = "100vh";
      lob.style.fontSize = `${(window.innerWidth < 640 ? rand(26, 44) : rand(28, 54)) | 0}px`;
      eggLayer.appendChild(lob);

      if (!canAnimate) {
        setTimeout(() => lob.remove(), 4200);
        continue;
      }

      const dx = rand(-24, 24);
      const floor = rand(2, 7);
      const peak = rand(42, 76);
      const spin = (rand(180, 520) | 0) * (Math.random() < .5 ? -1 : 1);
      const tilt = rand(-20, 20) | 0;
      const duration = reduceMotion ? 2600 : rand(5200, 7400) | 0;
      const delay = reduceMotion ? i * 35 : rand(0, 720) | 0;
      const keyframes = reduceMotion ? [
        { transform: "translate(0, 0)", opacity: 0 },
        { transform: `translate(${(dx * .42) | 0}vw, -${(peak * .24) | 0}vh) rotate(${tilt}deg)`, opacity: 1, offset: .18 },
        { transform: `translate(${(dx * .42) | 0}vw, -${(peak * .24) | 0}vh) rotate(${tilt}deg)`, opacity: 1, offset: .82 },
        { transform: `translate(${(dx * .42) | 0}vw, -${(peak * .24) | 0}vh) rotate(${tilt}deg)`, opacity: 0 }
      ] : [
        { offset: 0, transform: "translate(0vw, 0vh) rotate(0deg)", opacity: 0, easing: upEase },
        { offset: .04, transform: `translate(${(dx * .18) | 0}vw, -${(peak * .32) | 0}vh) rotate(${(spin * .12) | 0}deg)`, opacity: 1, easing: upEase },
        { offset: .18, transform: `translate(${(dx * .52) | 0}vw, -${peak | 0}vh) rotate(${(spin * .45) | 0}deg)`, opacity: 1, easing: downEase },
        { offset: .34, transform: `translate(${(dx * .76) | 0}vw, -${floor.toFixed(1)}vh) rotate(${(spin * .62) | 0}deg)`, easing: upEase },
        { offset: .45, transform: `translate(${(dx * .9) | 0}vw, -${(peak * .28) | 0}vh) rotate(${(spin * .78) | 0}deg)`, easing: downEase },
        { offset: .55, transform: `translate(${dx | 0}vw, -${floor.toFixed(1)}vh) rotate(${tilt}deg)`, easing: "ease-in-out" },
        { offset: .72, transform: `translate(${(dx + 1.6) | 0}vw, -${floor.toFixed(1)}vh) rotate(${tilt + 5}deg)`, opacity: 1 },
        { offset: .88, transform: `translate(${(dx - 1.2) | 0}vw, -${floor.toFixed(1)}vh) rotate(${tilt - 4}deg)`, opacity: 1 },
        { offset: 1, transform: `translate(${dx | 0}vw, -${floor.toFixed(1)}vh) rotate(${tilt}deg)`, opacity: 0 }
      ];
      lob.animate(keyframes, { duration, delay, fill: "forwards" }).onfinish = () => lob.remove();
    }
  };
  const bottomBurst = () => {
    if (bottomBurstBusy) return;
    bottomBurstBusy = true;
    toast("🦞 到底啦，小龙虾开闸！");
    const waves = window.innerWidth < 640
      ? [[18, 0], [82, 520], [50, 1180]]
      : [[12, 0], [88, 420], [50, 900], [28, 1500], [72, 2100]];
    waves.forEach(([origin, delay]) => setTimeout(() => burstFromBottom(origin), delay));
    setTimeout(() => { bottomBurstBusy = false; }, reduceMotion ? 3000 : 7200);
  };
  const watchBottomReturn = () => {
    const y = window.scrollY;
    if (nearBottom()) bottomPrimed = true;
    if (bottomPrimed && bottomWatchY - y > 16 && y > 80) {
      bottomPrimed = false;
      bottomBurst();
    }
    bottomWatchY = y;
  };
  window.addEventListener("scroll", watchBottomReturn, { passive: true });
  window.addEventListener("wheel", (event) => {
    if (nearBottom()) bottomPrimed = true;
    if (bottomPrimed && event.deltaY < -18 && window.scrollY > 80) {
      bottomPrimed = false;
      bottomBurst();
    }
  }, { passive: true });
  window.addEventListener("pointerdown", () => {
    clicks += 1;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clicks = 0; }, 1200);
    if (clicks >= 5) {
      clicks = 0;
      parade();
    }
  }, { passive: true });
  window.addEventListener("keydown", (event) => {
    if ((event.key || "").toLowerCase() === "f") feed();
  });

  if (finePointer && !reduceMotion) {
    const count = 15;
    const layer = document.createElement("div");
    layer.className = "lobtrail";
    layer.setAttribute("aria-hidden", "true");
    const colors = ["#ff4d1c", "#c8ff2d", "#2b47f0"];
    const dots = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const dot = document.createElement("span");
      dot.className = i % 2 ? "lobtrail__star" : "lobtrail__dot";
      const size = (i % 2 ? 13 : 11) - t * (i % 2 ? 9 : 8);
      dot.style.width = dot.style.height = `${size}px`;
      dot.style.background = colors[i % colors.length];
      dot.style.opacity = (.85 * (1 - t)).toFixed(2);
      layer.appendChild(dot);
      dots.push(dot);
    }
    const head = document.createElement("div");
    head.className = "lobtrail__head";
    head.textContent = "🦞";
    layer.appendChild(head);
    document.body.appendChild(layer);
    const pts = Array.from({ length: count }, () => ({ x: innerWidth / 2, y: innerHeight / 2 }));
    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    let active = false;
    let raf = 0;
    let pinchAt = -1e9;
    const loop = () => {
      pts[0].x += (mouse.x - pts[0].x) * .34;
      pts[0].y += (mouse.y - pts[0].y) * .34;
      for (let i = 1; i < count; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * .42;
        pts[i].y += (pts[i - 1].y - pts[i].y) * .42;
      }
      dots.forEach((dot, i) => {
        dot.style.transform = `translate(${pts[i].x}px, ${pts[i].y}px) translate(-50%, -50%)`;
      });
      const hp = pts[3];
      const ref = pts[7];
      const vx = hp.x - ref.x;
      const vy = hp.y - ref.y;
      const facing = vx >= 0 ? -1 : 1;
      const tilt = Math.max(-.4, Math.min(.4, vy * .012));
      const pe = (performance.now() - pinchAt) / 320;
      let scale = 1;
      let squish = 1;
      let snap = 0;
      if (pe >= 0 && pe < 1) {
        scale = 1 + Math.sin(pe * Math.PI) * .45;
        squish = 1 + Math.sin(pe * Math.PI * 2) * .28;
        snap = Math.sin(pe * Math.PI * 2) * .22;
      }
      const wobble = Math.sin(performance.now() / 130) * .13;
      head.style.transform = `translate(${hp.x}px, ${hp.y}px) translate(-50%, -50%) rotate(${tilt + snap + wobble}rad) scale(${scale}) scaleX(${facing * squish})`;
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!active) {
        active = true;
        pts.forEach((point) => { point.x = mouse.x; point.y = mouse.y; });
      }
      layer.classList.add("is-on");
      cancelAnimationFrame(raf);
      loop();
    };
    const burst = (x, y) => {
      for (let k = 0; k < 7; k++) {
        const pop = document.createElement("span");
        pop.className = `lobtrail__pop${["", " lobtrail__pop--lime", " lobtrail__pop--blue"][k % 3]}`;
        pop.style.transform = `translate(${x}px, ${y}px)`;
        layer.appendChild(pop);
        const angle = (Math.PI * 2 * k) / 7 + Math.random() * .6;
        const dist = rand(20, 38);
        requestAnimationFrame(() => {
          pop.style.transform = `translate(${x + Math.cos(angle) * dist}px, ${y + Math.sin(angle) * dist}px) scale(.4)`;
          pop.style.opacity = "0";
        });
        setTimeout(() => pop.remove(), 480);
      }
    };
    window.addEventListener("pointermove", (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      if (!active) start();
    }, { passive: true });
    window.addEventListener("pointerdown", (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      if (!active) start();
      pinchAt = performance.now();
      burst(event.clientX, event.clientY);
    }, { passive: true });
    document.addEventListener("mouseleave", () => layer.classList.remove("is-on"));
    document.addEventListener("mouseenter", () => active && layer.classList.add("is-on"));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (active) { cancelAnimationFrame(raf); loop(); }
    });
  }
})();
