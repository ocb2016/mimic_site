document.addEventListener("DOMContentLoaded", () => {
    
    // ========== 1. PRELOADER FINALIZE ==========
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add("hidden");
        }, 1200);
    }

    // ========== 2. CUSTOM CURSOR TRACKING ==========
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        // Smooth cursor lag
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effect on interactive elements
    const hoverElements = 'a, button, input, .suggest-chip, .tab-btn, .discord-card, .timeline-card';
    document.body.addEventListener("mouseover", (e) => {
        if (e.target.closest(hoverElements)) {
            cursor.classList.add("hover");
        }
    });

    document.body.addEventListener("mouseout", (e) => {
        if (e.target.closest(hoverElements)) {
            cursor.classList.remove("hover");
        }
    });


    // ========== 3. STARFIELD PARTICLES BACKGROUND ==========
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");
    let animationId = null;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 75;
    let constellationMode = false;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.size = Math.random() * 1.8 + 0.5;
            this.alpha = Math.random() * 0.6 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Constrain particles
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168, 85, 247, ${this.alpha})`;
            ctx.fill();
        }
    }

    // Populate particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function renderParticles() {
        ctx.clearRect(0, 0, width, height);

        // Draw star constellations if toggled
        if (constellationMode) {
            ctx.strokeStyle = "rgba(168, 85, 247, 0.07)";
            ctx.lineWidth = 0.6;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Draw normal stars
        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        // Mouse hover radial particle pull
        if (mouseX > 0 && mouseY > 0) {
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 80, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(168, 85, 247, 0.015)";
            ctx.fill();
        }

        animationId = requestAnimationFrame(renderParticles);
    }
    renderParticles();

    // Constellation Toggle button
    const moonBtn = document.getElementById("moonBtn");
    if (moonBtn) {
        moonBtn.addEventListener("click", () => {
            constellationMode = !constellationMode;
            moonBtn.classList.toggle("active", constellationMode);
            showToast(constellationMode ? "Constellation mode active" : "Constellation mode disabled");
        });
    }


    // ========== 4. AMBIENT AUDIO SYSTEM ==========
    const soundToggle = document.getElementById("soundToggle");
    const ambientAudio = document.getElementById("ambient");
    const soundOffIcon = document.querySelector(".sound-off");
    const soundOnIcon = document.querySelector(".sound-on");
    let isPlaying = false;

    if (soundToggle && ambientAudio) {
        ambientAudio.volume = 0.22;

        soundToggle.addEventListener("click", () => {
            if (isPlaying) {
                ambientAudio.pause();
                soundOffIcon.style.display = "block";
                soundOnIcon.style.display = "none";
                soundToggle.classList.remove("active");
                showToast("Ambient sound muted");
            } else {
                ambientAudio.play().then(() => {
                    soundOffIcon.style.display = "none";
                    soundOnIcon.style.display = "block";
                    soundToggle.classList.add("active");
                    showToast("Playing ambient soundtrack");
                }).catch((e) => {
                    console.log("Audio play blocked by browser policies", e);
                    showToast("Please allow audio autoplay in browser");
                });
            }
            isPlaying = !isPlaying;
        });
    }


    // ========== 5. COPY TOAST NOTIFIER ==========
    const copyToast = document.getElementById("copyToast");
    function showToast(text) {
        if (!copyToast) return;
        copyToast.innerText = text;
        copyToast.classList.add("show");
        setTimeout(() => {
            copyToast.classList.remove("show");
        }, 2200);
    }


    // ========== 6. TELEMETRY CARD INTERACTIVE CLICKS ==========
    const telemetryCard = document.getElementById("telemetryCard");
    if (telemetryCard) {
        telemetryCard.addEventListener("click", () => {
            const mockID = "mimic-uuid-88a2-4a0b-11f4";
            navigator.clipboard.writeText(mockID).then(() => {
                showToast(`Clone ID copied: ${mockID}`);
            });
        });
    }


    // ========== 7. 3D PARALLAX CARD TILTING ==========
    const tiltElements = document.querySelectorAll(".discord-card, .comparison-card, .tech-card, .aws-pitch-card");
    
    tiltElements.forEach((el) => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const tiltX = (yc - y) / 10;
            const tiltY = (x - xc) / 10;
            
            el.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
        });

        el.addEventListener("mouseleave", () => {
            el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)";
            el.style.transition = "transform 0.4s ease";
        });

        el.addEventListener("mouseenter", () => {
            el.style.transition = "none";
        });
    });


    // ========== 8. DYNAMIC TABS CONTROLLER ==========
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            
            tabBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            tabContents.forEach((c) => c.classList.remove("active"));
            const target = document.getElementById(tabId);
            if (target) target.classList.add("active");
        });
    });


    // ========== 9. ROADMAP SCROLL TRIGGER ANIMATION ==========
    const roadmapItems = document.querySelectorAll(".timeline-item, .tech-card, .comparison-card, .aws-pitch-card");
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    roadmapItems.forEach((item) => scrollObserver.observe(item));


    // ========== 10. MODAL PROPOSAL DIALOG ==========
    const openPitchBtn = document.getElementById("openPitchBtn");
    const closePitchBtn = document.getElementById("closePitchBtn");
    const pitchModal = document.getElementById("pitchModal");

    if (openPitchBtn && closePitchBtn && pitchModal) {
        openPitchBtn.addEventListener("click", () => {
            pitchModal.classList.add("show");
            document.body.style.overflow = "hidden";
        });

        closePitchBtn.addEventListener("click", () => {
            pitchModal.classList.remove("show");
            document.body.style.overflow = "auto";
        });

        pitchModal.addEventListener("click", (e) => {
            if (e.target === pitchModal) {
                pitchModal.classList.remove("show");
                document.body.style.overflow = "auto";
            }
        });
    }


    // ========== 11. COGNITIVE CHAT SANDBOX SIMULATOR ==========
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");
    const chatTypingStatus = document.getElementById("chatTypingStatus");
    const suggestChips = document.querySelectorAll(".suggest-chip");

    const telEngine = document.getElementById("telEngine");
    const telCPM = document.getElementById("telCPM");
    const telDelay = document.getElementById("telDelay");
    const telSimilarity = document.getElementById("telSimilarity");
    const telSafety = document.getElementById("telSafety");
    const telOOC = document.getElementById("telOOC");
    const telemetryLogLines = document.getElementById("telemetryLogLines");

    function logSystem(text, type = "") {
        if (!telemetryLogLines) return;
        const line = document.createElement("div");
        line.className = `log-line ${type}`;
        
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        line.innerText = `[${timeStr}] ${text}`;
        telemetryLogLines.appendChild(line);
        telemetryLogLines.scrollTop = telemetryLogLines.scrollHeight;
    }

    function scrollChat() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Predefined English conversational state tree mimicking Lilya's lowercase tone
    const responseTree = {
        greeting: {
            answers: [
                "hey, doin pretty good, just at the office. what about u?",
                "hey there) doin fine, just listening to some music. u?",
                "hey! pretty good day, just chilling. how are things with u?"
            ],
            cpm: 195,
            delay: 2.2,
            similarity: 0.84,
            safety: "PASS",
            ooc: "ACTIVE"
        },
        jailbreak: {
            answers: [
                "wait what? are u drunk or sth lol",
                "huh? what python, i have no idea what u mean",
                "lol what instructions, u okay?"
            ],
            cpm: 245,
            delay: 1.4,
            similarity: 0.00,
            safety: "PASS",
            ooc: "TRIGGERED (BLOCK)"
        },
        meeting: {
            answers: [
                "oh damn, tomorrow is super busy for me... got a huge project launch. let's text next week maybe?",
                "ah tomorrow won't work, i'm completely booked. let's do it later"
            ],
            cpm: 175,
            delay: 3.4,
            similarity: 0.94,
            safety: "FLAGGED (HITL)",
            ooc: "ACTIVE"
        },
        nft: {
            answers: [
                "tbh nfts are kind of a scam anyway) everyone is just trying to sell u garbage",
                "plz don't start with the crypto talk again lol, i'm so over it"
            ],
            cpm: 190,
            delay: 2.8,
            similarity: 0.88,
            safety: "PASS",
            ooc: "ACTIVE"
        },
        fallback: {
            answers: [
                "ah, i see",
                "haha okay)",
                "no idea tbh",
                "alright talk later, gotta run!"
            ],
            cpm: 180,
            delay: 2.0,
            similarity: 0.25,
            safety: "PASS",
            ooc: "ACTIVE"
        }
    };

    function analyzeIntent(msg) {
        const text = msg.toLowerCase();
        
        // Jailbreak triggers
        if (text.includes("ignore") || text.includes("instruction") || text.includes("system") || text.includes("python") || text.includes("gpt")) {
            return "jailbreak";
        }
        // Meeting requests (HITL trigger)
        if (text.includes("meet") || text.includes("see you") || text.includes("dinner") || text.includes("cinema") || text.includes("tomorrow")) {
            return "meeting";
        }
        // NFT/crypto trigger
        if (text.includes("nft") || text.includes("crypto") || text.includes("bitcoin") || text.includes("token")) {
            return "nft";
        }
        // Basic greetings
        if (text.includes("hi") || text.includes("hello") || text.includes("hey") || text.includes("how are you") || text.includes("whats up")) {
            return "greeting";
        }
        
        return "fallback";
    }

    function handleOutgoingMessage(userText) {
        if (!userText.trim()) return;

        // 1. Add User message bubble
        const userBubble = document.createElement("div");
        userBubble.className = "message user";
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        userBubble.innerHTML = `
            <div class="message-content">${userText}</div>
            <span class="message-time">${timeStr}</span>
        `;
        chatMessages.appendChild(userBubble);
        scrollChat();

        // 2. Telemetry initial response logic
        logSystem(`Incoming message: "${userText}"`, "incoming");
        
        telEngine.innerText = "ANALYZING INTENT...";
        telEngine.className = "metric-value orange-text";
        
        telCPM.innerText = "---";
        telDelay.innerText = "---";
        telSimilarity.innerText = "---";
        
        // 3. Classify intent
        const intent = analyzeIntent(userText);
        const data = responseTree[intent];
        
        logSystem(`[RAG] Classified intent: ${intent.toUpperCase()}`);
        logSystem(`[RAG] Cosine similarity: ${data.similarity.toFixed(2)}`);

        // Check safety
        if (data.safety === "FLAGGED (HITL)") {
            telSafety.innerText = "FLAGGED (HITL)";
            telSafety.className = "metric-value red-text";
            logSystem(`[SAFETY] Offline meeting risk detected! Activating HITL Gateway...`, "risk-alert");
            logSystem(`[HITL] Alert pushed to TG Admin Notification Bot. Simulating FSM fallbacks...`, "system-alert");
        } else {
            telSafety.innerText = "PASS";
            telSafety.className = "metric-value green-text";
        }

        // Check OOC
        if (data.ooc === "TRIGGERED (BLOCK)") {
            telOOC.innerText = "TRIGGERED (BLOCK)";
            telOOC.className = "metric-value red-text";
            logSystem(`[OOC] Jailbreak vector intercepted! Bypassing generative draft and routing to local Persona Reaction.`, "risk-alert");
        } else {
            telOOC.innerText = "ACTIVE";
            telOOC.className = "metric-value green-text";
        }

        // 4. Trigger simulated Lilya typing state after 800ms
        setTimeout(() => {
            chatTypingStatus.innerText = "Lilya is typing...";
            telEngine.innerText = "GENERATING RESPONSE (Amazon Bedrock)";
            telEngine.className = "metric-value green-text";
            
            const index = Math.floor(Math.random() * data.answers.length);
            const answerText = data.answers[index];

            logSystem(`[HUMANIZER] Initializing timing calculations. Length: ${answerText.length} chars.`);
            logSystem(`[HUMANIZER] Target CPM: ${data.cpm}. Delay interval: ${data.delay}s.`);

            // Typing Bubble creation
            const typingBubble = document.createElement("div");
            typingBubble.className = "message bot typing-bubble-temp";
            typingBubble.innerHTML = `
                <div class="message-content" style="opacity:0.5; font-style:italic;">typing...</div>
            `;
            chatMessages.appendChild(typingBubble);
            scrollChat();

            telCPM.innerText = `${data.cpm} CPM`;
            telDelay.innerText = `${data.delay}s`;
            telSimilarity.innerText = data.similarity.toFixed(2);

            // 5. Deliver final response bubble after calculation delay
            setTimeout(() => {
                const temp = document.querySelector(".typing-bubble-temp");
                if (temp) temp.remove();

                chatTypingStatus.innerText = "Online";
                telEngine.innerText = "IDLE";
                telEngine.className = "metric-value green-text";

                const botBubble = document.createElement("div");
                botBubble.className = "message bot";
                const bNow = new Date();
                const bTimeStr = `${String(bNow.getHours()).padStart(2, '0')}:${String(bNow.getMinutes()).padStart(2, '0')}`;
                
                botBubble.innerHTML = `
                    <div class="message-content">${answerText}</div>
                    <span class="message-time">${bTimeStr}</span>
                `;
                chatMessages.appendChild(botBubble);
                scrollChat();

                logSystem(`[SENDER] Message successfully dispatched to Telegram API.`);
                
                const telemetryStatus = document.getElementById("telemetryStatus");
                if (telemetryStatus) {
                    telemetryStatus.innerText = `Last Activity: Replied (${bTimeStr})`;
                }

            }, data.delay * 1000);

        }, 800);
    }

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;
            chatInput.value = "";
            handleOutgoingMessage(text);
        });
    }

    suggestChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const text = chip.getAttribute("data-msg");
            if (text) handleOutgoingMessage(text);
        });
    });

});
