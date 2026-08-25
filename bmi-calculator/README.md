# Vitalify — Premium BMI & Body Fat Calculator (Health Engine v1.2)

Welcome to **Vitalify**, a mathematically precise health and body composition engine integrated with a custom AI Fitness & Diet Coach. Vitalify is built as a responsive single-page application (SPA) using vanilla HTML5, custom CSS3 variables, and vanilla JavaScript. 

This repository implements rigorous health index calculators, multi-system unit conversions, local storage encryption, and a fallback Google Gemini API integration.

---

## 🌟 Key Features

### 1. Unified Diagnostic Input Panel
*   **Gender Selector:** Interactive Male and Female cards with dynamic form validation adjustments.
*   **Bi-Unit System Conversion:** Real-time toggling between **Metric** (kg, cm) and **Imperial** (lbs, ft/in) systems. Crucially, all inputs (Height, Weight, Neck, Waist, Hip) are synchronized on the fly using standard conversion constants.
*   **Activity Multipliers:** A dropdown offering five distinct daily physical activity levels (Sedentary, Lightly Active, Moderately Active, Very Active, and Extra Active) to compute energy expenditures.

### 2. Precise Body Fat tape Measurements
*   **Collapsible tape panel:** A dedicated section that unfolds when "Enable Precise Body Fat Tape Measurements" is activated.
*   **U.S. Navy Method Inputs:** Dynamic field renders for Neck, Waist, and Hip measurements. The Hip input dynamically displays only for females, complying with clinical research specifications.

### 3. Medical Calculator Dashboard
*   **BMI Gauge:** Custom gauge bar visualization using dynamic linear indicator segments representing *Underweight*, *Normal Weight*, *Overweight*, and *Obese* ranges. A pointer needle transitions to the calculated value using custom spring-like CSS animations.
*   **Lean vs. Fat Mass Breakdown:** A segmented bar graph comparing total body fat percentage against lean body mass. Displays the precise weights in `kg` or `lbs`.
*   **Multi-Formula Comparative Body Fat Engine:** Displays body fat outputs calculated concurrently from three separate formulas:
    1.  *U.S. Navy Tape-Based Formula*
    2.  *YMCA Waist-Weight Formula*
    3.  *Deurenberg BMI-Age Formula*
*   **Key Health Indicators:**
    *   **BMR (Basal Metabolic Rate):** Baseline daily calorie requirements.
    *   **TDEE (Total Daily Energy Expenditure):** Activity-adjusted daily caloric burn.
    *   **Ideal Body Weight:** Target body weight based on physical stature.
    *   **Daily Hydration Target:** Water consumption recommendation.
*   **Daily Calorie Target Recommendations:** Provides specific targets for *Weight Loss*, *Weight Maintenance*, and *Weight Gain*.
*   **Personalized Diagnostic Insight:** Renders contextual health advice based on BMI classifications.

### 4. AI Coach Integration (Powered by Gemini)
*   **Dynamic Diet & Gym Planner:** Connects directly to Gemini models to generate personalized meal and exercise plans in professional Hinglish.
*   **Secured System Settings:** 
    *   Saves the API key securely in the user's local browser storage.
    *   Includes a **4-digit Passcode (PIN) Lock** feature which encrypts the key locally, preventing unauthorized local access.

---

## 🧮 Mathematical Formulas & Logic (Under the Hood)

Vitalify relies on verified clinical formulas to perform its calculations. Below is the exact logic implemented in `index.js`:

### 1. Body Mass Index (BMI)
$$BMI = \frac{\text{Weight (kg)}}{\text{Height (meters)}^2}$$

### 2. Basal Metabolic Rate (BMR)
Vitalify utilizes the clinical standard **Mifflin-St Jeor Equation**:
*   **Male:** 
    $$BMR = 10 \times \text{Weight (kg)} + 6.25 \times \text{Height (cm)} - 5 \times \text{Age (years)} + 5$$
*   **Female:** 
    $$BMR = 10 \times \text{Weight (kg)} + 6.25 \times \text{Height (cm)} - 5 \times \text{Age (years)} - 161$$

### 3. Total Daily Energy Expenditure (TDEE)
Calculated by multiplying the BMR by the active physical factor multiplier ($M_a$):
$$TDEE = BMR \times M_a$$

| Activity Level | Multiplier ($M_a$) | Description |
| :--- | :---: | :--- |
| **Sedentary** | `1.200` | Little or no exercise |
| **Lightly Active** | `1.375` | Exercise 1-3 days/week |
| **Moderately Active** | `1.550` | Exercise 3-5 days/week |
| **Very Active** | `1.725` | Hard exercise 6-7 days/week |
| **Extra Active** | `1.900` | Hard exercise + physical job |

### 4. Ideal Body Weight (IBW)
Utilizes the standard **Devine Formula** (for individuals over 5 feet / 60 inches tall):
$$\text{Inches Over } 60 = \max(0, \text{Height (inches)} - 60)$$
*   **Male:** 
    $$IBW\text{ (kg)} = 50.0 + 2.3 \times \text{Inches Over } 60$$
*   **Female:** 
    $$IBW\text{ (kg)} = 45.5 + 2.3 \times \text{Inches Over } 60$$

### 5. Daily Hydration Target
Calculates fluid requirements based on weight and physical activity:
$$\text{Base Water (Liters)} = \frac{\text{Weight (kg)} \times 35}{1000}$$
*   **Activity Adjustment:**
    *   If activity is `moderate` or `active`: Add $0.5\text{ Liters}$.
    *   If activity is `extreme`: Add $1.0\text{ Liter}$.

### 6. Body Fat Percentage Formulas

#### A. Deurenberg Formula (BMI & Age Based)
Used as a standard estimate and fallback:
*   **Male:** 
    $$\text{BF}_{\text{Deurenberg}} = 1.20 \times BMI + 0.23 \times \text{Age} - 16.2$$
*   **Female:** 
    $$\text{BF}_{\text{Deurenberg}} = 1.20 \times BMI + 0.23 \times \text{Age} - 5.4$$

#### B. YMCA Formula (Waist & Weight Based)
*   **Male:** 
    $$\text{BF}_{\text{YMCA}} = \frac{4.15 \times \text{Waist (inches)} - 0.082 \times \text{Weight (lbs)} - 98.42}{\text{Weight (lbs)}} \times 100$$
*   **Female:** 
    $$\text{BF}_{\text{YMCA}} = \frac{4.15 \times \text{Waist (inches)} - 0.082 \times \text{Weight (lbs)} - 76.76}{\text{Weight (lbs)}} \times 100$$

#### C. U.S. Navy Tape-Based Formula
*   **Male (Metric):**
    $$\text{BF}_{\text{Navy}} = \frac{495}{1.0324 - 0.19077 \log_{10}(\text{Waist}_{\text{cm}} - \text{Neck}_{\text{cm}}) + 0.15456 \log_{10}(\text{Height}_{\text{cm}})} - 450$$
*   **Female (Metric):**
    $$\text{BF}_{\text{Navy}} = \frac{495}{1.29579 - 0.35004 \log_{10}(\text{Waist}_{\text{cm}} + \text{Hip}_{\text{cm}} - \text{Neck}_{\text{cm}}) + 0.22100 \log_{10}(\text{Height}_{\text{cm}})} - 450$$
*   **Male (Imperial):**
    $$\text{BF}_{\text{Navy}} = 86.010 \log_{10}(\text{Waist}_{\text{in}} - \text{Neck}_{\text{in}}) - 70.041 \log_{10}(\text{Height}_{\text{in}}) + 36.76$$
*   **Female (Imperial):**
    $$\text{BF}_{\text{Navy}} = 163.205 \log_{10}(\text{Waist}_{\text{in}} + \text{Hip}_{\text{in}} - \text{Neck}_{\text{in}}) - 97.684 \log_{10}(\text{Height}_{\text{in}}) - 78.387$$

#### D. Combined Weighted Average Method
If tape measurements are enabled, Vitalify combines all three metrics to decrease standard error deviation:
$$\text{BF}_{\text{Combined}} = 0.50 \times \text{BF}_{\text{Navy}} + 0.25 \times \text{BF}_{\text{YMCA}} + 0.25 \times \text{BF}_{\text{Deurenberg}}$$

---

## 🔒 Security & Local Passcode Encryption
To protect the user's Google Gemini API Key from unauthorized visual access or local script extraction, Vitalify implements a **lightweight symmetric encryption wrapper**:

1.  **Check-Phrase:** On setup, a validation word (`"VITALIFY"`) is encrypted with the user's PIN to check password correctness later.
2.  **Symmetric XOR Cipher:** A lightweight XOR cipher cycles through the user-defined 4-digit PIN characters to encrypt the API key:
    ```javascript
    function encrypt(text, key) {
        let result = "";
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(result);
    }
    ```
3.  **Decryption:** Decryption retrieves the cipher, decodes the base-64 string, and reverses the XOR operations. If the decrypted check-phrase fails to return `"VITALIFY"`, the system rejects the attempt.

---

## 🤖 Gemini AI Prompting Structure
When the user requests **AI Coach Insights**, Vitalify constructs a highly detailed contextual prompt combining their clinical variables. The engine executes a fail-safe request chain across multiple Gemini model endpoints:
1.  `gemini-3.5-flash` (Primary)
2.  `gemini-3.1-flash-lite`
3.  `gemini-2.5-flash`
4.  `gemini-2.0-flash`
5.  `gemini-flash-latest`
6.  `gemini-pro-latest`

The system requires Gemini to return a structured JSON response (without markdown wrapper tags) containing detailed, daily professional meal recommendations, exercise schedules, and metabolic trajectory outlooks in **Hinglish**.

---

## 🎨 Theme & Styling Tokens
Vitalify is built on a dark-by-default design language using glassmorphism.

*   **Colors (Dark):** 
    *   Main background: `#0b0f19` to `#111827` gradient
    *   Card background: `rgba(22, 28, 45, 0.65)` (Glassmorphism card)
    *   Primary Accent: `#6366f1` (Indigo)
    *   Glow orbs: Teal (`#06b6d4`) and Indigo (`#6366f1`) blurred backdrops
*   **Colors (Light):**
    *   Main background: `#f8fafc` to `#e2e8f0` gradient
    *   Card background: `rgba(255, 255, 255, 0.75)`
*   **Typography:**
    *   Heading Font: `'Outfit'`, sans-serif
    *   Body Font: `'Plus Jakarta Sans'`, sans-serif
*   **Micro-Animations:**
    *   Smooth unit-switching sliding transitions.
    *   Cubic-bezier animated pointer needles (`transition: left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)`).

---

## 📁 Project Directory Structure
```
ibm_calculator/
│
├── index.html       # Single Page Application skeleton, modals, and templates
├── index.css        # Responsive layouts, design tokens, light/dark keyframes
├── index.js         # Core mathematical computations, API logic, and modal handling
└── README.md        # Technical documentation & project architecture (This file)
```

---
*Developed with medical and sports health equations. Powered by Vitalify Health Engine.*
