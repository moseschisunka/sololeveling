/* ==========================================================================
   THE SYSTEM: SOLO LEVELING GYM HUD ENGINE (V2 UPGRADE)
   ========================================================================== */

// --- GLOBAL GAME STATE ---
let playerState = {
    // Authentication & Profile Info
    authenticated: false,
    username: "Sung Jinwoo",
    password: "monarch123",
    
    // Character Info
    name: "Sung Jinwoo",
    title: "The Weakest Hunter",
    rank: "E",
    class: "knight", // knight, assassin, mage, ranger
    level: 1,
    exp: 0,
    expNeeded: 100,
    gold: 150,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    guild: "Solo Raider",

    // Physical Health Metrics (Awakened Appraisal)
    appraised: false,
    gender: "male",
    age: 24,
    height: 175,
    weight: 68,
    activityLevel: "moderate",
    goal: "balance",
    bmi: 22.2,
    bmr: 1650,
    tdee: 2400,
    idealWeight: "62 - 76 kg",

    // Attribute stats (base stats before class bonuses)
    allocatedPoints: 0,
    strength: 10,
    agility: 10,
    vitality: 10,
    sense: 10,
    intelligence: 10,
    tempStrength: 10,
    tempAgility: 10,
    tempVitality: 10,
    tempSense: 10,
    tempIntelligence: 10,

    // Time Tracking & Deficit Penalties
    lastGymWorkoutTimestamp: Date.now(), // Milliseconds since last gym exercise completion
    hasTrialDeficit: false,

    // Dynamic Customized Gym Routine Builder
    gymWorkouts: [
        { id: "init_bench", name: "Bench Press", category: "chest", targetSets: 3, targetReps: 10, targetWeight: 60, completedSets: [false, false, false] },
        { id: "init_pullup", name: "Pull-ups", category: "back", targetSets: 3, targetReps: 8, targetWeight: 0, completedSets: [false, false, false] }
    ],

    // Nutrition & Hydration
    dietProtocol: "balance",
    caloriesEaten: 0,
    proteinEaten: 0,
    carbsEaten: 0,
    fatsEaten: 0,
    waterLogged: 0,
    waterTarget: 2500,

    // Daily Quests Progress
    difficulty: "easy",
    questCompletedToday: false,
    holistic: {
        diet: false,
        meditation: false,
        sleep: false
    },

    // Inventory and Chests
    inventory: [
        { id: "hp_potion", name: "Health Potion", type: "consumable", qty: 2, icon: "fa-flask", desc: "Heals 50 HP instantly. A system-approved elixir." },
        { id: "mp_potion", name: "Mana Potion", type: "consumable", qty: 2, icon: "fa-vial", desc: "Restores 25 MP instantly. Relieves magical exhaustion." },
        { id: "key_e", name: "E-Rank Dungeon Key", type: "key", qty: 1, icon: "fa-key", desc: "Unlocks the Goblin Den Gate anomalies." }
    ],
    chests: {
        bronze: 1,
        silver: 0,
        gold: 0
    },

    // Intellectual Capabilities (Monarch of Mind Upgrade)
    apiKey: "",
    iqScore: 80,
    studyStreak: 0,
    intellectualCompletedToday: false,
    intellectualChecks: {
        bible: false,
        religion: false,
        history: false,
        philosophy: false,
        epidemiology: false
    },
    flashcardsMastered: [],
    examPermits: 0,
    examHistory: []
};

// --- DATA DICTIONARIES & ENUMERATIONS ---
const EXERCISE_CATALOG = {
    chest: ["Bench Press", "Incline Dumbbell Press", "Cable Chest Flyes", "Chest Dips", "Push-ups"],
    back: ["Deadlifts", "Pull-ups", "Lat Pulldowns", "Seated Cable Rows", "Barbell Bent Over Rows"],
    legs: ["Barbell Squats", "Leg Press", "Leg Extensions", "Lying Leg Curls", "Standing Calf Raises"],
    shoulders: ["Overhead Barbell Press", "Dumbbell Lateral Raises", "Cable Face Pulls", "Dumbbell Front Raises"],
    arms: ["Barbell Bicep Curls", "Tricep Rope Pushdowns", "Dumbbell Hammer Curls", "Skull Crushers"],
    cardio: ["Treadmill Running", "Rowing Machine", "Stationary Biking", "Jump Rope Routine", "HIIT Core Circuit"]
};

const CLASS_BONUSES = {
    knight: { name: "Heavy Knight", bonusStr: 5, bonusVit: 2, desc: "A resilient powerhouse built for powerlifting, heavy barbell squats, and massive raw strength." },
    assassin: { name: "Shadow Assassin", bonusAgi: 5, bonusSen: 2, desc: "A lightning-swift predator focused on calisthenics, HIIT, and evasion conditioning." },
    mage: { name: "Mystic Mage", bonusInt: 5, bonusVit: 2, desc: "A spellcaster whose high mana pool scales with consistency, deep sleep recovery, and meditation." },
    ranger: { name: "Vanguard Ranger", bonusSen: 5, bonusAgi: 2, desc: "An athletic explorer balanced for high cardio pacing, rowing endurance, and peak reflexes." }
};

const DIFFICULTY_CONFIG = {
    easy: { points: 1, chest: "bronze", penalty: 30 },
    medium: { points: 2, chest: "silver", penalty: 60 },
    hard: { points: 3, chest: "gold", penalty: 120 }
};

const TITLES = [
    { minLvl: 1, name: "The Weakest Hunter", desc: "You are at the very bottom of the food chain. The world looks down on you, but the System has chosen you." },
    { minLvl: 10, name: "E-Rank Survivor", desc: "You have stared death in the face and scraped by. Resilience is your ultimate shield." },
    { minLvl: 25, name: "C-Rank Vanguard", desc: "You have conquered basic dungeons. Hunters are starting to notice your uncanny growth." },
    { minLvl: 45, name: "A-Rank Guild Raider", desc: "A formidable force on any raid team. Your combat awareness matches elite guild generals." },
    { minLvl: 70, name: "Shadow Monarch", desc: "The supreme ruler of death itself. Your Shadow Army rises from the graves to crush all who stand in your way." }
];

const DIET_MANUALS = {
    bulk: {
        title: "Monarch's Bulk Regime",
        desc: "Designed for rapid physical hypertrophy, bone density scaling, and massive strength upgrades.",
        rules: [
            "Maintain a calorie surplus of +300 to +500 kcal above TDEE daily.",
            "Consume 2.0g of Protein per kg of body weight daily ('Magical Beast Proteins').",
            "Eat nutrient-dense 'High-Mana Carbs' (oats, brown rice, sweet potatoes) before major gates.",
            "Avoid low-quality processed sugars and greasy oils."
        ]
    },
    stealth: {
        title: "Shadow Stealth Protocol",
        desc: "Crafted for intense weight loss, metabolic shred, and supreme agility evasion scaling.",
        rules: [
            "Maintain a calorie deficit of -350 to -500 kcal below TDEE daily.",
            "Prioritize lean protein (chicken, egg whites, fish) to protect muscle mass during calorie limits.",
            "Incorporate dense greens and water elixirs to maintain full satiety and stealth endurance.",
            "Zero high-glycemic carbohydrates post-training."
        ]
    },
    balance: {
        title: "Hunter's Balance Diet",
        desc: "Optimal balanced health to ensure a steady pool of mana regeneration, vitality, and cellular repair.",
        rules: [
            "Maintain baseline calorie intake matching TDEE.",
            "Balanced macronutrient ratio: 40% Carbohydrates, 30% Protein, 30% Healthy Fats.",
            "Focus on anti-inflammatory whole foods (berries, avocados, nuts, leafy greens).",
            "Keep daily hydration levels peaking."
        ]
    }
};

const DUNGEON_MONSTERS = {
    E: { name: "Goblin Raider", hp: 60, maxHp: 60, atk: 6, gold: 50, exp: 35, keyId: "key_e" },
    D: { name: "Swamp Tarantula", hp: 160, maxHp: 160, atk: 14, gold: 120, exp: 70, keyId: "key_d" },
    C: { name: "Orc Warlord", hp: 450, maxHp: 450, atk: 26, gold: 300, exp: 180, keyId: "key_c" },
    B: { name: "Temple Gargoyle", hp: 1100, maxHp: 1100, atk: 55, gold: 800, exp: 400, keyId: "key_b" },
    S: { name: "Ant King (Jeju Island)", hp: 4200, maxHp: 4200, atk: 160, gold: 4000, exp: 1500, keyId: "key_s" }
};

const LOOT_CHANCE_ROSTER = {
    bronze: [
        { item: { id: "hp_potion", name: "Health Potion", type: "consumable", qty: 1, icon: "fa-flask", desc: "Heals 50 HP instantly." }, weight: 45 },
        { item: { id: "mp_potion", name: "Mana Potion", type: "consumable", qty: 1, icon: "fa-vial", desc: "Restores 25 MP instantly." }, weight: 35 },
        { item: { id: "key_e", name: "E-Rank Dungeon Key", type: "key", qty: 1, icon: "fa-key", desc: "Goblin Gate access key." }, weight: 15 },
        { item: { id: "kasaka_venom", name: "Kasaka's Venom", type: "consumable", qty: 1, icon: "fa-skull-crossbones", desc: "Consuming permanent +1 STR, lowers VIT by 1." }, weight: 5 }
    ],
    silver: [
        { item: { id: "hp_potion", name: "Health Potion", type: "consumable", qty: 2, icon: "fa-flask", desc: "Heals 50 HP instantly." }, weight: 30 },
        { item: { id: "key_d", name: "D-Rank Dungeon Key", type: "key", qty: 1, icon: "fa-key", desc: "Spider Nest Gate access key." }, weight: 30 },
        { item: { id: "key_c", name: "C-Rank Dungeon Key", type: "key", qty: 1, icon: "fa-key", desc: "Orc Stronghold access key." }, weight: 20 },
        { item: { id: "steel_dagger", name: "Steel Dagger", type: "weapon", qty: 1, icon: "fa-knife-slice", desc: "E-Rank Weapon. Equipping grants +5 STR and +2 AGI." }, weight: 15 },
        { item: { id: "kasaka_fang", name: "Kasaka's Venom Fang", type: "weapon", qty: 1, icon: "fa-gavel", desc: "C-Rank Weapon. Grants +15 STR and poisons bosses." }, weight: 5 }
    ],
    gold: [
        { item: { id: "key_b", name: "B-Rank Dungeon Key", type: "key", qty: 1, icon: "fa-key", desc: "Gargoyle Temple access key." }, weight: 35 },
        { item: { id: "key_s", name: "S-Rank Dungeon Key", type: "key", qty: 1, icon: "fa-key", desc: "Jeju Hive access key." }, weight: 15 },
        { item: { id: "elixir_life", name: "Elixir of Life", type: "consumable", qty: 1, icon: "fa-prescription-bottle-medical", desc: "Fully restores HP and MP instantly." }, weight: 20 },
        { item: { id: "demon_shortsword", name: "Demon King's Shortsword", type: "weapon", qty: 1, icon: "fa-sword", desc: "A-Rank Weapon. Grants +35 STR and +10 SEN." }, weight: 20 },
        { item: { id: "monarch_dagger", name: "Monarch's Dagger", type: "weapon", qty: 1, icon: "fa-shield-halved", desc: "S-Rank Legendary Weapon. Grants +75 STR, +20 AGI, and +15 SEN." }, weight: 10 }
    ]
};

// --- INITIALIZER ---
document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication();
    initClock();
    registerEventListeners();
    initIntellectualSubsystem();
    refreshHUD();
});

// --- AUTHENTICATION & SECURITY GATE ---
function checkAuthentication() {
    const data = localStorage.getItem("solo_leveling_player_state");
    if (data) {
        try {
            const parsed = JSON.parse(data);
            if (parsed.authenticated) {
                // Merge parsed state with default properties to support upgrade pathways without errors
                playerState = {
                    ...playerState,
                    ...parsed
                };
                
                // Explicitly initialize nested and missing fields
                if (!playerState.intellectualChecks) {
                    playerState.intellectualChecks = { bible: false, religion: false, history: false, philosophy: false, epidemiology: false };
                }
                if (!playerState.flashcardsMastered) playerState.flashcardsMastered = [];
                if (!playerState.examHistory) playerState.examHistory = [];
                if (playerState.apiKey === undefined) playerState.apiKey = "";
                if (playerState.iqScore === undefined) playerState.iqScore = 80;
                if (playerState.studyStreak === undefined) playerState.studyStreak = 0;
                if (playerState.examPermits === undefined) playerState.examPermits = 0;

                // Sync temporary allocation points
                playerState.tempStrength = playerState.strength;
                playerState.tempAgility = playerState.agility;
                playerState.tempVitality = playerState.vitality;
                playerState.tempSense = playerState.sense;
                playerState.tempIntelligence = playerState.intelligence;
                
                document.getElementById("screen-login").classList.add("hidden");
                document.getElementById("screen-login").style.display = "none";
                document.getElementById("app-container").classList.remove("hidden");
            }
        } catch (e) {
            console.error("Error reading login state", e);
        }
    }
}

function handleLogin(username, password) {
    const data = localStorage.getItem("solo_leveling_player_state");
    
    if (data) {
        try {
            const parsed = JSON.parse(data);
            // Verify password if account exists
            if (parsed.username === username && parsed.password !== password) {
                spawnToast("Decryption Error", "Incorrect key/password for this Hunter Signature.", "red");
                return;
            } else if (parsed.username === username) {
                // Login successful
                playerState = parsed;
                playerState.authenticated = true;
                saveStateToStorage();
                checkAuthentication();
                refreshHUD();
                checkAppraisalRequirements();
                spawnToast("Signature Validated", `Welcome back, Hunter ${playerState.name}! Core loaded.`, "gold");
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Auto-Register brand new hunter
    playerState.username = username;
    playerState.password = password;
    playerState.name = username;
    playerState.authenticated = true;
    playerState.appraised = false; // Trigger appraisal modal ceremony next
    
    saveStateToStorage();
    checkAuthentication();
    checkAppraisalRequirements();
}

function handleLogout() {
    playerState.authenticated = false;
    saveStateToStorage();
    location.reload();
}

// --- STATE PERSISTENCE ---
function saveStateToStorage() {
    localStorage.setItem("solo_leveling_player_state", JSON.stringify(playerState));
}

// --- DYNAMIC CLOCK & TIMERS ---
let dailyTimerInterval = null;
function initClock() {
    const clockEl = document.getElementById("system-time");
    const timerEl = document.getElementById("quest-timer");

    function updateClocks() {
        const now = new Date();
        clockEl.textContent = now.toTimeString().split(' ')[0];

        // Countdown to midnight for daily reset - only check if authenticated
        if (playerState.authenticated) {
            const midnight = new Date();
            midnight.setDate(midnight.getDate() + 1);
            midnight.setHours(0, 0, 0, 0);
            const diffMs = midnight - now;

            if (diffMs <= 0) {
                triggerDailyReset();
                return;
            }

            const hours = Math.floor(diffMs / 3600000).toString().padStart(2, '0');
            const minutes = Math.floor((diffMs % 3600000) / 60000).toString().padStart(2, '0');
            const seconds = Math.floor((diffMs % 60000) / 1000).toString().padStart(2, '0');
            
            timerEl.textContent = `${hours}:${minutes}:${seconds}`;

            // Live check missed gym deficit trigger (36 hours = 129,600,000 ms)
            const idleTimeMs = Date.now() - playerState.lastGymWorkoutTimestamp;
            if (idleTimeMs > 36 * 3600 * 1000 && !playerState.hasTrialDeficit) {
                triggerTrialDeficit();
            }
        } else {
            timerEl.textContent = "24:00:00";
        }
    }

    updateClocks();
    dailyTimerInterval = setInterval(updateClocks, 1000);
}

function triggerDailyReset() {
    if (!playerState.authenticated) return;

    // If daily quests aren't done, pull player into penalty zone survival!
    if (!playerState.questCompletedToday) {
        initiatePenaltyQuest();
    } else {
        // Clear daily checklists safely
        playerState.questCompletedToday = false;
        playerState.holistic.diet = false;
        playerState.holistic.meditation = false;
        playerState.holistic.sleep = false;
        playerState.waterLogged = 0;
        playerState.caloriesEaten = 0;
        playerState.proteinEaten = 0;
        playerState.carbsEaten = 0;
        playerState.fatsEaten = 0;

        // Reset dynamic custom gym sets checkboxes
        playerState.gymWorkouts.forEach(workout => {
            workout.completedSets = workout.completedSets.map(() => false);
        });
        
        saveStateToStorage();
        refreshHUD();
        spawnToast("Daily Reset", "A new day rises. Your System workout tasks are updated.", "blue");
    }
}

// --- TRIAL DEFICIT SETBACK ENGINE ---
function triggerTrialDeficit() {
    playerState.hasTrialDeficit = true;
    
    // Penalize EXP and Gold
    playerState.exp = Math.max(0, playerState.exp - 30);
    playerState.gold = Math.max(0, playerState.gold - 50);

    saveStateToStorage();
    refreshHUD();
    spawnToast("Trial Deficit", "WARNING: Missed Gym trials for 36h+. Exertion core exhausted!", "red");
}

function simulateGymMiss() {
    // Force set the last workout timestamp to 37 hours ago
    playerState.lastGymWorkoutTimestamp = Date.now() - (37 * 3600 * 1000);
    triggerTrialDeficit();
}

// --- RESTORATION RITUAL MODAL LOGIC ---
let ritualMeditationTimer = null;
let ritualMeditationSeconds = 300;

function openRestorationModal() {
    const modal = document.getElementById("modal-restoration");
    modal.classList.remove("hidden");
    modal.style.display = "flex";

    // Setup ritual progress tracking
    document.getElementById("ritual-meditation").checked = false;
    const isWaterDone = playerState.waterLogged >= 3000;
    document.getElementById("ritual-hydration").checked = isWaterDone;
    document.getElementById("ritual-water-progress").textContent = `${playerState.waterLogged} / 3000`;

    updateRitualPurgeButton();
}

function handleRitualMeditation() {
    const medBtn = document.getElementById("btn-ritual-meditate");
    const medTimerEl = document.getElementById("ritual-meditation-timer");
    const medCheckbox = document.getElementById("ritual-meditation");

    if (medBtn.innerHTML.includes("Start")) {
        medBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Ritual Meditation';
        
        ritualMeditationTimer = setInterval(() => {
            ritualMeditationSeconds--;
            
            const mins = Math.floor(ritualMeditationSeconds / 60).toString().padStart(2, '0');
            const secs = (ritualMeditationSeconds % 60).toString().padStart(2, '0');
            medTimerEl.textContent = `${mins}:${secs}`;

            if (ritualMeditationSeconds <= 0) {
                clearInterval(ritualMeditationTimer);
                medCheckbox.checked = true;
                medBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Meditation Complete';
                medBtn.disabled = true;
                updateRitualPurgeButton();
                spawnToast("Ritual Step Done", "Your mana circulation meditation is finished.", "purple");
            }
        }, 1000);
    } else {
        clearInterval(ritualMeditationTimer);
        medBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Ritual Meditation';
    }
}

function updateRitualPurgeButton() {
    const med = document.getElementById("ritual-meditation").checked;
    const hydration = playerState.waterLogged >= 3000;
    const sleep = document.getElementById("ritual-sleep").checked;

    const purgeBtn = document.getElementById("btn-complete-ritual");
    if (med && hydration && sleep) {
        purgeBtn.disabled = false;
        purgeBtn.classList.remove("disabled");
    } else {
        purgeBtn.disabled = true;
        purgeBtn.classList.add("disabled");
    }
}

function executeRitualPurge() {
    playerState.hasTrialDeficit = false;
    playerState.lastGymWorkoutTimestamp = Date.now(); // reset timer
    
    // Partially replenish HP & MP
    playerState.hp = playerState.maxHp;
    playerState.mp = playerState.maxMp;

    saveStateToStorage();
    refreshHUD();
    
    document.getElementById("modal-restoration").classList.add("hidden");
    document.getElementById("modal-restoration").style.display = "none";
    spawnToast("Debuff Cleansed", "Faltered Resolve purged! Base combat matrices fully restored.", "gold");
}

// --- APPRAISAL CEREMONY ---
function checkAppraisalRequirements() {
    const modal = document.getElementById("modal-appraisal");
    const mainHUD = document.getElementById("app-container");
    
    if (playerState.authenticated && !playerState.appraised) {
        modal.classList.remove("hidden");
        modal.style.display = "flex";
        mainHUD.classList.add("hidden");
    } else if (playerState.authenticated) {
        modal.classList.add("hidden");
        modal.style.display = "none";
        mainHUD.classList.remove("hidden");
    }
}

function performAwakeningAppraisal(name, age, height, weight, activity, goal, classChoice) {
    playerState.name = name;
    playerState.age = age;
    playerState.height = height;
    playerState.weight = weight;
    playerState.activityLevel = activity;
    playerState.goal = goal;
    playerState.class = classChoice;

    // Calculate BMI
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);
    playerState.bmi = parseFloat(bmi);

    // Calculate BMR
    let bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    if (playerState.gender === "female") bmr -= 166;
    playerState.bmr = Math.round(bmr);

    // TDEE
    let activityMultiplier = 1.2;
    if (activity === "light") activityMultiplier = 1.375;
    else if (activity === "moderate") activityMultiplier = 1.55;
    else if (activity === "heavy") activityMultiplier = 1.725;
    playerState.tdee = Math.round(bmr * activityMultiplier);

    // Ideal weight target
    const idealLow = Math.round(18.5 * heightM * heightM);
    const idealHigh = Math.round(24.9 * heightM * heightM);
    playerState.idealWeight = `${idealLow} - ${idealHigh} kg`;

    // Hydration Target
    playerState.waterTarget = Math.round(weight * 35);

    // Class Attributes allocation biases
    playerState.strength = 10;
    playerState.agility = 10;
    playerState.vitality = 10;
    playerState.sense = 10;
    playerState.intelligence = 10;

    const bonuses = CLASS_BONUSES[classChoice];
    if (classChoice === "knight") {
        playerState.strength += bonuses.bonusStr;
        playerState.vitality += bonuses.bonusVit;
    } else if (classChoice === "assassin") {
        playerState.agility += bonuses.bonusAgi;
        playerState.sense += bonuses.bonusSen;
    } else if (classChoice === "mage") {
        playerState.intelligence += bonuses.bonusInt;
        playerState.vitality += bonuses.bonusVit;
    } else if (classChoice === "ranger") {
        playerState.sense += bonuses.bonusSen;
        playerState.agility += bonuses.bonusAgi;
    }

    // Set starting Hunter Rank based on fitness parameters
    let score = 0;
    if (activity === "light") score += 1;
    else if (activity === "moderate") score += 2;
    else if (activity === "heavy") score += 3;
    if (playerState.bmi >= 18.5 && playerState.bmi < 25.0) score += 2;

    let startingRank = "E";
    if (score >= 4) startingRank = "C";
    else if (score >= 3) startingRank = "D";

    playerState.rank = startingRank;
    playerState.appraised = true;

    // Load matching diet manual
    if (goal === "bulk") playerState.dietProtocol = "bulk";
    else if (goal === "stealth") playerState.dietProtocol = "stealth";
    else playerState.dietProtocol = "balance";

    // Temp variables sync
    playerState.tempStrength = playerState.strength;
    playerState.tempAgility = playerState.agility;
    playerState.tempVitality = playerState.vitality;
    playerState.tempSense = playerState.sense;
    playerState.tempIntelligence = playerState.intelligence;

    recalculateDerivedStats();
    playerState.hp = playerState.maxHp;
    playerState.mp = playerState.maxMp;

    saveStateToStorage();
    checkAppraisalRequirements();
    refreshHUD();

    spawnToast("System Ceremony", `Appraisal Confirmed! Awakened as a ${startingRank}-Rank ${CLASS_BONUSES[classChoice].name}.`, "gold");
}

// --- DYNAMIC CUSTOM GYM WORKOUTS LOGIC ---
function renderGymWorkouts() {
    const list = document.getElementById("dynamic-gym-list");
    list.innerHTML = "";

    if (playerState.gymWorkouts.length === 0) {
        list.innerHTML = `
            <div class="battle-placeholder flex-col-center" style="height: 180px;">
                <i class="fa-solid fa-circle-question placeholder-icon"></i>
                <p class="placeholder-text">NO GYM EXERCISES ADDED</p>
                <span class="placeholder-sub">Click 'Add Gym Exercise' above to customize your routine with real weights, sets, and reps!</span>
            </div>
        `;
        return;
    }

    playerState.gymWorkouts.forEach((workout) => {
        const itemEl = document.createElement("div");
        itemEl.className = "exercise-item-gym glass-panel";
        
        let setsHTML = "";
        workout.completedSets.forEach((checked, setIndex) => {
            setsHTML += `
                <div class="gym-set-row">
                    <span class="gym-set-label">Set ${setIndex + 1}</span>
                    <span class="gym-set-reps">${workout.targetReps} reps @ ${workout.targetWeight}kg</span>
                    <div class="gym-set-check ${checked ? 'checked' : ''}" data-workout-id="${workout.id}" data-set-index="${setIndex}"></div>
                </div>
            `;
        });

        itemEl.innerHTML = `
            <div class="exercise-gym-header">
                <div class="exercise-gym-title-box">
                    <span class="exercise-gym-title">${workout.name}</span>
                    <span class="exercise-gym-cat">${workout.category}</span>
                </div>
                <div class="exercise-gym-actions">
                    <button class="btn-remove-exercise" data-workout-id="${workout.id}" title="Remove Exercise">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
            
            <div class="exercise-gym-sets-progress">
                ${setsHTML}
            </div>
        `;

        // Bind Remove Button click
        itemEl.querySelector(".btn-remove-exercise").addEventListener("click", () => {
            removeGymExercise(workout.id);
        });

        // Bind Checkbox click
        itemEl.querySelectorAll(".gym-set-check").forEach(check => {
            check.addEventListener("click", () => {
                const wId = check.getAttribute("data-workout-id");
                const sIdx = parseInt(check.getAttribute("data-set-index"));
                toggleGymSet(wId, sIdx);
            });
        });

        list.appendChild(itemEl);
    });
}

function populateExerciseVariants(category) {
    const select = document.getElementById("exercise-variant");
    select.innerHTML = "";
    
    const variants = EXERCISE_CATALOG[category];
    variants.forEach(variant => {
        const opt = document.createElement("option");
        opt.value = variant;
        opt.textContent = variant;
        select.appendChild(opt);
    });
}

function addGymExercise(name, category, sets, reps, weight) {
    const newWorkout = {
        id: `gym_${Date.now()}_${Math.floor(Math.random()*100)}`,
        name,
        category,
        targetSets: sets,
        targetReps: reps,
        targetWeight: weight,
        completedSets: Array(sets).fill(false)
    };

    playerState.gymWorkouts.push(newWorkout);
    saveStateToStorage();
    refreshHUD();
    spawnToast("Exercise Added", `Injected ${name} (${sets} sets) into your Gym trials checklist!`, "blue");
}

function removeGymExercise(id) {
    playerState.gymWorkouts = playerState.gymWorkouts.filter(workout => workout.id !== id);
    saveStateToStorage();
    refreshHUD();
    spawnToast("Exercise Removed", "Gym checklist item retracted.", "blue");
}

function toggleGymSet(workoutId, setIndex) {
    const workout = playerState.gymWorkouts.find(w => w.id === workoutId);
    if (!workout) return;

    workout.completedSets[setIndex] = !workout.completedSets[setIndex];
    
    // Check if entire exercise is complete
    const allDone = workout.completedSets.every(s => s === true);
    if (allDone) {
        // Complete gym exercise rewards!
        playerState.lastGymWorkoutTimestamp = Date.now(); // reset accountability timer!
        playerState.exp += 15;
        playerState.gold += 20;

        spawnToast("Workout Complete", `Finished ${workout.name}! Earned: +15 EXP, +20 Gold. Accountability timer reset!`, "green");
        gainExperience(0); // Trigger potential level up checks
    }

    saveStateToStorage();
    refreshHUD();
}

// --- CORE SYSTEM HUD EVENT REGISTRATION ---
function registerEventListeners() {
    // Authentication login form
    document.getElementById("form-login").addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("login-username").value;
        const pass = document.getElementById("login-password").value;
        handleLogin(username, pass);
    });

    // Logout
    document.getElementById("btn-logout").addEventListener("click", () => {
        handleLogout();
    });

    // Tab buttons switching
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const contents = document.querySelectorAll(".tab-content");
            contents.forEach(content => content.classList.remove("active"));
            
            const targetId = tab.getAttribute("data-tab");
            document.getElementById(targetId).classList.add("active");
            
            if (targetId === "dungeons-tab") {
                exitActiveBattle();
            }
        });
    });

    // Custom appraisal modal ceremony submit
    document.getElementById("form-appraisal").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("appraisal-name").value;
        const age = parseInt(document.getElementById("appraisal-age").value);
        const height = parseInt(document.getElementById("appraisal-height").value);
        const weight = parseInt(document.getElementById("appraisal-weight").value);
        const activity = document.getElementById("appraisal-activity").value;
        const goal = document.getElementById("appraisal-goal").value;
        const classChoice = document.getElementById("appraisal-class").value;
        performAwakeningAppraisal(name, age, height, weight, activity, goal, classChoice);
    });

    document.getElementById("btn-recalibrate").addEventListener("click", () => {
        playerState.appraised = false;
        checkAppraisalRequirements();
    });

    // Quests difficulty toggles
    const diffBtns = document.querySelectorAll(".btn-tab-diff");
    diffBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            diffBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            playerState.difficulty = btn.getAttribute("data-diff");
            saveStateToStorage();
            refreshHUD();
            spawnToast("Difficulty Changed", `Routine targets scaled to ${playerState.difficulty.toUpperCase()} Mode.`, "blue");
        });
    });

    // Custom Exercise modal buttons triggers
    document.getElementById("btn-open-add-exercise").addEventListener("click", () => {
        const modal = document.getElementById("modal-add-exercise");
        modal.classList.remove("hidden");
        modal.style.display = "flex";
        
        // Initial catalog load
        populateExerciseVariants("chest");
    });

    document.getElementById("btn-close-exercise-modal").addEventListener("click", () => {
        const modal = document.getElementById("modal-add-exercise");
        modal.classList.add("hidden");
        modal.style.display = "none";
    });

    // Category select changes dynamically updates exercises select
    document.getElementById("exercise-category").addEventListener("change", (e) => {
        populateExerciseVariants(e.target.value);
    });

    // Form Custom exercise submit
    document.getElementById("form-add-exercise").addEventListener("submit", (e) => {
        e.preventDefault();
        const cat = document.getElementById("exercise-category").value;
        const name = document.getElementById("exercise-variant").value;
        const sets = parseInt(document.getElementById("exercise-sets").value) || 3;
        const reps = parseInt(document.getElementById("exercise-reps").value) || 10;
        const weight = parseInt(document.getElementById("exercise-weight").value) || 0;

        addGymExercise(name, cat, sets, reps, weight);

        // Close modal
        document.getElementById("modal-add-exercise").classList.add("hidden");
        document.getElementById("modal-add-exercise").style.display = "none";
    });

    // Trigger Restoration Ritual Modal button
    document.getElementById("btn-ritual-trigger").addEventListener("click", () => {
        openRestorationModal();
    });

    document.getElementById("btn-close-ritual-modal").addEventListener("click", () => {
        clearInterval(ritualMeditationTimer);
        ritualMeditationSeconds = 300;
        document.getElementById("ritual-meditation-timer").textContent = "05:00";
        document.getElementById("btn-ritual-meditate").innerHTML = '<i class="fa-solid fa-play"></i> Start Ritual Meditation';
        document.getElementById("btn-ritual-meditate").disabled = false;
        
        const modal = document.getElementById("modal-restoration");
        modal.classList.add("hidden");
        modal.style.display = "none";
    });

    document.getElementById("btn-ritual-meditate").addEventListener("click", () => {
        handleRitualMeditation();
    });

    document.getElementById("ritual-sleep").addEventListener("change", () => {
        updateRitualPurgeButton();
    });

    document.getElementById("btn-complete-ritual").addEventListener("click", () => {
        executeRitualPurge();
    });

    // Normal Meditation timer controls
    let meditationTimer = null;
    let meditationSecondsLeft = 300;
    const medRing = document.getElementById("meditation-glow-ring");
    const medDisplay = document.getElementById("meditation-timer-display");
    const medPrompt = document.getElementById("meditation-breath-prompt");
    const medStartBtn = document.getElementById("btn-meditate-start");
    const medResetBtn = document.getElementById("btn-meditate-reset");

    medStartBtn.addEventListener("click", () => {
        if (medStartBtn.innerHTML.includes("Start")) {
            medStartBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Meditation';
            medResetBtn.classList.remove("hidden");
            medRing.classList.add("pulsing");
            
            meditationTimer = setInterval(() => {
                meditationSecondsLeft--;
                
                const breathePhase = meditationSecondsLeft % 8;
                if (breathePhase >= 4) {
                    medPrompt.textContent = "Breathe Out (Release Mana)";
                } else {
                    medPrompt.textContent = "Breathe In (Gather Mana)";
                }

                const mins = Math.floor(meditationSecondsLeft / 60).toString().padStart(2, '0');
                const secs = (meditationSecondsLeft % 60).toString().padStart(2, '0');
                medDisplay.textContent = `${mins}:${secs}`;

                if (meditationSecondsLeft <= 0) {
                    clearInterval(meditationTimer);
                    playerState.holistic.meditation = true;
                    medStartBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Mana Concentrated';
                    medStartBtn.disabled = true;
                    medResetBtn.classList.add("hidden");
                    medRing.classList.remove("pulsing");
                    medPrompt.textContent = "Core Stabilized";
                    saveStateToStorage();
                    refreshHUD();
                    spawnToast("System Awakening", "Daily meditation complete! Core mind energy reinforced.", "gold");
                }
            }, 1000);
        } else {
            clearInterval(meditationTimer);
            medStartBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Meditation';
            medRing.classList.remove("pulsing");
        }
    });

    medResetBtn.addEventListener("click", () => {
        clearInterval(meditationTimer);
        meditationSecondsLeft = 300;
        medDisplay.textContent = "05:00";
        medPrompt.textContent = "Focus Mana";
        medRing.classList.remove("pulsing");
        medStartBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Meditation';
        medStartBtn.disabled = false;
        medResetBtn.classList.add("hidden");
    });

    // Checkboxes change triggers
    document.getElementById("quest-check-diet").addEventListener("change", (e) => {
        playerState.holistic.diet = e.target.checked;
        saveStateToStorage();
        refreshHUD();
    });

    document.getElementById("quest-check-sleep").addEventListener("change", (e) => {
        playerState.holistic.sleep = e.target.checked;
        saveStateToStorage();
        refreshHUD();
    });

    // Claim rewards button triggers
    document.getElementById("btn-complete-quest").addEventListener("click", () => {
        claimQuestRewards();
    });

    // Attribute points allocation
    const statTypes = ["str", "agi", "vit", "sen", "int"];
    statTypes.forEach(stat => {
        const decBtn = document.querySelector(`.btn-stat-dec[data-stat="${stat}"]`);
        const incBtn = document.querySelector(`.btn-stat-inc[data-stat="${stat}"]`);

        decBtn.addEventListener("click", () => {
            const baseStatVal = playerState[stat];
            let tempVal = playerState[`temp${stat.charAt(0).toUpperCase() + stat.slice(1)}`];
            
            if (tempVal > baseStatVal) {
                tempVal--;
                playerState[`temp${stat.charAt(0).toUpperCase() + stat.slice(1)}`] = tempVal;
                playerState.allocatedPoints++;
                updateStatsAllocationTab();
            }
        });

        incBtn.addEventListener("click", () => {
            if (playerState.allocatedPoints > 0) {
                playerState.allocatedPoints--;
                playerState[`temp${stat.charAt(0).toUpperCase() + stat.slice(1)}`]++;
                updateStatsAllocationTab();
            }
        });
    });

    // Apply Stat permanent confirmations
    document.getElementById("btn-apply-stats").addEventListener("click", () => {
        playerState.strength = playerState.tempStrength;
        playerState.agility = playerState.tempAgility;
        playerState.vitality = playerState.tempVitality;
        playerState.sense = playerState.tempSense;
        playerState.intelligence = playerState.tempIntelligence;
        
        recalculateDerivedStats();
        playerState.hp = playerState.maxHp;
        playerState.mp = playerState.maxMp;

        saveStateToStorage();
        refreshHUD();
        spawnToast("System Update", "Your attribute stats have been permanently locked and reinforced.", "blue");
    });

    // Selector diet regimen change
    document.getElementById("diet-protocol-selector").addEventListener("change", (e) => {
        playerState.dietProtocol = e.target.value;
        saveStateToStorage();
        renderDietRegimen();
        spawnToast("Diet Shifted", `Macros updated to match: ${DIET_MANUALS[e.target.value].title}`, "blue");
    });

    // Log food macros
    document.getElementById("form-log-food").addEventListener("submit", (e) => {
        e.preventDefault();
        const cal = parseInt(document.getElementById("food-calories").value) || 0;
        const prot = parseInt(document.getElementById("food-protein").value) || 0;
        const carb = parseInt(document.getElementById("food-carbs").value) || 0;
        const fat = parseInt(document.getElementById("food-fats").value) || 0;

        playerState.caloriesEaten += cal;
        playerState.proteinEaten += prot;
        playerState.carbsEaten += carb;
        playerState.fatsEaten += fat;

        document.getElementById("food-calories").value = "";
        document.getElementById("food-protein").value = "";
        document.getElementById("food-carbs").value = "";
        document.getElementById("food-fats").value = "";

        saveStateToStorage();
        refreshHUD();
        spawnToast("Food Eaten Logged", `Registered: +${cal} kcal, +${prot}g Protein.`, "green");
    });

    document.getElementById("btn-reset-nutrition").addEventListener("click", () => {
        playerState.caloriesEaten = 0;
        playerState.proteinEaten = 0;
        playerState.carbsEaten = 0;
        playerState.fatsEaten = 0;
        saveStateToStorage();
        refreshHUD();
    });

    // Hydration water add logs
    document.querySelectorAll(".btn-water").forEach(btn => {
        btn.addEventListener("click", () => {
            const amount = parseInt(btn.getAttribute("data-amount"));
            playerState.waterLogged += amount;
            
            // Check dynamic water checklist progress
            if (playerState.waterLogged >= playerState.waterTarget) {
                playerState.holistic.water = true;
            }

            saveStateToStorage();
            refreshHUD();
            
            // If inside restoration ritual modal, update the checks live!
            const restorationHydration = document.getElementById("ritual-hydration");
            if (restorationHydration) {
                const reachedRitualWater = playerState.waterLogged >= 3000;
                restorationHydration.checked = reachedRitualWater;
                document.getElementById("ritual-water-progress").textContent = `${playerState.waterLogged} / 3000`;
                updateRitualPurgeButton();
            }

            spawnToast("Hydration Logged", `Absorbed elixir: +${amount} ml. Cellular status replenished.`, "blue");
        });
    });

    document.getElementById("btn-water-reset").addEventListener("click", () => {
        playerState.waterLogged = 0;
        saveStateToStorage();
        refreshHUD();
    });

    // Dungeon battles gates triggers
    document.querySelectorAll(".btn-enter-gate").forEach(btn => {
        btn.addEventListener("click", () => {
            const rank = btn.getAttribute("data-gate-rank");
            initiateGateRaid(rank);
        });
    });

    // Gacha chests open
    document.querySelectorAll(".btn-open-box").forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.getAttribute("data-chest-type");
            triggerGachaChest(type);
        });
    });

    // Shop purchase
    document.getElementById("btn-buy-hp").addEventListener("click", () => purchaseItem("hp_potion", 50));
    document.getElementById("btn-buy-mp").addEventListener("click", () => purchaseItem("mp_potion", 50));
    document.getElementById("btn-buy-key-e").addEventListener("click", () => purchaseItem("key_e", 100));
    document.getElementById("btn-buy-key-c").addEventListener("click", () => purchaseItem("key_c", 500));

    // Developer override simulation buttons
    document.getElementById("dev-miss-gym").addEventListener("click", () => {
        simulateGymMiss();
    });
    
    document.getElementById("dev-time-skip").addEventListener("click", () => {
        triggerDailyReset();
    });
}

// --- DYNAMIC REFRESH ENGINE (DOM SYNC) ---
function refreshHUD() {
    if (!playerState.authenticated) return;

    // 1. Sidebar profile card updates
    document.getElementById("hud-hunter-rank").textContent = playerState.rank;
    document.getElementById("hud-player-name").textContent = playerState.name;
    
    const classTag = CLASS_BONUSES[playerState.class] ? CLASS_BONUSES[playerState.class].name : "Hunter";
    document.getElementById("hud-player-title").textContent = `${classTag} (${playerState.title})`;
    
    document.getElementById("hud-level-value").textContent = playerState.level;
    document.getElementById("hud-exp-value").textContent = `${playerState.exp} / ${playerState.expNeeded}`;
    
    const expFillPercent = Math.min(100, (playerState.exp / playerState.expNeeded) * 100);
    document.getElementById("hud-exp-fill").style.width = `${expFillPercent}%`;

    document.getElementById("hud-hp-value").textContent = `${playerState.hp} / ${playerState.maxHp}`;
    const hpPercent = Math.min(100, (playerState.hp / playerState.maxHp) * 100);
    document.getElementById("hud-hp-fill").style.width = `${hpPercent}%`;

    document.getElementById("hud-mp-value").textContent = `${playerState.mp} / ${playerState.maxMp}`;
    const mpPercent = Math.min(100, (playerState.mp / playerState.maxMp) * 100);
    document.getElementById("hud-mp-fill").style.width = `${mpPercent}%`;

    document.getElementById("hud-gold").textContent = `${playerState.gold} G`;
    document.getElementById("hud-guild").textContent = playerState.guild;

    // Sync Trial Deficit alert banner card
    const deficitBanner = document.getElementById("trial-deficit-banner");
    if (playerState.hasTrialDeficit) {
        deficitBanner.classList.remove("hidden");
    } else {
        deficitBanner.classList.add("hidden");
    }

    // 2. Status Appraisal Panel
    document.getElementById("status-bmi").textContent = playerState.bmi;
    
    const bmiCategoryEl = document.getElementById("status-bmi-category");
    if (playerState.bmi < 18.5) {
        bmiCategoryEl.textContent = "Underweight";
        bmiCategoryEl.className = "metric-sub text-glow-red";
    } else if (playerState.bmi >= 18.5 && playerState.bmi < 25.0) {
        bmiCategoryEl.textContent = "Normal Weight";
        bmiCategoryEl.className = "metric-sub text-glow-green";
    } else if (playerState.bmi >= 25.0 && playerState.bmi < 30.0) {
        bmiCategoryEl.textContent = "Overweight";
        bmiCategoryEl.className = "metric-sub text-glow-purple";
    } else {
        bmiCategoryEl.textContent = "Obese";
        bmiCategoryEl.className = "metric-sub text-glow-red";
    }

    document.getElementById("status-bmr").textContent = playerState.bmr.toLocaleString();
    document.getElementById("status-tdee").textContent = playerState.tdee.toLocaleString();
    document.getElementById("status-ideal-weight").textContent = playerState.idealWeight;
    document.getElementById("status-height").textContent = `${playerState.height} cm`;
    document.getElementById("status-weight").textContent = `${playerState.weight} kg`;
    
    let activityText = "Sedentary";
    if (playerState.activityLevel === "light") activityText = "Lightly Active";
    else if (playerState.activityLevel === "moderate") activityText = "Moderately Active";
    else if (playerState.activityLevel === "heavy") activityText = "Highly Active / Athletic";
    document.getElementById("status-activity-lvl").textContent = activityText;

    let goalText = "Optimal Health (Balanced Plan)";
    if (playerState.goal === "bulk") goalText = "Muscle Gain (Monarch's Bulk)";
    else if (playerState.goal === "stealth") goalText = "Fat Loss (Shadow Stealth)";
    document.getElementById("status-core-goal").textContent = goalText;

    // Load active title
    const titleObj = TITLES.reduce((acc, curr) => (playerState.level >= curr.minLvl ? curr : acc), TITLES[0]);
    playerState.title = titleObj.name;
    document.getElementById("status-active-title").textContent = `${CLASS_BONUSES[playerState.class].name} - ${titleObj.name}`;
    document.getElementById("status-title-desc").textContent = `${CLASS_BONUSES[playerState.class].desc} ${titleObj.desc}`;

    // Difficulty updates in Status Tab
    let activeDiffText = "Easy Mode (E-Rank)";
    let activeDiffDesc = "Recommended for recovery, conditioning, or beginners. Earns +1 Stat Point upon daily completion.";
    if (playerState.difficulty === "medium") {
        activeDiffText = "Medium Mode (B-Rank)";
        activeDiffDesc = "An intermediate routine testing your mental limits. Earns +2 Stat Points upon daily completion.";
    } else if (playerState.difficulty === "hard") {
        activeDiffText = "Hard Mode (Monarch / S-Rank)";
        activeDiffDesc = "The legendary regime to rebuild your absolute muscular core. Earns +3 Stat Points upon daily completion.";
    }
    document.getElementById("status-current-difficulty-name").textContent = activeDiffText;
    document.getElementById("status-difficulty-desc").textContent = activeDiffDesc;

    // 3. Quests Panel Sync & Custom exercise list rendering
    renderGymWorkouts();

    // Holistic checklist checks
    document.getElementById("quest-check-diet").checked = playerState.holistic.diet;
    document.getElementById("quest-check-sleep").checked = playerState.holistic.sleep;
    
    const waterCheckbox = document.getElementById("quest-check-water");
    const isWaterDone = playerState.waterLogged >= playerState.waterTarget;
    waterCheckbox.checked = isWaterDone;
    document.getElementById("quest-water-progress").textContent = `${playerState.waterLogged} / ${playerState.waterTarget}`;

    // Claim Quest rewards button conditions
    const gymWorkoutsDone = playerState.gymWorkouts.length > 0 && playerState.gymWorkouts.every(workout => 
        workout.completedSets.every(s => s === true)
    );

    const holisticDone = 
        playerState.holistic.diet &&
        playerState.holistic.meditation &&
        playerState.holistic.sleep &&
        isWaterDone;

    const completeBtn = document.getElementById("btn-complete-quest");
    if (gymWorkoutsDone && holisticDone && !playerState.questCompletedToday) {
        completeBtn.disabled = false;
        completeBtn.classList.remove("disabled");
    } else {
        completeBtn.disabled = true;
        completeBtn.classList.add("disabled");
        if (playerState.questCompletedToday) {
            completeBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> GYM TRIALS COMMITTED FOR TODAY';
        } else {
            completeBtn.innerHTML = '<i class="fa-solid fa-award"></i> CLAIM REWARD CHESTS';
        }
    }

    // 4. Stats Allocation Panel Sync
    updateStatsAllocationTab();

    // 5. Nourishment & Hydration Panel Sync
    document.getElementById("nutrition-current-calories").textContent = playerState.caloriesEaten;
    document.getElementById("nutrition-target-calories").textContent = playerState.tdee;
    
    const calPct = Math.min(100, (playerState.caloriesEaten / playerState.tdee) * 100);
    document.getElementById("calorie-ring-fill").style.transform = `rotate(${(calPct * 3.6) - 45}deg)`;

    // Macros
    let proteinTarget = Math.round(playerState.weight * 2.0);
    if (playerState.dietProtocol === "stealth") proteinTarget = Math.round(playerState.weight * 2.2);
    
    const proteinKcal = proteinTarget * 4;
    const remainingKcal = playerState.tdee - proteinKcal;
    let carbTarget = Math.round((remainingKcal * 0.5) / 4);
    let fatTarget = Math.round((remainingKcal * 0.5) / 9);

    if (playerState.dietProtocol === "bulk") {
        carbTarget = Math.round((remainingKcal * 0.6) / 4);
        fatTarget = Math.round((remainingKcal * 0.4) / 9);
    } else if (playerState.dietProtocol === "stealth") {
        carbTarget = Math.round((remainingKcal * 0.3) / 4);
        fatTarget = Math.round((remainingKcal * 0.7) / 9);
    }

    document.getElementById("macro-prot-target").textContent = proteinTarget;
    document.getElementById("macro-prot-curr").textContent = playerState.proteinEaten;
    const protPct = Math.min(100, (playerState.proteinEaten / proteinTarget) * 100);
    document.getElementById("macro-prot-fill").style.width = `${protPct}%`;

    document.getElementById("macro-carb-target").textContent = carbTarget;
    document.getElementById("macro-carb-curr").textContent = playerState.carbsEaten;
    const carbPct = Math.min(100, (playerState.carbsEaten / carbTarget) * 100);
    document.getElementById("macro-carb-fill").style.width = `${carbPct}%`;

    document.getElementById("macro-fat-target").textContent = fatTarget;
    document.getElementById("macro-fat-curr").textContent = playerState.fatsEaten;
    const fatPct = Math.min(100, (playerState.fatsEaten / fatTarget) * 100);
    document.getElementById("macro-fat-fill").style.width = `${fatPct}%`;

    // Hydration Glass level visual
    document.getElementById("hydration-current").textContent = playerState.waterLogged;
    document.getElementById("hydration-target").textContent = playerState.waterTarget.toLocaleString();
    const waterPct = Math.min(100, (playerState.waterLogged / playerState.waterTarget) * 100);
    document.getElementById("water-fill-level").style.height = `${waterPct}%`;

    // Diet Protocol selector sync
    document.getElementById("diet-protocol-selector").value = playerState.dietProtocol;
    renderDietRegimen();

    // 6. Inventory & Chests Sync
    document.getElementById("inventory-gold-val").textContent = `${playerState.gold} G`;
    document.getElementById("chest-count-bronze").textContent = playerState.chests.bronze;
    document.getElementById("chest-count-silver").textContent = playerState.chests.silver;
    document.getElementById("chest-count-gold").textContent = playerState.chests.gold;

    renderInventoryGrid();

    // 7. Intellectual Trials Subsystem HUD Updates
    refreshIntellectualHUD();
}

function updateStatsAllocationTab() {
    document.getElementById("stat-available-points").textContent = playerState.allocatedPoints;

    document.getElementById("stat-str-val").textContent = playerState.tempStrength;
    document.getElementById("stat-agi-val").textContent = playerState.tempAgility;
    document.getElementById("stat-vit-val").textContent = playerState.tempVitality;
    document.getElementById("stat-sen-val").textContent = playerState.tempSense;
    document.getElementById("stat-int-val").textContent = playerState.tempIntelligence;

    // Show Apply Button state
    const applyBtn = document.getElementById("btn-apply-stats");
    const pointsChanged = 
        playerState.tempStrength !== playerState.strength ||
        playerState.tempAgility !== playerState.agility ||
        playerState.tempVitality !== playerState.vitality ||
        playerState.tempSense !== playerState.sense ||
        playerState.tempIntelligence !== playerState.intelligence;

    if (pointsChanged && playerState.allocatedPoints === 0) {
        applyBtn.disabled = false;
        applyBtn.classList.remove("disabled");
    } else {
        applyBtn.disabled = true;
        applyBtn.classList.add("disabled");
    }

    // Dynamic combat stats - affected by 20% exhaustion debuff if behind trials!
    const decayMultiplier = playerState.hasTrialDeficit ? 0.8 : 1.0;

    const physicalAtk = Math.round((playerState.tempStrength * 2) * decayMultiplier);
    const critRate = 5 + (playerState.tempSense * 0.25);
    const evasion = Math.round((3 + (playerState.tempAgility * 0.25)) * decayMultiplier);
    const mitigation = playerState.tempVitality * 1;
    const shadowLimit = Math.floor(playerState.tempIntelligence / 15);

    document.getElementById("combat-atk").textContent = playerState.hasTrialDeficit ? `${physicalAtk} [EXHAUSTED]` : physicalAtk;
    document.getElementById("combat-crit").textContent = `${critRate.toFixed(1)}%`;
    document.getElementById("combat-dodge").textContent = playerState.hasTrialDeficit ? `${evasion.toFixed(1)}% [EXHAUSTED]` : `${evasion.toFixed(1)}%`;
    document.getElementById("combat-def").textContent = mitigation;
    document.getElementById("combat-shadow-limit").textContent = `${shadowLimit} Shadow Soldiers`;
}

function renderDietRegimen() {
    const dietObj = DIET_MANUALS[playerState.dietProtocol];
    const container = document.getElementById("diet-instructions-content");
    
    let html = `
        <h4>${dietObj.title}</h4>
        <p>${dietObj.desc}</p>
        <ul>
    `;
    dietObj.rules.forEach(rule => {
        html += `<li>${rule}</li>`;
    });
    html += `</ul>`;
    
    container.innerHTML = html;
}

function renderInventoryGrid() {
    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = "";

    // 16 slots default
    for (let i = 0; i < 16; i++) {
        const slotEl = document.createElement("div");
        slotEl.className = "inventory-slot glass-panel";
        
        if (playerState.inventory[i]) {
            const item = playerState.inventory[i];
            
            let weaponBonusText = "";
            if (item.id === "monarch_dagger") weaponBonusText = "\nBonuses: +75 STR, +20 AGI, +15 SEN";
            else if (item.id === "demon_shortsword") weaponBonusText = "\nBonuses: +35 STR, +10 SEN";
            else if (item.id === "kasaka_fang") weaponBonusText = "\nBonuses: +15 STR";
            else if (item.id === "steel_dagger") weaponBonusText = "\nBonuses: +5 STR, +2 AGI";

            slotEl.innerHTML = `
                <i class="fa-solid ${item.icon}"></i>
                <span class="slot-qty">${item.qty}</span>
            `;
            slotEl.setAttribute("data-tooltip", `${item.name}\n[${item.type.toUpperCase()}]\n${item.desc}${weaponBonusText}`);
            
            slotEl.addEventListener("click", () => {
                useConsumableItem(item.id);
            });
        }
        grid.appendChild(slotEl);
    }
}

// --- STATS ATTRIBUTES SCALE FORMULAS ---
function recalculateDerivedStats() {
    playerState.maxHp = 50 + (playerState.vitality * 10);
    playerState.maxMp = 20 + (playerState.intelligence * 5);
}

// --- QUEST REWARDS CLAIM ---
function claimQuestRewards() {
    if (playerState.questCompletedToday) return;

    const config = DIFFICULTY_CONFIG[playerState.difficulty];
    
    // Award stats & chests
    playerState.allocatedPoints += config.points;
    playerState.chests[config.chest]++;
    
    const expGained = playerState.difficulty === "easy" ? 30 : playerState.difficulty === "medium" ? 80 : 150;
    const goldGained = playerState.difficulty === "easy" ? 50 : playerState.difficulty === "medium" ? 150 : 300;
    
    playerState.gold += goldGained;
    playerState.questCompletedToday = true;

    spawnToast("Daily Trials Done", `Claimed: +${config.points} Stat Points, +${goldGained} Gold, +1 ${config.chest.toUpperCase()} Box.`, "gold");
    gainExperience(expGained);
}

function gainExperience(amount) {
    playerState.exp += amount;
    
    while (playerState.exp >= playerState.expNeeded) {
        playerState.exp -= playerState.expNeeded;
        playerState.level++;
        playerState.expNeeded = Math.round(100 * Math.pow(1.15, playerState.level - 1));
        
        // Level up bonus point allocation
        playerState.allocatedPoints += 5;
        
        playerState.hp = playerState.maxHp;
        playerState.mp = playerState.maxMp;

        spawnToast("LEVEL UP", `Core limit surpassed! Level: ${playerState.level}. Received +5 Points!`, "gold");
        triggerLevelUpOverlay();
    }
    
    saveStateToStorage();
    refreshHUD();
}

function triggerLevelUpOverlay() {
    const splash = document.createElement("div");
    splash.className = "modal-backdrop flex-col-center animated-zoom";
    splash.style.zIndex = "99999";
    splash.innerHTML = `
        <h1 class="orbitron-text text-glow-gold" style="font-size: 54px; letter-spacing: 4px; font-weight:900; animation: flashRed 1.5s step-end infinite;">LEVEL UP</h1>
        <p class="orbitron-text text-glow-blue mt-sm" style="font-size: 20px; font-weight:bold;">THE SYSTEM REINFORCES YOUR CORE MATRICES</p>
        <button class="btn btn-warning btn-lg mt-lg" onclick="this.parentElement.remove()">CONTINUE RAIDS</button>
    `;
    document.body.appendChild(splash);
}

// --- ITEM SYSTEM ---
function useConsumableItem(itemId) {
    const idx = playerState.inventory.findIndex(item => item.id === itemId);
    if (idx === -1) return;

    const item = playerState.inventory[idx];
    if (item.type !== "consumable") return;

    if (itemId === "hp_potion") {
        if (playerState.hp >= playerState.maxHp) {
            spawnToast("System Info", "Your health pool is already full.", "blue");
            return;
        }
        playerState.hp = Math.min(playerState.maxHp, playerState.hp + 50);
        spawnToast("Consumable Used", "Consumed Health Potion. Restored 50 HP.", "green");
    } else if (itemId === "mp_potion") {
        if (playerState.mp >= playerState.maxMp) {
            spawnToast("System Info", "Your mana reserves are already fully saturated.", "blue");
            return;
        }
        playerState.mp = Math.min(playerState.maxMp, playerState.mp + 25);
        spawnToast("Consumable Used", "Consumed Mana Potion. Restored 25 MP.", "purple");
    } else if (itemId === "elixir_life") {
        playerState.hp = playerState.maxHp;
        playerState.mp = playerState.maxMp;
        spawnToast("Divine Consumable Used", "Consumed Elixir of Life. Health and Mana pools fully saturated!", "gold");
    } else if (itemId === "kasaka_venom") {
        playerState.strength += 1;
        playerState.tempStrength += 1;
        playerState.vitality = Math.max(1, playerState.vitality - 1);
        playerState.tempVitality = Math.max(1, playerState.tempVitality - 1);
        recalculateDerivedStats();
        spawnToast("Toxin Absorbed", "Kasaka's Venom consumed. Received permanent +1 Strength and -1 Vitality.", "purple");
    }

    item.qty--;
    if (item.qty <= 0) {
        playerState.inventory.splice(idx, 1);
    }

    saveStateToStorage();
    refreshHUD();
}

function purchaseItem(itemId, price) {
    if (playerState.gold < price) {
        spawnToast("System Error", "Insufficient gold reserves to complete trade.", "red");
        return;
    }

    playerState.gold -= price;
    
    const existing = playerState.inventory.find(item => item.id === itemId);
    if (existing) {
        existing.qty++;
    } else {
        let name = "Consumable", icon = "fa-box", desc = "System drop item", type = "consumable";
        if (itemId === "hp_potion") { name = "Health Potion"; icon = "fa-flask"; desc = "Heals 50 HP instantly."; }
        else if (itemId === "mp_potion") { name = "Mana Potion"; icon = "fa-vial"; desc = "Restores 25 MP instantly."; }
        else if (itemId === "key_e") { name = "E-Rank Dungeon Key"; icon = "fa-key"; desc = "Goblin Gate access key."; type = "key"; }
        else if (itemId === "key_c") { name = "C-Rank Dungeon Key"; icon = "fa-key"; desc = "Orc Stronghold access key."; type = "key"; }
        
        playerState.inventory.push({ id: itemId, name, type, qty: 1, icon, desc });
    }

    saveStateToStorage();
    refreshHUD();
    spawnToast("Trade Confirmed", `Purchased 1x ${itemId.toUpperCase().replace("_", " ")} for ${price} Gold.`, "gold");
}

// --- GACHA REWARD CHEST OPENER ---
function triggerGachaChest(chestType) {
    if (playerState.chests[chestType] <= 0) {
        spawnToast("Extraction Failed", `No unopened ${chestType.toUpperCase()} reward boxes in your vaults.`, "red");
        return;
    }

    playerState.chests[chestType]--;
    saveStateToStorage();
    refreshHUD();

    const modal = document.getElementById("modal-gacha");
    modal.classList.remove("hidden");
    modal.style.display = "flex";

    const chestTitle = document.getElementById("gacha-chest-title");
    const chestIcon = document.getElementById("gacha-chest-icon");
    const animState = document.getElementById("gacha-animation-state");
    const rewardState = document.getElementById("gacha-reward-state");

    chestTitle.textContent = `${chestType.toUpperCase()} REWARD CHEST`;
    chestIcon.className = `fa-solid fa-box chest-opening-animation ${chestType}-chest shaking`;
    animState.classList.remove("hidden");
    rewardState.classList.add("hidden");

    const triggerBtn = document.getElementById("btn-gacha-trigger");
    const newTriggerBtn = triggerBtn.cloneNode(true);
    triggerBtn.parentNode.replaceChild(newTriggerBtn, triggerBtn);

    newTriggerBtn.addEventListener("click", () => {
        chestIcon.classList.remove("shaking");
        chestIcon.className = "fa-solid fa-box-open chest-opening-animation text-glow-gold";
        
        setTimeout(() => {
            animState.classList.add("hidden");
            rewardState.classList.remove("hidden");
            
            const rewardItem = extractRandomLoot(chestType);
            
            document.getElementById("reward-item-icon").className = `fa-solid ${rewardItem.icon} reward-item-icon`;
            document.getElementById("reward-item-name").textContent = rewardItem.name;
            document.getElementById("reward-item-rarity").textContent = `${rewardItem.type.toUpperCase()}`;
            document.getElementById("reward-item-desc").textContent = rewardItem.desc;

            // Save to inventory
            const existing = playerState.inventory.find(item => item.id === rewardItem.id);
            if (existing) {
                existing.qty += rewardItem.qty;
            } else {
                playerState.inventory.push(rewardItem);
            }

            saveStateToStorage();
            refreshHUD();
        }, 1000);
    });

    const closeBtn = document.getElementById("btn-gacha-close");
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    newCloseBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.style.display = "none";
    });
}

function extractRandomLoot(chestType) {
    const list = LOOT_CHANCE_ROSTER[chestType];
    const totalWeight = list.reduce((sum, current) => sum + current.weight, 0);
    
    let roll = Math.random() * totalWeight;
    for (let i = 0; i < list.length; i++) {
        if (roll < list[i].weight) {
            return JSON.parse(JSON.stringify(list[i].item));
        }
        roll -= list[i].weight;
    }
    return JSON.parse(JSON.stringify(list[0].item));
}

// --- DUNGEON ACTIVE COMBAT ENGINE ---
let activeRaid = null;

function initiateGateRaid(rank) {
    const monsterObj = DUNGEON_MONSTERS[rank];
    let minLvl = 1;
    if (rank === "D") minLvl = 10;
    else if (rank === "C") minLvl = 25;
    else if (rank === "B") minLvl = 45;
    else if (rank === "S") minLvl = 75;

    if (playerState.level < minLvl) {
        spawnToast("Access Denied", `Your magical essence is too weak. Minimum level required: ${minLvl}.`, "red");
        return;
    }

    const keyIdx = playerState.inventory.findIndex(item => item.id === monsterObj.keyId);
    if (keyIdx === -1) {
        spawnToast("Access Denied", `You do not hold the required ${rank}-Rank Dungeon Key.`, "red");
        return;
    }

    playerState.inventory[keyIdx].qty--;
    if (playerState.inventory[keyIdx].qty <= 0) {
        playerState.inventory.splice(keyIdx, 1);
    }
    saveStateToStorage();
    refreshHUD();

    activeRaid = {
        rank: rank,
        bossName: monsterObj.name,
        bossHp: monsterObj.hp,
        bossMaxHp: monsterObj.hp,
        bossAtk: monsterObj.atk,
        goldReward: monsterObj.gold,
        expReward: monsterObj.exp
    };

    document.getElementById("battle-pre-screen").classList.add("hidden");
    document.getElementById("battle-active-screen").classList.remove("hidden");
    document.getElementById("battle-boss-name").textContent = activeRaid.bossName;
    
    updateBattleDisplays();

    const feed = document.getElementById("battle-log-feed");
    feed.innerHTML = `<div class="feed-entry system-msg"><i class="fa-solid fa-skull"></i> Entered Gate [Rank ${rank}]. A colossal ${activeRaid.bossName} approaches!</div>`;
    
    if (playerState.hasTrialDeficit) {
        logCombatFeed("WARNING: Your core matrices are EXHAUSTED due to missing gym trials! Combat capacity reduced by 20%!", "defeat");
    }

    spawnToast("Gate Open", `Dimensional rift opened. Slay the ${activeRaid.bossName}!`, "red");
    setupBattleControls();
}

function updateBattleDisplays() {
    if (!activeRaid) return;

    document.getElementById("battle-player-hp-text").textContent = `${playerState.hp} / ${playerState.maxHp} HP`;
    const playerHpPct = Math.max(0, Math.min(100, (playerState.hp / playerState.maxHp) * 100));
    document.getElementById("battle-player-hp").style.width = `${playerHpPct}%`;

    document.getElementById("battle-boss-hp-text").textContent = `${activeRaid.bossHp} / ${activeRaid.bossMaxHp} HP`;
    const bossHpPct = Math.max(0, Math.min(100, (activeRaid.bossHp / activeRaid.bossMaxHp) * 100));
    document.getElementById("battle-boss-hp").style.width = `${bossHpPct}%`;
}

function setupBattleControls() {
    const attackBtn = document.getElementById("btn-battle-attack");
    const skillBtn = document.getElementById("btn-battle-skill");
    const healBtn = document.getElementById("btn-battle-heal");
    const fleeBtn = document.getElementById("btn-battle-flee");

    const newAttack = attackBtn.cloneNode(true);
    attackBtn.parentNode.replaceChild(newAttack, attackBtn);

    const newSkill = skillBtn.cloneNode(true);
    skillBtn.parentNode.replaceChild(newSkill, skillBtn);

    const newHeal = healBtn.cloneNode(true);
    healBtn.parentNode.replaceChild(newHeal, healBtn);

    const newFlee = fleeBtn.cloneNode(true);
    fleeBtn.parentNode.replaceChild(newFlee, fleeBtn);

    newAttack.addEventListener("click", () => triggerPlayerTurn("attack"));
    newSkill.addEventListener("click", () => triggerPlayerTurn("skill"));
    
    newHeal.addEventListener("click", () => {
        const hpIdx = playerState.inventory.findIndex(item => item.id === "hp_potion");
        if (hpIdx === -1) {
            logCombatFeed("No Health Potions left in inventory!", "defeat");
            return;
        }
        useConsumableItem("hp_potion");
        updateBattleDisplays();
        logCombatFeed("Consumed Health Potion. Core health restored (+50 HP).", "system-msg");
        
        triggerBossCounterAttack();
    });

    newFlee.addEventListener("click", () => {
        logCombatFeed("Fled Gate anomaly. Gold deducted in retreat (-50 Gold).", "defeat");
        playerState.gold = Math.max(0, playerState.gold - 50);
        setTimeout(exitActiveBattle, 2000);
    });
}

function triggerPlayerTurn(actionType) {
    if (!activeRaid) return;

    let dmg = 0;
    let crit = false;

    let weaponBonusDmg = 0;
    let weaponBonusCrit = 0;
    let weaponBonusDodge = 0;

    const weaponItem = playerState.inventory.find(item => item.type === "weapon");
    if (weaponItem) {
        if (weaponItem.id === "monarch_dagger") { weaponBonusDmg = 75; weaponBonusCrit = 15; weaponBonusDodge = 20; }
        else if (weaponItem.id === "demon_shortsword") { weaponBonusDmg = 35; weaponBonusCrit = 10; }
        else if (weaponItem.id === "kasaka_fang") { weaponBonusDmg = 15; }
        else if (weaponItem.id === "steel_dagger") { weaponBonusDmg = 5; weaponBonusDodge = 2; }
    }

    // Apply exhaustion debuff
    const decayMultiplier = playerState.hasTrialDeficit ? 0.8 : 1.0;

    // Cognitive rank damage multiplier
    let cognitiveDmgMultiplier = 1.0;
    const iq = playerState.iqScore || 80;
    if (iq >= 160) cognitiveDmgMultiplier = 1.35; // S-Rank
    else if (iq >= 140) cognitiveDmgMultiplier = 1.20; // A-Rank
    else if (iq >= 125) cognitiveDmgMultiplier = 1.15; // B-Rank
    else if (iq >= 110) cognitiveDmgMultiplier = 1.10; // C-Rank
    else if (iq >= 90) cognitiveDmgMultiplier = 1.05;  // D-Rank

    const playerAtk = Math.round(((playerState.strength * 2) + weaponBonusDmg) * decayMultiplier * cognitiveDmgMultiplier);
    const critChance = 5 + (playerState.sense * 0.25) + weaponBonusCrit;

    if (actionType === "attack") {
        dmg = playerAtk + Math.floor(Math.random() * 6);
        crit = Math.random() * 100 < critChance;
        if (crit) {
            // Sense increases Critical Strike Damage (+0.5% per point of SEN)
            const critMult = 2.0 + (playerState.sense * 0.005);
            dmg = Math.round(dmg * critMult);
        }
        logCombatFeed(`You strike the ${activeRaid.bossName}. Dealt ${dmg} damage.${crit ? " [CRITICAL IMPACT]" : ""}`, crit ? "critical" : "damage-dealt");
    } else if (actionType === "skill") {
        if (playerState.mp < 15) {
            logCombatFeed("Insufficient Mana pool to trigger Shadow Strike!", "defeat");
            return;
        }
        playerState.mp -= 15;
        // Intelligence boosts magical damage scaling (+2 per point of INT)
        dmg = Math.round((playerAtk * 2.5) + (playerState.intelligence * 2)) + Math.floor(Math.random() * 10);
        logCombatFeed(`Shadows reinforce your blade! Executed Shadow Strike on ${activeRaid.bossName} for ${dmg} damage!`, "critical");
    }

    activeRaid.bossHp = Math.max(0, activeRaid.bossHp - dmg);
    updateBattleDisplays();
    saveStateToStorage();
    refreshHUD();

    if (activeRaid.bossHp <= 0) {
        triggerRaidVictory();
    } else {
        setTimeout(triggerBossCounterAttack, 800);
    }
}

function triggerBossCounterAttack() {
    if (!activeRaid) return;

    const decayMultiplier = playerState.hasTrialDeficit ? 0.8 : 1.0;
    
    let evasionChance = 3 + (playerState.agility * 0.25);
    const weaponItem = playerState.inventory.find(item => item.type === "weapon");
    if (weaponItem) {
        if (weaponItem.id === "monarch_dagger") evasionChance += 20;
        else if (weaponItem.id === "steel_dagger") evasionChance += 2;
    }
    
    // Exhaustion penalties dodge
    evasionChance = Math.round(evasionChance * decayMultiplier);

    const dodge = Math.random() * 100 < evasionChance;

    if (dodge) {
        logCombatFeed(`The ${activeRaid.bossName} counter-attacks, but you slip into the shadows and EVADE!`, "victory");
    } else {
        const damageReduction = playerState.vitality * 1;
        const baseDmg = activeRaid.bossAtk + Math.floor(Math.random() * 6);
        const finalDmg = Math.max(3, baseDmg - damageReduction);
        
        playerState.hp = Math.max(0, playerState.hp - finalDmg);
        logCombatFeed(`The ${activeRaid.bossName} strikes back. You received ${finalDmg} damage.`, "damage-taken");
        
        updateBattleDisplays();
        saveStateToStorage();
        refreshHUD();

        if (playerState.hp <= 0) {
            triggerRaidDefeat();
        }
    }
}

function triggerRaidVictory() {
    logCombatFeed(`VICTORY CONFIRMED! The colossal ${activeRaid.bossName} has collapsed!`, "victory");
    logCombatFeed(`Gateway stabilized. Cleared rewards extracted: +${activeRaid.goldReward} Gold, +${activeRaid.expReward} EXP.`, "system-msg");
    
    playerState.gold += activeRaid.goldReward;
    
    const keyDropRoll = Math.random();
    if (keyDropRoll < 0.25) {
        const dropKeyId = activeRaid.rank === "E" ? "key_e" : activeRaid.rank === "D" ? "key_c" : "hp_potion";
        const dropKeyName = dropKeyId === "key_e" ? "E-Rank Dungeon Key" : dropKeyId === "key_c" ? "C-Rank Dungeon Key" : "Health Potion";
        
        const existing = playerState.inventory.find(item => item.id === dropKeyId);
        if (existing) existing.qty++;
        else playerState.inventory.push({ id: dropKeyId, name: dropKeyName, type: dropKeyId.includes("key") ? "key" : "consumable", qty: 1, icon: dropKeyId.includes("key") ? "fa-key" : "fa-flask", desc: "A gate key anomaly recovered from raid vaults." });
        
        logCombatFeed(`System Loot Alert: Recovered 1x ${dropKeyName} from the boss's ash remains!`, "critical");
    }

    const expGained = activeRaid.expReward;
    document.querySelectorAll(".battle-controls button").forEach(b => b.disabled = true);
    
    setTimeout(() => {
        exitActiveBattle();
        gainExperience(expGained);
    }, 2500);
}

function triggerRaidDefeat() {
    logCombatFeed("DEFEAT CONFIRMED! Your health pool has dried out...", "defeat");
    logCombatFeed("System Intervention: Evacuating player core. Level compromised (-1).", "defeat");
    
    playerState.level = Math.max(1, playerState.level - 1);
    playerState.exp = 0;
    playerState.expNeeded = Math.round(100 * Math.pow(1.15, playerState.level - 1));
    playerState.hp = 10;

    document.querySelectorAll(".battle-controls button").forEach(b => b.disabled = true);
    
    setTimeout(() => {
        exitActiveBattle();
        saveStateToStorage();
        refreshHUD();
    }, 2500);
}

function exitActiveBattle() {
    activeRaid = null;
    document.getElementById("battle-active-screen").classList.add("hidden");
    document.getElementById("battle-pre-screen").classList.remove("hidden");
}

function logCombatFeed(msg, typeClass) {
    const feed = document.getElementById("battle-log-feed");
    const el = document.createElement("div");
    el.className = `feed-entry ${typeClass}`;
    el.innerHTML = msg;
    
    feed.appendChild(el);
    feed.scrollTop = feed.scrollHeight;
}

// --- PENALTY QUEST CANVAS dodger ---
let penaltyGameActive = false;
let penaltyTimerVal = 0;
let penaltyTimerInterval = null;
let canvas = null;
let ctx = null;
let playerPos = { x: 400, y: 200, radius: 10 };
let enemies = [];
let keysPressed = {};

function initiatePenaltyQuest() {
    penaltyGameActive = true;
    
    const overlay = document.getElementById("screen-penalty");
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";

    clearInterval(dailyTimerInterval);

    const config = DIFFICULTY_CONFIG[playerState.difficulty];
    penaltyTimerVal = config.penalty;
    document.getElementById("penalty-timer-val").textContent = formatPenaltyTime(penaltyTimerVal);

    canvas = document.getElementById("penalty-canvas");
    ctx = canvas.getContext("2d");
    
    playerPos = { x: canvas.width / 2, y: canvas.height / 2, radius: 10 };
    enemies = [];
    
    window.addEventListener("keydown", handlePenaltyKeyDown);
    window.addEventListener("keyup", handlePenaltyKeyUp);
    
    canvas.addEventListener("mousemove", handlePenaltyMouseMove);
    canvas.addEventListener("touchmove", handlePenaltyTouchMove);

    for (let i = 0; i < 4; i++) {
        spawnCentipede();
    }

    penaltyTimerInterval = setInterval(() => {
        penaltyTimerVal--;
        document.getElementById("penalty-timer-val").textContent = formatPenaltyTime(penaltyTimerVal);
        
        if (penaltyTimerVal % 8 === 0) {
            spawnCentipede();
        }

        if (penaltyTimerVal <= 0) {
            completePenaltyQuest(true);
        }
    }, 1000);

    requestAnimationFrame(runPenaltyFrame);
    spawnToast("System Warning", "WARNING: Penalty Quest initiated! Survive the desert sand centipedes!", "red");
}

function handlePenaltyKeyDown(e) {
    keysPressed[e.key.toLowerCase()] = true;
}

function handlePenaltyKeyUp(e) {
    keysPressed[e.key.toLowerCase()] = false;
}

function handlePenaltyMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    playerPos.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    playerPos.y = (e.clientY - rect.top) * (canvas.height / rect.height);
}

function handlePenaltyTouchMove(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    playerPos.x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    playerPos.y = (touch.clientY - rect.top) * (canvas.height / rect.height);
}

function spawnCentipede() {
    const side = Math.floor(Math.random() * 4);
    let x = 0, y = 0;
    
    if (side === 0) { x = Math.random() * canvas.width; y = -30; }
    else if (side === 1) { x = canvas.width + 30; y = Math.random() * canvas.height; }
    else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + 30; }
    else { x = -30; y = Math.random() * canvas.height; }

    const speed = 2 + (Math.random() * 3);
    const angle = Math.atan2(playerPos.y - y, playerPos.x - x);
    
    enemies.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        width: 35 + Math.random() * 40,
        height: 12,
        color: "#ff2d55"
    });
}

function runPenaltyFrame() {
    if (!penaltyGameActive) return;

    ctx.fillStyle = "#0c0a0c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255, 45, 85, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

    const speed = 4;
    if (keysPressed['w'] || keysPressed['arrowup']) playerPos.y = Math.max(playerPos.radius, playerPos.y - speed);
    if (keysPressed['s'] || keysPressed['arrowdown']) playerPos.y = Math.min(canvas.height - playerPos.radius, playerPos.y + speed);
    if (keysPressed['a'] || keysPressed['arrowleft']) playerPos.x = Math.max(playerPos.radius, playerPos.x - speed);
    if (keysPressed['d'] || keysPressed['arrowright']) playerPos.x = Math.min(canvas.width - playerPos.radius, playerPos.x + speed);

    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, playerPos.radius, 0, Math.PI * 2);
    ctx.fillStyle = varColor("--color-cyan");
    ctx.shadowBlur = 15;
    ctx.shadowColor = varColor("--color-cyan");
    ctx.fill();
    ctx.shadowBlur = 0;

    enemies.forEach((enemy, index) => {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        if (Math.random() < 0.02) {
            const steerAngle = Math.atan2(playerPos.y - enemy.y, playerPos.x - enemy.x);
            const currentSpeed = Math.sqrt(enemy.vx * enemy.vx + enemy.vy * enemy.vy);
            enemy.vx = (enemy.vx * 0.7) + (Math.cos(steerAngle) * currentSpeed * 0.3);
            enemy.vy = (enemy.vy * 0.7) + (Math.sin(steerAngle) * currentSpeed * 0.3);
        }

        ctx.fillStyle = enemy.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = enemy.color;
        
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        const heading = Math.atan2(enemy.vy, enemy.vx);
        ctx.rotate(heading);
        
        ctx.fillRect(-enemy.width/2, -enemy.height/2, enemy.width, enemy.height);
        
        ctx.strokeStyle = "rgba(255, 45, 85, 0.4)";
        ctx.lineWidth = 2;
        for (let l = -enemy.width/2; l < enemy.width/2; l += 8) {
            ctx.beginPath();
            ctx.moveTo(l, -enemy.height/2);
            ctx.lineTo(l - 2, -enemy.height/2 - 5);
            ctx.moveTo(l, enemy.height/2);
            ctx.lineTo(l - 2, enemy.height/2 + 5);
            ctx.stroke();
        }
        ctx.restore();
        ctx.shadowBlur = 0;

        const dx = Math.abs(playerPos.x - enemy.x);
        const dy = Math.abs(playerPos.y - enemy.y);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < playerPos.radius + (enemy.height / 2)) {
            playerState.hp = Math.max(0, playerState.hp - 1);
            saveStateToStorage();
            refreshHUD();
            
            ctx.fillStyle = "rgba(255, 45, 85, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (playerState.hp <= 0) {
                completePenaltyQuest(false);
            }
        }
    });

    requestAnimationFrame(runPenaltyFrame);
}

function completePenaltyQuest(survived) {
    penaltyGameActive = false;
    clearInterval(penaltyTimerInterval);
    
    window.removeEventListener("keydown", handlePenaltyKeyDown);
    window.removeEventListener("keyup", handlePenaltyKeyUp);

    const overlay = document.getElementById("screen-penalty");
    overlay.classList.add("hidden");
    overlay.style.display = "none";

    initClock();

    if (survived) {
        playerState.hp = playerState.maxHp;
        playerState.mp = playerState.maxMp;
        playerState.questCompletedToday = false;
        playerState.holistic.diet = false;
        playerState.holistic.meditation = false;
        playerState.holistic.sleep = false;
        playerState.waterLogged = 0;
        
        // Reset dynamic custom gym sets checkboxes
        playerState.gymWorkouts.forEach(workout => {
            workout.completedSets = workout.completedSets.map(() => false);
        });

        saveStateToStorage();
        refreshHUD();
        spawnToast("System Saved", "PENALTY SURVIVED! Fatigue completely Cleansed.", "gold");
    } else {
        playerState.level = Math.max(1, playerState.level - 1);
        playerState.exp = 0;
        playerState.gold = Math.max(0, playerState.gold - 200);
        playerState.hp = 25;
        
        saveStateToStorage();
        refreshHUD();
        
        const deathSplash = document.createElement("div");
        deathSplash.className = "modal-backdrop flex-col-center animated-zoom";
        deathSplash.style.zIndex = "99999";
        deathSplash.innerHTML = `
            <h1 class="orbitron-text text-glow-red" style="font-size: 40px; font-weight:900; letter-spacing: 2px;">PENALTY DEADLINE MET</h1>
            <p class="orbitron-text text-glow-purple mt-sm" style="font-size: 14px; text-align:center;">THE SYSTEM INFLICTED DEGRADATION ON YOUR PATH.<br>GOLD -200 | LEVEL REDUCED.</p>
            <button class="btn btn-secondary btn-lg mt-lg" onclick="this.parentElement.remove()">RESTORE CORE STATUS</button>
        `;
        document.body.appendChild(deathSplash);
    }
}

function formatPenaltyTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function varColor(cssVarName) {
    try {
        const val = getComputedStyle(document.documentElement).getPropertyValue(cssVarName);
        return val ? val.trim() : "#00f3ff";
    } catch (e) {
        return "#00f3ff";
    }
}

// --- SYSTEM TOAST INJECTOR ---
function spawnToast(title, desc, colorSignature) {
    const container = document.getElementById("system-toast-container");
    const toast = document.createElement("div");
    
    let colorClass = "";
    let iconClass = "fa-circle-info toast-icon-blue";
    
    if (colorSignature === "red") {
        colorClass = "toast-error";
        iconClass = "fa-triangle-exclamation toast-icon-red";
    } else if (colorSignature === "gold") {
        colorClass = "toast-gold";
        iconClass = "fa-crown toast-icon-gold";
    } else if (colorSignature === "green") {
        colorClass = "toast-green";
        iconClass = "fa-circle-check toast-icon-green";
    }

    toast.className = `system-toast ${colorClass}`;
    toast.innerHTML = `
        <i class="fa-solid ${iconClass} toast-icon"></i>
        <div class="toast-body">
            <span class="toast-title orbitron-text">${title}</span>
            <span class="toast-desc">${desc}</span>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.5s ease";
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// ==========================================================================
// THE SYSTEM: MONARCH OF MIND INTELLECTUAL TRIALS SUBSYSTEM
// ==========================================================================

// --- 1. LOCAL HIGH-FIDELITY ACADEMIC DATABASE ---
const ACADEMIC_DATABASE = {
    bible: [
        {
            passage: "<p><strong>Genesis 1 & John 1 (Creation and Logos):</strong> In the beginning, the Hebrew scriptures establish a sovereign act of creation through divine speech ('And God said...'). John's gospel opens with an identical echo: 'In the beginning was the Word, and the Word was with God, and the Word was God.' John employs the Greek philosophical term <strong>Logos</strong>, bridging Judeo-Christian theology with Hellenistic philosophy.</p><p>In classical Greek philosophy, the <em>Logos</em> represented the rational principle of order governing the cosmos. John repurposes this to declare that the ultimate source of cosmic logic and order is not a formless force, but a personal, self-revealing Creator who incarnated as Jesus Christ. This exegesis establishes a rational foundation for the universe, framing creation not as chaotic accident, but as an expression of divine intellect.</p>",
            discussion: "Consider how the synthesis of Hebrew theology (Genesis) and Greek philosophy (John) under the term 'Logos' created a unified worldview that appealed to both Eastern and Western minds in antiquity.",
            quizQuestion: "Which classical philosophical Greek term is used in the prologue of John's Gospel to denote the rational, self-revealing principle of divine order in the cosmos?",
            options: ["Logos (The Word / Reason)", "Sophia (Wisdom)", "Rhema (Spoken Word)", "Gnosis (Secret Knowledge)"],
            correctIndex: 0,
            explanation: "John 1:1 uses 'Logos' to describe Christ as the ultimate embodiment of divine reason and self-revelation. In Greek thought, logos was the cosmic rationale; John frames it as a personal Creator."
        },
        {
            passage: "<p><strong>Isaiah 53 & Romans 5 (Atonement and Justification):</strong> Isaiah 53 presents the prophetic portrait of the 'Suffering Servant,' who was 'pierced for our transgressions' and 'crushed for our iniquities,' bearing the sins of many. In Romans 5, Paul constructs the theological edifice of <strong>Justification</strong>, explaining how Christ's sacrificial death acts as a substitutionary atonement that reconciles humanity to God.</p><p>Justification is a forensic (legal) term. It does not mean making a person inherently perfect, but declaring them legally righteous before the divine court. Paul explains that through faith, the righteousness of Christ is imputed (credited) to the believer, resolving the legal debt of sin. This theology establishes that peace with God is achieved not by human works, but as a free gift of grace grounded in substitutionary atonement.</p>",
            discussion: "Contemplate the legal mechanics of imputation in Romans 5, contrasting the condemnation inherited through the 'First Adam' with the justification granted through the 'Last Adam' (Christ).",
            quizQuestion: "Which forensic theological concept in Romans 5 describes the legal act of God declaring a sinner righteous based on the imputed righteousness of Christ?",
            options: ["Sanctification", "Justification", "Regeneration", "Glorification"],
            correctIndex: 1,
            explanation: "Justification is the forensic declaration of righteousness by God. Sanctification is the progressive process of holiness, whereas Justification is instantaneous and legal."
        },
        {
            passage: "<p><strong>Psalm 23 & Matthew 6 (Divine Providence vs. Anxiety):</strong> Psalm 23 is a masterpiece of pastoral theology, utilizing the metaphor of a shepherd to represent Yahweh's absolute protection, guidance, and provision. The shepherd's rod (for defense) and staff (for guidance) comfort the sheep, even in the 'valley of the shadow of death.' In Matthew 6, Jesus expands this pastoral care into a mandate against anxiety.</p><p>Jesus points to birds and lilies as evidence of God's active, constant care, urging disciples to 'seek first the Kingdom of God and His righteousness.' He argues that anxiety is fundamentally a failure to trust in divine providence. These texts present a unified defense against psychological dread, framing human existence within a universe governed by a benevolent, actively providing Father.</p>",
            discussion: "Analyze the psychological impact of shifting one's core perspective from absolute self-reliance to absolute trust in divine providence as framed in Matthew 6.",
            quizQuestion: "In Psalm 23, what two tools of the shepherd are specifically mentioned as sources of comfort and safety for the sheep?",
            options: ["The Shield and Sword", "The Rod and Staff", "The Sling and Stone", "The Cup and Oil"],
            correctIndex: 1,
            explanation: "Psalm 23:4 states: 'Thy rod and thy staff they comfort me.' The rod was used to drive off predators, while the staff guided and pulled sheep out of crevices."
        },
        {
            passage: "<p><strong>Acts 2 & Galatians 5 (Pneumatology and Spiritual Fruit):</strong> Acts 2 marks the historical descent of the Holy Spirit on Pentecost, empowering the early church with spiritual gifts (charismata) and launching global mission. In Galatians 5, Paul shifts the focus of Pneumatology (the study of the Spirit) from spectacular manifestations to internal character transformation, detailing the <strong>Fruit of the Spirit</strong>.</p><p>Paul contrasts the 'works of the flesh' with the 'fruit of the Spirit' (love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control). He argues that true spiritual maturity is measured not by ecstatic power, but by ethical, Christ-like character. This establishes a holistic Christian life where internal spiritual devotion must manifest as outward moral virtue.</p>",
            discussion: "Discuss the theological significance of Paul using the singular word 'Fruit' (Greek: Karpos) rather than the plural 'Fruits' in Galatians 5 to describe the nine character traits of a Spirit-led life.",
            quizQuestion: "What is the primary Greek term used in classical theology to describe the study of the Holy Spirit's person, role, and actions in the world?",
            options: ["Eschatology", "Pneumatology", "Ecclesiology", "Soteriology"],
            correctIndex: 1,
            explanation: "Pneumatology comes from the Greek word 'Pneuma' (spirit/breath) and denotes the study of the Holy Spirit. Soteriology is the study of salvation; Ecclesiology is the study of the church."
        }
    ],
    religion: [
        {
            passage: "<p><strong>Christian and Islamic Christology:</strong> Christology is the core point of theological divergence between Christianity and Islam. Christianity asserts the <strong>Divinity</strong> of Jesus Christ, defining Him as the second person of the Trinity—fully God and fully man. The Nicene Creed (325 AD) established that Jesus is 'of one substance' (homoousios) with the Father, making His incarnation the ultimate revelation of God's nature.</p><p>Conversely, Islamic theology firmly rejects the divinity and sonship of Jesus (Isa al-Masih), viewing such claims as <em>shirk</em> (associating partners with Allah). In Islam, Jesus is revered as one of the greatest prophets, born of a virgin, and the Messiah, but He is entirely human and did not die on the cross (Surah 4:157 asserts He was raised directly to heaven). Comparing these claims reveals fundamentally different structures of salvation and divine revelation.</p>",
            discussion: "Analyze how the Christian concept of salvation requires a divine mediator (Jesus dying for sins), whereas the Islamic structure of salvation relies on direct obedience to Allah's laws, negating the need for a divine savior.",
            quizQuestion: "Which doctrine is the primary point of theological disagreement between mainstream Christian and Islamic Christology?",
            options: ["The Virgin Birth of Jesus", "The Divinity and Sonship of Jesus", "The role of Jesus as the Messiah", "The performative miracles of Jesus"],
            correctIndex: 1,
            explanation: "Both Christians and Muslims accept the Virgin Birth, Messiah status, and miracles of Jesus. However, Islam rejects His divinity and sonship, holding that Allah has no partners."
        },
        {
            passage: "<p><strong>Theravada vs. Mahayana Buddhism:</strong> Buddhism split into two primary vehicles (yanas) with different paths to liberation. <strong>Theravada</strong> ('Way of the Elders'), dominant in Sri Lanka and Southeast Asia, emphasizes the <strong>Arhat</strong> ideal. An Arhat is an individual monk who, through intense meditation and monastic discipline, achieves personal enlightenment (Nirvana) and escapes Samsara.</p><p><strong>Mahayana</strong> ('Great Vehicle'), dominant in East Asia, criticizes the Arhat path as self-focused. It champions the <strong>Bodhisattva</strong> ideal. A Bodhisattva is an enlightened being who voluntarily vows to postpone their own entry into Nirvana, remaining in the cycle of Samsara to actively aid all sentient beings in attaining liberation. This shift redefines enlightenment from monastic isolation to cosmic compassion.</p>",
            discussion: "Evaluate the ethical implications of the Arhat (personal liberation) versus the Bodhisattva (collective, compassionate liberation) ideals in modern Buddhist practice.",
            quizQuestion: "In Mahayana Buddhism, what term denotes an enlightened being who voluntarily postpones Nirvana to assist all other suffering beings in escaping Samsara?",
            options: ["Arhat", "Bodhisattva", "Lama", "Sangha"],
            correctIndex: 1,
            explanation: "A Bodhisattva vows to save all beings before entering Nirvana themselves. An Arhat, in Theravada, represents personal liberation through individual monastic discipline."
        },
        {
            passage: "<p><strong>Monism vs. Covenantal Monotheism (Hinduism vs. Judaism):</strong> Hinduism and Judaism present two distinct models of ultimate reality. Classical Hindu philosophy (Advaita Vedanta) is monistic, teaching that the individual soul (<strong>Atman</strong>) is ultimately identical to the supreme, universal reality (<strong>Brahman</strong>). All material differences are considered <em>maya</em> (illusion); liberation (moksha) is realized when this absolute oneness is recognized.</p><p>Judaism, by contrast, is strictly dualistic and covenantal. God is the transcendent Creator, fundamentally distinct from His creation. Ultimate reality is framed not as an impersonal cosmic oneness, but as a personal, moral relationship between God and His chosen people, established through a historical **Covenant** (Berikh) governed by divine commandments (Torah). Salvation is realized through ethical obedience and holy relationship, not cosmic dissolution.</p>",
            discussion: "Contrast the spiritual goals of realization (dissolving the self into Brahman) in Hinduism with relation (loving and obeying a personal Creator) in Judaism.",
            quizQuestion: "What is the key Sanskrit term in Advaita Vedanta Hindu philosophy representing the supreme, absolute, and formless universal reality?",
            options: ["Atman", "Brahman", "Dharma", "Moksha"],
            correctIndex: 1,
            explanation: "Brahman is the absolute, formless reality. Atman is the individual soul. Advaita Vedanta teaches that Atman and Brahman are ultimately one and the same."
        },
        {
            passage: "<p><strong>Islamic Tawhid vs. Christian Trinitarianism:</strong> The concept of divine unity is defined differently in these monotheistic faiths. Islam is anchored on <strong>Tawhid</strong>, the absolute, uncompromising oneness and uniqueness of God (Allah). God is non-composite, indivisible, and has no partners. To suggest composite aspects or physical offspring is the greatest sin in Islam.</p><p>Christianity, while strictly monotheistic, defines unity through the **Trinity**—one God in three co-eternal, co-equal Persons (Father, Son, and Holy Spirit). This is not polytheism, but 'social monotheism,' suggesting that relationship, love, and community exist eternally within the very nature of God Himself. Understanding these terms is vital to comparative theological scholarship.",
            discussion: "Discuss how the Islamic concept of Tawhid influences its strict iconoclasm (rejection of images of God), while the Christian Trinity (and incarnation) justifies rich religious art and iconography.",
            quizQuestion: "Which Arabic term represents the core Islamic doctrine of the absolute oneness and indivisibility of God?",
            options: ["Tawhid", "Shirk", "Sunnah", "Halal"],
            correctIndex: 0,
            explanation: "Tawhid is the absolute oneness of Allah. Shirk is the sin of polytheism or associating partners with Allah; Sunnah is the prophetic tradition."
        }
    ],
    history: [
        {
            passage: "<p><strong>The Peace of Westphalia (1648) & State Sovereignty:</strong> The Peace of Westphalia, which ended the catastrophic Thirty Years' War in Europe, laid the foundations for the modern international political order. By recognizing the principle of <em>Cuius regio, eius religio</em> (whose realm, his religion), Westphalia established the doctrine of <strong>State Sovereignty</strong>—the absolute right of a state to govern its territory without external interference.</p><p>Before 1648, Europe was governed by overlapping, hierarchical authorities, with the Pope and the Holy Roman Emperor claiming universal supremacy. Westphalia replaced this with a system of equal, independent sovereign states. This paradigm shift created the concept of international law based on treaties and the balance of power, defining geopolitics to this day.</p>",
            discussion: "Analyze the tension in modern international relations between Westphalian sovereignty (non-interference) and the global mandate to protect human rights (humanitarian intervention).",
            quizQuestion: "Which major international treaty system in 1648 established the modern concept of state sovereignty and non-interference in international relations?",
            options: ["The Treaty of Versailles", "The Peace of Westphalia", "The Congress of Vienna", "The Treaty of Utrecht"],
            correctIndex: 1,
            explanation: "The Peace of Westphalia (1648) ended the Thirty Years' War and established the nation-state system based on territorial integrity and legal equality among sovereign states."
        },
        {
            passage: "<p><strong>The Division of the Roman Empire:</strong> By the late 3rd century AD, the Roman Empire had grown too vast and complex for a single ruler to govern, suffering from chronic military threats, inflation, and civil wars. In 285 AD, the military emperor <strong>Diocletian</strong> established the <strong>Tetrarchy</strong> ('Rule of Four'), officially dividing the empire into Western and Eastern administrative halves.</p><p>While Diocletian's power-sharing system collapsed into civil war, the administrative division persisted. Constantine consolidated power and established Constantinople in the East in 330 AD. The Western Roman Empire collapsed in 476 AD under Germanic pressures, while the Eastern Roman (Byzantine) Empire survived for another millennium, preserving classical law, culture, and Christian theology.</p>",
            discussion: "Consider how the geopolitical split of Rome created the cultural and theological divide between Western Roman Catholicism (Latin) and Eastern Greek Orthodoxy.",
            quizQuestion: "Which Roman Emperor split the Roman Empire into Western and Eastern administrative halves in 285 AD?",
            options: ["Augustus", "Diocletian", "Constantine", "Marcus Aurelius"],
            correctIndex: 1,
            explanation: "Diocletian split the empire in 285 AD to solve administrative and military crises, appointing Maximian as co-emperor of the Western half."
        },
        {
            passage: "<p><strong>The Cold War and Containment Paradigm:</strong> Following World War II, the geopolitical landscape was polarized into a bipolar conflict between the United States and the Soviet Union. In 1946, diplomat George F. Kennan sent the famous **Long Telegram** from Moscow, arguing that the Soviet regime was inherently expansionist and security-obsessed, requiring a firm, long-term counter-strategy.</p><p>This gave rise to the doctrine of <strong>Containment</strong>, codified in the Truman Doctrine (1947). The containment paradigm dictated that the US would commit economic, political, and military power to prevent the spread of Soviet communism globally. This doctrine structured decades of proxy wars, alliances (NATO), and nuclear deterrence, defining late 20th-century history.</p>",
            discussion: "Discuss the structural differences between Kennan's original containment plan (which was primarily political and economic) and its eventual militarization (Vietnam, Korea).",
            quizQuestion: "Which foreign policy doctrine, formulated by George F. Kennan, became the core geopolitical strategy of the United States to counter Soviet expansion during the Cold War?",
            options: ["Isolationism", "Containment", "Detente", "Brinkmanship"],
            correctIndex: 1,
            explanation: "Containment was the central Cold War policy of the US, aiming to limit Soviet power and influence to its existing borders through strategic alliances and intervention."
        },
        {
            passage: "<p><strong>The French Revolution and the Social Contract:</strong> The French Revolution (1789) shattered the absolute monarchies of Europe, declaring that sovereignty resides in the nation rather than the Crown. The ideological catalyst was the Enlightenment, particularly Jean-Jacques Rousseau's concept of the <strong>Social Contract</strong>. Rousseau argued that legitimate political authority rests on the 'General Will' of the citizens.</p><p>When the radical Jacobins took power, they pushed this concept to its extreme, instigating the Reign of Terror to purge 'enemies of the general will.' This historical epoch demonstrated the dangerous duality of modern democracy: it championed human rights and popular sovereignty, but also birthed ideological totalitarianism and state terror in the name of the people.</p>",
            discussion: "Ponder Rousseau's claim that citizens must be 'forced to be free' if they refuse to obey the general will, and how this idea was used to justify the Reign of Terror.",
            quizQuestion: "Which French political theorist wrote 'The Social Contract' (1762), providing the core democratic theory of the French Revolution?",
            options: ["Voltaire", "Montesquieu", "Jean-Jacques Rousseau", "John Locke"],
            correctIndex: 2,
            explanation: "Rousseau formulated 'The Social Contract' and the concept of the 'General Will,' arguing that citizens participate in a mutual contract to submit to the collective will."
        }
    ],
    philosophy: [
        {
            passage: "<p><strong>Epistemology: Rationalism vs. Empiricism:</strong> Epistemology is the philosophical study of the nature, scope, and limits of human knowledge. In the 17th and 18th centuries, philosophy was split by a debate between **Rationalism** and **Empiricism** regarding the primary source of truth.</p><p>Rationalists, led by René Descartes (who started with absolute doubt to arrive at <em>'Cogito, ergo sum'</em>), argued that the primary source of knowledge is reason and innate ideas, independent of sensory experience. Empiricists, led by John Locke (who argued the mind is a <em>tabula rasa</em> or blank slate), countered that all knowledge is derived from sensory observation and experience. Immanuel Kant eventually synthesized both, arguing that while all knowledge begins with experience, the mind structures that experience through innate categories.</p>",
            discussion: "Reflect on how you determine truth: do you rely more on internal rational deduction (Rationalism) or external observation and experimental data (Empiricism)?",
            quizQuestion: "Which philosophical school, championed by René Descartes, asserts that reason and innate ideas are the primary sources of knowledge, rather than sensory experience?",
            options: ["Empiricism", "Rationalism", "Pragmatism", "Existentialism"],
            correctIndex: 1,
            explanation: "Rationalism holds that intellectual deduction and innate ideas are the source of truth. Empiricism argues that all knowledge must come from sensory experience."
        },
        {
            passage: "<p><strong>Theodicy: The Problem of Evil:</strong> The problem of evil is the central challenge in philosophical theology. It is often framed as a trilemma: If God is all-powerful (omnipotent) and all-loving (omnibenevolent), why does evil exist? If God cannot stop evil, He is not all-powerful; if God will not stop evil, He is not all-loving.</p><p>Gottfried Wilhelm Leibniz coined the term <strong>Theodicy</strong> ('Justification of God') in 1710 to resolve this. He argued that God, possessing absolute wisdom, created 'the best of all possible worlds.' In this view, certain evils are necessary to achieve greater, comprehensive goods (such as human free will). This philosophical debate forces theologians to define the limits of human understanding and the nature of divine justice.</p>",
            discussion: "Consider the modern critique of Leibniz's 'best of all possible worlds' (such as Voltaire's Candide), and how you would construct a rational defense against the reality of suffering.",
            quizQuestion: "Which philosopher coined the term 'theodicy' to describe a rational defense of God's goodness in the face of the existence of evil?",
            options: ["Gottfried Wilhelm Leibniz", "Immanuel Kant", "Baruch Spinoza", "David Hume"],
            correctIndex: 0,
            explanation: "Leibniz coined 'Theodicy' in 1710. He argued that the current universe is the 'best of all possible worlds' that God could have created."
        },
        {
            passage: "<p><strong>Existentialism: Søren Kierkegaard and Choice:</strong> Existentialism is a modern philosophical movement asserting that 'existence precedes essence'—humans are born without a predefined purpose and must actively construct their own meaning through choices. The father of Christian Existentialism was the Danish philosopher **Søren Kierkegaard**.</p><p>Kierkegaard focused on the subjective individual, arguing that objective truths cannot solve the human crisis of anxiety (dread) and despair. He asserted that true faith is not rational assent to doctrines, but a passionate, subjective **Leap of Faith** in the face of logical paradox (such as the incarnation). This philosophy demands absolute personal accountability, warning that avoiding choice is itself a choice.</p>",
            discussion: "Discuss Kierkegaard's concept of 'dread' (angst) as the dizziness of freedom—the anxiety we feel when we realize we have absolute choice over our lives.",
            quizQuestion: "Which philosopher is widely recognized as the father of Christian Existentialism, emphasizing the subjective 'leap of faith' in the face of existential dread?",
            options: ["Jean-Paul Sartre", "Søren Kierkegaard", "Friedrich Nietzsche", "Albert Camus"],
            correctIndex: 1,
            explanation: "Kierkegaard emphasized subjective faith, individual choice, and existential angst, establishing the groundwork for both religious and secular existentialism."
        },
        {
            passage: "<p><strong>Aristotelian Virtue Ethics:</strong> Unlike modern ethical theories that focus on rules (Deontology) or consequences (Utilitarianism), Aristotle's virtue ethics focuses on the character of the moral agent. Aristotle argued that the ultimate goal of human life is <strong>Eudaimonia</strong>—a state of robust flourishing, well-being, and living excellently.</p><p>To achieve eudaimonia, one must cultivate moral virtues (aretai) by practicing the **Golden Mean**—the desirable middle state between two extremes of excess and deficiency. For example, courage is the mean between cowardice (deficiency) and rashness (excess). Virtues are not innate; they are habits developed through continuous, conscious practice, matching the 'practice makes perfect' discipline of physical gym training.</p>",
            discussion: "Identify a virtue in your life (e.g. self-control) and analyze how it represents a golden mean between deficiency and excess.",
            quizQuestion: "What classical Greek term did Aristotle use to denote the ultimate state of human flourishing and excellent living achieved through a life of virtue?",
            options: ["Eudaimonia", "Teleology", "Arete", "Catharsis"],
            correctIndex: 0,
            explanation: "Eudaimonia translates to 'flourishing' or 'blessedness.' It represents the active realization of human potential through continuous virtuous habits."
        }
    ],
    epidemiology: [
        {
            passage: "<p><strong>Cohort vs. Case-Control Study Designs:</strong> In public health and epidemiology, study designs dictate how clinical evidence is gathered. A <strong>Cohort Study</strong> is prospective: researchers select a group of exposed and unexposed individuals, follow them forward in time, and observe the incidence of disease. Because incidence is known, researchers calculate the **Relative Risk (RR)**.</p><p>A <strong>Case-Control Study</strong> is retrospective: researchers select individuals who already have the disease ('cases') and compare them to healthy individuals ('controls'), looking back in time for prior exposures. Because incidence cannot be calculated (since the cases were pre-selected), Relative Risk is invalid. Instead, researchers must calculate the <strong>Odds Ratio (OR)</strong> as the primary measure of association.</p>",
            discussion: "Contemplate why retrospective Case-Control studies are highly efficient for studying rare diseases, whereas prospective Cohort studies are better for studying rare exposures.",
            quizQuestion: "Which statistical measure of association is primary in a retrospective Case-Control study where direct disease incidence cannot be calculated?",
            options: ["Relative Risk (RR)", "Odds Ratio (OR)", "Hazard Ratio", "Attributable Risk"],
            correctIndex: 1,
            explanation: "In case-control studies, researchers select cases retrospectively, meaning the true risk or incidence is unknown. The Odds Ratio (OR) serves as a valid mathematical proxy."
        },
        {
            passage: "<p><strong>Statistical Significance: Type I vs. Type II Errors:</strong> Biostatistics is the mathematical core of public health trials, verifying whether drug treatments or health shifts have real statistical effects. Hypothesis testing sets up a Null Hypothesis ($H_0$, suggesting no effect) and an Alternative Hypothesis ($H_1$).</p><p>A <strong>Type I Error ($\alpha$)</strong> occurs when a researcher rejects a true null hypothesis (a 'false positive'—concluding a drug works when it does not). A <strong>Type II Error ($\beta$)</strong> occurs when a researcher fails to reject a false null hypothesis (a 'false negative'—concluding a drug is useless when it actually works). The **p-value** measures the probability that the observed study results occurred by random chance under $H_0$; a threshold of $p < 0.05$ is standard to reject $H_0$ and declare significance.</p>",
            discussion: "Reflect on why public health trials are highly conservative, aiming to minimize Type I errors ($\alpha$) to prevent approving useless or dangerous drugs for public consumption.",
            quizQuestion: "A clinical trial mistakenly concludes that a new vaccine is effective when it actually has no effect. What type of statistical error has been committed?",
            options: ["Type I Error (False Positive)", "Type II Error (False Negative)", "Sampling Bias Error", "Standard Deviation Variance"],
            correctIndex: 0,
            explanation: "A Type I error is rejecting the null hypothesis when it is actually true (declaring an effect exists when it does not, which is a false positive)."
        },
        {
            passage: "<p><strong>John Snow and the Broad Street Pump (1854):</strong> Dr. John Snow is revered as a founder of modern epidemiology for his brilliant detective work during the 1854 cholera outbreak in Soho, London. In the mid-19th century, medical authorities believed cholera was spread by 'miasma' (bad air/foul smells).</p><p>Snow rejected the miasma theory, mapping the geographic locations of cholera deaths and interviewing local residents. He discovered that the deaths clustered around the public water pump on **Broad Street**. By convincing the parish board to remove the pump's handle, Snow ended the epidemic. He proved cholera was a waterborne pathogen, establishing geographic case mapping as a core epidemiological tool.</p>",
            discussion: "Analyze the bravery required for Dr. John Snow to challenge the absolute scientific consensus of his day (miasma theory) using nothing but raw empirical data and maps.",
            quizQuestion: "Dr. John Snow revolutionized public health in 1854 by mapping cholera cases to which specific municipal contamination source in London?",
            options: ["The Thames River sewage outlets", "A contaminated public water pump on Broad Street", "A local slaughterhouse air exhaust", "A damp basement in a textile factory"],
            correctIndex: 1,
            explanation: "Snow's mapping traced the cholera cases to the Broad Street pump. Removing the handle stopped the public from drinking the sewage-contaminated well water."
        },
        {
            passage: "<p><strong>Sensitivity vs. Specificity in Diagnostics:</strong> Diagnostic screening tests are evaluated by two key metrics. <strong>Sensitivity</strong> is the test's ability to correctly identify patients who actually HAVE the disease (True Positive Rate). A highly sensitive test has very few false negatives, making it ideal for initial, broad screenings.</p><p><strong>Specificity</strong> is the test's ability to correctly identify healthy patients who do NOT have the disease (True Negative Rate). A highly specific test has very few false positives, making it ideal for confirmatory diagnostic checks. Balancing these two properties is crucial to prevent public panic (from false positives) or untreated outbreaks (from false negatives).</p>",
            discussion: "Consider a screening scenario for a highly lethal pathogen: would you prioritize a test with high Sensitivity or high Specificity in the initial screening gate, and why?",
            quizQuestion: "Which term represents a diagnostic test's ability to correctly identify healthy individuals who do NOT have the disease (True Negative Rate)?",
            options: ["Sensitivity", "Specificity", "Positive Predictive Value", "Negative Predictive Value"],
            correctIndex: 1,
            explanation: "Specificity measures the true negative rate (ability to exclude healthy people). Sensitivity measures the true positive rate (ability to detect sick people)."
        }
    ]
};

// --- 2. BASELINE FLASHCARDS DATABASE ---
const FLASHCARD_CODEX = [
    { id: "fc_1", subject: "Holy Scripture", question: "Hermeneutics", answer: "The science, methodology, and principles of interpreting texts, particularly biblical scriptures. It demands analyzing historical-grammatical context to extract the original author's intended meaning, avoiding personal bias." },
    { id: "fc_2", subject: "Holy Scripture", question: "Sola Scriptura", answer: "A key Protestant Reformation doctrine asserting that the Bible is the sole, ultimate, and infallible authority for Christian faith and practice, rejecting church tradition or papacy as equal sources of revelation." },
    { id: "fc_3", subject: "Holy Scripture", question: "Septuagint (LXX)", answer: "The ancient Greek translation of the Hebrew Bible (Old Testament) compiled by Jewish scholars in Alexandria, Egypt around the 3rd to 2nd centuries BC. It was widely used by early Greek-speaking Christians." },
    { id: "fc_4", subject: "Holy Scripture", question: "Exegesis vs. Eisegesis", answer: "Exegesis is reading the original historical meaning OUT of a text based on context. Eisegesis is forcing a foreign, subjective meaning INTO the text to suit a modern preconceived opinion." },
    { id: "fc_5", subject: "Holy Scripture", question: "Synoptic Gospels", answer: "Matthew, Mark, and Luke. Derived from the Greek word meaning 'seeing together' because they share similar outlines, narratives, and verbal agreements, unlike the theological, highly symbolic structure of John." },
    
    { id: "fc_6", subject: "Comparative Religion", question: "Tawhid", answer: "The absolute monotheistic doctrine of the absolute oneness, uniqueness, and indivisibility of God (Allah) in Islam. It stands in direct contrast to polytheism and the Christian doctrine of the Trinity." },
    { id: "fc_7", subject: "Comparative Religion", question: "Four Noble Truths", answer: "The foundational core of Buddhism: 1) Suffering (dukkha) exists; 2) Suffering is caused by selfish desire (tanha); 3) Suffering can end (Nirvana); 4) The Eightfold Path is the way to end suffering." },
    { id: "fc_8", subject: "Comparative Religion", question: "Nirvana", answer: "The ultimate spiritual goal in Buddhism and Hinduism representing the absolute blowing-out or extinction of desire, individual selfhood, and suffering, achieving liberation from the cycle of Samsara." },
    { id: "fc_9", subject: "Comparative Religion", question: "The Five Pillars of Islam", answer: "The core compulsory acts of devotion in Islam: Shahada (profession of faith), Salah (daily prayer), Zakat (charity), Sawm (fasting during Ramadan), and Hajj (pilgrimage to Mecca)." },
    { id: "fc_10", subject: "Comparative Religion", question: "Samsara", answer: "The continuous, painful cycle of birth, death, and reincarnation in Indian religions (Hinduism, Buddhism, Jainism), governed by the moral law of cause and effect (Karma)." },
    
    { id: "fc_11", subject: "World History", question: "Westphalian Sovereignty", answer: "The modern principle of international law established in 1648 that each state has exclusive sovereignty over its territory, defining borders, non-interference, and sovereign equality in global politics." },
    { id: "fc_12", subject: "World History", question: "Jacobinism", answer: "A radical, egalitarian political philosophy during the French Revolution advocating absolute popular sovereignty, centralization of power, civic virtue, and the direct purge of political dissent." },
    { id: "fc_13", subject: "World History", question: "The Concert of Europe", answer: "A system of dispute resolution and diplomatic equilibrium established in 1815 at the Congress of Vienna, where major European empires collaborated to prevent revolutions and maintain the balance of power." },
    { id: "fc_14", subject: "World History", question: "Magna Carta (1215)", answer: "The royal charter of rights that forced King John of England to accept that the monarch is not above the law, establishing legal protections for subjects and limiting absolute monarchical power." },
    { id: "fc_15", subject: "World History", question: "Truman Doctrine (1947)", answer: "The foreign policy paradigm committed to supporting democratic nations resisting subjugation by authoritarian forces, launching the global Containment strategy against Soviet expansion." },
    
    { id: "fc_16", subject: "Philosophy & Theology", question: "Categorical Imperative", answer: "Immanuel Kant's deontological ethical rule: Act only according to maxims (principles) that you could rationally will to become a universal law governing all human beings under similar circumstances." },
    { id: "fc_17", subject: "Philosophy & Theology", question: "Cogito, ergo sum", answer: "René Descartes' epistemological starting point: 'I think, therefore I am.' By doubting everything, he realized the very act of doubting proved the existence of his thinking mind." },
    { id: "fc_18", subject: "Philosophy & Theology", question: "Eudaimonia", answer: "Aristotle's term for absolute human flourishing, the ultimate life goal. It represents a state of well-being achieved by living in accordance with virtue and realizing one's rational potential." },
    { id: "fc_19", subject: "Philosophy & Theology", question: "Empiricism", answer: "The epistemological theory asserting that all human ideas and knowledge are derived from sensory observation and experimental evidence, rejecting the existence of innate ideas (championed by Locke, Hume)." },
    { id: "fc_20", subject: "Philosophy & Theology", question: "Utilitarianism", answer: "The consequentialist ethical theory asserting that the moral value of an action is determined solely by its contribution to overall utility, defined as maximizing the greatest happiness for the greatest number." },
    
    { id: "fc_21", subject: "Epidemiology", question: "p-value", answer: "The probability in hypothesis testing of obtaining results at least as extreme as observed, assuming the Null Hypothesis (no effect) is true. A p-value of <0.05 is standard to reject the null hypothesis." },
    { id: "fc_22", subject: "Epidemiology", question: "Type II Error (Beta)", answer: "Failing to reject a false null hypothesis (a false negative). This occurs when a study concludes there is no treatment effect when a real effect actually exists." },
    { id: "fc_23", subject: "Epidemiology", question: "Odds Ratio (OR)", answer: "The primary measure of association in retrospective Case-Control studies. It compares the odds of exposure in diseased cases with the odds of exposure in healthy controls." },
    { id: "fc_24", subject: "Epidemiology", question: "Relative Risk (RR)", answer: "The primary measure of association in prospective Cohort studies. It is the ratio of the probability of developing a disease in the exposed group vs. the unexposed group." },
    { id: "fc_25", subject: "Epidemiology", question: "Specificity", answer: "The diagnostic metric representing a test's ability to correctly exclude healthy individuals who do not have the disease (True Negative Rate). A highly specific test has very few false positives." }
];

// --- 3. EXAM GATE RANDOM QUESTIONS DECK (20 ITEMS) ---
const EXAM_POOL = [
    { subject: "Holy Scripture", question: "Which ancient collection of manuscript fragments found in Qumran in 1947 revolutionized modern biblical textual criticism?", options: ["The Dead Sea Scrolls", "The Codex Sinaiticus", "The Nag Hammadi Library", "The Samaritan Pentateuch"], correctIndex: 0, explanation: "The Dead Sea Scrolls provided Hebrew biblical texts dating back to the 2nd century BC, validating the copy accuracy of modern translations." },
    { subject: "Holy Scripture", question: "What theological term describes the divine breathing-out or supervision of the writing of biblical scriptures, ensuring their authority?", options: ["Inspiration", "Illumination", "Revelation", "Canonization"], correctIndex: 0, explanation: "Inspiration (from Greek 'theopneustos' - God-breathed) denotes the divine oversight of human authors in writing scripture." },
    { subject: "Holy Scripture", question: "Which doctrine holds that scriptures are completely free from error or falsehood in all matters they assert?", options: ["Inerrancy", "Infallibility", "Perspicuity", "Sufficiency"], correctIndex: 0, explanation: "Inerrancy asserts that scripture is entirely truthful and free from error in all historical, scientific, and theological assertions." },
    { subject: "Holy Scripture", question: "Which early church council in 325 AD formally condemned Arianism and drafted the core creed affirming Christ's full divinity?", options: ["Council of Nicaea", "Council of Chalcedon", "Council of Ephesus", "Council of Constantinople"], correctIndex: 0, explanation: "The Council of Nicaea established that Jesus is 'homoousios' (of the same substance) with the Father, defeating the Arian heresy." },
    
    { subject: "Comparative Religion", question: "Which sacred Sanskrit texts form the foundational scriptures of early Vedic Hinduism, considered divine hearing (sruti)?", options: ["The Vedas", "The Upanishads", "The Puranas", "The Bhagavad Gita"], correctIndex: 0, explanation: "The Vedas are the oldest sacred texts in Hinduism, containing liturgical chants, rituals, and early speculative theology." },
    { subject: "Comparative Religion", question: "In Hinduism, which moral law governs the absolute moral balance of cause and effect, dictating the quality of future reincarnations?", options: ["Karma", "Dharma", "Samsara", "Moksha"], correctIndex: 0, explanation: "Karma means 'action' and represents the cosmic law where every deed has an equal, proportional moral consequence in this life or the next." },
    { subject: "Comparative Religion", question: "Which major Islamic sect represents the majority of Muslims globally, prioritizing the consensus of the early community and prophetic tradition?", options: ["Sunni", "Shia", "Sufi", "Ibadi"], correctIndex: 0, explanation: "Sunni Muslims (adhering to the Sunnah) make up roughly 85-90% of the global Muslim population." },
    { subject: "Comparative Religion", question: "Which Jewish festival commemorates the liberation of the Hebrews from Egyptian bondage, marked by the Seder meal?", options: ["Passover (Pesach)", "Yom Kippur", "Rosh Hashanah", "Hanukkah"], correctIndex: 0, explanation: "Passover celebrates the Exodus, where the angel of death 'passed over' homes marked with lamb's blood." },
    
    { subject: "World History", question: "Which major diplomatic conference in 1815 reorganized Europe's borders and established an equilibrium after the Napoleonic Wars?", options: ["The Congress of Vienna", "The Treaty of Versailles", "The Peace of Westphalia", "The Treaty of Paris"], correctIndex: 0, explanation: "The Congress of Vienna restored conservative monarchies and balanced power to prevent single-nation hegemony." },
    { subject: "World History", question: "Which major historical event in 1215 established that English monarchs are bound by legal limits, forming a precursor to constitutional law?", options: ["The signing of Magna Carta", "The Battle of Hastings", "The Glorious Revolution", "The execution of King Charles I"], correctIndex: 0, explanation: "Magna Carta forced King John to yield absolute power, establishing habeas corpus and due process guarantees." },
    { subject: "World History", question: "Which international treaty in 1919 officially ended World War I but imposed severe reparations on Germany, fueling the rise of fascism?", options: ["The Treaty of Versailles", "The Treaty of Brest-Litovsk", "The Treaty of Berlin", "The Treaty of Saint-Germain"], correctIndex: 0, explanation: "Versailles forced Germany to accept absolute war guilt, imposing massive economic penalties that destabilized the Weimar Republic." },
    { subject: "World History", question: "What name was given to the economic recovery program launched by the US in 1948 to rebuild Western Europe and resist communism?", options: ["The Marshall Plan", "The New Deal", "The Lend-Lease Act", "The Truman Accord"], correctIndex: 0, explanation: "The Marshall Plan transferred over $13 billion in economic aid, stabilizing European markets and halting Soviet-backed political sweeps." },
    
    { subject: "Philosophy & Theology", question: "Which philosopher formulated the 'Allegory of the Cave' in his work 'The Republic' to illustrate the nature of forms and education?", options: ["Plato", "Aristotle", "Socrates", "Epicurus"], correctIndex: 0, explanation: "Plato used the Cave allegory to show that the material world is a shadow, and true knowledge is grasping the perfect forms." },
    { subject: "Philosophy & Theology", question: "Which deontological philosopher argued that actions are moral only if motivated by absolute duty, rejecting consequential calculations?", options: ["Immanuel Kant", "John Stuart Mill", "Friedrich Nietzsche", "David Hume"], correctIndex: 0, explanation: "Kant's deontology holds that moral duty is absolute and must be followed regardless of the outcomes, guided by rational duty." },
    { subject: "Philosophy & Theology", question: "Which modern philosophical theory asserts that all meaningful statements must be either logically analytic or empirically verifiable?", options: ["Logical Positivism", "Existentialism", "Pragmatism", "Phenomenology"], correctIndex: 0, explanation: "Logical Positivism (Vienna Circle) claimed metaphysics was literally meaningless because it could not be empirically tested." },
    { subject: "Philosophy & Theology", question: "Which theologian wrote 'Summa Theologiae,' synthesizing Christian theology with Aristotelian philosophy to create Thomism?", options: ["Thomas Aquinas", "Augustine of Hippo", "John Calvin", "Martin Luther"], correctIndex: 0, explanation: "St. Thomas Aquinas created the grand scholastic synthesis of faith and reason, forming the backbone of Catholic philosophy." },
    
    { subject: "Epidemiology", question: "Which term represents the absolute number of NEW cases of a disease that develop in a population over a specific period of time?", options: ["Incidence Rate", "Prevalence Rate", "Mortality Rate", "Attack Velocity"], correctIndex: 0, explanation: "Incidence rate measures new onset cases in a population-at-risk. Prevalence measures all existing active cases at a single point in time." },
    { subject: "Epidemiology", question: "Which type of study bias occurs when researchers systematically assign healthier or different patients into specific test groups?", options: ["Selection Bias", "Recall Bias", "Confounding Bias", "Observer Bias"], correctIndex: 0, explanation: "Selection bias occurs when the study population is not randomly selected or randomized, systematically distorting the true effects." },
    { subject: "Epidemiology", question: "What statistical parameter defines the range of values in which the true population effect size lies with a specified probability?", options: ["Confidence Interval (CI)", "Standard Deviation", "Coefficient of Variance", "Interquartile Range"], correctIndex: 0, explanation: "A 95% Confidence Interval gives the statistical range where researchers are 95% confident the true population parameter rests." },
    { subject: "Epidemiology", question: "Which biostatistical model is used to predict the time until a specific event of interest occurs, such as mortality or cure?", options: ["Survival Analysis / Cox Regression", "Linear Regression", "Logistic Regression", "ANOVA Testing"], correctIndex: 0, explanation: "Survival analysis models the time-to-event data. Cox Proportional Hazards regression is the standard model in clinical epidemiology." }
];

// --- 4. ENGINE CONTROLLERS & DATA VARIABLES ---
let activeStudyNodeSubject = null;
let currentStudyQuizData = null;
let selectedStudyOptionIndex = null;
let currentFlashcardIndex = 0;
let flashcardCodexCopy = [...FLASHCARD_CODEX];
let isFlashcardFlipped = false;

// Exam State
let examGameActive = false;
let examTimerVal = 600; // 10 minutes
let examTimerInterval = null;
let examQuestions = [];
let currentExamIndex = 0;
let examAnswers = [];
let selectedExamOptionIndex = null;

// --- 5. INITIALIZATION ROUTINE ---
function initIntellectualSubsystem() {
    // Sub-tab button bindings
    const subTabBtns = document.querySelectorAll(".sub-tab-btn");
    subTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            subTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const contents = document.querySelectorAll(".intellectual-sub-content");
            contents.forEach(c => c.classList.add("hidden"));
            
            const targetId = btn.getAttribute("data-subtab");
            document.getElementById(targetId).classList.remove("hidden");
        });
    });

    // Daily study grid cards click
    const cards = document.querySelectorAll(".synaptic-node-card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const subject = card.getAttribute("data-subject");
            openStudyNodeModal(subject);
        });
    });

    // Study Modal Buttons
    document.getElementById("btn-close-study-modal").addEventListener("click", () => {
        document.getElementById("modal-study-node").classList.add("hidden");
    });
    
    document.getElementById("btn-submit-study-answer").addEventListener("click", () => {
        submitStudyAnswer();
    });

    // Flashcard Flip Click
    document.getElementById("active-flashcard").addEventListener("click", () => {
        flipFlashcard();
    });

    // Flashcard action buttons
    document.getElementById("btn-flashcard-review").addEventListener("click", () => {
        evaluateFlashcard(false);
    });
    
    document.getElementById("btn-flashcard-master").addEventListener("click", () => {
        evaluateFlashcard(true);
    });

    // Exam permit gate trigger
    document.getElementById("btn-enter-exam").addEventListener("click", () => {
        if (playerState.examPermits > 0 && !examGameActive) {
            initiateWeeklyExam();
        }
    });

    // Exam Next / Submit Button
    document.getElementById("btn-exam-next").addEventListener("click", () => {
        submitExamAnswer();
    });

    // API Key form bind
    document.getElementById("form-api-gateway").addEventListener("submit", (e) => {
        e.preventDefault();
        const key = document.getElementById("input-api-key").value.trim();
        saveApiKey(key);
    });

    // Sync input key
    document.getElementById("input-api-key").value = playerState.apiKey || "";
}

// --- 6. CORE RECALCULATIONS & DATA SYNC ---
function recalculateIQ() {
    const studyStreak = playerState.studyStreak || 0;
    const masteredCount = playerState.flashcardsMastered.length;
    
    // Calculate Average Exam Grade
    let averageGrade = 0;
    if (playerState.examHistory.length > 0) {
        const sum = playerState.examHistory.reduce((acc, curr) => acc + curr.score, 0);
        averageGrade = sum / playerState.examHistory.length;
    }

    // Dynamic IQ formula bound between 70 and 200
    let calculatedIq = 80 + (studyStreak * 1.5) + (masteredCount * 0.8) + (averageGrade * 0.3);
    playerState.iqScore = Math.round(Math.min(200, Math.max(70, calculatedIq)));
}

function refreshIntellectualHUD() {
    if (!playerState.authenticated) return;

    // Recalculate dynamic IQ first
    recalculateIQ();

    const iq = playerState.iqScore;
    document.getElementById("hud-iq-val").textContent = iq;
    
    // Cognitive Rank thresholds
    let rankText = "[E-Rank Core]";
    let target = 90;
    let base = 70;
    if (iq >= 160) { rankText = "[S-Rank Monarch Core]"; target = 200; base = 160; }
    else if (iq >= 140) { rankText = "[A-Rank Supreme Core]"; target = 160; base = 140; }
    else if (iq >= 125) { rankText = "[B-Rank High Core]"; target = 140; base = 125; }
    else if (iq >= 110) { rankText = "[C-Rank Sage Core]"; target = 125; base = 110; }
    else if (iq >= 90) { rankText = "[D-Rank Mid Core]"; target = 110; base = 90; }

    document.getElementById("hud-iq-rank").textContent = rankText;
    document.getElementById("hud-iq-progress-lbl").textContent = `${iq} / ${target} IQ`;
    
    const pct = Math.min(100, Math.max(0, ((iq - base) / (target - base)) * 100));
    document.getElementById("hud-hud-iq-bar") ? document.getElementById("hud-hud-iq-bar").style.width = `${pct}%` : null;
    document.getElementById("hud-iq-bar").style.width = `${pct}%`;

    // Streak and Permits
    document.getElementById("intellectual-streak-val").textContent = `${playerState.studyStreak} days`;
    document.getElementById("exam-permit-val").textContent = playerState.examPermits;
    document.getElementById("exam-stat-count").textContent = playerState.examHistory.length;

    // Average Exam Grade
    let averageGrade = 0;
    let maxGrade = 0;
    if (playerState.examHistory.length > 0) {
        const sum = playerState.examHistory.reduce((acc, curr) => acc + curr.score, 0);
        averageGrade = Math.round(sum / playerState.examHistory.length);
        maxGrade = Math.max(...playerState.examHistory.map(h => h.score));
    }
    document.getElementById("exam-stat-avg").textContent = `${averageGrade}%`;
    document.getElementById("exam-stat-max").textContent = `${maxGrade}%`;

    // Enable / Disable enter exam button
    const enterExamBtn = document.getElementById("btn-enter-exam");
    if (playerState.examPermits > 0 && !examGameActive) {
        enterExamBtn.disabled = false;
        enterExamBtn.classList.remove("disabled");
    } else {
        enterExamBtn.disabled = true;
        enterExamBtn.classList.add("disabled");
    }

    // Toggle daily nodes checklist status
    Object.keys(playerState.intellectualChecks).forEach(subject => {
        const check = playerState.intellectualChecks[subject];
        const statusEl = document.getElementById(`node-status-${subject}`);
        if (statusEl) {
            if (check) {
                statusEl.className = "node-status-text cleared";
                statusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> SYNAPSE DECRYPTED (CLEARED)';
            } else {
                statusEl.className = "node-status-text pending";
                statusEl.innerHTML = '<i class="fa-solid fa-hourglass-half"></i> PENDING CONQUERING';
            }
        }
    });

    // Render historical exam log list
    renderExamHistoryList();

    // Sync API status indicator
    const apiBadge = document.getElementById("api-status-badge");
    if (playerState.apiKey && playerState.apiKey.length > 10) {
        apiBadge.className = "api-status-badge online";
        apiBadge.innerHTML = '<i class="fa-solid fa-circle"></i> AI NEURAL CORE CONNECTED';
    } else {
        apiBadge.className = "api-status-badge offline";
        apiBadge.innerHTML = '<i class="fa-solid fa-circle"></i> LOCAL OFFLINE STATIC ENGINE';
    }

    // Refresh Flashcard panel counters
    document.getElementById("flashcard-count-mastered").textContent = playerState.flashcardsMastered.length;
    document.getElementById("flashcard-index-indicator").textContent = `Card ${currentFlashcardIndex + 1} of ${flashcardCodexCopy.length}`;
    
    // Draw active flashcard content
    renderActiveFlashcard();
}

function renderExamHistoryList() {
    const listEl = document.getElementById("exam-history-list");
    if (!listEl) return;

    if (playerState.examHistory.length === 0) {
        listEl.innerHTML = `
            <div class="battle-placeholder flex-col-center" style="height: 80px; border:none; background:transparent;">
                <i class="fa-solid fa-hourglass placeholder-icon" style="font-size:18px;"></i>
                <p class="placeholder-text" style="font-size:11px;">NO REGISTERED EXAM CONQUESTS</p>
            </div>
        `;
        return;
    }

    let html = "";
    playerState.examHistory.forEach((log, idx) => {
        const scoreClass = log.passed ? "exam-score-high" : "exam-score-low";
        const resText = log.passed ? "CONQUERED" : "FALSERESOLVE";
        html += `
            <div class="exam-log-item">
                <span>Gate #${idx + 1} - ${log.date}</span>
                <span class="${scoreClass}">Result: ${resText} (${log.score}%)</span>
            </div>
        `;
    });
    listEl.innerHTML = html;
}

// --- 7. BIBLE/THEOLOGY DAILY STUDY NODE MECHANICS ---
async function openStudyNodeModal(subject) {
    if (playerState.intellectualChecks[subject]) {
        spawnToast("System Warning", "Synapse already cleared for today. Core cannot re-decrypt active memories.", "gold");
        return;
    }

    activeStudyNodeSubject = subject;
    selectedStudyOptionIndex = null;
    currentStudyQuizData = null;

    const modal = document.getElementById("modal-study-node");
    modal.classList.remove("hidden");
    
    // Set loading placeholders
    document.getElementById("study-node-subject-title").innerHTML = `<i class="fa-solid fa-sync fa-spin"></i> Initializing ${subject.toUpperCase()} Gateway`;
    document.getElementById("study-node-passage").innerHTML = '<p class="text-glow-blue" style="text-align:center; padding: 20px;"><i class="fa-solid fa-circle-notch fa-spin"></i> Decrypting high-dimensional data arrays...</p>';
    document.getElementById("study-node-discussion").style.display = "none";
    document.getElementById("study-node-question").textContent = "Synthesizing comprehension trial...";
    document.getElementById("study-node-options").innerHTML = "";
    document.getElementById("study-node-explanation").classList.add("hidden");
    
    const submitBtn = document.getElementById("btn-submit-study-answer");
    submitBtn.disabled = true;
    submitBtn.classList.add("disabled");

    // Fetch study content (from live Gemini API or offline fallback)
    try {
        currentStudyQuizData = await fetchStudyContent(subject);
        renderStudyContent();
    } catch (e) {
        console.error("Error loading study content", e);
        spawnToast("System Error", "Failed to compile study files. Static database offline.", "red");
        modal.classList.add("hidden");
    }
}

async function fetchStudyContent(subject) {
    // If API Key is configured, make call to Google Gemini
    if (playerState.apiKey && playerState.apiKey.length > 10) {
        try {
            return await fetchGeminiStudyPassage(subject);
        } catch (e) {
            console.warn("Gemini API error, falling back to local database", e);
            spawnToast("AI Offline", "Neural cloud query failed. Fallback static database engaged.", "gold");
        }
    }

    // Default Fallback: Index local database based on date seed
    const daySeed = new Date().getDate(); // Day of month (1-31)
    const subjectDeck = ACADEMIC_DATABASE[subject];
    const dataIndex = (daySeed - 1) % subjectDeck.length;
    return subjectDeck[dataIndex];
}

function renderStudyContent() {
    if (!currentStudyQuizData) return;

    let subTitle = "Holy Scripture";
    if (activeStudyNodeSubject === "religion") subTitle = "Comparative Religion";
    else if (activeStudyNodeSubject === "history") subTitle = "World Political History";
    else if (activeStudyNodeSubject === "philosophy") subTitle = "Philosophy & Theology";
    else if (activeStudyNodeSubject === "epidemiology") subTitle = "Epidemiology & Biostatistics";

    document.getElementById("study-node-subject-title").innerHTML = `<i class="fa-solid fa-brain"></i> ${subTitle}`;
    document.getElementById("study-node-passage").innerHTML = currentStudyQuizData.passage;
    
    const discEl = document.getElementById("study-node-discussion");
    discEl.innerHTML = `<strong>Contemplation Prompt:</strong> ${currentStudyQuizData.discussion}`;
    discEl.style.display = "block";
    
    document.getElementById("study-node-question").textContent = currentStudyQuizData.quizQuestion;

    // Options grid
    const optionsContainer = document.getElementById("study-node-options");
    optionsContainer.innerHTML = "";
    selectedStudyOptionIndex = null;

    currentStudyQuizData.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option-btn";
        btn.textContent = `${String.fromCharCode(65 + idx)}) ${opt}`;
        btn.addEventListener("click", () => {
            selectStudyOption(idx);
        });
        optionsContainer.appendChild(btn);
    });
}

function selectStudyOption(index) {
    if (document.getElementById("study-node-explanation").classList.contains("hidden") === false) return; // Answer already submitted

    selectedStudyOptionIndex = index;
    const optionBtns = document.querySelectorAll("#study-node-options .quiz-option-btn");
    optionBtns.forEach((btn, idx) => {
        if (idx === index) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        }
    });

    const submitBtn = document.getElementById("btn-submit-study-answer");
    submitBtn.disabled = false;
    submitBtn.classList.remove("disabled");
}

function submitStudyAnswer() {
    if (selectedStudyOptionIndex === null || !currentStudyQuizData) return;

    const correct = selectedStudyOptionIndex === currentStudyQuizData.correctIndex;
    const optionBtns = document.querySelectorAll("#study-node-options .quiz-option-btn");
    
    // Highlight options
    optionBtns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === currentStudyQuizData.correctIndex) {
            btn.classList.remove("selected");
            btn.classList.add("correct");
        } else if (idx === selectedStudyOptionIndex) {
            btn.classList.remove("selected");
            btn.classList.add("incorrect");
        }
    });

    const expBox = document.getElementById("study-node-explanation");
    expBox.className = correct ? "quiz-explanation-box success" : "quiz-explanation-box fail";
    expBox.innerHTML = `
        <strong>${correct ? '<i class="fa-solid fa-circle-check"></i> DECIPHERED CORRECTLY!' : '<i class="fa-solid fa-circle-xmark"></i> DECRYPTION FAILURE'}</strong>
        <p style="margin-top:6px;">${currentStudyQuizData.explanation}</p>
    `;
    expBox.classList.remove("hidden");

    // Hide Submit Button, transform Close Button
    const submitBtn = document.getElementById("btn-submit-study-answer");
    submitBtn.disabled = true;
    submitBtn.classList.add("disabled");

    if (correct) {
        // Mark checked, award rewards
        playerState.intellectualChecks[activeStudyNodeSubject] = true;
        
        // Award XP and Gold
        gainExperience(15);
        playerState.gold += 15;

        // Check if all study nodes completed today
        const allDone = Object.values(playerState.intellectualChecks).every(c => c === true);
        if (allDone && !playerState.intellectualCompletedToday) {
            playerState.intellectualCompletedToday = true;
            playerState.studyStreak += 1;
            
            // Streak awards exam permits (3 day streaks grant 1 permit)
            if (playerState.studyStreak % 3 === 0) {
                playerState.examPermits += 1;
                spawnToast("System Core Level Up", "PASSIONATE STREAK! Monarch Exam Permit compiled into inventory.", "gold");
            }
            
            spawnToast("System Cleared", "ALL INTELLECTUAL STUDY NODES DECIPHERED! Streaks incremented.", "gold");
        }

        saveStateToStorage();
        refreshHUD();
        spawnToast("Synaptic Decryption", "Deciphered correctly! Allocated +15 EXP and +15 Gold.", "blue");
    } else {
        spawnToast("Cognitive Warning", "Decryption failed. Mind Core suffered static interference.", "red");
    }
}

// --- 8. SYNAPTIC FLASHCARDS CODEX ---
function renderActiveFlashcard() {
    if (flashcardCodexCopy.length === 0) return;

    const card = flashcardCodexCopy[currentFlashcardIndex];
    document.getElementById("flashcard-subject-front").textContent = card.subject;
    document.getElementById("flashcard-subject-back").textContent = `${card.subject} (EXPLANATION)`;
    
    document.getElementById("flashcard-text-front").textContent = card.question;
    document.getElementById("flashcard-text-back").textContent = card.answer;

    // Reset rotation style
    const card3d = document.getElementById("active-flashcard");
    card3d.classList.remove("flipped");
    isFlashcardFlipped = false;

    // Color back highlight based on mastery
    const mastered = playerState.flashcardsMastered.includes(card.id);
    const cardBack = document.querySelector("#active-flashcard .flashcard-side.back");
    if (mastered) {
        cardBack.style.borderColor = "var(--color-green)";
        cardBack.style.boxShadow = "inset 0 0 20px rgba(0, 230, 118, 0.1)";
    } else {
        cardBack.style.borderColor = "rgba(0, 243, 255, 0.3)";
        cardBack.style.boxShadow = "inset 0 0 20px rgba(0, 243, 255, 0.1)";
    }
}

function flipFlashcard() {
    const card3d = document.getElementById("active-flashcard");
    isFlashcardFlipped = !isFlashcardFlipped;
    if (isFlashcardFlipped) {
        card3d.classList.add("flipped");
    } else {
        card3d.classList.remove("flipped");
    }
}

function evaluateFlashcard(mastered) {
    if (flashcardCodexCopy.length === 0) return;

    const card = flashcardCodexCopy[currentFlashcardIndex];
    const isAlreadyMastered = playerState.flashcardsMastered.includes(card.id);

    if (mastered) {
        if (!isAlreadyMastered) {
            playerState.flashcardsMastered.push(card.id);
            spawnToast("Codex Synapsed", `Committed '${card.question}' to long-term memory. IQ increased!`, "green");
        }
    } else {
        if (isAlreadyMastered) {
            playerState.flashcardsMastered = playerState.flashcardsMastered.filter(id => id !== card.id);
            spawnToast("Codex Retracted", `Pruned '${card.question}' from masteries for review.`, "gold");
        }
    }

    saveStateToStorage();

    // Advance to next card
    currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcardCodexCopy.length;
    refreshHUD();
}

// --- 9. WEEKLY MONARCH EXAM HALL ANOMALIES ---
async function initiateWeeklyExam() {
    if (playerState.examPermits <= 0) return;
    
    playerState.examPermits--;
    saveStateToStorage();

    examGameActive = true;
    currentExamIndex = 0;
    examAnswers = [];
    examQuestions = [];
    selectedExamOptionIndex = null;
    examTimerVal = 600; // 10 minutes

    const screen = document.getElementById("screen-exam");
    screen.classList.remove("hidden");
    screen.style.display = "flex";

    document.getElementById("exam-timer-val").textContent = formatPenaltyTime(examTimerVal);
    document.getElementById("exam-timer-val").style.color = "var(--color-cyan)";
    
    clearInterval(dailyTimerInterval); // Freeze standard midnight resets

    // Fetch randomized questions (local pool vs Gemini live)
    try {
        document.getElementById("exam-question-text").innerHTML = '<i class="fa-solid fa-sync fa-spin"></i> Initializing High-Dimensional Academic Gate...';
        document.getElementById("exam-options-list").innerHTML = "";
        
        if (playerState.apiKey && playerState.apiKey.length > 10) {
            try {
                examQuestions = await fetchGeminiExamQuestions();
            } catch (e) {
                console.warn("Exam live query failed, falling back to local pool", e);
                examQuestions = getRandomLocalExamQuestions();
            }
        } else {
            examQuestions = getRandomLocalExamQuestions();
        }

        renderExamQuestion();
        
        // Start Timer
        examTimerInterval = setInterval(() => {
            examTimerVal--;
            document.getElementById("exam-timer-val").textContent = formatPenaltyTime(examTimerVal);
            
            if (examTimerVal <= 120) {
                // Danger flashes
                document.getElementById("exam-timer-val").style.color = "var(--color-crimson)";
            }

            if (examTimerVal <= 0) {
                finishExam(false); // Time out = fail!
            }
        }, 1000);

    } catch (e) {
        console.error(e);
        spawnToast("System Error", "Failed to initiate exam core.", "red");
        screen.classList.add("hidden");
        screen.style.display = "none";
        initClock();
    }
}

function getRandomLocalExamQuestions() {
    // Shuffle local EXAM_POOL and pick 10
    const shuffled = [...EXAM_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
}

function renderExamQuestion() {
    if (examQuestions.length === 0 || currentExamIndex >= examQuestions.length) return;

    const q = examQuestions[currentExamIndex];
    document.getElementById("exam-question-index").textContent = currentExamIndex + 1;
    document.getElementById("exam-subject-badge").textContent = q.subject;
    document.getElementById("exam-question-text").textContent = q.question;

    const container = document.getElementById("exam-options-list");
    container.innerHTML = "";
    selectedExamOptionIndex = null;

    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option-btn";
        btn.textContent = `${String.fromCharCode(65 + idx)}) ${opt}`;
        btn.addEventListener("click", () => {
            selectExamOption(idx);
        });
        container.appendChild(btn);
    });

    const nextBtn = document.getElementById("btn-exam-next");
    nextBtn.disabled = true;
    nextBtn.classList.add("disabled");
}

function selectExamOption(index) {
    selectedExamOptionIndex = index;
    const optionBtns = document.querySelectorAll("#exam-options-list .quiz-option-btn");
    optionBtns.forEach((btn, idx) => {
        if (idx === index) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        }
    });

    const nextBtn = document.getElementById("btn-exam-next");
    nextBtn.disabled = false;
    nextBtn.classList.remove("disabled");
}

function submitExamAnswer() {
    if (selectedExamOptionIndex === null || !examGameActive) return;

    const q = examQuestions[currentExamIndex];
    const correct = selectedExamOptionIndex === q.correctIndex;
    
    examAnswers.push({
        correct: correct,
        subject: q.subject
    });

    currentExamIndex++;
    if (currentExamIndex < examQuestions.length) {
        renderExamQuestion();
    } else {
        // Exam Finished!
        evaluateExamResult();
    }
}

function evaluateExamResult() {
    const correctCount = examAnswers.filter(a => a.correct === true).length;
    const pct = Math.round((correctCount / examQuestions.length) * 100);
    const passed = pct >= 70; // 70% threshold to pass!

    finishExam(passed, pct);
}

function finishExam(passed, score = 0) {
    examGameActive = false;
    clearInterval(examTimerInterval);

    const screen = document.getElementById("screen-exam");
    screen.classList.add("hidden");
    screen.style.display = "none";

    initClock(); // Restore midnight reset tickers

    // Record attempt
    const dateStr = new Date().toLocaleDateString();
    playerState.examHistory.push({
        date: dateStr,
        score: score,
        passed: passed
    });

    if (passed) {
        // Clear all fatigue debuffs!
        playerState.hasTrialDeficit = false;
        
        // Massive awards
        gainExperience(100);
        playerState.gold += 100;
        
        // Award rare chest
        playerState.chests.gold += 1;

        // Force active recalibration sync
        saveStateToStorage();
        refreshHUD();

        spawnToast("Gate Conquered", `EXAM PASSED! Decryption Accuracy: ${score}%. Cleansed all fatigue. Received Gold Chest.`, "gold");
    } else {
        // Penalty: Decay EXP
        playerState.exp = Math.max(0, playerState.exp - 40);
        saveStateToStorage();
        refreshHUD();
        
        spawnToast("Decryption Failure", `EXAM FAILED! Score: ${score}%. Static interference degraded EXP.`, "red");
    }
}

// --- 10. SYSTEM AI ENDPOINT API GATEWAY (GEMINI CORES) ---
function saveApiKey(key) {
    if (!key || key.length < 10) {
        playerState.apiKey = "";
        saveStateToStorage();
        refreshHUD();
        spawnToast("System Settings", "API Key purged. Decoupled AI gateway.", "gold");
        return;
    }

    playerState.apiKey = key;
    saveStateToStorage();
    refreshHUD();
    spawnToast("System Connected", "AI Gateway Decryption Key verified and securely saved.", "green");
}

async function fetchGeminiStudyPassage(subject) {
    const apiKey = playerState.apiKey;
    const lvl = playerState.level;
    const title = playerState.title;
    
    let subjectFocus = "theology and biblical studies";
    if (subject === "religion") subjectFocus = "comparative religion, specifically focusing on theological differences";
    else if (subject === "history") subjectFocus = "world political history, analyzing sovereign empires and international treaties";
    else if (subject === "philosophy") subjectFocus = "classical epistemology, moral philosophy, and rational theology";
    else if (subject === "epidemiology") subjectFocus = "public health, biostatistics equations, and clinical epidemiologic study designs";

    const prompt = `You are "THE SYSTEM" from Solo Leveling, an elite AI tutor interface designed to test the player's mind.
Generate a daily academic study lesson in ${subjectFocus} formatted exactly as a raw JSON block.
Scale the reading difficulty and vocabulary appropriate for a Level ${lvl} Hunter (${title}).

The JSON response MUST fit this exact schema without markdown wraps:
{
  "passage": "A detailed 2-paragraph analysis with HTML <p> and <strong> tags highlighting critical terms.",
  "discussion": "A single thought-provoking contemplation prompt.",
  "quizQuestion": "A multiple-choice question testing the passage details.",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "A concise paragraph explaining why the correct option is correct."
}

Do not return any conversational text, just the raw JSON.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Gemini API returned status " + response.status);
    const data = await response.json();
    const rawJson = data.candidates[0].content.parts[0].text;
    return JSON.parse(rawJson);
}

async function fetchGeminiExamQuestions() {
    const apiKey = playerState.apiKey;
    const lvl = playerState.level;

    const prompt = `You are "THE SYSTEM" from Solo Leveling. Compile a comprehensive 10-question multiple-choice exam testing the player across five fields: Bible studies, Comparative Religion, World History, Philosophy, and Public Health Epidemiology/Biostatistics.
Format the response exactly as a raw JSON array. Scale it for a Level ${lvl} Hunter.

The JSON response MUST fit this exact schema without markdown wraps:
[
  {
    "subject": "Holy Scripture",
    "question": "Rigorous multiple-choice question text...",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0,
    "explanation": "Why correct..."
  },
  ...
]

Generate exactly 10 questions (2 per subject). Do not return any conversational text, just the raw JSON array.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Gemini API returned status " + response.status);
    const data = await response.json();
    const rawJson = data.candidates[0].content.parts[0].text;
    return JSON.parse(rawJson);
}

// ==========================================================================
// PROGRESSIVE WEB APP (PWA) SERVICE WORKER PROTOCOL BINDING
// ==========================================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('THE SYSTEM: Service Worker registered successfully.', reg))
            .catch(err => console.error('THE SYSTEM: Service Worker registration failed.', err));
    });
}
